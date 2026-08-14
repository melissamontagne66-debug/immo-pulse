export interface DayAction {
  id: string;
  day: number;
  title: string;
  description: string;
  category: 'prospection' | 'rdv' | 'technique' | 'admin' | 'formation' | 'visite' | 'nego' | 'notaire' | 'miseenligne' | 'suivi';
  estimatedTime: string;
  moduleRef: string;
  completéd?: boolean;
  debrief?: string;
  rating?: number;
}

export interface DebriefEntry {
  dayId: string;
  date: string;
  done: string;
  challenges: string;
  wins: string;
  tomorrow: string;
  mood: number;
  questions: string;
}

export interface DailyResults {
  date: string;
  callsMade: number;
  contactsApproached: number;
  rdvR1Fixed: number;
  rdvR1Done: number;
  rdvR2Done: number;
  mandatsSigned: number;
  visitesDone: number;
  offresWritten: number;
  compromisSigned: number;
  prospectionTime: string;
  notes: string;
  // Debrief du soir intégré
  wins: string;
  challenges: string;
  mood: number;
  coachQuestion: string;
  coachAnswer: string;
  // Suivi des vidéos du réseau (demande durant les 6 premiers mois)
  watchedNetworkVideosToday?: boolean;
  // Mise à jour CRM
  crmUpdated?: boolean;
}

export interface NextDayPlan {
  date: string;
  actions: string[]; // IDs des actions prévues
  validated: boolean;
  skippedActions: { actionId: string; reason: 'blocage' | 'difficulté' | 'report' | 'autre'; detail?: string; reportDate?: string }[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

import type { StreakState } from '@/lib/streak';

export interface UserProgress {
  currentDay: number;
  completedDays: string[];
  debriefs: DebriefEntry[];
  dailyResults: DailyResults[];
  nextDayPlans: NextDayPlan[];
  /** MOD-22 : objet série de bilans (migration douce depuis l'ancien nombre). */
  streak: StreakState;
  totalCalls: number;
  totalRdv: number;
  totalMandats: number;
  totalVisites: number;
  totalOffres: number;
  totalVentes: number;
}

export interface KnowledgeModule {
  id: string;
  title: string;
  category: string;
  content: string;
  keyPoints: string[];
  scripts?: string[];
}

export interface AIPersona {
  name: string;
  role: string;
  tone: string;
}

export interface WeekPlan {
  week: number;
  title: string;
  theme: string;
  days: DayAction[];
}

export interface MonthPlan {
  month: number;
  title: string;
  weeks: WeekPlan[];
}

// === VISITES & COMPTES RENDUS ===

export type VisitStatus = 'intéressé' | 'réflexion' | 'négatif' | 'offre';

export interface VisitReport {
  id: string;
  date: string;
  propertyAddress: string;
  sellerName: string;
  sellerPhone: string;
  buyerName: string;
  visitType: 'acheteur' | 'vendeur' | 'estimation';
  status: VisitStatus;
  rawFeedback: string;
  keyPoints: string;
  weakPoints: string;
  strongPoints: string;
  priceFeedback: string;
  locationFeedback: string;
  workFeedback: string;
  generalFeedback: string;
  generatedMessage: string;
  followUpDate: string;
  notes: string;
}

export interface VisitStats {
  totalVisits: number;
  byStatus: Record<VisitStatus, number>;
  topBuyerObjections: { objection: string; count: number }[];
  byProperty: Record<string, VisitReport[]>;
}
