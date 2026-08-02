import type { DayAction, WeekPlan, MonthPlan } from '@/types';

const generateId = (month: number, week: number, day: number) =>
  `M${month}-W${week}-D${day}`;

// ==================== MOIS 1 ====================
const month1Weeks: WeekPlan[] = [
  {
    week: 1,
    title: "Maîtrise du R1 (découverte vendeur)",
    theme: "Maîtriser les différentes prospections + le R1. Minimum 1 R1 + 1 R2. 5 apporteurs d'affaires enregistrés. Faire un max d'estimations (projet immédiat ou esti patrimoniale).",
    days: [
      {
        id: generateId(1, 1, 1), day: 1,
        title: "Prospection Ciblée + Appels",
        description: "Fin de Matinée (entre 11h et 13h ou entre 16h30 et 18h30/19h selon période de l'année) : 5 Nouveaux contacts prospection ciblée + 2 Commercants du secteur + 20 appels contacts à relancer.",
        category: "prospection", estimatedTime: "2h", moduleRef: "loi-des-nombres"
      },
      {
        id: generateId(1, 1, 2), day: 2,
        title: "Formation : Avancer sur les vidéos",
        description: "Formation : 2h pour avancer sur les vidéos de formation. R1, prospection, selection LeBonCoin acquéreur, loi des nombres.",
        category: "formation", estimatedTime: "2h", moduleRef: "r1-préparation"
      },
      {
        id: generateId(1, 1, 3), day: 3,
        title: "Mise à jour CRM et relances",
        description: "Mise à jour CRM et relance des dossiers / prospects des semaines précédentes / Préparation dossiers estimations (2 à 3h dans la journée). L'argent est dans le fichier !",
        category: "admin", estimatedTime: "3h", moduleRef: "gestion-temps"
      },
      {
        id: generateId(1, 1, 4), day: 4,
        title: "RDV R1 ou R2 (max 2/jour)",
        description: "Maximum 2 RDV R1 ou R2 par jour. Objectif : Maîtriser la découverte vendeur au R1. Écouter 80%, parler 20%. Ne JAMAIS donner le prix au R1.",
        category: "rdv", estimatedTime: "3h", moduleRef: "r1-préparation"
      },
      {
        id: generateId(1, 1, 5), day: 5,
        title: "Procédure TRACFIN + Simulation",
        description: "Maîtriser et faire la procédure TRACFIN (ou SEPBLAC en Espagne) + Faire simulation R1 et Prospection pour se perfectionner.",
        category: "technique", estimatedTime: "2h", moduleRef: "top-performer"
      },
      {
        id: generateId(1, 1, 6), day: 6,
        title: "Débrief Hebdo avec Parrain",
        description: "Debrief hebdomadaire avec ton parrain : combien d'appels ? Combien de RDV ? Quels blocages ? Quels progrès ? Planifier la semaine prochaine.",
        category: "suivi", estimatedTime: "1h", moduleRef: "top-performer"
      },
    ]
  },
  {
    week: 2,
    title: "Semaine 2",
    theme: "Maîtriser le R2. Minimum 2 R1 + 1 R2. 5 apporteurs d'affaires enregistrés. Faire un max d'estimations (projet immédiat ou esti patrimoniale).",
    days: [
      {
        id: generateId(1, 2, 7), day: 7,
        title: "Prospection Ciblée + Appels",
        description: "Fin de Matinée (entre 11h et 13h ou entre 16h30 et 18h30/19h selon période de l'année) : 5 Nouveaux contacts prospection ciblée + 2 Commercants du secteur + 20 appels contacts à relancer.",
        category: "prospection", estimatedTime: "2h", moduleRef: "loi-des-nombres"
      },
      {
        id: generateId(1, 2, 8), day: 8,
        title: "Formation : R2 et Avis de Valeur",
        description: "Formation : 2h pour avancer sur les vidéos de formation. Focus : R2, les 3 scénarios de prix, la preuve irréfutable, la règle du silence.",
        category: "formation", estimatedTime: "2h", moduleRef: "r2-stratégie"
      },
      {
        id: generateId(1, 2, 9), day: 9,
        title: "Mise à jour CRM et relances",
        description: "Mise à jour CRM et relance des dossiers / prospects des semaines précédentes / Préparation dossiers estimations (2 à 3h dans la journée). L'argent est dans le fichier !",
        category: "admin", estimatedTime: "3h", moduleRef: "gestion-temps"
      },
      {
        id: generateId(1, 2, 10), day: 10,
        title: "RDV R1 ou R2 (max 2/jour)",
        description: "Maximum 2 RDV R1 ou R2 par jour. Objectif : Maîtriser le R2 - les 3 scénarios, preuve par biens VENDUS, faire choisir le vendeur. Ne JAMAIS donner le prix directement.",
        category: "rdv", estimatedTime: "3h", moduleRef: "r2-stratégie"
      },
      {
        id: generateId(1, 2, 11), day: 11,
        title: "TRACFIN + Simulation R1/R2",
        description: "Maîtriser et faire la procédure TRACFIN (ou SEPBLAC en Espagne) + Faire simulation R1 / R2 et Prospection pour se perfectionner.",
        category: "technique", estimatedTime: "2h", moduleRef: "top-performer"
      },
      {
        id: generateId(1, 2, 12), day: 12,
        title: "Débrief Hebdo avec Parrain",
        description: "Debrief hebdomadaire avec ton parrain : combien d'appels ? Combien de RDV ? Quels blocages ? Quels progrès ? Planifier la semaine prochaine.",
        category: "suivi", estimatedTime: "1h", moduleRef: "top-performer"
      },
    ]
  },
  {
    week: 3,
    title: "Semaine 3",
    theme: "Maîtriser la prise de Mandat. Minimum 3 R1 + 2 R2. 5 apporteurs d'affaires enregistrés. Premier mandat. Faire un max d'estimations.",
    days: [
      {
        id: generateId(1, 3, 13), day: 13,
        title: "Prospection Ciblée + Appels (intensif)",
        description: "Fin de Matinée : 10 Nouveaux contacts prospection ciblée + 2 Commercants du secteur + 20 appels contacts à relancer. On intensifie pour signer le premier mandat !",
        category: "prospection", estimatedTime: "3h", moduleRef: "loi-des-nombres"
      },
      {
        id: generateId(1, 3, 14), day: 14,
        title: "Formation : Mandats et objections",
        description: "Formation : 2h pour avancer sur les vidéos de formation. Focus : Les différents mandats (Simple / Exclusif / Succes), la Clause de Confiance, les 8 objections courantes.",
        category: "formation", estimatedTime: "2h", moduleRef: "mandats"
      },
      {
        id: generateId(1, 3, 15), day: 15,
        title: "Mise à jour CRM et relances",
        description: "Mise à jour CRM et relance des dossiers / prospects des semaines précédentes / Préparation dossiers estimations (2 à 3h dans la journée). L'argent est dans le fichier !",
        category: "admin", estimatedTime: "3h", moduleRef: "gestion-temps"
      },
      {
        id: generateId(1, 3, 16), day: 16,
        title: "RDV R2 avec prise de mandat",
        description: "Maximum 2 RDV R1 ou R2 par jour. Objectif : PREMIER MANDAT ! Applique tout ce que tu as appris : 3 scénarios, Clause de Confiance, vendeur qui choisit. Tu vas l'écraser !",
        category: "rdv", estimatedTime: "3h", moduleRef: "mandats"
      },
      {
        id: generateId(1, 3, 17), day: 17,
        title: "TRACFIN + Simulation prise de mandat",
        description: "Maîtriser et faire la procédure TRACFIN + Faire simulation R2 avec prise de Mandat. Si nécessaire : Ne pas hésiter a demander a s'entraîner a la prospection.",
        category: "technique", estimatedTime: "2h", moduleRef: "objections"
      },
      {
        id: generateId(1, 3, 18), day: 18,
        title: "Débrief Hebdo avec Parrain",
        description: "Debrief hebdomadaire avec ton parrain : As-tu signé ton premier mandat ? Si oui, CELEBRE ! Si non, analyser pourquoi et ajuster. La constance paie toujours.",
        category: "suivi", estimatedTime: "1h", moduleRef: "top-performer"
      },
    ]
  },
  {
    week: 4,
    title: "Semaine 4",
    theme: "Maîtriser la prise de Mandat en EXCLU et la mise en ligne. Minimum 4 R1 + 3 R2. Premier mandat exclu.",
    days: [
      {
        id: generateId(1, 4, 19), day: 19,
        title: "Prospection Ciblée + Appels (intensif)",
        description: "Fin de Matinée : 10 Nouveaux contacts prospection ciblée + 2 Commercants du secteur + 20 appels contacts à relancer. On ne relâche pas !",
        category: "prospection", estimatedTime: "3h", moduleRef: "loi-des-nombres"
      },
      {
        id: generateId(1, 4, 20), day: 20,
        title: "Formation : Exclusif et Garantie 30J",
        description: "Formation : 2h pour avancer sur les vidéos de formation. Focus : L'exclusif, la Clause de Confiance, la Garantie 30 Jours, la mise en ligne sous 72h.",
        category: "formation", estimatedTime: "2h", moduleRef: "garantie-30j"
      },
      {
        id: generateId(1, 4, 21), day: 21,
        title: "Mise à jour CRM et relances",
        description: "Mise à jour CRM et relance des dossiers / prospects des semaines précédentes / Préparation dossiers estimations (2 à 3h dans la journée). L'argent est dans le fichier !",
        category: "admin", estimatedTime: "3h", moduleRef: "gestion-temps"
      },
      {
        id: generateId(1, 4, 22), day: 22,
        title: "RDV R2 avec mandat EXCLUSIF",
        description: "Maximum 2 RDV R1 ou R2 par jour. Objectif : PREMIER MANDAT EXCLUSIF ! Utilise la Garantie 30 Jours comme différenciateur. 'Je suis tellement certain de vendre rapidement que je vous propose notre garantie 30 jours...'",
        category: "rdv", estimatedTime: "3h", moduleRef: "garantie-30j"
      },
      {
        id: generateId(1, 4, 23), day: 23,
        title: "TRACFIN + Simulation mandat exclu",
        description: "Maîtriser et faire la procédure TRACFIN + Faire simulation R2 avec prise de Mandat Exclu. Si nécessaire : Ne pas hésiter a demander a s'entraîner a la prospection.",
        category: "technique", estimatedTime: "2h", moduleRef: "assurance"
      },
      {
        id: generateId(1, 4, 24), day: 24,
        title: "Mise en ligne du premier mandat",
        description: "Tu as un mandat signé ? 72h max pour tout mettre en ligne ! Photos pro, rédaction d'annonce, publication. Capitalise sur l'effet nouveauté. Partage sur tes réseaux.",
        category: "miseenligne", estimatedTime: "3h", moduleRef: "mise-en-ligne"
      },
      {
        id: generateId(1, 4, 25), day: 25,
        title: "Débrief Hebdo + Bilan Mois 1",
        description: "Debrief hebdomadaire avec ton parrain + Bilan du premier mois : As-tu signé un mandat exclu ? Fais le bilan de tes chiffres. Célèbre tes victoires. Tu as fait énormément de progrès !",
        category: "suivi", estimatedTime: "1h", moduleRef: "top-performer"
      },
    ]
  }
];

