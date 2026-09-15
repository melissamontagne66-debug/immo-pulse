// Source unique de vérité pour les objectifs (MOD-19).
// Toutes les vues — récap onboarding, dashboard, « Aujourd'hui », bilan du soir —
// lisent ici leurs chiffres d'objectifs et leur liste d'actions.
// Plus aucun objectif codé en dur dans les composants.

import type { UserProfile } from '@/types/profile';
import { getDailyTargets, getMonthlyMandatTarget } from '@/types/profile';
import type { DailyResults } from '@/types';
import type { CounterKey } from '@/hooks/useDailyCounters';

// Pluriel dynamique — jamais de « mandat(s) » dans l'UI.
// plural(2, 'mandat') → "2 mandats" ; plural(1, 'mandat') → "1 mandat".
export function plural(n: number, singular: string, pluralForm?: string): string {
  return `${n} ${n > 1 ? (pluralForm ?? `${singular}s`) : singular}`;
}

// Mois écoulés depuis la date de démarrage du profil.
export function getMonthsSinceStart(startDate: string): number {
  const start = new Date(startDate);
  const now = new Date();
  return Math.max(0, (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth()));
}

// Objectif quotidien affiché sur les tuiles (dashboard, récap onboarding, compteurs).
export interface DailyGoal {
  key: CounterKey;
  target: number;
  label: string;
}

export type DailyActionType =
  | 'prospection' | 'admin' | 'r1' | 'r2' | 'retours' | 'défi' | 'apporteurs'
  | 'plateformes' | 'primo' | 'mandat-proactif' | 'inter-cabinets' | 'gmb' | 'gmb-hebdo'
  | 'relance-bdd' | 'social' | 'crm' | 'video';

// Une action de la liste « Aujourd'hui » (= celle vérifiée au bilan du soir).
// Les textes longs (description, scripts, conseils) restent dans DailyActions :
// ils sont rattachés à chaque entrée via `type`.
export interface DailyAction {
  id: string;
  type: DailyActionType;
  label: string;        // libellé court (bilan du soir)
  icon: string;
  catLabel?: string;    // badge catégorie (Aujourd'hui) — prospection : fourni par catInfo
  catColor?: string;
  askResult: boolean;
  counterKeys?: CounterKey[];
  hasTip?: boolean;
  tipTitle?: string;
}

export interface Goals {
  monthlyMandats: number;  // objectif de mandats du mois (une seule valeur partout)
  weeklyMandats: number;   // monthlyMandats / 4.33 arrondi pour affichage
  dailyGoals: DailyGoal[];
  // Forme historique de la prop `dailyTargets` passée par App.tsx (mêmes valeurs).
  dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number };
  dailyActions: DailyAction[];  // la liste « Aujourd'hui » = celle du bilan
}

