import { toLocalDateKey, parseLocalDateKey } from '@/lib/utils';
import { plural } from '@/lib/goals';

// ============================================
// MOD-22 — Série de bilans (« streak » réelle)
// Logique pure et testable : aucun accès à localStorage / React.
//
// Règles :
// - La série ne s'incrémente QU'à la validation du bilan du soir
//   (cocher des actions n'a aucun effet sur la série).
// - 1 gel automatique par semaine calendaire : si hier n'a pas de bilan
//   et qu'un gel est disponible, il est consommé à la réouverture et la
//   série est conservée.
// - Sans gel, la série est cassée (message bienveillant) et repart à 1
//   au prochain bilan validé.
// - Paliers : 3, 7, 14, 30 jours puis tous les 30 (60, 90...).
// ============================================

export interface StreakState {
  count: number;
  /** Dernier jour avec bilan validé (clé locale YYYY-MM-DD), null si jamais. */
  lastBilanDate: string | null;
  /** 1 si aucun gel n'a été consommé cette semaine calendaire, sinon 0. */
  freezesAvailable: number;
  freezesUsedThisWeek: number;
  /** Date du dernier gel consommé — sert à la remise à zéro hebdomadaire. */
  lastFreezeDate: string | null;
}

export const DEFAULT_STREAK: StreakState = {
  count: 0,
  lastBilanDate: null,
  freezesAvailable: 1,
  freezesUsedThisWeek: 0,
  lastFreezeDate: null,
};

// ---------- Helpers de dates (clés YYYY-MM-DD locales) ----------

export function addDays(dateKey: string, delta: number): string {
  const d = parseLocalDateKey(dateKey);
  d.setDate(d.getDate() + delta);
  return toLocalDateKey(d);
}

export function diffDays(fromKey: string, toKey: string): number {
  const ms = parseLocalDateKey(toKey).getTime() - parseLocalDateKey(fromKey).getTime();
  return Math.round(ms / 86_400_000);
}

/** Lundi de la semaine calendaire contenant dateKey (clé YYYY-MM-DD). */
export function weekKey(dateKey: string): string {
  const d = parseLocalDateKey(dateKey);
  const day = d.getDay(); // 0 = dimanche
  const shift = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + shift);
  return toLocalDateKey(d);
}

// ---------- Migration douce ----------

/**
 * Convertit n'importe quelle valeur persistée en StreakState valide.
 * Ancien format : `streak` était un simple nombre (incrémenté à la coche
 * d'actions). On conserve le compteur et on déduit lastBilanDate du bilan
 * le plus récent si disponible (sinon null — le prochain bilan repartira
 * proprement).
 */
export function migrateStreak(raw: unknown, dailyResults?: { date: string }[]): StreakState {
  if (raw && typeof raw === 'object' && typeof (raw as StreakState).count === 'number') {
    const s = raw as Partial<StreakState>;
    return {
      count: s.count ?? 0,
      lastBilanDate: typeof s.lastBilanDate === 'string' ? s.lastBilanDate : null,
      freezesAvailable: typeof s.freezesAvailable === 'number' ? s.freezesAvailable : 1,
      freezesUsedThisWeek: typeof s.freezesUsedThisWeek === 'number' ? s.freezesUsedThisWeek : 0,
      lastFreezeDate: typeof s.lastFreezeDate === 'string' ? s.lastFreezeDate : null,
    };
  }
  if (typeof raw === 'number') {
    const lastBilanDate = dailyResults && dailyResults.length > 0
      ? dailyResults.map(r => r.date).sort().reverse()[0]
      : null;
    return { ...DEFAULT_STREAK, count: Math.max(0, raw), lastBilanDate };
  }
  return { ...DEFAULT_STREAK };
}

// ---------- Paliers ----------

export function isMilestone(n: number): boolean {
  return n === 3 || n === 7 || n === 14 || (n >= 30 && n % 30 === 0);
}

export function getMilestoneMessage(n: number): string | null {
  if (n === 3) return '🔥 3 jours de suite\u00A0! Le rituel est en place.';
  if (n === 7) return '🔥 Une semaine complète\u00A0! Tu fais partie des 10\u00A0% qui tiennent le rythme.';
  if (n === 14) return '🔥 14 jours. La constance est devenue une habitude.';
  if (n >= 30 && n % 30 === 0) {
    return `🏆 ${plural(n, 'jour')} de bilans\u00A0! Tu es officiellement un professionnel structuré.`;
  }
  return null;
}

