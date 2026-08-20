// ============================================
// IMMO PULSE API SERVICE
// Connecte le frontend à l'API Cloudflare
// ============================================

const API_URL = 'https://immo-pulse-api.melissa-montagne66.workers.dev';

const IS_PLACEHOLDER = API_URL.includes('ton-compte');
const FETCH_TIMEOUT = 5000; // 5 secondes max

function getToken(): string | null {
  return localStorage.getItem('immo-pulse-token');
}

function headers() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// Fetch avec timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
}

// --- API health check ---

export function isApiConfigured(): boolean {
  return !IS_PLACEHOLDER;
}

export async function isApiReachable(): Promise<boolean> {
  if (IS_PLACEHOLDER) return false;
  try {
    const res = await fetchWithTimeout(`${API_URL}/api/sync`, {
      method: 'HEAD',
      headers: headers(),
    });
    return res.ok || res.status === 401;
  } catch {
    return false;
  }
}

// --- AUTH ---

export async function apiRegister(email: string, password: string, firstName: string, lastName: string, expérienceLevel?: string, startDate?: string, cguVersion?: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName, expérienceLevel, startDate, cguVersion }),
  });
  const data = await res.json();
  if (data.token) localStorage.setItem('immo-pulse-token', data.token);
  return data;
}

export async function apiLogin(email: string, password: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) localStorage.setItem('immo-pulse-token', data.token);
  return data;
}

export async function apiForgotPassword(email: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

export async function apiResetPassword(token: string, password: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword: password }),
  });
  return await res.json();
}

// --- SYNC ---

export async function apiSyncSave(payload: {
  profile: any;
  progress: any;
  visits: any[];
}) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/sync`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function apiSyncLoad() {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/sync`, {
    headers: headers(),
  });
  return await res.json();
}

// --- VISITS ---

export async function apiSaveVisit(visit: any) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/visits`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(visit),
  });
  return await res.json();
}

export async function apiDeleteVisit(id: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/visits?id=${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return await res.json();
}

// --- CONTACTS ---

export async function apiSaveContact(contact: any) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/contacts`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(contact),
  });
  return await res.json();
}

export async function apiDeleteContact(id: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/contacts?id=${id}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return await res.json();
}

// --- PUSH (MOD-29) ---

export async function apiPushSubscribe(fcmToken: string, userAgent: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/push/subscribe`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ fcmToken, userAgent }),
  });
  return await res.json();
}

export async function apiPushUnsubscribe(fcmToken: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/push/subscribe?fcmToken=${encodeURIComponent(fcmToken)}`, {
    method: 'DELETE',
    headers: headers(),
  });
  return await res.json();
}

// --- MILESTONES (MOD-30 : email de félicitations de palier) ---

export async function apiMilestone(kind: string) {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/milestone`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ kind }),
  });
  return await res.json();
}

// --- ACCOUNT (droit à l'oubli RGPD) ---

export async function apiDeleteAccount() {
  if (IS_PLACEHOLDER) {
    throw new Error('API not configured');
  }
  const res = await fetchWithTimeout(`${API_URL}/api/account`, {
    method: 'DELETE',
    headers: headers(),
  });
  return await res.json();
}

// --- UTIL ---

export function isCloudEnabled(): boolean {
  return !!getToken() && !IS_PLACEHOLDER;
}

export function logoutCloud() {
  localStorage.removeItem('immo-pulse-token');
}
