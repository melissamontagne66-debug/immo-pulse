import { useState, useCallback, useRef, useEffect } from 'react';
import { toLocalDateKey } from '@/lib/utils';

// ============================================
// Mini-agenda « Mes RDV à venir »
// Persistance : localStorage `iad-coach-rdv-{userKey}` (pas de sync cloud).
// L'email est auto-résolu depuis la session (même pattern que
// useDailyCounters) pour ne pas avoir à toucher App.tsx.
// ============================================

export interface Rdv {
  id: string;
  titre: string;
  dateHeure: string; // 'YYYY-MM-DDTHH:mm' (heure locale)
  lieu: string;
}

const STORAGE_PREFIX = 'iad-coach-rdv';
const RDV_EVENT = 'iad-coach-rdv-changed';

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

function loadRdvs(userKey: string): Rdv[] {
  try {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}-${userKey}`);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

export function useRdv(userKeyProp?: string) {
  const userKey = resolveUserKey(userKeyProp);
  const [rdvs, setRdvs] = useState<Rdv[]>(() => loadRdvs(userKey));
  const rdvsRef = useRef(rdvs);
  rdvsRef.current = rdvs;

  useEffect(() => {
    setRdvs(loadRdvs(userKey));
  }, [userKey]);

  // Sync inter-onglets (storage) et entre instances du hook (custom event),
  // comme useDailyCounters.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === `${STORAGE_PREFIX}-${userKey}`) setRdvs(loadRdvs(userKey));
    };
    const onCustom = () => setRdvs(loadRdvs(userKey));
    window.addEventListener('storage', onStorage);
    window.addEventListener(RDV_EVENT, onCustom);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener(RDV_EVENT, onCustom);
    };
  }, [userKey]);

  const persist = useCallback((next: Rdv[]) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}-${userKey}`, JSON.stringify(next));
    } catch { /* ignore */ }
    setRdvs(next);
    window.dispatchEvent(new CustomEvent(RDV_EVENT));
  }, [userKey]);

  const addRdv = useCallback((data: Omit<Rdv, 'id'>): Rdv => {
    const rdv: Rdv = { ...data, id: `rdv-${Date.now()}` };
    persist([rdv, ...rdvsRef.current]);
    return rdv;
  }, [persist]);

  const updateRdv = useCallback((id: string, updates: Partial<Omit<Rdv, 'id'>>) => {
    persist(rdvsRef.current.map(r => r.id === id ? { ...r, ...updates } : r));
  }, [persist]);

  const deleteRdv = useCallback((id: string) => {
    persist(rdvsRef.current.filter(r => r.id !== id));
  }, [persist]);

  // RDV du jour, triés par heure
  const getRdvDuJour = useCallback((): Rdv[] => {
    const today = toLocalDateKey(new Date());
    return rdvs
      .filter(r => r.dateHeure.slice(0, 10) === today)
      .sort((a, b) => a.dateHeure.localeCompare(b.dateHeure));
  }, [rdvs]);

  // RDV à venir (aujourd'hui inclus), triés par date
  const getRdvAVenir = useCallback((): Rdv[] => {
    const now = new Date();
    const nowKey = `${toLocalDateKey(now)}T${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    return rdvs
      .filter(r => r.dateHeure >= nowKey)
      .sort((a, b) => a.dateHeure.localeCompare(b.dateHeure));
  }, [rdvs]);

  return { rdvs, addRdv, updateRdv, deleteRdv, getRdvDuJour, getRdvAVenir };
}
