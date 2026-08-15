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
