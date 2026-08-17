export interface MonthlyGoal {
  month: number;
  caTarget: number;        // CA mensuel visé en €
  commissionsPct: number;  // % de commissions (défaut 5-7%)
  ventesTarget: number;    // Nombre de ventes visées
  appelsTarget: number;    // Calculé automatiquement
  rdvR1Target: number;     // Calculé automatiquement
  rdvR2Target: number;     // Calculé automatiquement
  mandatsTarget: number;   // Calculé automatiquement
  visitesTarget: number;   // Calculé automatiquement
  averagePrice: number;    // Prix moyen des biens dans le secteur
  conversionRate: number;  // Taux de conversion (défaut 2.5%)
}

export interface UserProfile {
  // Identité
  firstName: string;
  lastName: string;
  city: string;
  phone: string;

  // Secteur
  sectorType: 'centre-ville' | 'périphérie' | 'rural' | 'luxe';
  averagePrice: number;
  country: 'france' | 'spain';
  language: 'fr' | 'es';

  // Parcours & expérience
  expérienceLevel: 'débutant' | 'quelques-semaines' | 'quelques-mois' | 'confirmé';
  watchedNetworkVideos: boolean;     // A vu toutes les vidéos du réseau
  watchedTerrainVideos: boolean; // A vu toutes les vidéos formation terrain
  hasMentor: boolean;            // A-t-il un parrain/mentor
  // MOD-32 — Coordonnées du parrain (demandées une fois au premier bilan clôturé)
  parrain?: { prenom: string; contact: string }; // contact = email ou téléphone
  parrainAsked?: boolean;        // true = ne plus redemander les coordonnées du parrain
  lastMonthMandates?: number;    // Mandats rentrés le mois dernier (pour ajuster les objectifs)
  primoListeCalled: boolean;     // A appelé toute sa primo liste (amis, famille, répertoire + réseaux sociaux)

  // Objectifs CA
  ca6MonthsTarget: number;       // CA vise
  commissionsPct: number;

  // Objectifs du mois en cours
  currentMonthGoal: MonthlyGoal;
  monthlyGoals: MonthlyGoal[];

  startDate: string;
}

export const defaultProfile: UserProfile = {
  firstName: '',
  lastName: '',
  city: '',
  phone: '',
  sectorType: 'centre-ville',
  averagePrice: 250000,
  country: 'france',
  language: 'fr',
  expérienceLevel: 'débutant',
  watchedNetworkVideos: false,
  watchedTerrainVideos: false,
  hasMentor: true,
  primoListeCalled: false,
  ca6MonthsTarget: 90000,
  commissionsPct: 6,
  currentMonthGoal: {
    month: 1,
    caTarget: 10000,
    commissionsPct: 6,
    ventesTarget: 1,
    appelsTarget: 70,
    rdvR1Target: 4,
    rdvR2Target: 2,
    mandatsTarget: 1,
    visitesTarget: 3,
    averagePrice: 250000,
    conversionRate: 2.5,
  },
  monthlyGoals: [],
  startDate: new Date().toISOString().split('T')[0],
};

// Calcul automatique des objectifs à partir du CA vise
// Le premier mois est allégé pour les débutants
export function calculateTargetsFromCA6Months(
  ca6Months: number,
  commissionsPct: number,
  averagePrice: number,
  expérienceLevel: string,
  month: number = 1
): {
  ventesTarget: number;
  mandatsTarget: number;
  rdvR2Target: number;
  rdvR1Target: number;
  appelsTarget: number;
  visitesTarget: number;
} {
  const avgCommission = averagePrice * (commissionsPct / 100);
  const tôtalVentes6M = Math.ceil(ca6Months / avgCommission);

  // Progression douce pour débutants : mois 1 allégé, progression progressive
  let monthWeight: number;
  if (expérienceLevel === 'débutant') {
    // Progression douce : 10%, 15%, 20%, 20%, 20%, 15%
    const weights = [0.10, 0.15, 0.20, 0.20, 0.20, 0.15];
    monthWeight = weights[Math.min(month - 1, 5)];
  } else if (expérienceLevel === 'quelques-semaines') {
    const weights = [0.15, 0.18, 0.20, 0.20, 0.18, 0.09];
    monthWeight = weights[Math.min(month - 1, 5)];
  } else {
    // Confirmés : répartition plus égale
    const weights = [0.16, 0.17, 0.17, 0.17, 0.17, 0.16];
    monthWeight = weights[Math.min(month - 1, 5)];
  }

  const ventesTarget = Math.max(1, Math.ceil(tôtalVentes6M * monthWeight));
  // Mandats par mois selon le niveau d'expérience
  let mandatsTarget: number;
  if (expérienceLevel === 'débutant' || expérienceLevel === 'quelques-semaines') {
    mandatsTarget = 1; // 1er objectif : 1 mandat par mois
  } else if (expérienceLevel === 'quelques-mois') {
    mandatsTarget = 2; // Après 2-3 mois : 2 mandats par mois
  } else {
    mandatsTarget = Math.max(3, Math.min(5, Math.ceil(ventesTarget * 1.5))); // Confirmé : 3 à 5 selon objectif
  }
  const rdvR2Target = Math.ceil(mandatsTarget * 2.5);
  const rdvR1Target = Math.ceil(rdvR2Target * 2);
  const appelsTarget = Math.ceil(rdvR1Target * 20);
  const visitesTarget = Math.ceil(ventesTarget * 5);

  return { ventesTarget, mandatsTarget, rdvR2Target, rdvR1Target, appelsTarget, visitesTarget };
}

