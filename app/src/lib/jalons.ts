// MOD-31 — Progression carrière : jalons, niveaux, semaine de programme.
// Détection pure depuis les données existantes (bilans + ventes) : aucune
// nouvelle saisie, aucun changement de format. Seule persistance nouvelle :
// la liste des jalons DÉJÀ célébrés, dans localStorage
// `iad-coach-milestones-{email}` (la sync cloud de cette liste viendra plus
// tard — pour l'instant elle est locale à l'appareil).
//
// Note R1 : les bilans distinguent rdvR1Fixed (fixé) et rdvR1Done (fait) —
// les deux jalons « 1er R1 fixé » et « 1er R1 fait » sont donc détectables
// séparément, pas besoin de fusionner.

import type { DailyResults, UserProgress } from '@/types';
import type { Sale } from '@/hooks/useSales';
import { diffDays } from '@/lib/streak';
import { toLocalDateKey, parseLocalDateKey } from '@/lib/utils';

const MILESTONES_PREFIX = 'iad-coach-milestones';
const LAST_OPEN_PREFIX = 'iad-coach-last-open';

// Même repli que antiDecrochage.ts / temoignages.ts : l'email vient de la
// session si non fourni.
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

// ---------- Types ----------

export interface Jalon {
  id: string;
  titre: string;
  titreEs: string;
  atteint: boolean;
  /** Clé YYYY-MM-DD de la première occurrence, null si non atteint. */
  dateAtteinte: string | null;
  commentObtenir: string;
  commentObtenirEs: string;
}

export interface Niveau {
  key: 'pepite' | 'confirme' | 'top';
  emoji: string;
  label: string;
  labelEs: string;
}

const NIVEAU_PEPITE: Niveau = { key: 'pepite', emoji: '🌱', label: 'Pépite', labelEs: 'Promesa' };
const NIVEAU_CONFIRME: Niveau = { key: 'confirme', emoji: '🌿', label: 'Confirmé', labelEs: 'Confirmado' };
const NIVEAU_TOP: Niveau = { key: 'top', emoji: '🏆', label: 'Top conseiller', labelEs: 'Top asesor' };

// ---------- Helpers de détection ----------

// Date du premier bilan (ordre chronologique) vérifiant `pred`.
function firstBilanDate(bilansAsc: DailyResults[], pred: (r: DailyResults) => boolean): string | null {
  return bilansAsc.find(pred)?.date ?? null;
}

// Date à laquelle le cumul de `value` atteint `seuil` (bilans chronologiques).
function dateSeuilCumul(bilansAsc: DailyResults[], value: (r: DailyResults) => number, seuil: number): string | null {
  let cumul = 0;
  for (const r of bilansAsc) {
    cumul += value(r);
    if (cumul >= seuil) return r.date;
  }
  return null;
}

// Événements « mandat » : mandatsSigned des bilans + ventes countsAsMandat.
// Approximation assumée : une vente countsAsMandat dont le mandat est AUSSI
// dans un bilan comptera deux fois (les deux sources ne sont pas reliées).
function dateSeuilMandats(bilansAsc: DailyResults[], sales: Sale[], seuil: number): string | null {
  const events: { date: string; n: number }[] = [
    ...bilansAsc.filter(r => (r.mandatsSigned || 0) > 0).map(r => ({ date: r.date, n: r.mandatsSigned })),
    ...sales.filter(s => s.countsAsMandat).map(s => ({ date: s.date, n: 1 })),
  ].sort((a, b) => a.date.localeCompare(b.date));
  let cumul = 0;
  for (const e of events) {
    cumul += e.n;
    if (cumul >= seuil) return e.date;
  }
  return null;
}

// ---------- Jalons ----------

