// ============================================
// IMMO PULSE API — Cloudflare Worker
// Auth + Sync + Visits — JWT HMAC-SHA256
// ============================================

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}

// --- CORS ---
function corsHeaders(env: Env, request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = env.FRONTEND_URL || '*';
  const allowedOrigins = allowedOrigin.split(',').map((entry) => entry.trim()).filter(Boolean);
  const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin);
  const finalOrigin = isAllowed ? (origin || allowedOrigins[0] || '*') : (allowedOrigins[0] || '*');
  return {
    'Access-Control-Allow-Origin': finalOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

function json(data: any, status = 200, cors: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

// --- Password hashing ---
async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const CURRENT_SALT = 'immo-pulse-salt-v1';
const LEGACY_SALT = 'immo-pulse-salt';
const RESET_TOKEN_TTL_SECONDS = 60 * 60; // 1 heure

function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function generateResetToken(): string {
  return crypto.randomUUID();
}

function getFrontendUrl(env: Env, origin?: string): string {
  const allowedOrigins = (env.FRONTEND_URL || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (origin && allowedOrigins.includes(origin)) {
    return origin.replace(/\/$/, '');
  }
  return allowedOrigins[0] || 'https://immo-pulse.pages.dev';
}

async function sendResetEmail(email: string, token: string, frontendUrl: string, env: Env): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  const from = env.RESEND_FROM_EMAIL?.trim() || 'no-reply@immo-pulse.pages.dev';
  const resetLink = `${frontendUrl.replace(/\/$/, '')}?reset=${encodeURIComponent(token)}`;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: 'Réinitialisation de ton mot de passe Immo Pulse',
      html: `
        <p>Bonjour,</p>
        <p>Tu as demandé à réinitialiser ton mot de passe pour Immo Pulse.</p>
        <p>Clique sur ce lien pour définir un nouveau mot de passe :</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>Si tu n'as pas demandé cette réinitialisation, ignore ce message.</p>
      `.trim(),
    }),
  });
}

async function hashPassword(password: string): Promise<string> {
  return hashPasswordWithSalt(password, CURRENT_SALT);
}

async function verifyPassword(password: string, hash: string): Promise<{ valid: boolean; needsRehash: boolean }> {
  const currentHash = await hashPasswordWithSalt(password, CURRENT_SALT);
  if (currentHash === hash) return { valid: true, needsRehash: false };
  const legacyHash = await hashPasswordWithSalt(password, LEGACY_SALT);
  if (legacyHash === hash) return { valid: true, needsRehash: true };
  return { valid: false, needsRehash: false };
}

// --- JWT with real HMAC-SHA256 ---
async function signHMAC(key: CryptoKey, data: string): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

async function createJWT(userId: string, email: string, env: Env): Promise<string> {
  const secret = env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET not configured');
  const key = await importKey(secret);
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const now = Math.floor(Date.now() / 1000);
  const payload = btoa(JSON.stringify({
    sub: userId,
    email,
    iat: now,
    exp: now + 30 * 24 * 60 * 60, // 30 days
  }));
  const signature = await signHMAC(key, `${header}.${payload}`);
  return `${header}.${payload}.${signature}`;
}

async function verifyJWT(token: string, env: Env): Promise<{ userId: string; email: string } | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const secret = env.JWT_SECRET;
    if (!secret) return null;
    const key = await importKey(secret);
    const expectedSig = await signHMAC(key, `${parts[0]}.${parts[1]}`);
    // Constant-time comparison
    if (parts[2].length !== expectedSig.length) return null;
    let match = true;
    for (let i = 0; i < parts[2].length; i++) {
      if (parts[2].charCodeAt(i) !== expectedSig.charCodeAt(i)) match = false;
    }
    if (!match) return null;
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null; // Expired
    return { userId: payload.sub, email: payload.email };
  } catch { return null; }
}

