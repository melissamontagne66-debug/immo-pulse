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

export function useDailyCoach(
  _currentDay: number,
  _completedDays: string[],
  _streak: number,
  _profile: UserProfile,
  _dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number },
  _dailyResults?: DailyResults[]
) {
  const messages = useMemo((): DailyCoachMessage[] => [], []);
  return { messages, week: 1 };
}
