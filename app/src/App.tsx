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
import { ContactsView } from '@/components/ContactsView';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';
import { useVisits } from '@/hooks/useVisits';
import { useContacts } from '@/hooks/useContacts';
import { useSales } from '@/hooks/useSales';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import type { DailyResults, NextDayPlan } from '@/types';
import './App.css';

type ModalView = 'none' | 'checkup' | 'planner';

function App() {
  const { currentUser, isAuthenticated, login, logout, getUserKey, register } = useAuth();
  const userKey = getUserKey();

  const { visits, addVisit, updateVisit: updateVisitReport, deleteVisit, deleteProperty, stats: visitStats, loadFromCloud: loadVisitsFromCloud } = useVisits(userKey);
  const contactsState = useContacts(userKey);
  const { sales } = useSales(userKey);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('none');
  const [showFirstTimeOnboarding, setShowFirstTimeOnboarding] = useState(false);
  const [pendingRedirectToReport, setPendingRedirectToReport] = useState(false);

  // Confirmation avant fermeture du bilan si une saisie est en cours
  const [checkupDirty, setCheckupDirty] = useState(false);
  const [showCheckupCloseConfirm, setShowCheckupCloseConfirm] = useState(false);

  const requestCloseCheckup = () => {
    if (checkupDirty) {
      setShowCheckupCloseConfirm(true);
    } else {
      setModalView('none');
    }
  };

  // Fermeture via la touche Échap : même comportement que la croix
  // (confirmation si saisie en cours). Si la confirmation est déjà
  // affichée, Échap la ferme et revient au bilan.
  useEffect(() => {
    if (modalView !== 'checkup') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (showCheckupCloseConfirm) {
        setShowCheckupCloseConfirm(false);
      } else {
        requestCloseCheckup();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [modalView, checkupDirty, showCheckupCloseConfirm]);

  // Reset de l'état de confirmation quand le modal bilan se ferme
  useEffect(() => {
    if (modalView !== 'checkup') {
      setShowCheckupCloseConfirm(false);
      setCheckupDirty(false);
    }
  }, [modalView]);

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

  useEffect(() => {
    if (hasProfile && showFirstTimeOnboarding) {
      setShowFirstTimeOnboarding(false);
    }
  }, [hasProfile, showFirstTimeOnboarding]);

  // ===== CHARGEMENT CLOUD =====
  // State (et non ref) : la fin du chargement DOIT déclencher un re-render,
  // sinon l'écran "Chargement de ton compte..." reste affiché indéfiniment
  // pour un compte neuf (cloud vide → aucun setState → page figée jusqu'à F5).
  const [hasLoadedCloud, setHasLoadedCloud] = useState(false);
  const previousUser = useRef<string | null>(null);

  // Reset cloud load flag when user changes
  useEffect(() => {
    const currentUserEmail = currentUser?.email || null;
    if (currentUserEmail !== previousUser.current) {
      previousUser.current = currentUserEmail;
      setHasLoadedCloud(false);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    if (hasLoadedCloud) return;

    const loadFromCloud = async () => {
      if (!isCloudEnabled()) {
        setHasLoadedCloud(true);
        return;
      }
      try {
        const data = await apiSyncLoad();
        if (!data.success) {
          setHasLoadedCloud(true);
          return;
        }

        // Un profil cloud vide ({}) ne compte pas comme un profil existant :
        // il ne doit pas faire sauter l'onboarding wizard (firstName est requis).
        const cloudProfile = data.profile && data.profile.firstName ? data.profile : null;

        // Inject cloud data into hooks
        if (cloudProfile) {
          loadProfileFromCloud(cloudProfile);
        }
        if (data.progress) {
          loadProgressFromCloud(data.progress);
        } else {
          if (data.dailyResults && data.dailyResults.length > 0) {
            loadProgressFromCloud({
              dailyResults: data.dailyResults,
              completedDays: data.completedDays || [],
            });
          }
          if (data.completedDays && data.completedDays.length > 0) {
            loadProgressFromCloud({ completedDays: data.completedDays });
          }
        }
        if (data.visits && data.visits.length > 0) {
          loadVisitsFromCloud(data.visits);
        }
        if (data.contacts && data.contacts.length > 0) {
          contactsState.loadFromCloud(data.contacts);
        }

        // Migration: if cloud is empty but local has data → push to cloud
        const hasLocalData = progress.dailyResults.length > 0 || visits.length > 0 || hasProfile || progress.currentDay > 1 || progress.nextDayPlans.length > 0;
        const cloudEmpty = (!data.dailyResults || data.dailyResults.length === 0)
          && (!data.visits || data.visits.length === 0)
          && !cloudProfile;

        if (cloudEmpty && hasLocalData) {
          toast.info('Synchronisation de tes données vers le cloud...', { duration: 3000 });
          await apiSyncSave({
            profile: hasProfile ? profile : null,
            progress,
            visits,
          });
          toast.success('Données synchronisées !', { duration: 3000 });
        } else if (data.dailyResults?.length > 0 || data.visits?.length > 0) {
          toast.success('Données chargées depuis le cloud', { duration: 2000 });
        }
        setHasLoadedCloud(true);
      } catch {
        // Network down: silently use localStorage — mais on débloque l'UI
        // (sinon l'écran de chargement resterait affiché indéfiniment).
        setHasLoadedCloud(true);
      }
    };

    loadFromCloud();
  }, [isAuthenticated, currentUser, hasLoadedCloud]);
  // ===== FIN CHARGEMENT CLOUD =====

  // ===== SAUVEGARDE CLOUD =====
  const isSyncing = useRef(false);

  const flushSync = useCallback(async () => {
    if (!isCloudEnabled() || !currentUser) return;
    if (isSyncing.current) return;
    isSyncing.current = true;
    try {
      await apiSyncSave({
        // Ne jamais pousser le defaultProfile tant que l'onboarding
        // n'est pas terminé — sinon le prochain chargement croirait
        // qu'un profil existe et ferait sauter l'onboarding wizard.
        profile: hasProfile ? profile : null,
        progress,
        visits,
      });
    } catch {
      // Silencieux — si le réseau est down, les données restent en localStorage
    } finally {
      isSyncing.current = false;
    }
  }, [progress, profile, visits, currentUser, hasProfile]);

  useEffect(() => {
    if (!isCloudEnabled() || !currentUser) return;
    if (isSyncing.current) return;

    // Court délai : juste de quoi coalescer des changements simultanés. L'état ne
    // change que sur des actions ponctuelles (clic), jamais en continu (frappe
    // clavier), donc pas besoin d'un long debounce — et un délai court réduit la
    // fenêtre pendant laquelle une fermeture d'onglet ferait perdre la sync.
    const timeout = setTimeout(() => { flushSync(); }, 500);
    return () => clearTimeout(timeout);
  }, [progress, profile, visits, currentUser, hasProfile, flushSync]);
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

  if (isCloudEnabled() && !hasLoadedCloud) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="rounded-3xl bg-white p-8 shadow-xl border border-gray-100 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900">Chargement de ton compte...</h2>
          <p className="text-sm text-gray-500 mt-3">Reste connecté, on récupère tes dernières données et ton dernier bilan.</p>
        </div>
      </div>
    );
  }

  const handleSaveCheckup = (results: DailyResults & { wins: string; challenges: string; mood: number; watchedNetworkVideosToday?: boolean; crmUpdated?: boolean }) => {
    addDailyResults(results);
    setModalView('none');
    toast.success('Bilan enregistré !');
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
            sales={sales}
            contactsState={contactsState}
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
            onCreateContact={(note) => {
              contactsState.addContact({ nom: '', telephone: '', contexte: note, origine: 'Action du jour', dateRelance: '', statut: 'chaud' });
              setActiveTab('contacts');
            }}
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
          <HistoryView dailyResults={progress.dailyResults} profile={profile} sales={sales} />
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
        return <CommissionCalculator userKey={userKey} country={profile.country} averagePrice={profile.averagePrice} />;
      case 'contacts':
        return <ContactsView userKey={userKey} state={contactsState} />;
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
            sales={sales}
            contactsState={contactsState}
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

      {/* Modal overlay: Daily Checkup — pas de fermeture au clic sur l'overlay :
          l'overlay n'a volontairement aucun onClick. */}
      {modalView === 'checkup' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Bilan de ta journée — Jour {progress.currentDay}</h2>
                <p className="text-red-100 text-sm">Fais le point sur tes résultats réels</p>
              </div>
              <button onClick={requestCloseCheckup} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <DailyCheckup
                userKey={userKey}
                profile={profile}
                currentDay={progress.currentDay}
                completedDays={progress.completedDays}
                dailyResults={progress.dailyResults}
                onSave={handleSaveCheckup}
                onClose={handleCloseCheckup}
                onRequestClose={requestCloseCheckup}
                onDirtyChange={setCheckupDirty}
                onUpdateProfile={updateProfile}
              />
            </div>
          </div>

          {/* Confirmation avant fermeture si une saisie est en cours */}
          {showCheckupCloseConfirm && (
            <div className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center px-4">
              <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
                <h3 className="text-base font-bold text-gray-900">Fermer le bilan ?</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Ta vérification du jour est en cours. Si tu fermes sans valider, elle restera sauvegardée en brouillon — tu pourras la reprendre.
                </p>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setShowCheckupCloseConfirm(false)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                  >
                    Reprendre
                  </button>
                  <button
                    onClick={() => {
                      setShowCheckupCloseConfirm(false);
                      setModalView('none');
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                  >
                    Fermer quand même
                  </button>
                </div>
              </div>
            </div>
          )}
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