async function getUserId(request: Request, env: Env): Promise<string | null> {
  const auth = request.headers.get('Authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const decoded = await verifyJWT(auth.slice(7), env);
  return decoded?.userId || null;
}

// --- Routes ---

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(env, request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // ===== AUTH: Register =====
      if (path === '/api/auth/register' && request.method === 'POST') {
        const body = await request.json() as any;
        const { email, password, firstName, lastName, experienceLevel, startDate } = body;

        if (!email || !password || password.length < 6) {
          return json({ error: 'Email et mot de passe (6 caractères min) requis.' }, 400, cors);
        }

        // Check existing
        const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email.toLowerCase().trim()).first();
        if (existing) return json({ error: 'Un compte existe déjà avec cet email.' }, 400, cors);

        const id = crypto.randomUUID();
        const passwordHash = await hashPassword(password);

        await env.DB.prepare(
          'INSERT INTO users (id, email, password_hash, first_name, last_name, experience_level, start_date) VALUES (?, ?, ?, ?, ?, ?, ?)'
        ).bind(id, email.toLowerCase().trim(), passwordHash, (firstName || '').trim(), (lastName || '').trim(), experienceLevel || 'débutant', startDate || new Date().toISOString().split('T')[0]).run();

        const token = await createJWT(id, email.toLowerCase().trim(), env);
        return json({ success: true, token, user: { id, email: email.toLowerCase().trim(), firstName, lastName, experienceLevel, startDate } }, 200, cors);
      }

// ===== AUTH: Forgot password =====
      if (path === '/api/auth/forgot-password' && request.method === 'POST') {
        const body = await request.json() as any;
        const email = normalizeEmail(body.email || '');
        if (!email) {
          return json({ error: 'Email requis.' }, 400, cors);
        }

        const user = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
        if (!user) {
          return json({ success: true, message: 'Si un compte existe avec cet email, un lien de réinitialisation vient d\'être envoyé.' }, 200, cors);
        }

        const token = generateResetToken();
        const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_SECONDS * 1000).toISOString();
        const frontendUrl = getFrontendUrl(env, request.headers.get('Origin') || undefined);

        await env.DB.prepare(
          'INSERT INTO password_resets (id, token, user_id, expires_at, used) VALUES (?, ?, ?, ?, 0)'
        ).bind(crypto.randomUUID(), token, user.id, expiresAt).run();

        try {
          await sendResetEmail(email, token, frontendUrl, env);
        } catch {
          // Continue anyway to avoid exposing internal errors.
        }

        return json({ success: true, message: 'Si un compte existe avec cet email, un lien de réinitialisation vient d\'être envoyé.' }, 200, cors);
      }

      // ===== AUTH: Login =====
      if (path === '/api/auth/login' && request.method === 'POST') {
        const body = await request.json() as any;
        const { email, password } = body;

        const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase().trim()).first();
        if (!user) return json({ error: 'Email ou mot de passe incorrect.' }, 401, cors);

        const { valid, needsRehash } = await verifyPassword(password, user.password_hash as string);
        if (!valid) return json({ error: 'Email ou mot de passe incorrect.' }, 401, cors);

        if (needsRehash) {
          const newHash = await hashPassword(password);
          await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(newHash, user.id).run();
        }

        const token = await createJWT(user.id as string, user.email as string, env);
        return json({
          success: true,
          token,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            experienceLevel: user.experience_level,
            startDate: user.start_date,
          }
        }, 200, cors);
      }

      // ===== AUTH: Reset password =====
      if (path === '/api/auth/reset-password' && request.method === 'POST') {
        const body = await request.json() as any;
        const token = body.token || '';
        const password = body.newPassword || body.password || '';

        if (!token || !password || password.length < 6) {
          return json({ error: 'Ce lien a expiré ou a déjà été utilisé. Redemande un lien.' }, 400, cors);
        }

        const reset = await env.DB.prepare(
          'SELECT * FROM password_resets WHERE token = ? AND used = 0'
        ).bind(token).first();

        if (!reset) {
          return json({ error: 'Ce lien a expiré ou a déjà été utilisé. Redemande un lien.' }, 400, cors);
        }

        const expiresAt = new Date(reset.expires_at as string);
        if (expiresAt.getTime() < Date.now()) {
          await env.DB.prepare('UPDATE password_resets SET used = 1 WHERE token = ?').bind(token).run();
          return json({ error: 'Ce lien a expiré ou a déjà été utilisé. Redemande un lien.' }, 400, cors);
        }

        const passwordHash = await hashPassword(password);
        await env.DB.prepare('UPDATE users SET password_hash = ? WHERE id = ?').bind(passwordHash, reset.user_id).run();
        await env.DB.prepare('UPDATE password_resets SET used = 1 WHERE token = ?').bind(token).run();

        return json({ success: true }, 200, cors);
      }

      // ===== SYNC: POST (save) =====
      if (path === '/api/sync' && request.method === 'POST') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);

        const body = await request.json() as any;
        const { profile, progress, dailyResults, completedDays } = body;

        // Save profile/progress as JSON in the same row.
        if (profile || progress) {
          const existingRow = await env.DB.prepare('SELECT data, progress FROM profiles WHERE user_id = ?').bind(userId).first();
          const savedProfile = profile ? JSON.stringify(profile) : (existingRow?.data ?? JSON.stringify({}));
          const savedProgress = progress ? JSON.stringify(progress) : (existingRow?.progress ?? JSON.stringify({}));

          await env.DB.prepare(
            'INSERT OR REPLACE INTO profiles (user_id, data, progress, updated_at) VALUES (?, ?, ?, datetime("now"))'
          ).bind(userId, savedProfile, savedProgress).run();
        }

        // Save daily results
        if (dailyResults && Array.isArray(dailyResults)) {
          for (const r of dailyResults) {
            await env.DB.prepare(
              `INSERT OR REPLACE INTO daily_results
                (id, user_id, date, calls_made, contacts_approached, rdv_r1_done, rdv_r2_done, mandats_signed, visites_done, offres_written, mood, wins, challenges, coach_question, coach_answer)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
            ).bind(
              `${userId}-${r.date}`, userId, r.date,
              r.callsMade || 0, r.contactsApproached || 0, r.rdvR1Done || 0, r.rdvR2Done || 0,
              r.mandatsSigned || 0, r.visitesDone || 0, r.offresWritten || 0,
              r.mood || 3, r.wins || '', r.challenges || '', r.coachQuestion || '', r.coachAnswer || ''
            ).run();
          }
        }

        // Save completed actions
        if (completedDays && Array.isArray(completedDays)) {
          await env.DB.prepare('DELETE FROM completed_actions WHERE user_id = ?').bind(userId).run();
          for (const actionId of completedDays) {
            await env.DB.prepare(
              'INSERT OR IGNORE INTO completed_actions (user_id, action_id) VALUES (?, ?)'
            ).bind(userId, actionId).run();
          }
        }

        return json({ success: true, message: 'Données sauvegardées.' }, 200, cors);
      }

      // ===== SYNC: GET (load) =====
      if (path === '/api/sync' && request.method === 'GET') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);

        // Profile + progress
        const profileRow = await env.DB.prepare('SELECT data, progress FROM profiles WHERE user_id = ?').bind(userId).first();
        const profile = profileRow ? JSON.parse(profileRow.data as string) : null;
        const progressData = profileRow && profileRow.progress ? JSON.parse(profileRow.progress as string) : null;

        // Daily results
        const resultsRows = await env.DB.prepare(
          'SELECT * FROM daily_results WHERE user_id = ? ORDER BY date DESC'
        ).bind(userId).all();
        const dailyResults = (resultsRows.results || []).map((r: any) => ({
          date: r.date,
          callsMade: r.calls_made,
          contactsApproached: r.contacts_approached,
          rdvR1Done: r.rdv_r1_done,
          rdvR2Done: r.rdv_r2_done,
          mandatsSigned: r.mandats_signed,
          visitesDone: r.visites_done,
          offresWritten: r.offres_written,
          mood: r.mood,
          wins: r.wins,
          challenges: r.challenges,
          coachQuestion: r.coach_question,
          coachAnswer: r.coach_answer,
        }));

        // Completed actions
        const actionsRows = await env.DB.prepare(
          'SELECT action_id FROM completed_actions WHERE user_id = ?'
        ).bind(userId).all();
        const completedDays = (actionsRows.results || []).map((r: any) => r.action_id);

        // Visit reports
        const visitsRows = await env.DB.prepare(
          'SELECT * FROM visit_reports WHERE user_id = ? ORDER BY date DESC'
        ).bind(userId).all();
        const visits = (visitsRows.results || []).map((r: any) => ({
          id: r.id,
          date: r.date,
          propertyAddress: r.property_address,
          sellerName: r.seller_name,
          buyerName: r.buyer_name,
          status: r.status,
          priceFeedback: r.price_feedback,
          locationFeedback: r.location_feedback,
          workFeedback: r.work_feedback,
          generalFeedback: r.general_feedback,
          weakPoints: r.weak_points,
          strongPoints: r.strong_points,
          generatedMessage: r.generated_message,
        }));

        return json({ success: true, profile, progress: progressData || {
          dailyResults,
          completedDays,
          currentDay: 1,
          nextDayPlans: [],
          streak: 0,
          totalCalls: dailyResults.reduce((s: number, r: any) => s + r.calls_made, 0),
          totalRdv: dailyResults.reduce((s: number, r: any) => s + r.rdv_r1_done + r.rdv_r2_done, 0),
          totalMandats: dailyResults.reduce((s: number, r: any) => s + r.mandats_signed, 0),
          totalVisites: dailyResults.reduce((s: number, r: any) => s + r.visites_done, 0),
        }, completedDays, visits }, 200, cors);
      }

      // ===== VISITS: POST =====
      if (path === '/api/visits' && request.method === 'POST') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);

        const body = await request.json() as any;
        const id = body.id || `visit-${Date.now()}`;

        await env.DB.prepare(
          `INSERT OR REPLACE INTO visit_reports
            (id, user_id, date, property_address, seller_name, buyer_name, status,
             price_feedback, location_feedback, work_feedback, general_feedback,
             weak_points, strong_points, generated_message)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          id, userId, body.date, body.propertyAddress, body.sellerName || '', body.buyerName || '', body.status || 'intéressé',
          body.priceFeedback || '', body.locationFeedback || '', body.workFeedback || '', body.generalFeedback || '',
          body.weakPoints || '', body.strongPoints || '', body.generatedMessage || ''
        ).run();

        return json({ success: true, id }, 200, cors);
      }

      // ===== VISITS: DELETE =====
      if (path === '/api/visits' && request.method === 'DELETE') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);

        const id = url.searchParams.get('id');
        if (!id) return json({ error: 'ID manquant.' }, 400, cors);

        await env.DB.prepare('DELETE FROM visit_reports WHERE id = ? AND user_id = ?').bind(id, userId).run();
        return json({ success: true }, 200, cors);
      }

      return json({ error: 'Route non trouvée.' }, 404, cors);

    } catch (err: any) {
      return json({ error: err.message || 'Erreur serveur.' }, 500, cors);
    }
  }
};
