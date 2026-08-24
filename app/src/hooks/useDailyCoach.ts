import { useMemo } from 'react';
import type { UserProfile } from '@/types/profile';
import type { DailyResults } from '@/types';

export interface DailyCoachMessage {
  id: string;
  type: 'morning' | 'challenge' | 'tip' | 'motivation' | 'evening';
  title: string;
  message: string;
  action?: string;
  emoji: string;
}

/* eslint-disable @typescript-eslint/no-unused-vars -- paramètres conservés pour la signature publique du hook (stub) */
export function useDailyCoach(
  _currentDay: number,
  _completedDays: string[],
  _streak: number,
  _profile: UserProfile,
  _dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number },
  _dailyResults?: DailyResults[]
) {
/* eslint-enable @typescript-eslint/no-unused-vars */
  const messages = useMemo((): DailyCoachMessage[] => [], []);
  return { messages, week: 1 };
}
