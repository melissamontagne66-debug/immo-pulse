// ============================================
// IMMO PULSE API — Cloudflare Worker
// Auth + Sync + Visits — JWT HMAC-SHA256
// ============================================

export interface Env {
  DB: D1Database;
  JWT_SECRET: string;
  FRONTEND_URL: string;
  MAILGUN_API_KEY?: string;
  MAILGUN_DOMAIN?: string;
  MAILGUN_FROM_EMAIL?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  EMAIL_FROM?: string;
  // URL publique de ce worker (utilisée pour les liens de désinscription
  // générés hors contexte HTTP, ex. cron). Fallback : FRONTEND_URL.
  API_URL?: string;
  // JSON du compte de service Google pour FCM HTTP v1 (secret wrangler).
  FCM_SERVICE_ACCOUNT?: string;
}

// --- CORS ---
export function corsHeaders(env: Env, request: Request): Record<string, string> {
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
export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const CURRENT_SALT = 'immo-pulse-salt-v1';
const LEGACY_SALT = 'immo-pulse-salt';
const RESET_TOKEN_TTL_SECONDS = 60 * 60; // 1 heure

export function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

function generateResetToken(): string {
  return crypto.randomUUID();
}

export function getFrontendUrl(env: Env, origin?: string): string {
  const allowedOrigins = (env.FRONTEND_URL || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (origin && allowedOrigins.includes(origin)) {
    return origin.replace(/\/$/, '');
  }
  return allowedOrigins[0] || 'https://immo-pulse.pages.dev';
}

async function sendResetEmail(email: string, token: string, frontendUrl: string, env: Env): Promise<void> {
  const resetLink = `${frontendUrl.replace(/\/$/, '')}?reset=${encodeURIComponent(token)}`;
  const defaultFrom = env.MAILGUN_DOMAIN ? `no-reply@${env.MAILGUN_DOMAIN}` : 'no-reply@immo-pulse.pages.dev';
  const from = env.MAILGUN_FROM_EMAIL?.trim() || defaultFrom;

  if (env.MAILGUN_API_KEY && env.MAILGUN_DOMAIN) {
    const body = new URLSearchParams();
    body.set('from', from);
    body.set('to', email);
    body.set('subject', 'Réinitialisation de ton mot de passe Immo Pulse');
    body.set('html', `
      <p>Bonjour,</p>
      <p>Tu as demandé à réinitialiser ton mot de passe pour Immo Pulse.</p>
      <p>Clique sur ce lien pour définir un nouveau mot de passe :</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
      <p>Si tu n'as pas demandé cette réinitialisation, ignore ce message.</p>
    `.trim());

    await fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${btoa(`api:${env.MAILGUN_API_KEY}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });
    return;
  }

  if (!env.RESEND_API_KEY) return;
  const resendFrom = env.RESEND_FROM_EMAIL?.trim() || defaultFrom;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: resendFrom,
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

// --- Emails de relance (Resend) + push FCM + cron ---

// Date au format YYYY-MM-DD dans le fuseau Europe/Paris (en-CA formate en ISO).
export function dateLocalParis(date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Paris',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

// Correspondance palier -> contenu de l'email de félicitations.
export const MILESTONES: Record<string, { palier: string; detail: string; pourcentage: number; prochainJalon: string }> = {
  streak_3: { palier: '3 jours d\'affilée', detail: '3 jours de bilan d\'affilée', pourcentage: 60, prochainJalon: 'la série de 7 jours' },
  streak_7: { palier: '7 jours d\'affilée', detail: '7 jours de bilan d\'affilée', pourcentage: 40, prochainJalon: 'la série de 14 jours' },
  streak_14: { palier: '14 jours d\'affilée', detail: '14 jours de bilan d\'affilée', pourcentage: 25, prochainJalon: 'le mois complet (30 jours)' },
  streak_30: { palier: '30 jours d\'affilée', detail: '30 jours de bilan d\'affilée', pourcentage: 10, prochainJalon: 'ton premier mandat' },
  first_mandat: { palier: 'Premier mandat', detail: 'ton premier mandat signé', pourcentage: 30, prochainJalon: 'ta première vente' },
  first_vente: { palier: 'Première vente', detail: 'ta première vente', pourcentage: 15, prochainJalon: 'le rythme qui dure, mois après mois' },
};

function emailButton(url: string, label: string): string {
  return `<p style="margin: 24px 0;"><a href="${url}" style="display: inline-block; background: #f97316; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">${label}</a></p>`;
}

function emailLayout(content: string): string {
  return `<div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; color: #1f2937; line-height: 1.6;">${content}</div>`;
}

function buildNoBilanEmail(env: Env, firstName: string, streak: number | null): { subject: string; html: string } {
  const appUrl = getFrontendUrl(env);
  const prenom = firstName || 'champion';
  // Sans la série (profiles.progress illisible), on omet toute la phrase qui la mentionne.
  const streakPhrase = streak && streak > 0
    ? `, et ta série de ${streak} jours tient encore (ton gel de série a peut-être fait son boulot)`
    : '';
  return {
    subject: `Ta série tient encore, ${prenom} 🔥`,
    html: emailLayout(`
      <p>Salut ${prenom},</p>
      <p>Hier soir, pas de bilan — ça arrive. La bonne nouvelle : ta journée d'hier n'est pas perdue${streakPhrase}.</p>
      <p>Aujourd'hui, une seule chose compte : <strong>ton action du jour</strong>. Elle t'attend, script inclus, 2 heures chrono.</p>
      ${emailButton(appUrl, 'Voir mon action du jour')}
      <p>Et ce soir, 3 minutes de bilan pour garder la série. C'est ce que font les meilleurs.</p>
      <p>À ce soir,<br>Le Coach Immo</p>
    `.trim()),
  };
}

function buildInactiveEmail(env: Env, firstName: string): { subject: string; html: string } {
  const appUrl = getFrontendUrl(env);
  const prenom = firstName || 'champion';
  return {
    subject: `On te cherche, ${prenom}`,
    html: emailLayout(`
      <p>Salut ${prenom},</p>
      <p>Trois jours sans passer par l'app. Si c'est le moral, sache que c'est le moment le plus fréquent du métier — et le plus trompeur : la plupart des premiers mandats arrivent juste après la période où on a envie de lâcher.</p>
      <p>On ne te demande pas une grosse journée. <strong>Une seule action, 30 minutes</strong>, aujourd'hui. Ton objectif est allégé à ton retour.</p>
      ${emailButton(appUrl, 'Reprendre doucement')}
      <p>Et si tu veux en parler : ton parrain est là pour ça.</p>
      <p>On compte sur toi,<br>Le Coach Immo</p>
    `.trim()),
  };
}

function buildMilestoneEmail(env: Env, firstName: string, info: { palier: string; detail: string; pourcentage: number; prochainJalon: string }): { subject: string; html: string } {
  const appUrl = getFrontendUrl(env);
  const prenom = firstName || 'champion';
  const detail = info.detail.charAt(0).toUpperCase() + info.detail.slice(1);
  return {
    subject: `🏆 ${info.palier} — bravo ${prenom} !`,
    html: emailLayout(`
      <p>Bravo ${prenom},</p>
      <p><strong>${detail}</strong>. Tu fais partie des ${info.pourcentage} % d'agents qui tiennent ce rythme — et ce sont eux qui signent.</p>
      <p>Prochaine étape : ${info.prochainJalon}.</p>
      ${emailButton(appUrl, 'Voir mon parcours')}
      <p>Fier de toi,<br>Le Coach Immo</p>
    `.trim()),
  };
}

// Envoi via Resend + journalisation dans email_log (anti-doublon / suivi quota).
async function sendEmail(env: Env, to: string, subject: string, html: string, kind: string, userId: string): Promise<boolean> {
  if (!env.RESEND_API_KEY) {
    console.log(`[email] RESEND_API_KEY absent — email "${kind}" non envoyé à ${to}`);
    return false;
  }

  // Alerte quota Resend : 80 % des 3000 emails/mois de l'offre gratuite.
  try {
    const quota = await env.DB.prepare(
      `SELECT COUNT(*) AS n FROM email_log WHERE strftime('%Y-%m', sent_at) = strftime('%Y-%m', 'now')`
    ).first();
    if (quota && Number(quota.n) > 2400) {
      console.warn(`[email] Alerte quota Resend : ${quota.n} emails envoyés ce mois-ci (> 2400)`);
    }
  } catch (err) {
    console.error('[email] check quota impossible', err);
  }

  const from = env.EMAIL_FROM?.trim() || 'Immo Pulse <coach@immo-pulse.pages.dev>';
  const apiUrl = (env.API_URL || getFrontendUrl(env)).replace(/\/$/, '');
  const unsubscribeToken = await createJWT(userId, to, env);
  const unsubscribeUrl = `${apiUrl}/api/emails/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`;
  const fullHtml = `${html}<p style="font-family: Arial, sans-serif; margin-top: 32px; font-size: 12px; color: #9ca3af;"><a href="${unsubscribeUrl}" style="color: #9ca3af;">Se désinscrire des emails de relance</a></p>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, subject, html: fullHtml }),
  });
  await env.DB.prepare('INSERT INTO email_log (id, user_id, kind, sent_at, status) VALUES (?, ?, ?, datetime("now"), ?)')
    .bind(crypto.randomUUID(), userId, kind, res.ok ? 'sent' : 'error').run();
  return res.ok;
}

// Mis à jour sur chaque appel authentifié : sert à cibler les relances du cron.
async function touchLastSeen(env: Env, userId: string): Promise<void> {
  try {
    await env.DB.prepare('UPDATE users SET last_seen_at = datetime(\'now\') WHERE id = ?').bind(userId).run();
  } catch (err) {
    console.error('[last_seen] mise à jour impossible', err);
  }
}

// --- Push FCM ---
// Implémente FCM HTTP v1 (recommandé par Google) avec un compte de service.
// Option legacy (non implémentée) : endpoint https://fcm.googleapis.com/fcm/send
// avec l'en-tête `Authorization: key=<FCM_SERVER_KEY>` — API arrêtée par Google.

function base64url(input: string | ArrayBuffer): string {
  const b64 = typeof input === 'string'
    ? btoa(input)
    : btoa(String.fromCharCode(...new Uint8Array(input)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function pemToArrayBuffer(pem: string): ArrayBuffer {
  const b64 = pem.replace(/-----[^-]+-----/g, '').replace(/\s/g, '');
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

// JWT Google signé RS256 (compte de service) échangé contre un access token OAuth2.
async function getGoogleAccessToken(serviceAccount: { client_email: string; private_key: string }): Promise<string> {
  const key = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(serviceAccount.private_key),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claims = base64url(JSON.stringify({
    iss: serviceAccount.client_email,
    scope: 'https://www.googleapis.com/auth/firebase.messaging',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  }));
  const signature = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', key, new TextEncoder().encode(`${header}.${claims}`));
  const jwt = `${header}.${claims}.${base64url(signature)}`;
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
  });
  if (!res.ok) throw new Error(`OAuth Google : HTTP ${res.status}`);
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

async function sendFCM(env: Env, fcmToken: string, notification: { title: string; body: string }): Promise<boolean> {
  if (!env.FCM_SERVICE_ACCOUNT) {
    console.log('[push] FCM_SERVICE_ACCOUNT absent — notification ignorée');
    return false;
  }
  try {
    const serviceAccount = JSON.parse(env.FCM_SERVICE_ACCOUNT);
    const accessToken = await getGoogleAccessToken(serviceAccount);
    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${serviceAccount.project_id}/messages:send`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: { token: fcmToken, notification } }),
    });
    if (!res.ok) console.error(`[push] FCM HTTP ${res.status} : ${await res.text()}`);
    return res.ok;
  } catch (err) {
    console.error('[push] erreur FCM', err);
    return false;
  }
}

