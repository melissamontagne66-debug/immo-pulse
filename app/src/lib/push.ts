// ============================================
// MOD-29 — Notifications push via Firebase Cloud Messaging (FCM).
//
// Dégradation gracieuse : si les variables VITE_FIREBASE_* ne sont pas
// définies au build (compte Firebase pas encore créé), tout ce module est
// inerte — l'app fonctionne normalement et les emails (MOD-28) restent
// le filet de sécurité.
// ============================================

import { apiPushSubscribe, apiPushUnsubscribe, isCloudEnabled } from '@/services/api';

const PUSH_STATE_PREFIX = 'immo-pulse-push-state';

interface PushState {
  /** 'granted' | 'denied' | 'default' — dernier état connu de la permission. */
  permission: string;
  /** Date ISO du dernier « Plus tard » — on redemande après 7 jours. */
  remindAfter: string | null;
  /** Token FCM courant, si souscrit. */
  fcmToken: string | null;
  /** Préférence utilisateur : rappel du bilan à 18 h (défaut true si permission donnée). */
  reminderEnabled: boolean;
}

function stateKey(userKey: string): string {
  return `${PUSH_STATE_PREFIX}-${userKey}`;
}

export function loadPushState(userKey: string): PushState {
  try {
    const raw = localStorage.getItem(stateKey(userKey));
    if (raw) return { reminderEnabled: true, fcmToken: null, remindAfter: null, permission: 'default', ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { permission: 'default', remindAfter: null, fcmToken: null, reminderEnabled: true };
}

function savePushState(userKey: string, state: PushState): void {
  try {
    localStorage.setItem(stateKey(userKey), JSON.stringify(state));
  } catch { /* ignore */ }
}

// ---------- Config Firebase (variables de build VITE_FIREBASE_*) ----------

function getFirebaseConfig(): Record<string, string> | null {
  const env = import.meta.env;
  const config = {
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  };
  if (!config.apiKey || !config.projectId || !config.appId) return null;
  return config as Record<string, string>;
}

/** FCM est-il configuré pour ce build ? */
export function isPushConfigured(): boolean {
  return getFirebaseConfig() !== null && typeof window !== 'undefined' && 'serviceWorker' in navigator && 'Notification' in window;
}

// Initialisation lazy du SDK Firebase (import dynamique : rien n'est chargé
// si FCM n'est pas configuré — zéro impact sur le bundle de démarrage).
let messagingPromise: Promise<import('firebase/messaging').Messaging> | null = null;

async function getMessaging(): Promise<import('firebase/messaging').Messaging> {
  if (!messagingPromise) {
    messagingPromise = (async () => {
      const [{ initializeApp }, { getMessaging: getMessagingSdk }] = await Promise.all([
        import('firebase/app'),
        import('firebase/messaging'),
      ]);
      const app = initializeApp(getFirebaseConfig()!);
      return getMessagingSdk(app);
    })();
  }
  return messagingPromise;
}

// Enregistre le service worker FCM (sans demander la permission).
// Scope dédié : le scope racine './' est déjà pris par sw.js (PWA) —
// deux scripts sur le même scope se remplaceraient l'un l'autre.
export async function registerPushServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!isPushConfigured()) return null;
  try {
    return await navigator.serviceWorker.register('./firebase-messaging-sw.js', { scope: './firebase-push/' });
  } catch (err) {
    console.warn('Push : échec enregistrement du service worker', err);
    return null;
  }
}

// ---------- Demande de permission (UX douce) ----------

/**
 * Faut-il afficher la carte « Activer les rappels » ?
 * Règles : jamais au 1er lancement (currentDay >= 2), jamais si la permission
 * est déjà décidée (granted/denied), « Plus tard » → redemande après 7 jours.
 */
export function shouldPromptForPush(userKey: string, currentDay: number): boolean {
  if (!isPushConfigured() || currentDay < 2) return false;
  if (typeof Notification === 'undefined') return false;
  if (Notification.permission !== 'default') return false;
  const state = loadPushState(userKey);
  if (state.remindAfter && new Date(state.remindAfter) > new Date()) return false;
  return true;
}

/** « Plus tard » : redemande dans 7 jours. */
export function snoozePushPrompt(userKey: string): void {
  const state = loadPushState(userKey);
  const remindAfter = new Date();
  remindAfter.setDate(remindAfter.getDate() + 7);
  savePushState(userKey, { ...state, remindAfter: remindAfter.toISOString() });
}

/** La permission navigateur a été refusée → ne plus jamais proposer. */
export function isPushDenied(): boolean {
  return typeof Notification !== 'undefined' && Notification.permission === 'denied';
}

// ---------- Souscription ----------

/** Demande la permission, récupère le token FCM et l'enregistre côté Worker. */
export async function subscribeToPush(userKey: string): Promise<boolean> {
  if (!isPushConfigured() || !isCloudEnabled()) return false;
  try {
    const registration = await registerPushServiceWorker();
    if (!registration) return false;

    const permission = await Notification.requestPermission();
    const state = loadPushState(userKey);
    savePushState(userKey, { ...state, permission });
    if (permission !== 'granted') return false;

    const messaging = await getMessaging();
    const { getToken, onMessage } = await import('firebase/messaging');
    const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY;
    const token = await getToken(messaging, {
      serviceWorkerRegistration: registration,
      ...(vapidKey ? { vapidKey } : {}),
    });
    if (!token) return false;

    await apiPushSubscribe(token, navigator.userAgent);
    savePushState(userKey, { ...loadPushState(userKey), fcmToken: token, reminderEnabled: true });

    // Message reçu pendant que l'app est au premier plan → notification manuelle.
    onMessage(messaging, (payload) => {
      if (Notification.permission === 'granted' && payload.notification) {
        new Notification(payload.notification.title || 'Immo Pulse', { body: payload.notification.body || '' });
      }
    });
    return true;
  } catch (err) {
    console.warn('Push : échec de la souscription', err);
    return false;
  }
}

/** Active/désactive le rappel du bilan à 18 h (réglages). */
export async function setPushReminderEnabled(userKey: string, enabled: boolean): Promise<void> {
  const state = loadPushState(userKey);
  if (!enabled && state.fcmToken && isCloudEnabled()) {
    try {
      await apiPushUnsubscribe(state.fcmToken);
    } catch { /* le local reste la référence */ }
    savePushState(userKey, { ...state, reminderEnabled: false, fcmToken: null });
    return;
  }
  if (enabled && !state.fcmToken) {
    const ok = await subscribeToPush(userKey);
    savePushState(userKey, { ...loadPushState(userKey), reminderEnabled: ok });
    return;
  }
  savePushState(userKey, { ...state, reminderEnabled: enabled });
}
