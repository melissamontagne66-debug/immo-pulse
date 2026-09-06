import { useState, useCallback, useRef, useEffect } from 'react';
import type { UserProfile, MonthlyGoal } from '@/types/profile';
import { defaultProfile, calculateTargetsFromMonthlyCA, getDailyTargets } from '@/types/profile';

const STORAGE_PREFIX = 'iad-coach-profile';

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}-${userKey}`;
}

function loadProfile(userKey: string): UserProfile | null {
  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveProfile(userKey: string, profile: UserProfile) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(profile));
}

export function useProfile(userKey: string) {
  const [profile, setProfileState] = useState<UserProfile | null>(() => loadProfile(userKey));
  const loadedKey = useRef(userKey);

  // React to userKey changes
  useEffect(() => {
    if (userKey !== loadedKey.current) {
      loadedKey.current = userKey;
      const stored = loadProfile(userKey);
      // Rechargement localStorage au changement d'utilisateur : le setState
      // synchrone est volontaire (données locales disponibles immédiatement).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProfileState(stored);
    }
  }, [userKey]);

  // Inject cloud data (called from App.tsx after apiSyncLoad)
  const loadFromCloud = useCallback((cloudProfile: Partial<UserProfile> | null) => {
    if (!cloudProfile) return;
    // Cloud data always wins over local
    setProfileState(prev => {
      const merged = { ...defaultProfile, ...(prev || {}), ...cloudProfile };
      // Recalculate targets — à partir du CA du mois du goal (qui peut avoir
      // été ajusté à la main), pas du CA 6 mois, sinon l'ajustement manuel
      // serait écrasé à chaque chargement cloud.
      try {
        const targets = calculateTargetsFromMonthlyCA(
          merged.currentMonthGoal?.caTarget ?? merged.ca6MonthsTarget,
          merged.commissionsPct,
          merged.averagePrice,
          merged.expérienceLevel
        );
        merged.currentMonthGoal = { ...merged.currentMonthGoal, ...targets };
      } catch { /* ignore */ }
      saveProfile(loadedKey.current, merged);
      return merged;
    });
  }, []);

  const setProfile = useCallback((p: UserProfile) => {
    const targets = calculateTargetsFromMonthlyCA(
      p.currentMonthGoal.caTarget,
      p.commissionsPct,
      p.averagePrice,
      p.expérienceLevel
    );
    const updatedGoal: MonthlyGoal = {
      ...p.currentMonthGoal,
      ventesTarget: targets.ventesTarget,
      mandatsTarget: targets.mandatsTarget,
      rdvR2Target: targets.rdvR2Target,
      rdvR1Target: targets.rdvR1Target,
      appelsTarget: targets.appelsTarget,
      visitesTarget: targets.visitesTarget,
      averagePrice: p.averagePrice,
    };
    const finalProfile = { ...p, currentMonthGoal: updatedGoal };
    setProfileState(finalProfile);
    saveProfile(loadedKey.current, finalProfile);
  }, []);

  const updateMonthlyGoal = useCallback((goal: MonthlyGoal) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const targets = calculateTargetsFromMonthlyCA(
        goal.caTarget,
        goal.commissionsPct,
        prev.averagePrice,
        prev.expérienceLevel
      );
      const updatedGoal: MonthlyGoal = { ...goal, ...targets, averagePrice: prev.averagePrice };
      const updated = {
        ...prev,
        currentMonthGoal: updatedGoal,
        monthlyGoals: [...prev.monthlyGoals.filter(g => g.month !== goal.month), updatedGoal],
      };
      saveProfile(loadedKey.current, updated);
      return updated;
    });
  }, []);

  const resetProfile = useCallback(() => {
    localStorage.removeItem(getStorageKey(loadedKey.current));
    setProfileState(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState(prev => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveProfile(loadedKey.current, updated);
      return updated;
    });
  }, []);

  const hasProfile = profile !== null;

  const dailyTargets = getDailyTargets(profile?.currentMonthGoal || defaultProfile.currentMonthGoal);

  return {
    profile: profile || defaultProfile,
    hasProfile,
    setProfile,
    updateMonthlyGoal,
    updateProfile,
    resetProfile,
    dailyTargets,
    loadFromCloud,
  };
}