// ==================== PLACEHOLDERS POUR MOIS 2-6 ====================
// Sera remplace par les vraies actions quand l'utilisateur les fournira
const month2Weeks: WeekPlan[] = [
  {
    week: 5,
    title: "À venir - Mois 2",
    theme: "En attente des actions de l'utilisateur.",
    days: Array.from({ length: 7 }, (_, i) => ({
      id: generateId(2, 5, 26 + i),
      day: 26 + i,
      title: "À venir - En attente de données",
      description: "Les actions réelles du mois 2 seront intégrées quand l'utilisateur fournira les données de son Excel.",
      category: "formation" as const,
      estimatedTime: "?",
      moduleRef: "top-performer"
    }))
  }
];

const month3Weeks: WeekPlan[] = [
  {
    week: 9,
    title: "À venir - Mois 3",
    theme: "En attente des actions de l'utilisateur.",
    days: Array.from({ length: 7 }, (_, i) => ({
      id: generateId(3, 9, 54 + i),
      day: 54 + i,
      title: "À venir - En attente de données",
      description: "Les actions réelles du mois 3 seront intégrées quand l'utilisateur fournira les données de son Excel.",
      category: "formation" as const,
      estimatedTime: "?",
      moduleRef: "top-performer"
    }))
  }
];

const month4Weeks: WeekPlan[] = [
  {
    week: 13,
    title: "À venir - Mois 4",
    theme: "En attente des actions de l'utilisateur.",
    days: Array.from({ length: 7 }, (_, i) => ({
      id: generateId(4, 13, 82 + i),
      day: 82 + i,
      title: "À venir - En attente de données",
      description: "Les actions réelles du mois 4 seront intégrées quand l'utilisateur fournira les données de son Excel.",
      category: "formation" as const,
      estimatedTime: "?",
      moduleRef: "top-performer"
    }))
  }
];

