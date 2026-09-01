import { describe, it, expect } from 'vitest';
import {
  hashPasswordWithSalt,
  hashPassword,
  verifyPassword,
  createJWT,
  verifyJWT,
  importKey,
  signHMAC,
  normalizeEmail,
  getFrontendUrl,
  corsHeaders,
  dateLocalParis,
  MILESTONES,
  buildSessionCookie,
  getCookieValue,
  normalizePhoneFR,
  formatBirthdateFR,
  parseSinceParam,
  parseOffsetParam,
  toIsoUtc,
  buildExpiredSessionCookie,
  formatAddressLine,
  SESSION_MAX_AGE_SECONDS,
  type Env,
} from './index';

function fakeEnv(overrides: Partial<Env> = {}): Env {
  return {
    DB: {} as Env['DB'],
    JWT_SECRET: 'test-secret-do-not-use-in-prod',
    FRONTEND_URL: 'https://immo-pulse.pages.dev',
    ...overrides,
  };
}

describe('hashPasswordWithSalt', () => {
  it('is deterministic for the same password and salt', async () => {
    const a = await hashPasswordWithSalt('hunter2', 'salt-a');
    const b = await hashPasswordWithSalt('hunter2', 'salt-a');
    expect(a).toBe(b);
  });

  it('produces a different hash for a different password', async () => {
    const a = await hashPasswordWithSalt('hunter2', 'salt-a');
    const b = await hashPasswordWithSalt('hunter3', 'salt-a');
    expect(a).not.toBe(b);
  });

  it('produces a different hash for a different salt', async () => {
    const a = await hashPasswordWithSalt('hunter2', 'salt-a');
    const b = await hashPasswordWithSalt('hunter2', 'salt-b');
    expect(a).not.toBe(b);
  });
});

describe('hashPassword / verifyPassword (migration sel legacy -> v1)', () => {
  it('accepts a password hashed with the current salt, no rehash needed', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    const result = await verifyPassword('correct-horse-battery-staple', hash);
    expect(result).toEqual({ valid: true, needsRehash: false });
  });

  it('accepts a password hashed with the legacy salt and flags it for rehash', async () => {
    const legacyHash = await hashPasswordWithSalt('correct-horse-battery-staple', 'immo-pulse-salt');
    const result = await verifyPassword('correct-horse-battery-staple', legacyHash);
    expect(result).toEqual({ valid: true, needsRehash: true });
  });

  it('rejects a wrong password', async () => {
    const hash = await hashPassword('correct-horse-battery-staple');
    const result = await verifyPassword('wrong-password', hash);
    expect(result).toEqual({ valid: false, needsRehash: false });
  });
});