// Liste des actions du jour — utilisée par « Aujourd'hui » ET par la vérification
// du bilan (mêmes ids, mêmes conditions, même ordre). Fin du 11 vs 9.
export function getDailyActionsForDay(
  day: number,
  profile: UserProfile,
  dailyResults: DailyResults[],
  isEs: boolean = false
): DailyAction[] {
  const hasMandats = dailyResults.some(r => r.mandatsSigned > 0);
  const lastMandat = dailyResults.find(r => r.mandatsSigned > 0);
  const daysSinceLastMandat = lastMandat
    ? Math.floor((new Date().getTime() - new Date(lastMandat.date).getTime()) / (1000 * 60 * 60 * 24))
    : 999;
  // Retours uniquement si une visite a été faite un jour
  const showRetours = dailyResults.some(r => r.visitesDone > 0);
  const showMandatProactif = hasMandats && daysSinceLastMandat <= 7;
  const showInterCabinets = hasMandats && day % 7 === 3; // Jours 3, 10, 17...
  const isFirstMonth = getMonthsSinceStart(profile.startDate) < 1 && !profile.primoListeCalled;
  // Apporteurs d'affaires : à partir du mois 3, un jour sur deux
  const showApporteurs = getMonthsSinceStart(profile.startDate) >= 2 && day % 2 === 0;
  // Vidéos de formation vues : confirmé par le conseiller au bilan du soir
  // (« As-tu vu toutes les vidéos du réseau ? » → profile.watchedNetworkVideos)
  const videosDone = profile.watchedNetworkVideos;

  // ============ JOUR 1 — mise en place (tous niveaux) ============
  // Uniquement 4 tâches : blocs agenda, primo liste, GMB, réseaux sociaux.
  if (day === 1) {
    return [
      {
        id: `blocs-agenda-jour-1`, type: 'admin' as const,
        label: isEs ? 'Bloquear tus franjas importantes en la agenda' : 'Bloquer tes créneaux importants dans ton agenda', icon: '🗓️',
        catLabel: isEs ? 'Administrativo' : 'Administratif',
        catColor: 'bg-blue-100 text-blue-700 border-blue-200',
        askResult: false,
      },
      ...(!profile.primoListeCalled ? [{
        id: `primo-jour-1`, type: 'primo' as const,
        label: isEs ? 'Llamar a tu lista primo' : 'Appeler ta primo liste', icon: '❤️',
        catLabel: isEs ? 'Lista primo' : 'Primo liste',
        catColor: 'bg-rose-100 text-rose-700 border-rose-200',
        askResult: false,
      }] : []),
      {
        id: `gmb-jour-1`, type: 'gmb' as const,
        label: 'Google Business Profile', icon: '🌐',
        catLabel: 'Google Business',
        catColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        askResult: false,
      },
      {
        id: `social-jour-1`, type: 'social' as const,
        label: isEs ? 'Contenido redes sociales' : 'Réseaux sociaux — Idée du jour', icon: '📱',
        catLabel: isEs ? 'Redes sociales' : 'Réseaux sociaux',
        catColor: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
        askResult: false,
      },
    ];
  }

  // ============ VIDÉOS NON TERMINÉES — socle minimal (jour 2 et +) ============
  // Tant que le conseiller n'a pas confirmé avoir vu toutes les vidéos au
  // bilan, on reste sur l'essentiel : terrain + primo liste + formation vidéo
  // + CRM. Plateformes, R1 et R2 quotidiens se débloquent une fois les
  // vidéos vues.
  if (!videosDone) {
    return [
      {
        id: `prospection-jour-${day}`, type: 'prospection',
        label: isEs ? 'Acción de prospección' : 'Action de prospection', icon: '🚪',
        askResult: true, counterKeys: ['conversations', 'contacts'],
      },
      ...(!profile.primoListeCalled ? [{
        id: `primo-jour-${day}`, type: 'primo' as const,
        label: isEs ? 'Llamar a tu lista primo' : 'Appeler ta primo liste', icon: '❤️',
        catLabel: isEs ? 'Lista primo' : 'Primo liste',
        catColor: 'bg-rose-100 text-rose-700 border-rose-200',
        askResult: false,
      }] : []),
      {
        id: `video-jour-${day}`, type: 'video' as const,
        label: isEs ? 'Ver los vídeos de formación' : 'Regarder les vidéos de formation', icon: '🎬',
        catLabel: isEs ? 'Formación' : 'Formation',
        catColor: 'bg-purple-100 text-purple-700 border-purple-200',
        askResult: false,
      },
      {
        id: 'daily-crm-update', type: 'crm',
        label: isEs ? 'Actualizar el CRM' : 'Mettre à jour le CRM', icon: '🗄️',
        askResult: false,
      },
    ];
  }

  // ============ JOUR 2 ET + — terrain + messages + admin ============
  return [
    // La veille des nouveaux biens est la 1ʳᵉ tâche chaque jour (demande client)
    {
      id: `plateformes-jour-${day}`, type: 'plateformes',
      label: isEs ? 'Contactar bienes en plataformas' : 'Contacter les nouveaux biens sur les plateformes', icon: '💻',
      catLabel: isEs ? 'Plataformas' : 'Plateformes',
      catColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      askResult: false, counterKeys: ['piges' as CounterKey],
    },
    {
      id: `prospection-jour-${day}`, type: 'prospection',
      label: isEs ? 'Acción de prospección' : 'Action de prospection', icon: '🚪',
      askResult: true, counterKeys: ['conversations', 'contacts'],
    },
    {
      id: `admin-jour-${day}`, type: 'admin',
      label: isEs ? 'Tareas administrativas' : 'Tâches administratives', icon: '📋',
      catLabel: isEs ? 'Administrativo' : 'Administratif',
      catColor: 'bg-blue-100 text-blue-700 border-blue-200',
      askResult: false,
    },
    // R1 et R2 quotidiens une fois les vidéos vues
    {
      id: `r1-jour-${day}`, type: 'r1' as const,
      label: isEs ? 'Hacer tus R1' : 'Effectuer tes R1', icon: '📅',
      catLabel: 'R1', catColor: 'bg-green-100 text-green-700 border-green-200',
      askResult: false, counterKeys: ['r1'] as CounterKey[],
      hasTip: true, tipTitle: isEs ? 'Bueno saber para tu R1' : 'Bon à savoir pour ton R1',
    },
    {
      id: `r2-jour-${day}`, type: 'r2' as const,
      label: isEs ? 'Hacer tus R2' : 'Effectuer tes R2', icon: '✍️',
      catLabel: 'R2', catColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      askResult: false, counterKeys: ['r2'] as CounterKey[],
      hasTip: true, tipTitle: isEs ? 'Bueno saber para tu R2' : 'Bon à savoir pour ton R2',
    },
    ...(showRetours ? [{
      id: `retours-jour-${day}`, type: 'retours' as const,
      label: isEs ? 'Hacer los retornos de visitas' : 'Faire les retours de visites', icon: '📞',
      catLabel: isEs ? 'Retornos' : 'Retours',
      catColor: 'bg-pink-100 text-pink-700 border-pink-200',
      askResult: false, counterKeys: ['visites'] as CounterKey[],
      hasTip: true, tipTitle: isEs ? 'Bueno saber para tus retornos' : 'Bon à savoir pour tes retours',
    }] : []),
    {
      id: `défi-jour-${day}`, type: 'défi',
      label: isEs ? 'Reto del día' : 'Défi du jour', icon: '🏆',
      catLabel: isEs ? 'Reto' : 'Défi',
      catColor: 'bg-gradient-to-r from-pink-100 to-violet-100 text-violet-700 border-violet-300',
      askResult: false,
    },
    // Apporteurs d'affaires : à partir du mois 3, un jour sur deux
    ...(showApporteurs ? [{
      id: `apporteurs-jour-${day}`, type: 'apporteurs' as const,
      label: isEs ? 'Registrar colaboradores' : 'Enregistrer tes apporteurs', icon: '🤝',
      catLabel: isEs ? 'Colaboradores' : 'Apporteurs',
      catColor: 'bg-amber-100 text-amber-700 border-amber-200',
      askResult: false,
    }] : []),
    ...(isFirstMonth ? [{
      id: `primo-jour-${day}`, type: 'primo' as const,
      label: isEs ? 'Llamar a tu lista primo' : 'Appeler ta primo liste', icon: '❤️',
      catLabel: isEs ? 'Lista primo' : 'Primo liste',
      catColor: 'bg-rose-100 text-rose-700 border-rose-200',
      askResult: false,
    }] : []),
    ...(showMandatProactif ? [{
      id: `mandat-proactif-jour-${day}`, type: 'mandat-proactif' as const,
      label: isEs ? 'Acciones proactivas sobre tu nuevo mandato' : 'Actions proactives sur ton nouveau mandat', icon: '🚀',
      catLabel: isEs ? 'Mandato' : 'Mandat',
      catColor: 'bg-violet-100 text-violet-700 border-violet-200',
      askResult: false,
    }] : []),
    ...(showInterCabinets ? [{
      id: `inter-cabinets-jour-${day}`, type: 'inter-cabinets' as const,
      label: isEs ? 'Inter-agencias' : 'Inter-cabinets', icon: '🔄',
      catLabel: isEs ? 'Inter-agencias' : 'Inter-cabinets',
      catColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
      askResult: false,
    }] : []),
    // GMB hebdomadaire : 1 h dédiée chaque semaine (publication + demande d'avis).
    // day > 7 : la création de la fiche est déjà la tâche du jour 1 — sans ce
    // garde-fou, la tâche hebdo revenait dès le lendemain (jour 2 = 2 % 7).
    ...(day % 7 === 2 && day > 7 ? [{
      id: `gmb-hebdo-jour-${day}`, type: 'gmb-hebdo' as const,
      label: 'Google Business Profile (1 h)', icon: '🌐',
      catLabel: 'Google Business',
      catColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      askResult: false,
    }] : []),
    // Relance de la base de données : 1×/semaine en guise d'action terrain (2 h)
    ...(day % 7 === 5 ? [{
      id: `relance-bdd-jour-${day}`, type: 'relance-bdd' as const,
      label: isEs ? 'Relanzar tu base de datos (2 h)' : 'Relancer ta base de données (2 h)', icon: '🗃️',
      catLabel: isEs ? 'Base de datos' : 'Base de données',
      catColor: 'bg-lime-100 text-lime-700 border-lime-200',
      askResult: false,
    }] : []),
    {
      id: `social-jour-${day}`, type: 'social',
      label: isEs ? 'Contenido redes sociales' : 'Réseaux sociaux — Idée du jour', icon: '📱',
      catLabel: isEs ? 'Redes sociales' : 'Réseaux sociaux',
      catColor: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      askResult: false,
    },
    // CRM : uniquement à partir du jour 2 (quand les actions terrain commencent)
    {
      id: 'daily-crm-update', type: 'crm',
      label: isEs ? 'Actualizar el CRM' : 'Mettre à jour le CRM', icon: '🗄️',
      askResult: false,
    },
  ];
}

