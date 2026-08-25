// ============================================
// Week-end : pas de tâches le samedi/dimanche (la semaine court du lundi
// au vendredi), message repos/discipline, et report optionnel des RDV
// (R1, R2, visites) vers le bilan de lundi.
// ============================================

import { toLocalDateKey } from '@/lib/utils';

export function isWeekendDay(d: Date = new Date()): boolean {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

// Clé de date du lundi suivant (appelée un samedi → +2, un dimanche → +1).
export function nextMondayKey(d: Date = new Date()): string {
  const monday = new Date(d);
  const dow = monday.getDay();
  monday.setDate(monday.getDate() + (dow === 6 ? 2 : dow === 0 ? 1 : (8 - dow) % 7));
  return toLocalDateKey(monday);
}

// ---------- Report des RDV du week-end vers le bilan de lundi ----------

export interface WeekendPending {
  date: string;        // clé du lundi cible (YYYY-MM-DD)
  rdvR1Done: number;
  rdvR2Done: number;
  visitesDone: number;
}

function pendingKey(userKey: string): string {
  return `iad-coach-weekend-pending-${userKey}`;
}

// Renvoie le report s'il est encore pertinent (lundi cible pas dépassé),
// et purge les reports périmés (bilan de lundi jamais rempli).
export function loadWeekendPending(userKey: string): WeekendPending | null {
  try {
    const raw = localStorage.getItem(pendingKey(userKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as WeekendPending;
    if (typeof parsed?.date !== 'string') return null;
    if (parsed.date < toLocalDateKey(new Date())) {
      localStorage.removeItem(pendingKey(userKey));
      return null;
    }
    return {
      date: parsed.date,
      rdvR1Done: parsed.rdvR1Done || 0,
      rdvR2Done: parsed.rdvR2Done || 0,
      visitesDone: parsed.visitesDone || 0,
    };
  } catch {
    return null;
  }
}

export function saveWeekendPending(userKey: string, totals: Omit<WeekendPending, 'date'>): void {
  try {
    const existing = loadWeekendPending(userKey);
    const pending: WeekendPending = {
      date: existing?.date ?? nextMondayKey(),
      rdvR1Done: Math.max(0, totals.rdvR1Done),
      rdvR2Done: Math.max(0, totals.rdvR2Done),
      visitesDone: Math.max(0, totals.visitesDone),
    };
    if (pending.rdvR1Done + pending.rdvR2Done + pending.visitesDone === 0) {
      localStorage.removeItem(pendingKey(userKey));
      return;
    }
    localStorage.setItem(pendingKey(userKey), JSON.stringify(pending));
  } catch { /* ignore */ }
}

export function clearWeekendPending(userKey: string): void {
  try {
    localStorage.removeItem(pendingKey(userKey));
  } catch { /* ignore */ }
}

// ---------- Messages du week-end ----------

// Textes maison (pas de citations attribuées — pas de fausse source).
export const WEEKEND_QUOTES: { fr: string[]; es: string[] } = {
  fr: [
    'La discipline est le plus court chemin vers la liberté — et le repos rend la discipline tenable.',
    'Le repos n\'est pas une pause dans ta progression : il en fait partie.',
    'Les champions s\'entraînent dur, puis récupèrent plus dur encore.',
    'Un esprit reposé écoute mieux, vend mieux, signe mieux.',
    'La constance du lundi se prépare par la décompression du dimanche.',
    'Recharger ses batteries, c\'est déjà travailler à sa réussite de demain.',
  ],
  es: [
    'La disciplina es el camino más corto hacia la libertad — y el descanso la hace sostenible.',
    'El descanso no es una pausa en tu progreso: forma parte de él.',
    'Los campeones entrenan duro y recuperan aún más duro.',
    'Una mente descansada escucha mejor, vende mejor, firma mejor.',
    'La constancia del lunes se prepara desconectando el domingo.',
    'Recargar las baterías también es trabajar para el éxito de mañana.',
  ],
};

// Citation du jour (stable dans la journée — hash de la date).
export function weekendQuoteOfDay(isEs: boolean, d: Date = new Date()): string {
  const list = isEs ? WEEKEND_QUOTES.es : WEEKEND_QUOTES.fr;
  const key = toLocalDateKey(d);
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) | 0;
  return list[Math.abs(h) % list.length];
}