describe('createJWT / verifyJWT', () => {
  it('round-trips userId and email through a signed token', async () => {
    const env = fakeEnv();
    const token = await createJWT('user-123', 'test@example.com', env);
    const decoded = await verifyJWT(token, env);
    expect(decoded).toEqual({ userId: 'user-123', email: 'test@example.com' });
  });

  it('rejects a token signed with a different secret', async () => {
    const token = await createJWT('user-123', 'test@example.com', fakeEnv({ JWT_SECRET: 'secret-a' }));
    const decoded = await verifyJWT(token, fakeEnv({ JWT_SECRET: 'secret-b' }));
    expect(decoded).toBeNull();
  });

  it('rejects a tampered payload', async () => {
    const env = fakeEnv();
    const token = await createJWT('user-123', 'test@example.com', env);
    const [header, payload, signature] = token.split('.');
    const tamperedPayload = btoa(JSON.stringify({ sub: 'someone-else', email: 'attacker@example.com', iat: 0, exp: 9999999999 }));
    const tampered = `${header}.${tamperedPayload}.${signature}`;
    expect(await verifyJWT(tampered, env)).toBeNull();
  });

  it('rejects a malformed token', async () => {
    const env = fakeEnv();
    expect(await verifyJWT('not-a-jwt', env)).toBeNull();
    expect(await verifyJWT('a.b', env)).toBeNull();
  });

  it('rejects when JWT_SECRET is not configured', async () => {
    const env = fakeEnv();
    const token = await createJWT('user-123', 'test@example.com', env);
    const decoded = await verifyJWT(token, fakeEnv({ JWT_SECRET: '' }));
    expect(decoded).toBeNull();
  });

  it('rejects an expired token', async () => {
    // Reproduit createJWT mais avec un exp déjà dans le passé, pour ne pas
    // dépendre d'un mock d'horloge (Cloudflare Workers ne garantit pas
    // Date.now() modifiable dans tous les runners).
    const env = fakeEnv();
    const key = await importKey(env.JWT_SECRET);
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ sub: 'user-123', email: 'test@example.com', iat: 0, exp: 1 }));
    const signature = await signHMAC(key, `${header}.${payload}`);
    const expiredToken = `${header}.${payload}.${signature}`;
    expect(await verifyJWT(expiredToken, env)).toBeNull();
  });

  it('createJWT throws when JWT_SECRET is not configured', async () => {
    await expect(createJWT('user-123', 'test@example.com', fakeEnv({ JWT_SECRET: '' }))).rejects.toThrow();
  });
});

describe('normalizeEmail', () => {
  it('lowercases and trims', () => {
    expect(normalizeEmail('  Test@Example.COM  ')).toBe('test@example.com');
  });
});

describe('getFrontendUrl', () => {
  it('returns the matching origin among several allowed origins', () => {
    const env = fakeEnv({ FRONTEND_URL: 'https://immo-pulse.pages.dev, https://preview.immo-pulse.pages.dev' });
    expect(getFrontendUrl(env, 'https://preview.immo-pulse.pages.dev')).toBe('https://preview.immo-pulse.pages.dev');
  });

  it('falls back to the first allowed origin when the given origin does not match', () => {
    const env = fakeEnv({ FRONTEND_URL: 'https://immo-pulse.pages.dev, https://preview.immo-pulse.pages.dev' });
    expect(getFrontendUrl(env, 'https://evil.example.com')).toBe('https://immo-pulse.pages.dev');
  });

  it('falls back to the default URL when FRONTEND_URL is empty', () => {
    const env = fakeEnv({ FRONTEND_URL: '' });
    expect(getFrontendUrl(env)).toBe('https://immo-pulse.pages.dev');
  });
});

describe('corsHeaders', () => {
  it('echoes the request origin when it is allowed', () => {
    const env = fakeEnv({ FRONTEND_URL: 'https://immo-pulse.pages.dev' });
    const request = new Request('https://api.example.com', { headers: { Origin: 'https://immo-pulse.pages.dev' } });
    expect(corsHeaders(env, request)['Access-Control-Allow-Origin']).toBe('https://immo-pulse.pages.dev');
  });

  it('does not echo a disallowed origin', () => {
    const env = fakeEnv({ FRONTEND_URL: 'https://immo-pulse.pages.dev' });
    const request = new Request('https://api.example.com', { headers: { Origin: 'https://evil.example.com' } });
    expect(corsHeaders(env, request)['Access-Control-Allow-Origin']).not.toBe('https://evil.example.com');
  });
});

