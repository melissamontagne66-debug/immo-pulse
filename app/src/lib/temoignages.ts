// MOD-24 — Moteur de matching des témoignages.
//
// Score :
//   même région +4 ; région limitrophe +2
//   même type de secteur +3 ; même profil d'expérience +3
//   timing crédible (|délai premier mandat − jours écoulés| ≤ 30 % des jours écoulés) +2
//   tag contextuel 'coup-dur' (protocole anti-décrochage actif) +5
// Égalité → rotation stable dans la journée (seed = date du jour).
// Jamais deux fois le même témoignage sur 7 jours glissants (localStorage).

import { TEMOIGNAGES, type Temoignage } from '@/data/temoignages';
import type { UserProfile } from '@/types/profile';
import { toLocalDateKey } from '@/lib/utils';

export interface TemoignageContext {
  coupDur?: boolean;   // protocole anti-décrochage actif
  email?: string;      // clé de l'historique (sinon session courante)
}

// === Mapping ville → région (villes de src/data/cityPrices.ts) ===
// Même normalisation que cityPrices : minuscules, sans accents, sans espaces/tirets.
const CITY_REGION: Record<string, string> = {
  paris: 'idf',
  lyon: 'ara',
  marseille: 'paca',
  bordeaux: 'nouvelle-aquitaine',
  toulouse: 'occitanie',
  nantes: 'pays-de-la-loire',
  strasbourg: 'grand-est',
  montpellier: 'occitanie',
  lille: 'hauts-de-france',
  nice: 'paca',
  rennes: 'bretagne',
  grenoble: 'ara',
  rouen: 'normandie',
  toulon: 'paca',
  dijon: 'bourgogne-franche-comte',
  angers: 'pays-de-la-loire',
  villeurbanne: 'ara',
  saintetienne: 'ara',
  lehavre: 'normandie',
  reims: 'grand-est',
  perpignan: 'occitanie',
  avignon: 'paca',
  besancon: 'bourgogne-franche-comte',
  nimes: 'occitanie',
  metz: 'grand-est',
  tours: 'centre-val-de-loire',
  orleans: 'centre-val-de-loire',
  mulhouse: 'grand-est',
  caen: 'normandie',
  brest: 'bretagne',
  limoges: 'nouvelle-aquitaine',
  clermontferrand: 'ara',
  troyes: 'grand-est',
  poitiers: 'nouvelle-aquitaine',
  annecy: 'ara',
  biarritz: 'nouvelle-aquitaine',
  cannes: 'paca',
  aixenprovence: 'paca',
  chambery: 'ara',
  bayonne: 'nouvelle-aquitaine',
  antibes: 'paca',
  lorient: 'bretagne',
  pau: 'nouvelle-aquitaine',
  valence: 'ara',
  bourgenbresse: 'ara',
  beziers: 'occitanie',
  sete: 'occitanie',
  colmar: 'grand-est',
  saintmalo: 'bretagne',
  quimper: 'bretagne',
  // Villes espagnoles / suisses : volontairement absentes → région null,
  // le score région est alors simplement ignoré (dégradation propre).
};

// === Régions limitrophes ===
const REGIONS_VOISINES: Record<string, string[]> = {
  'hauts-de-france': ['idf', 'normandie', 'grand-est'],
  'idf': ['hauts-de-france', 'normandie', 'centre-val-de-loire', 'bourgogne-franche-comte', 'grand-est'],
  'normandie': ['hauts-de-france', 'idf', 'centre-val-de-loire', 'pays-de-la-loire', 'bretagne'],
  'bretagne': ['normandie', 'pays-de-la-loire'],
  'pays-de-la-loire': ['bretagne', 'normandie', 'centre-val-de-loire', 'nouvelle-aquitaine'],
  'centre-val-de-loire': ['normandie', 'idf', 'bourgogne-franche-comte', 'ara', 'nouvelle-aquitaine', 'pays-de-la-loire'],
  'grand-est': ['hauts-de-france', 'idf', 'bourgogne-franche-comte'],
  'bourgogne-franche-comte': ['grand-est', 'idf', 'centre-val-de-loire', 'ara'],
  'ara': ['bourgogne-franche-comte', 'centre-val-de-loire', 'nouvelle-aquitaine', 'occitanie', 'paca'],
  'nouvelle-aquitaine': ['pays-de-la-loire', 'centre-val-de-loire', 'ara', 'occitanie'],
  'occitanie': ['nouvelle-aquitaine', 'ara', 'paca'],
  'paca': ['occitanie', 'ara'],
};

