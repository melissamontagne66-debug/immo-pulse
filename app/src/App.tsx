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
import { InstallAppPrompt } from '@/components/InstallAppPrompt';
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
import { checkStreakOnOpen, getMilestoneMessage } from '@/lib/streak';
import { evaluateBilan } from '@/lib/antiDecrochage';
import { toLocalDateKey } from '@/lib/utils';
import { plural } from '@/lib/goals';
import { Celebration } from '@/components/Celebration';
import { MonParcours } from '@/components/MonParcours';
import { useJalons } from '@/hooks/useJalons';
import { getNiveau } from '@/lib/jalons';
import { registerPushServiceWorker } from '@/lib/push';
import { apiMilestone } from '@/services/api';
import type { DailyResults, NextDayPlan } from '@/types';
import './App.css';

type ModalView = 'none' | 'checkup' | 'planner';

function App() {
  const { currentUser, isAuthenticated, login, logout, getUserKey, register } = useAuth();
  const userKey = getUserKey();

  const { visits, addVisit, updateVisit: updateVisitReport, deleteVisit, deleteProperty, stats: visitStats, loadFromCloud: loadVisitsFromCloud } = useVisits(userKey);
  const contactsState = useContacts(userKey);
  const { sales } = useSales(userKey);

  // 6.7 — Persistance de la vue : l'écran courant survit au rechargement (F5).
  const [activeTab, setActiveTabState] = useState(() => {
    try {
      return localStorage.getItem('immo-pulse-active-tab') || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });
  const setActiveTab = (tab: string) => {
    setActiveTabState(tab);
    try {
      localStorage.setItem('immo-pulse-active-tab', tab);
    } catch { /* ignore */ }
    // Scroll en haut à chaque changement d'onglet (le main scrolle, pas la fenêtre)
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      document.querySelector('main')?.scrollTo(0, 0);
    });
  };
  const [showGoalSetter, setShowGoalSetter] = useState(false);
  const [modalView, setModalView] = useState<ModalView>('none');
  const [showFirstTimeOnboarding, setShowFirstTimeOnboarding] = useState(false);
  const [pendingRedirectToReport, setPendingRedirectToReport] = useState(false);
  // MOD-21 : célébration plein écran après validation du bilan
  const [bilanCelebration, setBilanCelebration] = useState<{ message: string; submessage: string; particleCount: number } | null>(null);

  // Confirmation avant fermeture du bilan si une saisie est en cours
  const [checkupDirty, setCheckupDirty] = useState(false);
  const [showCheckupCloseConfirm, setShowCheckupCloseConfirm] = useState(false);
  // Rattrapage : date ciblée quand le bilan est ouvert via la flèche
  // « jour suivant » bloquée (bilan oublié). null = bilan du jour.
  const [checkupDate, setCheckupDate] = useState<string | null>(null);

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
      setCheckupDate(null);
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
    applyStreakOpenCheck,
  } = useProgress(userKey);

  const { messages, isTyping, sendMessage, clearChat } = useChat(userKey);
  const { profile, hasProfile, setProfile, updateProfile, dailyTargets, loadFromCloud: loadProfileFromCloud } = useProfile(userKey);

  // MOD-31 : jalons de carrière — célébration plein écran à la 1ère occurrence
  const { newJalon, dismissJalon } = useJalons(progress, sales, currentUser?.email);

  // MOD-22 : vérification de la série à l'ouverture (gel automatique / casse bienveillante).
  // Une seule fois par utilisateur et par jour.
  const streakCheckedFor = useRef<string | null>(null);
  useEffect(() => {
    if (!isAuthenticated || !userKey) return;
    const todayKey = toLocalDateKey(new Date());
    const ref = `${userKey}-${todayKey}`;
    if (streakCheckedFor.current === ref) return;
    streakCheckedFor.current = ref;
    applyStreakOpenCheck(prev => {
      const { streak, event } = checkStreakOnOpen(prev.streak, todayKey);
      if (event) {
        // Toast différé pour laisser l'UI se monter
        setTimeout(() => {
          if (event.type === 'freeze-used') toast.info(event.message, { duration: 8000 });
          else toast(event.message, { duration: 8000 });
        }, 800);
      }
      return { ...prev, streak };
    });
  }, [isAuthenticated, userKey, applyStreakOpenCheck]);

  // MOD-29 : enregistrement du service worker push au chargement (sans
  // demander la permission — la carte douce s'en charge au bon moment).
  useEffect(() => {
    if (!isAuthenticated) return;
    registerPushServiceWorker();
  }, [isAuthenticated]);

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
        {/* Proposition d'installation PWA dès la visite navigateur,
            avant même la connexion */}
        <div className="fixed bottom-4 inset-x-4 z-40 max-w-md mx-auto">
          <InstallAppPrompt />
        </div>
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
    const registration = addDailyResults(results);
    // MOD-27 : évalue le protocole anti-décrochage (humeur / difficultés du bilan).
    // Volontairement silencieux ici — la réponse bienveillante s'affiche sur le
    // dashboard, jamais de mention du « protocole » à l'utilisateur.
    evaluateBilan(results, profile, progress.dailyResults, userKey);
    // MOD-21 : le modal reste ouvert sur le step 2 (célébration + planification) —
    // la fermeture se fait via onClose. La célébration plein écran s'affiche par-dessus.
    const streakCount = registration?.streak.count ?? 0;
    const milestoneMsg = registration?.milestone ? getMilestoneMessage(registration.milestone) : null;
    const now = new Date();
    const savedLate = now.getHours() >= 22 && registration?.incremented;

    // Victoire saisie → toast dédié
    if (results.wins?.trim()) {
      toast.success(`🏆 Victoire notée : « ${results.wins.trim()} » — c'est comme ça qu'on construit une carrière.`, { duration: 6000 });
    }

    // Récap des chiffres du jour (seulement les valeurs > 0)
    const recapLines: string[] = [];
    if (results.callsMade > 0) recapLines.push(`📞 ${plural(results.callsMade, 'conversation')}`);
    if (results.contactsApproached > 0) recapLines.push(`🤝 ${plural(results.contactsApproached, 'contact physique')}`);
    if (results.rdvR1Done > 0) recapLines.push(`📅 ${plural(results.rdvR1Done, 'R1')}`);
    if (results.rdvR2Done > 0) recapLines.push(`✍️ ${plural(results.rdvR2Done, 'R2')}`);
    if (results.visitesDone > 0) recapLines.push(`🏡 ${plural(results.visitesDone, 'visite')}`);
    if (results.mandatsSigned > 0) recapLines.push(`📑 ${plural(results.mandatsSigned, 'mandat')}`);
    if (results.offresWritten > 0) recapLines.push(`💰 ${plural(results.offresWritten, 'offre')}`);

    const sérieLine = `🔥 Série : ${plural(streakCount, 'jour')}. À demain, ${profile.firstName} !`;
    const lateLine = savedLate ? `\nBilan bouclé à ${now.getHours()} h ${String(now.getMinutes()).padStart(2, '0')} — série sauvée de justesse ! 😅` : '';

    setBilanCelebration({
      message: milestoneMsg ?? '🎉 Bilan enregistré !',
      submessage: `${sérieLine}${lateLine}${recapLines.length > 0 ? `\n\n${recapLines.join(' · ')}` : ''}`,
      particleCount: milestoneMsg ? 48 : 32,
    });

    // MOD-30 : email de félicitations de palier (anti-doublon côté Worker)
    if (registration?.milestone && isCloudEnabled()) {
      apiMilestone(`streak_${registration.milestone}`).catch(() => { /* silencieux */ });
    }
    // Premier mandat → palier « first_mandat » (email 3)
    if (registration?.incremented && results.mandatsSigned > 0) {
      const totalMandats = progress.dailyResults.reduce((s, r) => s + (r.mandatsSigned || 0), 0);
      if (totalMandats === 0 && isCloudEnabled()) {
        apiMilestone('first_mandat').catch(() => { /* silencieux */ });
      }
    }
  };

  const handleCloseCheckup = () => {
    setModalView('none');
    if (pendingRedirectToReport) {
      setPendingRedirectToReport(false);
      setActiveTab('report');
      toast.info('N\'oublie pas de faire tes comptes rendus de visites !', { duration: 5000 });
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
  // MOD-31 : niveau de carrière affiché dans la sidebar
  const niveau = getNiveau(progress, sales);
  const niveauLabel = `${niveau.emoji} ${profile.language === 'es' ? niveau.labelEs : niveau.label}`;

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
            onOpenMissedCheckup={(date) => { setCheckupDate(date); setModalView('checkup'); }}
            onNavigate={setActiveTab}
            userEmail={currentUser?.email}
            onCreateContact={(note) => {
              contactsState.addContact({ nom: '', prenom: '', telephone: '', email: '', contexte: note, origine: 'autre', typeProspect: '', occupancy: '', adresse: '', codePostal: '', ville: '', quartier: '', anniversaire: '', dateDerniereRelance: '', dateRelance: '', notes: [], statut: 'chaud' });
              setActiveTab('contacts');
            }}
            nextDayPlan={progress.nextDayPlans.find(p => p.date === toLocalDateKey(new Date()))}
            contactsState={contactsState}
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
      case 'parcours':
        return (
          <MonParcours
            progress={progress}
            sales={sales}
            profile={profile}
          />
        );
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
        niveauLabel={niveauLabel}
        streak={progress.streak.count}
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

      {/* MOD-21 : célébration plein écran après validation du bilan */}
      {bilanCelebration && (
        <Celebration
          show={true}
          message={bilanCelebration.message}
          submessage={bilanCelebration.submessage}
          particleCount={bilanCelebration.particleCount}
          autoCloseMs={6000}
          onClose={() => setBilanCelebration(null)}
        />
      )}

      {/* MOD-31 : célébration plein écran d'un nouveau jalon de carrière */}
      {newJalon && (
        <Celebration
          show={true}
          message={`🎉 ${newJalon.titre} !`}
          submessage={newJalon.sub}
          particleCount={48}
          autoCloseMs={6000}
          onClose={dismissJalon}
        />
      )}

      {/* Modal overlay: Daily Checkup — pas de fermeture au clic sur l'overlay :
          l'overlay n'a volontairement aucun onClick.
          6.2 : plein écran sur mobile (usage terrain au pouce). */}
      {modalView === 'checkup' && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center overflow-y-auto py-8 px-4 max-sm:py-0 max-sm:px-0">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-auto max-sm:rounded-none max-sm:border-0 max-sm:min-h-screen max-sm:my-0">
            <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {checkupDate && checkupDate !== toLocalDateKey(new Date())
                    ? `Bilan oublié — rattrapage du ${new Date(checkupDate + 'T12:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}`
                    : `Bilan de ta journée — Jour ${progress.currentDay}`}
                </h2>
                <p className="text-red-100 text-sm">Fais le point sur tes résultats réels</p>
              </div>
              <button onClick={requestCloseCheckup} className="text-white/80 hover:text-white text-2xl leading-none">&times;</button>
            </div>
            <div className="p-6 max-h-[70vh] max-sm:max-h-none overflow-y-auto" id="checkup-scroll">
              <DailyCheckup
                userKey={userKey}
                profile={profile}
                currentDay={progress.currentDay}
                completedDays={progress.completedDays}
                dailyResults={progress.dailyResults}
                bilanDate={checkupDate ?? undefined}
                onSave={handleSaveCheckup}
                onClose={handleCloseCheckup}
                onRequestClose={requestCloseCheckup}
                onDirtyChange={setCheckupDirty}
                onUpdateProfile={updateProfile}
                onPlanNextDay={(tasks) => planNextDay({
                  date: toLocalDateKey(new Date(Date.now() + 24 * 60 * 60 * 1000)),
                  actions: tasks,
                  validated: true,
                  skippedActions: [],
                })}
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
            <div className="p-6 max-h-[70vh] max-sm:max-h-none overflow-y-auto" id="checkup-scroll">
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