describe('dateLocalParis', () => {
  it('formats as YYYY-MM-DD', () => {
    expect(dateLocalParis(new Date('2026-03-15T12:00:00Z'))).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('shifts the date around midnight in winter (UTC+1)', () => {
    // 23h30 UTC le 15 janvier = 00h30 le 16 janvier à Paris.
    expect(dateLocalParis(new Date('2026-01-15T23:30:00Z'))).toBe('2026-01-16');
  });

  it('shifts the date around midnight in summer (UTC+2)', () => {
    // 22h30 UTC le 15 juillet = 00h30 le 16 juillet à Paris.
    expect(dateLocalParis(new Date('2026-07-15T22:30:00Z'))).toBe('2026-07-16');
  });
});

describe('MILESTONES', () => {
  it('covers exactly the 6 kinds accepted by POST /api/milestone', () => {
    expect(Object.keys(MILESTONES).sort()).toEqual([
      'first_mandat',
      'first_vente',
      'streak_14',
      'streak_3',
      'streak_30',
      'streak_7',
    ]);
  });

  it('provides palier, detail, pourcentage and prochainJalon for each kind', () => {
    for (const info of Object.values(MILESTONES)) {
      expect(info.palier.length).toBeGreaterThan(0);
      expect(info.detail.length).toBeGreaterThan(0);
      expect(info.pourcentage).toBeGreaterThan(0);
      expect(info.prochainJalon.length).toBeGreaterThan(0);
    }
  });
});

describe('buildSessionCookie', () => {
  it('carries the JWT with the attributes required for a cross-site extension', () => {
    const cookie = buildSessionCookie('token-abc');
    expect(cookie).toContain('session=token-abc');
    expect(cookie).toContain('HttpOnly');
    expect(cookie).toContain('Secure');
    expect(cookie).toContain('SameSite=None');
    expect(cookie).toContain('Path=/');
    expect(cookie).toContain(`Max-Age=${SESSION_MAX_AGE_SECONDS}`);
  });

  it('uses the same TTL as the JWT (30 days)', () => {
    expect(SESSION_MAX_AGE_SECONDS).toBe(30 * 24 * 60 * 60);
  });
});

describe('getCookieValue', () => {
  it('extracts the session cookie among several cookies', () => {
    expect(getCookieValue('foo=bar; session=abc.def.ghi; other=1', 'session')).toBe('abc.def.ghi');
  });

  it('handles a single cookie without separator', () => {
    expect(getCookieValue('session=abc', 'session')).toBe('abc');
  });

  it('returns null when the cookie is absent or the header is missing', () => {
    expect(getCookieValue('foo=bar', 'session')).toBeNull();
    expect(getCookieValue(null, 'session')).toBeNull();
    expect(getCookieValue('', 'session')).toBeNull();
  });

  it('does not match a cookie whose name is only a prefix', () => {
    expect(getCookieValue('session_id=xyz', 'session')).toBeNull();
  });
});

describe('normalizePhoneFR', () => {
  it('strips spaces, dots and dashes', () => {
    expect(normalizePhoneFR('06 12 34 56 78')).toBe('0612345678');
    expect(normalizePhoneFR('06.12.34.56.78')).toBe('0612345678');
    expect(normalizePhoneFR('06-12-34-56-78')).toBe('0612345678');
  });

  it('converts +33 to a leading 0', () => {
    expect(normalizePhoneFR('+33612345678')).toBe('0612345678');
    expect(normalizePhoneFR('+33 6 12 34 56 78')).toBe('0612345678');
  });

  it('converts 0033 to a leading 0', () => {
    expect(normalizePhoneFR('0033612345678')).toBe('0612345678');
  });

  it('returns an empty string for empty input', () => {
    expect(normalizePhoneFR('')).toBe('');
  });
});

describe('formatBirthdateFR', () => {
  it('converts YYYY-MM-DD to JJ/MM/AAAA', () => {
    expect(formatBirthdateFR('1990-05-17')).toBe('17/05/1990');
  });

  it('accepts Feb 29 on a leap year', () => {
    expect(formatBirthdateFR('2000-02-29')).toBe('29/02/2000');
  });

  it('rejects Feb 29 on a non-leap year', () => {
    expect(formatBirthdateFR('2001-02-29')).toBe('');
  });

  it('returns an empty string for empty or malformed input', () => {
    expect(formatBirthdateFR('')).toBe('');
    expect(formatBirthdateFR('17/05/1990')).toBe('');
    expect(formatBirthdateFR('1990-13-01')).toBe('');
  });
});

describe('parseSinceParam', () => {
  it('accepts a valid YYYY-MM-DD date', () => {
    expect(parseSinceParam('2026-08-24')).toBe('2026-08-24');
  });

  it('returns null when absent', () => {
    expect(parseSinceParam(null)).toBeNull();
    expect(parseSinceParam('')).toBeNull();
  });

  it('ignores (null) an invalid format instead of rejecting the request', () => {
    expect(parseSinceParam('24/08/2026')).toBeNull();
    expect(parseSinceParam('not-a-date')).toBeNull();
  });

  it('ignores (null) a well-formed but impossible date', () => {
    expect(parseSinceParam('2026-02-30')).toBeNull();
  });
});

describe('parseOffsetParam', () => {
  it('returns 0 when absent or empty', () => {
    expect(parseOffsetParam(null)).toBe(0);
    expect(parseOffsetParam('')).toBe(0);
  });

  it('accepts a positive integer', () => {
    expect(parseOffsetParam('100')).toBe(100);
    expect(parseOffsetParam(' 200 ')).toBe(200);
  });

  it('returns 0 for invalid or negative input instead of rejecting the request', () => {
    expect(parseOffsetParam('abc')).toBe(0);
    expect(parseOffsetParam('-5')).toBe(0);
  });

  it('caps the offset to bound query cost', () => {
    expect(parseOffsetParam('999999')).toBe(10000);
  });
});

describe('toIsoUtc', () => {
  it('converts a SQLite datetime to ISO 8601 UTC', () => {
    expect(toIsoUtc('2026-08-20 10:32:00')).toBe('2026-08-20T10:32:00Z');
    expect(toIsoUtc('2026-08-20T10:32:00')).toBe('2026-08-20T10:32:00Z');
  });

  it('defaults missing seconds', () => {
    expect(toIsoUtc('2026-08-20 10:32')).toBe('2026-08-20T10:32:00Z');
  });

  it('returns null for absent or malformed input', () => {
    expect(toIsoUtc(null)).toBeNull();
    expect(toIsoUtc('')).toBeNull();
    expect(toIsoUtc('20/08/2026')).toBeNull();
  });
});

describe('buildExpiredSessionCookie', () => {
  it('expires the session cookie immediately (logout)', () => {
    const c = buildExpiredSessionCookie();
    expect(c).toContain('session=');
    expect(c).toContain('Max-Age=0');
    expect(c).toContain('HttpOnly');
    expect(c).toContain('SameSite=None');
  });
});

describe('formatAddressLine', () => {
  it('joins address, zip and city on one line', () => {
    expect(formatAddressLine('24 rue de la République', '69006', 'Lyon')).toBe('24 rue de la République, 69006 Lyon');
  });

  it('omits empty parts without dangling separators', () => {
    expect(formatAddressLine('24 rue de la République', '', '')).toBe('24 rue de la République');
    expect(formatAddressLine('', '69006', 'Lyon')).toBe('69006 Lyon');
    expect(formatAddressLine('', '', 'Lyon')).toBe('Lyon');
    expect(formatAddressLine('', '', '')).toBe('');
  });
});

describe('corsHeaders (extension Bridge CRM)', () => {
  it('echoes a chrome-extension:// origin so credentialed fetches work', () => {
    const env = fakeEnv({ FRONTEND_URL: 'https://immo-pulse.pages.dev' });
    const request = new Request('https://api.example.com', { headers: { Origin: 'chrome-extension://abcdef' } });
    expect(corsHeaders(env, request)['Access-Control-Allow-Origin']).toBe('chrome-extension://abcdef');
  });

  it('sends Allow-Credentials for credentialed (cookie) requests', () => {
    const env = fakeEnv();
    const request = new Request('https://api.example.com', { headers: { Origin: 'https://immo-pulse.pages.dev' } });
    expect(corsHeaders(env, request)['Access-Control-Allow-Credentials']).toBe('true');
  });
});