// Détection des jalons depuis les bilans et les ventes. Chaque jalon atteint
// porte la date de sa première occurrence (timeline « Mon parcours »).
export function getJalons(progress: UserProgress, sales: Sale[]): Jalon[] {
  const bilansAsc = [...progress.dailyResults].sort((a, b) => a.date.localeCompare(b.date));
  const salesAsc = [...sales].sort((a, b) => a.date.localeCompare(b.date));

  const defs: { id: string; titre: string; titreEs: string; commentObtenir: string; commentObtenirEs: string; date: string | null }[] = [
    {
      id: 'premier-r1-fixe',
      titre: '1er R1 fixé', titreEs: '1.ª R1 agendada',
      commentObtenir: 'Fixe ton premier rendez-vous découverte (R1) depuis une conversation de prospection.',
      commentObtenirEs: 'Agenda tu primera cita de descubrimiento (R1) desde una conversación de prospección.',
      date: firstBilanDate(bilansAsc, r => (r.rdvR1Fixed || 0) > 0),
    },
    {
      id: 'premier-r1-fait',
      titre: '1er R1 fait', titreEs: '1.ª R1 hecha',
      commentObtenir: 'Réalise ton premier rendez-vous découverte (R1).',
      commentObtenirEs: 'Realiza tu primera cita de descubrimiento (R1).',
      date: firstBilanDate(bilansAsc, r => (r.rdvR1Done || 0) > 0),
    },
    {
      id: 'premier-r2',
      titre: '1er R2 fait', titreEs: '1.ª R2 hecha',
      commentObtenir: 'Réalise ton premier rendez-vous de signature (R2).',
      commentObtenirEs: 'Realiza tu primera cita de firma (R2).',
      date: firstBilanDate(bilansAsc, r => (r.rdvR2Done || 0) > 0),
    },
    {
      id: 'premier-mandat',
      titre: '1er mandat signé', titreEs: '1.er mandato firmado',
      commentObtenir: 'Signe ton premier mandat (bilan du soir ou vente enregistrée).',
      commentObtenirEs: 'Firma tu primer mandato (balance de la noche o venta registrada).',
      date: dateSeuilMandats(bilansAsc, salesAsc, 1),
    },
    {
      id: 'premiere-vente',
      titre: '1ère vente', titreEs: '1.ª venta',
      commentObtenir: 'Enregistre ta première vente dans le calculateur de commission.',
      commentObtenirEs: 'Registra tu primera venta en la calculadora de comisión.',
      date: salesAsc.length > 0 ? salesAsc[0].date : null,
    },
    {
      id: 'premiere-offre',
      titre: '1ère offre écrite', titreEs: '1.ª oferta escrita',
      commentObtenir: 'Rédige ta première offre suite à une visite.',
      commentObtenirEs: 'Redacta tu primera oferta después de una visita.',
      date: firstBilanDate(bilansAsc, r => (r.offresWritten || 0) > 0),
    },
    {
      id: '5-mandats',
      titre: '5 mandats signés', titreEs: '5 mandatos firmados',
      commentObtenir: 'Cumule 5 mandats signés (bilans + ventes qui comptent comme mandat).',
      commentObtenirEs: 'Acumula 5 mandatos firmados (balances + ventas que cuentan como mandato).',
      date: dateSeuilMandats(bilansAsc, salesAsc, 5),
    },
    {
      id: '10-mandats',
      titre: '10 mandats signés', titreEs: '10 mandatos firmados',
      commentObtenir: 'Cumule 10 mandats signés (bilans + ventes qui comptent comme mandat).',
      commentObtenirEs: 'Acumula 10 mandatos firmados (balances + ventas que cuentan como mandato).',
      date: dateSeuilMandats(bilansAsc, salesAsc, 10),
    },
    {
      id: '30-bilans',
      titre: '30 bilans complétés', titreEs: '30 balances completados',
      commentObtenir: 'Valide ton bilan du soir 30 fois — la constance avant tout.',
      commentObtenirEs: 'Valida tu balance de la noche 30 veces — la constancia ante todo.',
      date: bilansAsc.length >= 30 ? bilansAsc[29].date : null,
    },
    {
      id: '100-conversations',
      titre: '100 conversations', titreEs: '100 conversaciones',
      commentObtenir: 'Cumule 100 conversations de prospection (tous bilans confondus).',
      commentObtenirEs: 'Acumula 100 conversaciones de prospección (todos los balances).',
      date: dateSeuilCumul(bilansAsc, r => r.callsMade || 0, 100),
    },
  ];

  return defs.map(d => ({
    id: d.id,
    titre: d.titre,
    titreEs: d.titreEs,
    atteint: d.date !== null,
    dateAtteinte: d.date,
    commentObtenir: d.commentObtenir,
    commentObtenirEs: d.commentObtenirEs,
  }));
}