// Calcul des objectifs journaliers (toujours par jour, jamais par mois en affichage)
// Tous les nombres sont des ENTIERS — pas de 0.7 R1/jour
export function getDailyTargets(monthlyGoal: MonthlyGoal): {
  calls: number;
  contactsPhysiques: number;
  rdv: number;
  rdvR1: number;
  rdvR2: number;
  mandats: number;
  visites: number;
  ventes: number;
} {
  return {
    calls: Math.max(10, Math.ceil(monthlyGoal.appelsTarget / 22)),
    contactsPhysiques: Math.max(3, Math.ceil(monthlyGoal.appelsTarget / 22 / 3)),
    rdv: Math.ceil(monthlyGoal.rdvR1Target / 22) + Math.ceil(monthlyGoal.rdvR2Target / 22),
    rdvR1: Math.max(1, Math.ceil(monthlyGoal.rdvR1Target / 22)),
    rdvR2: Math.max(0, Math.ceil(monthlyGoal.rdvR2Target / 22)),
    mandats: Math.max(0, Math.ceil(monthlyGoal.mandatsTarget / 22)),
    visites: Math.max(0, Math.ceil(monthlyGoal.visitesTarget / 22)),
    ventes: monthlyGoal.ventesTarget,
  };
}

// Objectif mensuel de mandats selon le niveau et l'ancienneté
export function getMonthlyMandatTarget(level: string, monthsSinceStart: number): number {
  if (monthsSinceStart === 0) return 1; // Premier mois : 1 mandat
  if (monthsSinceStart === 1) return 2; // 2ème mois : 2 mandats
  if (monthsSinceStart === 2) return 3; // 3ème mois : 3 mandats
  if (monthsSinceStart >= 3) {
    // À partir du 4ème mois : 4+ selon le niveau
    if (level === 'confirmé') return 5;
    return 4;
  }
  return 1;
}

// Message bienveillant selon le niveau d'expérience
export function getWelcomeMessageForExpérience(level: string): string {
  switch (level) {
    case 'débutant':
      return "Bienvenue dans ton aventure ! Comme tout débutant, tu as besoin de quelques semaines pour assimiler la méthode et prendre tes repères. C'est tout à fait normal. Ton objectif de CA est un cap qui te guide — pas une pression pour demain. On y va étape par étape, et chaque petit progrès compte. 💪";
    case 'quelques-semaines':
      return "Tu as déjà passé les premières semaines, bravo ! Tu commences à prendre tes marques. On continue sur cette lancée — chaque jour tu progresses un peu plus. 🚀";
    case 'quelques-mois':
      return "Tu as déjà de l'expérience et ça se voit. Maintenant on passe la vitesse supérieure — affûte tes techniques et viser plus haut. 🔥";
    case 'confirmé':
      return "Conseiller confirmé — on optimise ce qui fonctionne déjà et on vise l'excellence. Chaque détail compte pour atteindre tes objectifs. 🏆";
    default:
      return "Bienvenue ! On construit ton succès ensemble, étape par étape.";
  }
}

// Texte pour le CA 6 mois selon l'expérience
export function getCATargetLabel(level: string): string {
  switch (level) {
    case 'débutant':
      return "Quel CA aimerais-tu viser ? (N'oublie pas : ton premier mois est pour apprendre, la progression vient ensuite !)";
    case 'quelques-semaines':
      return "Quel CA tu vises sur les 6 prochains mois ? Tu as déjà les bases, maintenant on construit.";
    default:
      return "Quel CA tu vises sur les 6 prochains mois ?";
  }
}