// --- Relances déclenchées par le cron ---

async function runMorningRelances(env: Env): Promise<void> {
  const yesterday = dateLocalParis(new Date(Date.now() - 86400000));

  // 1) « Pas de bilan hier soir » — utilisateur actif récemment, sans bilan à la date d'hier,
  //    pas déjà relancé aujourd'hui pour ce motif.
  const noBilan = await env.DB.prepare(`
    SELECT u.id, u.email, u.first_name, p.progress
    FROM users u
    LEFT JOIN profiles p ON p.user_id = u.id
    WHERE u.last_seen_at >= datetime('now', '-2 days')
      AND COALESCE(u.email_opt_out, 0) = 0
      AND NOT EXISTS (SELECT 1 FROM daily_results d WHERE d.user_id = u.id AND d.date = ?)
      AND NOT EXISTS (SELECT 1 FROM email_log e WHERE e.user_id = u.id AND e.kind = 'no_bilan'
                       AND date(e.sent_at) = date('now'))
  `).bind(yesterday).all();
  for (const u of noBilan.results) {
    let streak: number | null = null;
    try {
      const progress = u.progress ? JSON.parse(u.progress as string) : null;
      if (progress && typeof progress.streak === 'number') streak = progress.streak;
    } catch { /* progress illisible -> phrase de série omise */ }
    const { subject, html } = buildNoBilanEmail(env, (u.first_name as string) || '', streak);
    await sendEmail(env, u.email as string, subject, html, 'no_bilan', u.id as string);
  }

  // 2) « Ça fait 3 jours » — dernière connexion entre J-4 et J-3, pas relancé depuis 7 jours.
  const inactive = await env.DB.prepare(`
    SELECT id, email, first_name FROM users
    WHERE last_seen_at BETWEEN datetime('now', '-4 days') AND datetime('now', '-3 days')
      AND COALESCE(email_opt_out, 0) = 0
      AND NOT EXISTS (SELECT 1 FROM email_log e WHERE e.user_id = users.id AND e.kind = 'inactive_3d'
                       AND e.sent_at >= datetime('now', '-7 days'))
  `).all();
  for (const u of inactive.results) {
    const { subject, html } = buildInactiveEmail(env, (u.first_name as string) || '');
    await sendEmail(env, u.email as string, subject, html, 'inactive_3d', u.id as string);
  }
}