export interface GoalsOptions {
  // MOD-27 : protocole anti-décrochage actif — objectifs du jour allégés
  // (÷2 arrondi inférieur, min 1) pendant 48 h. Seuls les dailyGoals sont
  // allégés ; dailyTargets reste intact pour les autres consommateurs.
  consolidation?: boolean;
}

// Objet unique d'objectifs, calculé depuis le profil (niveau d'expérience,
// CA visé, prix moyen, ancienneté). Récap onboarding = dashboard = bilan.
export function getGoals(profile: UserProfile, day: number = 1, dailyResults: DailyResults[] = [], options: GoalsOptions = {}): Goals {
  const isEs = profile.language === 'es';
  const t = getDailyTargets(profile.currentMonthGoal);
  const monthlyMandats = getMonthlyMandatTarget(profile.expérienceLevel, getMonthsSinceStart(profile.startDate));
  const allege = (n: number) => (options.consolidation ? Math.max(1, Math.floor(n / 2)) : n);

  return {
    monthlyMandats,
    weeklyMandats: Math.ceil(monthlyMandats / 4.33),
    dailyGoals: [
      { key: 'conversations', target: allege(t.calls), label: isEs ? 'Conversaciones' : 'Conversations' },
      { key: 'contacts', target: allege(t.contactsPhysiques), label: isEs ? 'Contactos físicos' : 'Contacts physiques' },
      { key: 'r1', target: allege(t.rdvR1), label: isEs ? 'R1 · Cita descubrimiento' : 'R1 · RDV découverte' },
      { key: 'r2', target: allege(t.rdvR2), label: isEs ? 'R2 · Cita firma' : 'R2 · RDV signature' },
      { key: 'visites', target: allege(t.visites), label: isEs ? 'Visitas' : 'Visites' },
      // Pige : cible fixe quotidienne (hors calcul CA) — messages envoyés
      // aux propriétaires depuis les plateformes immo.
      { key: 'piges', target: 5, label: isEs ? 'Mensajes de pige' : 'Messages de pige' },
    ],
    dailyTargets: {
      calls: t.calls,
      contactsPhysiques: t.contactsPhysiques,
      rdvR1: t.rdvR1,
      rdvR2: t.rdvR2,
      mandats: t.mandats,
      visites: t.visites,
    },
    dailyActions: getDailyActionsForDay(day, profile, dailyResults, isEs),
  };
}