function normalizeCity(city: string): string {
  return city
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // accents (diacritiques combinants)
    .replace(/[-\s']/g, '')
    .trim();
}

// Région de l'utilisateur depuis sa ville de profil ; null si inconnue.
export function getRegionForCity(city: string): string | null {
  if (!city || !city.trim()) return null;
  return CITY_REGION[normalizeCity(city)] ?? null;
}

function mapSectorType(sectorType: UserProfile['sectorType']): Temoignage['typeSecteur'] {
  return sectorType === 'périphérie' ? 'peripherie' : sectorType;
}

function mapProfil(level: UserProfile['expérienceLevel']): Temoignage['profil'] {
  if (level === 'débutant') return 'debutant';
  if (level === 'confirmé') return 'confirme';
  return level;
}

function daysSinceStart(startDate: string): number {
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return 0;
  return Math.max(0, Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24)));
}

// === Historique 7 jours glissants (localStorage) ===

interface SeenEntry { id: string; date: string } // date = 'YYYY-MM-DD' locale

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

function loadSeen(email: string): SeenEntry[] {
  try {
    const raw = localStorage.getItem(`immo-pulse-temoignages-seen-${email}`);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(e => e && typeof e.id === 'string' && typeof e.date === 'string') : [];
  } catch {
    return [];
  }
}

function saveSeen(email: string, entries: SeenEntry[]): void {
  try {
    localStorage.setItem(`immo-pulse-temoignages-seen-${email}`, JSON.stringify(entries));
  } catch { /* ignore */ }
}

// Rotation stable dans la journée : petit hash de la date du jour.
function dailySeed(dateKey: string): number {
  let h = 0;
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Retourne le témoignage du jour pour un conseiller :
 * - personnalisé (région, secteur, expérience, timing, contexte coup-dur)
 * - différent chaque jour, jamais deux fois le même sur 7 jours glissants
 * - stable dans la journée (un F5 ne change pas le témoignage affiché)
 * Retourne null si la base est vide.
 */
export function getTemoignageForUser(profile: UserProfile, context: TemoignageContext = {}): Temoignage | null {
  if (TEMOIGNAGES.length === 0) return null;

  const todayKey = toLocalDateKey(new Date());
  const today = new Date(`${todayKey}T00:00:00`);
  const windowStart = new Date(today);
  windowStart.setDate(windowStart.getDate() - 7);

  const email = resolveEmail(context.email);
  // On ne filtre que les témoignages vus AVANT aujourd'hui : celui affiché
  // aujourd'hui (déjà enregistré à un précédent rendu) reste éligible,
  // ce qui garantit la stabilité du témoignage dans la journée.
  let seen = loadSeen(email).filter(e => {
    const d = new Date(`${e.date}T00:00:00`);
    return d >= windowStart && d < today;
  });
  const seenIds = new Set(seen.map(e => e.id));

  let candidates = TEMOIGNAGES.filter(t => !seenIds.has(t.id));
  if (candidates.length === 0) {
    // Tous vus sur la fenêtre → on réinitialise la fenêtre.
    seen = [];
    saveSeen(email, []);
    candidates = TEMOIGNAGES;
  }

  const region = getRegionForCity(profile.city);
  const secteur = mapSectorType(profile.sectorType);
  const profil = mapProfil(profile.expérienceLevel);
  const joursEcoules = daysSinceStart(profile.startDate);

  const score = (t: Temoignage): number => {
    let s = 0;
    if (region) {
      if (t.region === region) s += 4;
      else if ((REGIONS_VOISINES[region] ?? []).includes(t.region)) s += 2;
    }
    if (t.typeSecteur === secteur) s += 3;
    if (t.profil === profil) s += 3;
    if (Math.abs(t.delaiPremierMandatJours - joursEcoules) <= 0.3 * joursEcoules) s += 2;
    if (context.coupDur && t.tags.includes('coup-dur')) s += 5;
    return s;
  };

  const scored = candidates.map(t => ({ t, s: score(t) }));
  const best = Math.max(...scored.map(x => x.s));
  const ties = scored.filter(x => x.s === best).map(x => x.t)
    .sort((a, b) => a.id.localeCompare(b.id)); // ordre déterministe
  const chosen = ties[dailySeed(todayKey) % ties.length];

  // Enregistre l'affichage du jour (idempotent sur la journée).
  if (!loadSeen(email).some(e => e.id === chosen.id && e.date === todayKey)) {
    saveSeen(email, [...seen, { id: chosen.id, date: todayKey }]);
  }

  return chosen;
}
