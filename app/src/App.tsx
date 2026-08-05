import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
// Immo Pulse - App de coaching immobilier
import { LoginScreen } from '@/components/LoginScreen';
import { Layout } from '@/components/Layout';
import { Dashboard } from '@/components/Dashboard';
import { DailyActions } from '@/components/DailyActions';
import { apiSyncSave, apiSyncLoad, isCloudEnabled } from '@/services/api';

import { Chat } from '@/components/Chat';
import { OnboardingWizard } from '@/components/OnboardingWizard';
import { FirstTimeOnboarding } from '@/components/FirstTimeOnboarding';
import { MonthlyGoalSetter } from '@/components/MonthlyGoalSetter';
import { DailyCheckup } from '@/components/DailyCheckup';
import { NextDayPlanner } from '@/components/NextDayPlanner';
import { HistoryView } from '@/components/HistoryView';
import { VisitReportWriter } from '@/components/VisitReportWriter';
import { CommissionCalculator } from '@/components/CommissionCalculator';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';
import { useVisits } from '@/hooks/useVisits';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { DailyResults, NextDayPlan } from '@/types';
import './App.css';

type ModalView = 'none' | 'checkup' | 'planner';

function App() {
  const { currentUser, isAuthenticated, login, logout, getUserKey, register } = useAuth();
  const userKey = getUserKey();

  const { visits, addVisit, updateVisit: updateVisitReport, deleteVisit, deleteProperty, stats: visitStats, loadFromCloud: loadVisitsFromCloud } = useVisits(userKey);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('none');
  const [showFirstTimeOnboarding, setShowFirstTimeOnboarding] = useState(false);

  // Écouter les demandes de navigation entre onglets (ex: depuis le bilan)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail) {
        setActiveTab(detail);
        setModalView('none'); // fermer le modal checkup
      }
    };
    window.addEventListener('navigate-to-tab', handler);
    return () => window.removeEventListener('navigate-to-tab', handler);
  }, []);

  // Reset onboarding state when user changes
  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      setShowFirstTimeOnboarding(false);
      return;
    }
    try {
      const seen = localStorage.getItem(`immo-pulse-onboarding-seen-${userKey}`);
      setShowFirstTimeOnboarding(!seen);
    } catch {
      setShowFirstTimeOnboarding(true);
    }
  }, [userKey, isAuthenticated, currentUser]);

  const {
    progress,
    setCurrentDay,
    completeDay,
    uncompleteDay,
    addDebrief,
    addDailyResults,
    planNextDay,
    getCompletionRate,
    getCurrentWeek,
    loadFromCloud: loadProgressFromCloud,
  } = useProgress(userKey);

  const { messages, isTyping, sendMessage, clearChat } = useChat(userKey);
  const { profile, hasProfile, setProfile, updateProfile, dailyTargets, loadFromCloud: loadProfileFromCloud } = useProfile(userKey);

  // ===== CHARGEMENT CLOUD =====
  const hasLoadedCloud = useRef(false);
  const previousUser = useRef<string | null>(null);

  // Reset cloud load flag when user changes
  useEffect(() => {
    const currentUserEmail = currentUser?.email || null;
    if (currentUserEmail !== previousUser.current) {
      hasLoadedCloud.current = false;
      previousUser.current = currentUserEmail;
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    if (hasLoadedCloud.current) return;

    const loadFromCloud = async () => {
      if (!isCloudEnabled()) {
        hasLoadedCloud.current = true;
        return;
      }
      try {
        const data = await apiSyncLoad();
        if (!data.success) {
          hasLoadedCloud.current = true;
          return;
        }

        hasLoadedCloud.current = true;

        // Inject cloud data into hooks
        if (data.profile) {
          loadProfileFromCloud(data.profile);
        }
        if (data.dailyResults && data.dailyResults.length > 0) {
          loadProgressFromCloud({
            dailyResults: data.dailyResults,
            completedDays: data.completedDays || [],
          });
        }
        if (data.completedDays && data.completedDays.length > 0) {
          loadProgressFromCloud({ completedDays: data.completedDays });
        }
        if (data.visits && data.visits.length > 0) {
          loadVisitsFromCloud(data.visits);
        }

        // Migration: if cloud is empty but local has data → push to cloud
        const hasLocalData = progress.dailyResults.length > 0 || visits.length > 0 || hasProfile;
        const cloudEmpty = (!data.dailyResults || data.dailyResults.length === 0)
          && (!data.visits || data.visits.length === 0)
          && !data.profile;

        if (cloudEmpty && hasLocalData) {
          toast.info('Synchronisation de tes données vers le cloud...', { duration: 3000 });
          await apiSyncSave({
            profile,
            dailyResults: progress.dailyResults,
            completedDays: progress.completedDays,
            visits,
          });
          toast.success('Données synchronisées !', { duration: 3000 });
        } else if (data.dailyResults?.length > 0 || data.visits?.length > 0) {
          toast.success('Données chargées depuis le cloud', { duration: 2000 });
        }
      } catch {
        // Network down: silently use localStorage
      }
    };

    loadFromCloud();
  }, [isAuthenticated, currentUser, isCloudEnabled]);
  // ===== FIN CHARGEMENT CLOUD =====

  // ===== SAUVEGARDE CLOUD =====
  const isSyncing = useRef(false);

  const flushSync = useCallback(async () => {
    if (!isCloudEnabled() || !currentUser || !hasProfile) return;
    if (isSyncing.current) return;
    isSyncing.current = true;
    try {
      await apiSyncSave({
        profile,
        dailyResults: progress.dailyResults,
        completedDays: progress.completedDays,
        visits,
      });
    } catch {
      // Silencieux — si le réseau est down, les données restent en localStorage
    } finally {
      isSyncing.current = false;
    }
  }, [profile, progress.dailyResults, progress.completedDays, visits, currentUser, hasProfile]);

  useEffect(() => {
    if (!isCloudEnabled() || !currentUser || !hasProfile) return;
    if (isSyncing.current) return;

    // Court délai : juste de quoi coalescer des changements simultanés (ex: addDailyResults +
    // setCurrentDay dans handleSaveCheckup). Ces changements sont ponctuels (clic sur un bouton),
    // jamais continus (pas de frappe clavier), donc pas besoin d'un long debounce — et un délai
    // court réduit la fenêtre pendant laquelle une fermeture d'onglet ferait perdre la sync.
    const timeout = setTimeout(() => { flushSync(); }, 500);
    return () => clearTimeout(timeout);
  }, [progress.dailyResults, progress.completedDays, profile, visits, currentUser, hasProfile, flushSync]);
  // ===== FIN SAUVEGARDE CLOUD =====

  // Flush pending changes before logging out, so a fast logout can't cancel
  // an unsaved debounced sync and silently drop data that was never sent to D1.
  const handleLogout = useCallback(async () => {
    await flushSync();
    logout();
  }, [flushSync, logout]);

  // Scroll to top when tab changes
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab, modalView]);

  // Show login if not authenticated
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen onLogin={login} onRegister={register} />
        <Toaster position="bottom-center" richColors />
      </>
    );
  }

  const [pendingRedirectToReport, setPendingRedirectToReport] = useState(false);

  const handleSaveCheckup = (results: DailyResults & { wins: string; challenges: string; mood: number }) => {
    addDailyResults(results as DailyResults);

    // Check if visits were done today but no visit report exists for today
    const todayStr = new Date().toISOString().split('T')[0];
    const hasVisitsToday = results.visitesDone > 0;
    const hasVisitReportToday = visits.some(v => v.date === todayStr);
    const needsRedirectToReport = hasVisitsToday && !hasVisitReportToday;
    setPendingRedirectToReport(needsRedirectToReport);

    // Auto-advance to next day
    const nextDay = progress.currentDay + 1;
    setCurrentDay(nextDay);
  };

  const handleCloseCheckup = () => {
    setModalView('none');
    if (pendingRedirectToReport) {
      setPendingRedirectToReport(false);
      setActiveTab('report');
      toast.info('N\'oublie pas de faire tes comptes rendus de visites !', { duration: 5000 });
    } else {
      toast.success('Bilan enregistré ! On passe au jour suivant.');
    }
  };

  const handlePlanNextDay = (plan: NextDayPlan) => {
    planNextDay(plan);
    setModalView('none');
    toast.success('Plan de demain enregistré ! Bon courage.');
  };

  if (showGoalSetter) {
    return (
      <div className="min-h-screen">
        <MonthlyGoalSetter
          profile={profile}
          onSave={(goal) => { setProfile({ ...profile, currentMonthGoal: goal }); setShowGoalSetter(false); }}
          onCancel={() => setShowGoalSetter(false)}
        />
        <Toaster position="bottom-center" richColors />
      </div>
    );
  }

  // If authenticated but no profile yet → show onboarding wizard
  if (!hasProfile) {
    return (
      <div className="min-h-screen">
        <OnboardingWizard onComplete={(p) => { setProfile(p); setShowFirstTimeOnboarding(true); }} />
        <Toaster position="bottom-center" richColors />
      </div>
    );
  }

  // First time onboarding after wizard
  if (showFirstTimeOnboarding) {
    return (
      <FirstTimeOnboarding onComplete={() => {
        setShowFirstTimeOnboarding(false);
        try {
          localStorage.setItem(`immo-pulse-onboarding-seen-${userKey}`, 'true');
        } catch { /* ignore */ }
      }} />
    );
  }

  const completionRate = getCompletionRate();
  const currentWeek = getCurrentWeek();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            progress={progress}
            completionRate={completionRate}
            currentDay={progress.currentDay}
            profile={profile}
            dailyResults={progress.dailyResults}
            dailyTargets={dailyTargets}
            currentWeek={currentWeek}
            onNavigate={setActiveTab}
            onSetMonthlyGoal={() => setShowGoalSetter(true)}
          />
        );
      case 'today':
        return (
          <DailyActions
            currentDay={progress.currentDay}
            completedDays={progress.completedDays}
            
            profile={profile}
            dailyTargets={dailyTargets}
            dailyResults={progress.dailyResults}
            onCompleteDay={completeDay}
            onUncompleteDay={uncompleteDay}
            onAddDebrief={addDebrief}
            onDayChange={setCurrentDay}
            onOpenCheckup={() => setModalView('checkup')}
            onNavigate={setActiveTab}
            userEmail={currentUser?.email}
          />
        );
      case 'chat':
        return (
          <Chat
            messages={messages}
            isTyping={isTyping}
            onSendMessage={sendMessage}
            onClearChat={clearChat}
            profile={profile}
            dailyTargets={dailyTargets}
          />
        );
      case 'history':
        return (
          <HistoryView dailyResults={progress.dailyResults} profile={profile} />
        );
      case 'report':
        return (
          <VisitReportWriter
            visits={visits}
            stats={visitStats}
            onAddVisit={addVisit}
            onUpdateVisit={updateVisitReport}
            onDeleteVisit={deleteVisit}
            onDeleteProperty={deleteProperty}
          />
        );
      case 'commission':
        return <CommissionCalculator userKey={userKey} country={profile.country} />;
      default:
        return (
          <Dashboard
            progress={progress}
            completionRate={completionRate}
            currentDay={progress.currentDay}
            profile={profile}
            dailyResults={progress.dailyResults}
            dailyTargets={dailyTargets}
            currentWeek={currentWeek}
            onNavigate={setActiveTab}
            onSetMonthlyGoal={() => setShowGoalSetter(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Layout
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentDay={progress.currentDay}
        completionRate={completionRate}
        streak={progress.streak}
        profile={profile}
        onSetMonthlyGoal={() => setShowGoalSetter(true)}
        onLogout={handleLogout}
        onOpenCheckup={() => setModalView('checkup')}
        userEmail={currentUser?.email}
        hasNotification={true}
        onLanguageChange={(lang) => updateProfile({ language: lang })}
      >
        {renderContent()}
      </Layout>

      {/* Modal overlay: Daily Checkup */}
      {modalView === 'checkup' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Bilan de ta journée — Jour {progress.currentDay}</h2>
                <p className="text-red-100 text-sm">Fais le point sur tes résultats réels</p>
              </div>
              <button onClick={() => setModalView('none')} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <DailyCheckup
                profile={profile}
                currentDay={progress.currentDay}
                completedDays={progress.completedDays}
                onSave={handleSaveCheckup}
                onClose={handleCloseCheckup}
                onUpdateProfile={updateProfile}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal overlay: Next Day Planner */}
      {modalView === 'planner' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Planifie ton lendemain</h2>
                <p className="text-amber-100 text-sm">Sélectionne les actions pour demain</p>
              </div>
              <button onClick={() => setModalView('none')} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <NextDayPlanner
                currentDay={progress.currentDay}
                onPlan={handlePlanNextDay}
                onSkip={() => setModalView('none')}
              />
            </div>
          </div>
        </div>
      )}

      <Toaster position="bottom-center" richColors />
    </div>
  );
}

export default App;
