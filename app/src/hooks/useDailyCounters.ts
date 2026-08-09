import { useState, useEffect, useCallback, useRef } from 'react';
import { toLocalDateKey } from '@/lib/utils';

// === Compteurs d'objectifs du jour (MOD-11) ===
// Persistance : localStorage `iad-coach-counters-{userKey}-{YYYY-MM-DD}` (date locale).
// La clé datée fait repartir les compteurs à zéro chaque jour naturellement.
// ⚠️ Cette clé n'est pas encore incluse dans la sync cloud (App.tsx pousse
// seulement profile/progress/visits).

export type CounterKey = 'conversations' | 'contacts' | 'r1' | 'r2' | 'visites';

export interface DailyCounters {
  conversations: number;
  contacts: number;
  r1: number;
  r2: number;
  visites: number;
}

const COUNTERS_PREFIX = 'iad-coach-counters';
const COUNTERS_EVENT = 'iad-coach-counters-changed';
const NOTES_PREFIX = 'iad-coach-action-notes';
const NOTES_EVENT = 'iad-coach-action-notes-changed';

const emptyCounters: DailyCounters = { conversations: 0, contacts: 0, r1: 0, r2: 0, visites: 0 };

// Retrouve la clé utilisateur (email) depuis la session, comme getUserKey() dans App.tsx.
// Permet d'utiliser ces hooks sans changer les props passées par App.tsx.
function resolveUserKey(userKey?: string): string {
  if (userKey) return userKey;
  try {
    const session = localStorage.getItem('iad-coach-session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed?.email) return parsed.email;
    }
  } catch { /* ignore */ }
  return 'anonymous';
}

function getCountersKey(userKey: string, dateKey: string): string {
  return `${COUNTERS_PREFIX}-${userKey}-${dateKey}`;
}

function loadCounters(userKey: string, dateKey: string): { counters: DailyCounters; hasData: boolean } {
  try {
    const stored = localStorage.getItem(getCountersKey(userKey, dateKey));
    if (stored) return { counters: { ...emptyCounters, ...JSON.parse(stored) }, hasData: true };
  } catch { /* ignore */ }
  return { counters: { ...emptyCounters }, hasData: false };
}

export function useDailyCounters(userKeyProp?: string) {
  const userKey = resolveUserKey(userKeyProp);
  const [dateKey, setDateKey] = useState(() => toLocalDateKey(new Date()));
  const [state, setState] = useState(() => loadCounters(userKey, dateKey));
  const stateRef = useRef(state);
  stateRef.current = state;

  // Recharge quand l'utilisateur ou la date change (minuit passé, app rouverte le lendemain)
  useEffect(() => {
    setState(loadCounters(userKey, dateKey));
  }, [userKey, dateKey]);

  // Bascule de date pendant que l'app reste ouverte (minuit) + sync inter-onglets
  // + sync entre les instances du hook (Dashboard / Aujourd'hui / Bilan) via custom event.
  useEffect(() => {
    const checkDate = () => {
      const nowKey = toLocalDateKey(new Date());
      if (nowKey !== dateKey) setDateKey(nowKey);
    };
    const interval = setInterval(checkDate, 30000);
    window.addEventListener('focus', checkDate);
    const onStorage = (e: StorageEvent) => {
      if (e.key?.startsWith(`${COUNTERS_PREFIX}-${userKey}-`)) {
        setState(loadCounters(userKey, toLocalDateKey(new Date())));
      }
    };
    const onCustom = () => {
      setState(loadCounters(userKey, toLocalDateKey(new Date())));
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener(COUNTERS_EVENT, onCustom);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', checkDate);
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(COUNTERS_EVENT, onCustom);
    };
  }, [userKey, dateKey]);

  const persist = useCallback((next: DailyCounters) => {
    const key = getCountersKey(userKey, toLocalDateKey(new Date()));
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch { /* ignore */ }
    setState({ counters: next, hasData: true });
    window.dispatchEvent(new CustomEvent(COUNTERS_EVENT));
  }, [userKey]);

  const increment = useCallback((key: CounterKey, delta: number = 1) => {
    const next = { ...stateRef.current.counters, [key]: Math.max(0, stateRef.current.counters[key] + delta) };
    persist(next);
  }, [persist]);

  const setCounter = useCallback((key: CounterKey, value: number) => {
    persist({ ...stateRef.current.counters, [key]: Math.max(0, value) });
  }, [persist]);

  // Le bilan du soir validé fait foi : il réécrit les compteurs du jour.
  const setAll = useCallback((counters: DailyCounters) => {
    persist({ ...counters });
  }, [persist]);

  return {
    counters: state.counters,
    // true si l'utilisateur a déjà utilisé les compteurs aujourd'hui (clé existante)
    hasData: state.hasData,
    increment,
    setCounter,
    setAll,
  };
}

// === Notes de résultats par action (MOD-15) ===
// Persistance : localStorage `iad-coach-action-notes-{userKey}` → Record<taskId, note>.
// Les ids de tâches embarquent le numéro de jour (`prospection-jour-5`…), comme
// progress.completedDays — pas besoin de clé datée.
// ⚠️ Pas encore incluse dans la sync cloud.

function loadNotes(userKey: string): Record<string, string> {
  try {
    const stored = localStorage.getItem(`${NOTES_PREFIX}-${userKey}`);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

export function useActionNotes(userKeyProp?: string) {
  const userKey = resolveUserKey(userKeyProp);
  const [notes, setNotes] = useState<Record<string, string>>(() => loadNotes(userKey));
  const notesRef = useRef(notes);
  notesRef.current = notes;

  useEffect(() => {
    setNotes(loadNotes(userKey));
  }, [userKey]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === `${NOTES_PREFIX}-${userKey}`) setNotes(loadNotes(userKey));
    };
    const onCustom = () => setNotes(loadNotes(userKey));
    window.addEventListener('storage', onStorage);
    window.addEventListener(NOTES_EVENT, onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(NOTES_EVENT, onCustom);
    };
  }, [userKey]);

  const setNote = useCallback((taskId: string, note: string) => {
    const next = { ...notesRef.current };
    if (note.trim()) next[taskId] = note.trim();
    else delete next[taskId];
    try {
      localStorage.setItem(`${NOTES_PREFIX}-${userKey}`, JSON.stringify(next));
    } catch { /* ignore */ }
    setNotes(next);
    window.dispatchEvent(new CustomEvent(NOTES_EVENT));
  }, [userKey]);

  return { notes, setNote };
}
