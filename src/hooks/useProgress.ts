import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserProgress, DebriefEntry, DailyResults, NextDayPlan } from '@/types';
import { onboardingPlan } from '@/data/onboardingPlan';

const STORAGE_PREFIX = 'iad-coach-progress';

const defaultProgress: UserProgress = {
  currentDay: 1,
  completedDays: [],
  debriefs: [],
  dailyResults: [],
  nextDayPlans: [],
  streak: 0,
  totalCalls: 0,
  totalRdv: 0,
  totalMandats: 0,
  totalVisites: 0,
  totalOffres: 0,
  totalVentes: 0,
};

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}-${userKey}`;
}

function loadProgress(userKey: string): UserProgress {
  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultProgress, ...parsed };
    }
  } catch { /* ignore */ }
  return { ...defaultProgress };
}

function saveProgress(userKey: string, progress: UserProgress) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(progress));
}

export function useProgress(userKey: string) {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress(userKey));
  const loadedKey = useRef(userKey);

  // React to userKey changes
  if (userKey !== loadedKey.current) {
    loadedKey.current = userKey;
    const stored = loadProgress(userKey);
    setProgress(stored);
  }

  useEffect(() => {
    saveProgress(loadedKey.current, progress);
  }, [progress]);

  // Inject cloud data (called from App.tsx after apiSyncLoad)
  const loadFromCloud = useCallback((cloudProgress: any | null) => {
    if (!cloudProgress) return;
    setProgress(prev => {
      // Cloud data wins: merge with defaults, then overlay local, then overlay cloud
      const merged = { ...defaultProgress, ...prev, ...cloudProgress };
      saveProgress(loadedKey.current, merged);
      return merged;
    });
  }, []);

  const setCurrentDay = useCallback((day: number) => {
    setProgress(prev => ({ ...prev, currentDay: day }));
  }, []);

  const completeDay = useCallback((dayId: string) => {
    setProgress((prev: UserProgress) => {
      if (prev.completedDays.includes(dayId)) return prev;
      return {
        ...prev,
        completedDays: [...prev.completedDays, dayId],
        streak: prev.streak + 1,
      };
    });
  }, []);

  const uncompleteDay = useCallback((dayId: string) => {
    setProgress(prev => ({
      ...prev,
      completedDays: prev.completedDays.filter(id => id !== dayId),
      streak: Math.max(0, prev.streak - 1),
    }));
  }, []);

  const addDebrief = useCallback((debrief: DebriefEntry) => {
    setProgress(prev => ({
      ...prev,
      debriefs: [debrief, ...prev.debriefs],
    }));
  }, []);

  const addDailyResults = useCallback((results: DailyResults) => {
    setProgress((prev: UserProgress) => {
      const filtered = prev.dailyResults.filter(r => r.date !== results.date);
      const newTotalCalls = filtered.reduce((sum, r) => sum + r.callsMade, 0) + results.callsMade;
      const newTotalRdv = filtered.reduce((sum, r) => sum + r.rdvR1Done + r.rdvR2Done, 0) + results.rdvR1Done + results.rdvR2Done;
      const newTotalMandats = filtered.reduce((sum, r) => sum + r.mandatsSigned, 0) + results.mandatsSigned;
      const newTotalVisites = filtered.reduce((sum, r) => sum + r.visitesDone, 0) + results.visitesDone;
      return {
        ...prev,
        dailyResults: [results, ...filtered],
        totalCalls: newTotalCalls,
        totalRdv: newTotalRdv,
        totalMandats: newTotalMandats,
        totalVisites: newTotalVisites,
      };
    });
  }, []);

  const planNextDay = useCallback((plan: NextDayPlan) => {
    setProgress(prev => ({
      ...prev,
      nextDayPlans: [plan, ...prev.nextDayPlans.filter(p => p.date !== plan.date)],
    }));
  }, []);

  const getCompletionRate = useCallback((): number => {
    const allDays = onboardingPlan.flatMap(m => m.weeks.flatMap(w => w.days));
    if (allDays.length === 0) return 0;
    return Math.round((progress.completedDays.length / allDays.length) * 100);
  }, [progress.completedDays]);

  const getCurrentWeek = useCallback(() => {
    let dayCount = 0;
    for (const month of onboardingPlan) {
      for (const week of month.weeks) {
        if (progress.currentDay <= dayCount + week.days.length) {
          return week;
        }
        dayCount += week.days.length;
      }
    }
    return onboardingPlan[0].weeks[0];
  }, [progress.currentDay]);

  const getLast7DaysAverages = useCallback(() => {
    const last7 = progress.dailyResults.slice(0, 7);
    if (last7.length === 0) return null;
    return {
      avgCalls: Math.round(last7.reduce((s: number, r: DailyResults) => s + r.callsMade, 0) / last7.length * 10) / 10,
      avgRdvR1: Math.round(last7.reduce((s: number, r: DailyResults) => s + r.rdvR1Done, 0) / last7.length * 10) / 10,
      avgMandats: Math.round(last7.reduce((s: number, r: DailyResults) => s + r.mandatsSigned, 0) / last7.length * 10) / 10,
      avgVisites: Math.round(last7.reduce((s: number, r: DailyResults) => s + r.visitesDone, 0) / last7.length * 10) / 10,
    };
  }, [progress.dailyResults]);

  return {
    progress,
    setCurrentDay,
    completeDay,
    uncompleteDay,
    addDebrief,
    addDailyResults,
    planNextDay,
    getCompletionRate,
    getCurrentWeek,
    getLast7DaysAverages,
    loadFromCloud,
  };
}