// ---------- Gel de série ----------

export function hasFreezeAvailable(streak: StreakState, todayKey: string): boolean {
  if (!streak.lastFreezeDate) return streak.freezesAvailable > 0;
  return weekKey(streak.lastFreezeDate) !== weekKey(todayKey);
}

// ---------- Incrément à la validation du bilan ----------

export interface BilanRegistration {
  streak: StreakState;
  /** false si un bilan était déjà enregistré pour cette date (idempotent). */
  incremented: boolean;
  /** Valeur du palier atteint (3, 7, 14, 30, 60...) ou null. */
  milestone: number | null;
}

/**
 * Enregistre un bilan validé pour dateKey.
 * Contrat : checkStreakOnOpen doit avoir tourné à l'ouverture de l'app —
 * c'est lui qui applique gel / casse, donc ici on se contente d'incrémenter.
 */
export function registerBilan(streak: StreakState, dateKey: string): BilanRegistration {
  if (streak.lastBilanDate === dateKey) {
    return { streak, incremented: false, milestone: null };
  }
  const count = streak.count + 1;
  const next: StreakState = { ...streak, count, lastBilanDate: dateKey };
  return { streak: next, incremented: true, milestone: isMilestone(count) ? count : null };
}

// ---------- Vérification à l'ouverture (gel / casse) ----------

export type StreakOpenEvent =
  | { type: 'freeze-used'; count: number; message: string }
  | { type: 'broken'; previousCount: number; message: string };

/**
 * À appeler une fois à l'ouverture de l'app.
 * - Hier sans bilan + gel dispo (et un seul jour manqué) → gel consommé,
 *   série conservée (le gel « couvre » hier : lastBilanDate avance à hier,
 *   ce qui rend l'appel idempotent dans la journée).
 * - Sinon, si la série était active → casse bienveillante, count repart à 0
 *   (le prochain bilan la relancera à 1).
 * Retourne le même objet streak (référence identique) si rien n'a changé.
 */
export function checkStreakOnOpen(streak: StreakState, todayKey: string): { streak: StreakState; event: StreakOpenEvent | null } {
  // Remise hebdomadaire du gel (semaine calendaire, lundi → dimanche)
  let s = streak;
  if (s.lastFreezeDate && weekKey(s.lastFreezeDate) !== weekKey(todayKey)) {
    s = { ...s, freezesAvailable: 1, freezesUsedThisWeek: 0, lastFreezeDate: null };
  }

  if (!s.lastBilanDate || s.lastBilanDate >= todayKey) {
    return { streak: s, event: null };
  }
  const yesterday = addDays(todayKey, -1);
  if (s.lastBilanDate === yesterday) {
    return { streak: s, event: null };
  }

  const missedDays = diffDays(s.lastBilanDate, todayKey) - 1;
  if (s.count > 0 && missedDays === 1 && hasFreezeAvailable(s, todayKey)) {
    const next: StreakState = {
      ...s,
      lastBilanDate: yesterday,
      freezesAvailable: 0,
      freezesUsedThisWeek: s.freezesUsedThisWeek + 1,
      lastFreezeDate: todayKey,
    };
    return {
      streak: next,
      event: {
        type: 'freeze-used',
        count: s.count,
        message: `🧊 Ton gel de série a été utilisé — ta série de ${plural(s.count, 'jour')} est sauve\u00A0! Cette semaine, plus de joker\u00A0: pense à ton bilan ce soir.`,
      },
    };
  }

  if (s.count > 0) {
    const n = s.count;
    return {
      streak: { ...s, count: 0 },
      event: {
        type: 'broken',
        previousCount: n,
        message: `Ta série s'est arrêtée à ${plural(n, 'jour')}. ${plural(n, 'jour')} de travail, ça ne s'efface pas — ça prouve que tu sais faire. On repart aujourd'hui\u00A0? 💪`,
      },
    };
  }

  return { streak: s, event: null };
}
