// MOD-27 — Protocole anti-décrochage.
// L'app collecte humeur et difficultés chaque soir sans les utiliser : ce module
// les exploite. Évalué à l'enregistrement du bilan (evaluateBilan, appelé depuis
// handleSaveCheckup dans App.tsx), lu à l'ouverture du dashboard (getProtocole).
// L'état n'est JAMAIS affiché tel quel à l'utilisateur (pas de « niveau 2 ») :
// le dashboard ne montre qu'une carte de soutien bienveillante.

import type { DailyResults } from '@/types';
import type { UserProfile } from '@/types/profile';

const STORAGE_PREFIX = 'iad-coach-anti-decrochage';

// Durée du protocole : 2 bilans enregistrés après le déclenchement.
const DUREE_BILANS = 2;
// Niveau 2 « 0 mandat » : seuil d'ancienneté en jours.
const SEUIL_JOURS_SANS_MANDAT = 45;

export type ProtocoleLevel = 1 | 2;

export interface ProtocoleHistoryEntry {
  date: string;    // dateKey YYYY-MM-DD du bilan déclencheur
  level: ProtocoleLevel;
  trigger: string; // 'humeur-basse' | 'moral' | 'consecutif' | 'aucun-mandat-45j'
}

export interface ProtocoleState {
  active: boolean;
  level: ProtocoleLevel;
  startedAt: string;      // dateKey du déclenchement
  bilansRestants: number; // fin automatique à 0
  history: ProtocoleHistoryEntry[];
}

// Signaux de moral dans le champ « difficultés » (liste extensible).
// Déjà normalisés : minuscules, sans accents.
const SIGNAUX_MORAL = ['moral', 'decourag', 'abandon', 'envie de rien', 'ca ne marche pas'];

// Comparaison insensible à la casse ET aux accents (NFD + retrait des diacritiques).
function normalizeTexte(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Même repli que temoignages.ts : l'email vient de la session si non fourni.
function resolveEmail(email?: string): string {
  if (email) return email;
  try {
    const session = localStorage.getItem('iad-coach-session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed?.email) return parsed.email;
    }
  } catch { /* ignore */ }
  return 'anonymous';
}

function emptyState(): ProtocoleState {
  return { active: false, level: 1, startedAt: '', bilansRestants: 0, history: [] };
}

function loadState(email?: string): ProtocoleState | null {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}-${resolveEmail(email)}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.active !== 'boolean' || !Array.isArray(parsed?.history)) return null;
    return {
      active: parsed.active,
      level: parsed.level === 2 ? 2 : 1,
      startedAt: typeof parsed.startedAt === 'string' ? parsed.startedAt : '',
      bilansRestants: typeof parsed.bilansRestants === 'number' ? parsed.bilansRestants : 0,
      history: parsed.history,
    };
  } catch {
    return null;
  }
}

function saveState(email: string | undefined, state: ProtocoleState): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}-${resolveEmail(email)}`, JSON.stringify(state));
  } catch { /* ignore */ }
}

// État actif du protocole, lu à l'ouverture du dashboard. null si inactif.
export function getProtocole(email?: string): ProtocoleState | null {
  const state = loadState(email);
  return state && state.active ? state : null;
}

// Déclencheur niveau 1 : humeur ≤ 2/5, ou signal de moral dans les difficultés.
// Retourne le trigger ('humeur-basse' | 'moral') ou null.
export function detectNiveau1(bilan: { mood?: number; challenges?: string }): string | null {
  if ((bilan.mood ?? 3) <= 2) return 'humeur-basse';
  const difficultes = normalizeTexte(bilan.challenges ?? '');
  if (difficultes.trim() && SIGNAUX_MORAL.some(s => difficultes.includes(s))) return 'moral';
  return null;
}

// Évalué à chaque enregistrement de bilan. `previousBilans` = les bilans déjà
// enregistrés AVANT celui-ci (progress.dailyResults au moment du save).
// Silencieux par conception : aucune notification ici, la réponse bienveillante
// arrive sur le dashboard.
export function evaluateBilan(
  bilan: DailyResults & { mood?: number; challenges?: string },
  profile: UserProfile,
  previousBilans: DailyResults[],
  email?: string
): ProtocoleState {
  const state = loadState(email) ?? emptyState();
  const date = bilan.date;

  // 1. Fin automatique : chaque bilan enregistré décrémente — sauf le bilan
  //    déclencheur lui-même (ré-enregistrement du même jour ≠ nouveau bilan).
  if (state.active && state.startedAt !== date) {
    state.bilansRestants -= 1;
    if (state.bilansRestants <= 0) state.active = false;
  }

  // 2. Déclencheurs sur ce bilan.
  let level: ProtocoleLevel | null = null;
  let trigger: string | null = null;

  const n1 = detectNiveau1(bilan);
  if (n1) {
    level = 1;
    trigger = n1;
    // Niveau 2 : le bilan précédent était difficile aussi (2 consécutifs).
    const precedent = previousBilans
      .filter(r => r.date < date)
      .sort((a, b) => b.date.localeCompare(a.date))[0];
    if (precedent && detectNiveau1(precedent)) {
      level = 2;
      trigger = 'consecutif';
    }
  }

  // Niveau 2 : 0 mandat après 45 jours d'ancienneté (une seule fois par compte).
  const totalMandats =
    previousBilans.reduce((sum, r) => sum + (r.mandatsSigned || 0), 0) + (bilan.mandatsSigned || 0);
  const ancienneteJours = Math.floor((Date.now() - new Date(profile.startDate).getTime()) / 86400000);
  if (
    totalMandats === 0 &&
    ancienneteJours >= SEUIL_JOURS_SANS_MANDAT &&
    !state.history.some(h => h.trigger === 'aucun-mandat-45j')
  ) {
    level = 2;
    trigger = 'aucun-mandat-45j';
  }

  // 3. (Ré)activation : un déclencheur relance les 48 h.
  if (level !== null && trigger) {
    state.active = true;
    state.level = level;
    state.startedAt = date;
    state.bilansRestants = DUREE_BILANS;
    if (!state.history.some(h => h.date === date && h.trigger === trigger)) {
      state.history = [...state.history, { date, level, trigger }].slice(-50);
    }
  }

  saveState(email, state);
  return state;
}