// ---------- Niveau de carrière ----------

// 🌱 Pépite (début) → 🌿 Confirmé (1er mandat OU 14 jours de série)
// → 🏆 Top conseiller (5 mandats OU 30 jours de série).
export function getNiveau(progress: UserProgress, sales: Sale[]): Niveau {
  const totalMandats =
    progress.dailyResults.reduce((sum, r) => sum + (r.mandatsSigned || 0), 0) +
    sales.filter(s => s.countsAsMandat).length;
  const serie = progress.streak.count;
  if (totalMandats >= 5 || serie >= 30) return NIVEAU_TOP;
  if (totalMandats >= 1 || serie >= 14) return NIVEAU_CONFIRME;
  return NIVEAU_PEPITE;
}

// ---------- Semaine de programme ----------

// Semaine écoulée depuis la date de démarrage du profil (1 à 26 — le
// programme dure 6 mois).
export function getSemaineProgramme(startDate: string): number {
  const today = toLocalDateKey(new Date());
  if (!startDate || startDate >= today) return 1;
  return Math.min(26, Math.max(1, Math.floor(diffDays(startDate, today) / 7) + 1));
}

// ---------- Paliers de série (mur de victoires, MOD-33) ----------

// StreakState ne conserve pas d'historique : les paliers 3/7/14/30 sont
// déduits des suites de dates de bilans consécutives. La date du palier est
// celle du bilan qui l'a atteint.
export function getPaliersSerie(dailyResults: DailyResults[]): { jours: number; date: string }[] {
  const PALIERS = [3, 7, 14, 30];
  const dates = [...new Set(dailyResults.map(r => r.date))].sort();
  const paliers: { jours: number; date: string }[] = [];
  let run = 0;
  let prev: string | null = null;
  for (const date of dates) {
    run = prev !== null && diffDays(prev, date) === 1 ? run + 1 : 1;
    if (PALIERS.includes(run)) paliers.push({ jours: run, date });
    prev = date;
  }
  return paliers;
}

// ---------- Jalons célébrés (persistance locale) ----------

// null = la clé n'existe pas encore (première exécution de la fonctionnalité)
// — le hook useJalons s'en sert pour ne PAS célébrer rétroactivement les
// jalons déjà atteints avant l'arrivée de la fonctionnalité.
export function getJalonsCelebres(email?: string): string[] | null {
  try {
    const raw = localStorage.getItem(`${MILESTONES_PREFIX}-${resolveEmail(email)}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(id => typeof id === 'string') : null;
  } catch {
    return null;
  }
}

export function markJalonsCelebres(ids: string[], email?: string): void {
  try {
    const current = getJalonsCelebres(email) ?? [];
    const merged = [...new Set([...current, ...ids])];
    localStorage.setItem(`${MILESTONES_PREFIX}-${resolveEmail(email)}`, JSON.stringify(merged));
  } catch { /* ignore */ }
}

// ---------- Retour après absence (MOD-31.5) ----------

// Lecture pure (aucune écriture — sûre dans un useState/StrictMode) : nombre
// de jours depuis la dernière ouverture, 0 si < 3 jours. Premier lancement de
// la fonctionnalité : repli sur lastBilanDate pour les comptes existants.
export function getJoursDepuisDerniereOuverture(lastBilanDate: string | null, email?: string): number {
  try {
    const today = toLocalDateKey(new Date());
    const stored = localStorage.getItem(`${LAST_OPEN_PREFIX}-${resolveEmail(email)}`);
    const last = stored ?? lastBilanDate;
    if (!last || last >= today) return 0;
    const n = diffDays(last, today);
    return n >= 3 ? n : 0;
  } catch {
    return 0;
  }
}

// Écriture, à appeler une fois par ouverture (dans un useEffect).
export function touchLastOpen(email?: string): void {
  try {
    localStorage.setItem(`${LAST_OPEN_PREFIX}-${resolveEmail(email)}`, toLocalDateKey(new Date()));
  } catch { /* ignore */ }
}

// ---------- Victoire aléatoire (réexport pratique pour le mur) ----------

export function formatDateJalon(dateKey: string, isEs: boolean): string {
  return parseLocalDateKey(dateKey).toLocaleDateString(isEs ? 'es-ES' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