const month5Weeks: WeekPlan[] = [
  {
    week: 17,
    title: "À venir - Mois 5",
    theme: "En attente des actions de l'utilisateur.",
    days: Array.from({ length: 7 }, (_, i) => ({
      id: generateId(5, 17, 110 + i),
      day: 110 + i,
      title: "À venir - En attente de données",
      description: "Les actions réelles du mois 5 seront intégrées quand l'utilisateur fournira les données de son Excel.",
      category: "formation" as const,
      estimatedTime: "?",
      moduleRef: "top-performer"
    }))
  }
];

const month6Weeks: WeekPlan[] = [
  {
    week: 21,
    title: "À venir - Mois 6",
    theme: "En attente des actions de l'utilisateur.",
    days: Array.from({ length: 7 }, (_, i) => ({
      id: generateId(6, 21, 138 + i),
      day: 138 + i,
      title: "À venir - En attente de données",
      description: "Les actions réelles du mois 6 seront intégrées quand l'utilisateur fournira les données de son Excel.",
      category: "formation" as const,
      estimatedTime: "?",
      moduleRef: "top-performer"
    }))
  }
];

// ==================== ASSEMBLAGE ====================
export const onboardingPlan: MonthPlan[] = [
  { month: 1, title: "Mois 1", weeks: month1Weeks },
  { month: 2, title: "Mois 2 : À venir", weeks: month2Weeks },
  { month: 3, title: "Mois 3 : À venir", weeks: month3Weeks },
  { month: 4, title: "Mois 4 : À venir", weeks: month4Weeks },
  { month: 5, title: "Mois 5 : À venir", weeks: month5Weeks },
  { month: 6, title: "Mois 6 : À venir", weeks: month6Weeks },
];

// Helpers
export function getAllDays(): DayAction[] {
  return onboardingPlan.flatMap(m => m.weeks.flatMap(w => w.days));
}

export function getDayById(id: string): DayAction | undefined {
  return getAllDays().find(d => d.id === id);
}

export function getCurrentDayActions(dayNumber: number): DayAction[] {
  const allDays = getAllDays();
  return allDays.filter(d => d.day === dayNumber);
}

export function getWeekForDay(dayNumber: number): WeekPlan | undefined {
  for (const month of onboardingPlan) {
    for (const week of month.weeks) {
      if (week.days.some(d => d.day === dayNumber)) {
        return week;
      }
    }
  }
  return undefined;
}

export function getTôtalDays(): number {
  return getAllDays().length;
}