async function runEveningReminders(env: Env): Promise<void> {
  const today = dateLocalParis();
  const subs = await env.DB.prepare(`
    SELECT p.fcm_token, u.first_name, u.id AS user_id
    FROM push_subscriptions p JOIN users u ON u.id = p.user_id
    WHERE NOT EXISTS (SELECT 1 FROM daily_results d WHERE d.user_id = u.id AND d.date = ?)
  `).bind(today).all();
  for (const s of subs.results) {
    await sendFCM(env, s.fcm_token as string, {
      title: '📝 Ton bilan t\'attend',
      body: `3 minutes pour clôturer ta journée, ${(s.first_name as string) || 'champion'} — et garde ta série 🔥`,
    });
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hashPasswordWithSalt(password, CURRENT_SALT);
}

export async function verifyPassword(password: string, hash: string): Promise<{ valid: boolean; needsRehash: boolean }> {
  const currentHash = await hashPasswordWithSalt(password, CURRENT_SALT);
  if (currentHash === hash) return { valid: true, needsRehash: false };
  const legacyHash = await hashPasswordWithSalt(password, LEGACY_SALT);
  if (legacyHash === hash) return { valid: true, needsRehash: true };
  return { valid: false, needsRehash: false };
}

// --- JWT with real HMAC-SHA256 ---
export async function signHMAC(key: CryptoKey, data: string): Promise<string> {
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return btoa(String.fromCharCode(...new Uint8Array(sig)));
}

export async function importKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function createJWT(userId: string, email: string, env: Env): Promise<string> {
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

export async function verifyJWT(token: string, env: Env): Promise<{ userId: string; email: string } | null> {
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
        const neutralResponse = { success: true, message: 'Si un compte existe avec cet email, un lien de réinitialisation vient d\'être envoyé.' };

        const user = email
          ? await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
          : null;
        if (!user) {
          return json(neutralResponse, 200, cors);
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

        return json(neutralResponse, 200, cors);
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
        await touchLastSeen(env, userId);

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
        await touchLastSeen(env, userId);

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

        // Contacts chauds
        const contactsRows = await env.DB.prepare(
          'SELECT * FROM contacts WHERE user_id = ? ORDER BY follow_up_date ASC'
        ).bind(userId).all();
        const contacts = (contactsRows.results || []).map((r: any) => ({
          id: r.id,
          name: r.name,
          phone: r.phone,
          context: r.context,
          origin: r.origin,
          followUpDate: r.follow_up_date,
          status: r.status,
          createdAt: r.created_at,
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
        }, completedDays, visits, contacts }, 200, cors);
      }

      // ===== VISITS: POST =====
      if (path === '/api/visits' && request.method === 'POST') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);
        await touchLastSeen(env, userId);

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
        await touchLastSeen(env, userId);

        const id = url.searchParams.get('id');
        if (!id) return json({ error: 'ID manquant.' }, 400, cors);

        await env.DB.prepare('DELETE FROM visit_reports WHERE id = ? AND user_id = ?').bind(id, userId).run();
        return json({ success: true }, 200, cors);
      }

      // ===== CONTACTS: POST =====
      if (path === '/api/contacts' && request.method === 'POST') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);
        await touchLastSeen(env, userId);

        const body = await request.json() as any;
        if (!body.name || !String(body.name).trim()) {
          return json({ error: 'Nom manquant.' }, 400, cors);
        }
        const id = body.id || `contact-${Date.now()}`;

        await env.DB.prepare(
          `INSERT OR REPLACE INTO contacts
            (id, user_id, name, phone, context, origin, follow_up_date, status, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        ).bind(
          id, userId, String(body.name).trim(), body.phone || '', body.context || '', body.origin || '',
          body.followUpDate || null, body.status || 'chaud', body.createdAt || new Date().toISOString()
        ).run();

        return json({ success: true, id }, 200, cors);
      }

      // ===== CONTACTS: DELETE =====
      if (path === '/api/contacts' && request.method === 'DELETE') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);
        await touchLastSeen(env, userId);

        const id = url.searchParams.get('id');
        if (!id) return json({ error: 'ID manquant.' }, 400, cors);

        await env.DB.prepare('DELETE FROM contacts WHERE id = ? AND user_id = ?').bind(id, userId).run();
        return json({ success: true }, 200, cors);
      }

      // ===== PUSH: subscribe =====
      if (path === '/api/push/subscribe' && request.method === 'POST') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);
        await touchLastSeen(env, userId);

        const body = await request.json() as any;
        if (!body.fcmToken) return json({ error: 'fcmToken manquant.' }, 400, cors);

        await env.DB.prepare(
          'INSERT OR REPLACE INTO push_subscriptions (id, user_id, fcm_token, user_agent) VALUES (?, ?, ?, ?)'
        ).bind(crypto.randomUUID(), userId, String(body.fcmToken), String(body.userAgent || '')).run();

        return json({ success: true }, 200, cors);
      }

      // ===== PUSH: unsubscribe =====
      if (path === '/api/push/subscribe' && request.method === 'DELETE') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);
        await touchLastSeen(env, userId);

        const fcmToken = url.searchParams.get('fcmToken');
        if (!fcmToken) return json({ error: 'fcmToken manquant.' }, 400, cors);

        await env.DB.prepare('DELETE FROM push_subscriptions WHERE fcm_token = ? AND user_id = ?').bind(fcmToken, userId).run();
        return json({ success: true }, 200, cors);
      }

      // ===== EMAILS: désinscription (lien signé en bas de chaque email de relance) =====
      if (path === '/api/emails/unsubscribe' && request.method === 'GET') {
        const token = url.searchParams.get('token') || '';
        const decoded = await verifyJWT(token, env);
        const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8' };
        if (!decoded) {
          return new Response('<!DOCTYPE html><html lang="fr"><body style="font-family: Arial, sans-serif; text-align: center; padding: 48px;"><p>Ce lien est invalide ou a expiré.</p></body></html>', { status: 400, headers: htmlHeaders });
        }
        await env.DB.prepare('UPDATE users SET email_opt_out = 1 WHERE id = ?').bind(decoded.userId).run();
        return new Response('<!DOCTYPE html><html lang="fr"><body style="font-family: Arial, sans-serif; text-align: center; padding: 48px;"><p>Tu es désinscrit des emails de relance. Tu peux fermer cette page.</p></body></html>', { status: 200, headers: htmlHeaders });
      }

      // ===== MILESTONE: email de félicitations (un seul envoi par palier) =====
      if (path === '/api/milestone' && request.method === 'POST') {
        const userId = await getUserId(request, env);
        if (!userId) return json({ error: 'Non autorisé.' }, 401, cors);

        const body = await request.json() as any;
        const info = MILESTONES[body.kind];
        if (!info) return json({ error: 'Palier inconnu.' }, 400, cors);

        // Anti-doublon : le kind est encodé dans email_log ('milestone:streak_7').
        const logKind = `milestone:${body.kind}`;
        const alreadySent = await env.DB.prepare(
          'SELECT id FROM email_log WHERE user_id = ? AND kind = ?'
        ).bind(userId, logKind).first();
        if (alreadySent) return json({ success: true, alreadySent: true }, 200, cors);

        const user = await env.DB.prepare('SELECT email, first_name, email_opt_out FROM users WHERE id = ?').bind(userId).first();
        if (!user) return json({ error: 'Utilisateur introuvable.' }, 404, cors);
        if (user.email_opt_out) return json({ success: true, skipped: true }, 200, cors);

        const { subject, html } = buildMilestoneEmail(env, (user.first_name as string) || '', info);
        const sent = await sendEmail(env, user.email as string, subject, html, logKind, userId);
        return json({ success: sent }, sent ? 200 : 502, cors);
      }

      return json({ error: 'Route non trouvée.' }, 404, cors);

    } catch (err: any) {
      return json({ error: err.message || 'Erreur serveur.' }, 500, cors);
    }
  },

  // Cron : 7h UTC = relances email du matin, 16h UTC = rappels push du soir.
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      const hourUTC = new Date(event.scheduledTime).getUTCHours();
      if (hourUTC === 7) await runMorningRelances(env);
      if (hourUTC === 16) await runEveningReminders(env);
    })());
  }
};
