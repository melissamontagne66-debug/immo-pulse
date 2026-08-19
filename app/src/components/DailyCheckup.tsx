import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import type { DailyResults } from '@/types';
import type { UserProfile } from '@/types/profile';
import { useDailyCounters, useActionNotes, type CounterKey } from '@/hooks/useDailyCounters';
import { toLocalDateKey } from '@/lib/utils';
import { getDailyActionsForDay, getMonthsSinceStart, plural } from '@/lib/goals';
import { getDefiForDay } from '@/data/defis';
import { getTemoignageForUser } from '@/lib/temoignages';
import { TemoignageCard } from '@/components/TemoignageCard';
import { useRdv } from '@/hooks/useRdv';
import { ShareVictoryButtons } from '@/components/ShareVictoryButtons';
import {
  Phone, Users, Calendar, FileCheck, Home,
  TrendingUp, Clock, Star, Trophy, AlertTriangle,
  CalendarPlus, ArrowRight, PlayCircle, CheckCircle, XCircle,
  Database, ClipboardCheck, Lightbulb, ChevronDown, ChevronUp,
  HeartHandshake
} from 'lucide-react';

const CHECKUP_DRAFT_PREFIX = 'iad-coach-checkup-draft';

interface CheckupDraft {
  step: number;
  actionVerifications: Record<string, boolean | null>;
  hadVisitsToday: boolean | null;
  results: any;
  nextDayTasks: string[];
}

function getDraftKey(userKey: string, day: number) {
  return `${CHECKUP_DRAFT_PREFIX}-${userKey}-${day}`;
}

function loadDraft(userKey: string, day: number): CheckupDraft | null {
  try {
    const stored = localStorage.getItem(getDraftKey(userKey, day));
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function saveDraft(userKey: string, day: number, draft: CheckupDraft) {
  try {
    localStorage.setItem(getDraftKey(userKey, day), JSON.stringify(draft));
  } catch {
    // ignore
  }
}

function clearDraft(userKey: string, day: number) {
  try {
    localStorage.removeItem(getDraftKey(userKey, day));
  } catch {
    // ignore
  }
}

// Tracfin en attente — clé localStorage par utilisateur.
// Persiste tant que le conseiller n'a pas répondu (fait / annulé / n'aboutit pas).
function getTracfinKey(userKey: string) {
  return `iad-coach-tracfin-pending-${userKey}`;
}

function loadTracfinPending(userKey: string): { type: 'mandat' | 'offre'; since: string } | null {
  try {
    const raw = localStorage.getItem(getTracfinKey(userKey));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if ((parsed?.type === 'mandat' || parsed?.type === 'offre') && typeof parsed?.since === 'string') {
      return parsed;
    }
  } catch { /* ignore */ }
  return null;
}

function saveTracfinPending(userKey: string, pending: { type: 'mandat' | 'offre'; since: string }) {
  try {
    localStorage.setItem(getTracfinKey(userKey), JSON.stringify(pending));
  } catch { /* ignore */ }
}

interface DailyCheckupProps {
  userKey: string;
  profile: UserProfile;
  currentDay: number;
  completedDays: string[];
  dailyResults: DailyResults[];
  onSave: (results: DailyResults & { wins: string; challenges: string; mood: number; watchedNetworkVideosToday?: boolean; crmUpdated?: boolean }) => void;
  onClose?: () => void;
  onRequestClose?: () => void;
  onDirtyChange?: (dirty: boolean) => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  // MOD-35 — persiste les tâches reportées (affichées en tête de « Aujourd'hui » le lendemain)
  onPlanNextDay?: (tasks: string[]) => void;
}

// Liste des actions du jour à vérifier — source unique partagée avec l'écran
// « Aujourd'hui » : getDailyActionsForDay dans src/lib/goals.ts (MOD-19).

export function DailyCheckup({ userKey, profile, currentDay, completedDays, dailyResults, onSave, onClose, onRequestClose, onDirtyChange, onUpdateProfile, onPlanNextDay }: DailyCheckupProps) {
  const draft = useMemo(() => loadDraft(userKey, currentDay), [userKey, currentDay]);

  // Compteurs d'objectifs du jour (partagés avec Dashboard / Aujourd'hui)
  const { counters, hasData: countersUsed, setAll: setAllCounters } = useDailyCounters(userKey);
  // Notes de résultats saisies à la coche dans « Aujourd'hui »
  const { notes: actionNotes } = useActionNotes(userKey);

  const isEs = profile.language === 'es';
  const dailyActions = getDailyActionsForDay(currentDay, profile, dailyResults, isEs);

  // MOD-23/24 : défi de demain (teasing) + témoignage de clôture
  const defiDemain = getDefiForDay(currentDay + 1);
  const temoignage = useMemo(() => getTemoignageForUser(profile, { email: userKey }), [profile, userKey]);
  // Actions prévues demain — affichées en fin de bilan pour préparer la journée
  const actionsDemain = getDailyActionsForDay(currentDay + 1, profile, dailyResults, isEs);

  // Une action a un statut si elle est cochée dans « Aujourd'hui » ou si son
  // compteur du jour a été incrémenté (R1, R2, visites/retours).
  const actionCounterKey = (actionId: string): CounterKey | null => {
    if (actionId === `r1-jour-${currentDay}`) return 'r1';
    if (actionId === `r2-jour-${currentDay}`) return 'r2';
    if (actionId === `retours-jour-${currentDay}`) return 'visites';
    return null;
  };
  const actionHasStatus = (actionId: string): boolean => {
    if (completedDays.includes(actionId)) return true;
    const ck = actionCounterKey(actionId);
    return ck !== null && counters[ck] > 0;
  };

  // MOD-13 : si toutes les actions ont un statut et que les compteurs ont été
  // utilisés, on escamote la phase de vérification (le bilan s'ouvre sur le formulaire).
  const verificationComplete = countersUsed && dailyActions.every(a => actionHasStatus(a.id));

  // Step management: 0 = action verification, 1 = main checkup, 2 = post-checkup planning
  const [step, setStep] = useState<number>(() => draft?.step ?? (verificationComplete ? 1 : 0));
  const [verificationSkipped] = useState(() => !draft && verificationComplete);
  const [recapOpen, setRecapOpen] = useState(false);

  // Action verification state — la vérification porte sur la liste COMPLÈTE
  // des actions du jour (la même que l'écran « Aujourd'hui »).
  const [actionVerifications, setActionVerifications] = useState<Record<string, boolean | null>>(() => {
    // Pré-cochage : les actions déjà cochées dans « Aujourd'hui » sont pré-marquées Faite (modifiable)
    const preChecked: Record<string, boolean> = {};
    dailyActions.forEach(a => {
      if (completedDays.includes(a.id)) preChecked[a.id] = true;
      // Compteur incrémenté => considérée faite aussi (ex. R1 compté sans cochage)
      else if (actionHasStatus(a.id)) preChecked[a.id] = true;
    });
    // Le brouillon reprend la main, mais ses valeurs null (non répondu) n'écrasent pas le pré-cochage
    const fromDraft = { ...(draft?.actionVerifications ?? {}) };
    Object.keys(fromDraft).forEach(k => {
      if (fromDraft[k] == null) delete fromDraft[k];
    });
    return { ...preChecked, ...fromDraft };
  });
  
  // Special state for visit returns: ask if there were visits today
  const [hadVisitsToday, setHadVisitsToday] = useState<boolean | null>(() => draft?.hadVisitsToday ?? null);

  // Saisie en cours : devient vrai dès la première interaction utilisateur
  // (sert à la confirmation avant fermeture dans App.tsx)
  const [hasInteracted, setHasInteracted] = useState(false);

  // Main checkup results
  // Scroll en haut à chaque changement de step
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Notes du jour versées dans le champ « Notes » (concaténation « action : note »)
  const notesPrefill = dailyActions
    .filter(a => actionNotes[a.id])
    .map(a => `${a.label} : ${actionNotes[a.id]}`)
    .join('\n');

  const [results, setResults] = useState(() => draft?.results ?? {
    date: toLocalDateKey(new Date()),
    // Pré-remplissage depuis les compteurs du jour (modifiables — le bilan fait foi)
    callsMade: counters.conversations,
    contactsApproached: counters.contacts,
    rdvR1Fixed: 0,
    rdvR1Done: counters.r1,
    rdvR2Done: counters.r2,
    mandatsSigned: 0,
    visitesDone: counters.visites,
    offresWritten: 0,
    prospectionTime: '',
    comptesRendusFaits: undefined as boolean | undefined,
    notes: notesPrefill,
    wins: '',
    challenges: '',
    mood: 3,
    watchedNetworkVideosToday: false as boolean | null,
    crmUpdated: false as boolean | null,
    primoListeChecked: undefined as boolean | undefined,
    primoListeRestant: undefined as boolean | undefined,
    r1EstimationBloquee: undefined as boolean | undefined,
  });

  // Next day planning state
  const [nextDayTasks, setNextDayTasks] = useState<string[]>(() => draft?.nextDayTasks ?? []);

  // Mini-agenda (ajout direct du créneau tracfin / estimation depuis le bilan)
  const { addRdv } = useRdv(userKey);

  // Tracfin en attente : persiste tant que le conseiller n'a pas répondu
  // (fait, ou mandat annulé / offre n'aboutit pas).
  const [tracfinPending, setTracfinPending] = useState<{ type: 'mandat' | 'offre'; since: string } | null>(() => loadTracfinPending(userKey));
  const [tracfinRdvAjoute, setTracfinRdvAjoute] = useState(false);
  const clearTracfin = () => {
    try { localStorage.removeItem(getTracfinKey(userKey)); } catch { /* ignore */ }
    setTracfinPending(null);
  };

  // MOD-32 — saisie des coordonnées du parrain (demandées une seule fois, au step 2)
  const [parrainPrenom, setParrainPrenom] = useState('');
  const [parrainContact, setParrainContact] = useState('');

  // Persist draft while the user is filling the checkup
  useEffect(() => {
    saveDraft(userKey, currentDay, {
      step,
      actionVerifications,
      hadVisitsToday,
      results,
      nextDayTasks,
    });
  }, [userKey, currentDay, step, actionVerifications, hadVisitsToday, results, nextDayTasks]);

  // Check if we should ask about network vidéos (first 6 months + not yet watched)
  const monthsSinceStart = getMonthsSinceStart(profile.startDate);
  const shouldAskVideos = monthsSinceStart < 6 && !profile.watchedNetworkVideos;

  const update = (field: keyof typeof results, value: any) => {
    setHasInteracted(true);
    setResults((prev: typeof results) => ({ ...prev, [field]: value }));
  };

  // Marquer « Faite » / « Pas faite » pose un statut ; re-cliquer sur le statut
  // déjà actif bascule vers l'autre état (toggle, jamais de blocage).
  const verifyAction = (actionId: string, done: boolean) => {
    setHasInteracted(true);
    setActionVerifications(prev => ({ ...prev, [actionId]: prev[actionId] === done ? !done : done }));
  };

  // Compteur dérivé : statut non défini (undefined/null) = non répondu.
  // Tient compte du pré-cochage des actions déjà cochées dans « Aujourd'hui ».
  const actionsRestantes = dailyActions.filter(a => actionVerifications[a.id] == null).length;
  const allActionsVerified = actionsRestantes === 0;

  // Signale à App.tsx si une saisie est en cours (confirmation avant fermeture).
  // Au step 2 le bilan est enregistré : fermer ne perd plus rien.
  const isDirty = hasInteracted && step !== 2;
  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const handleProceedToCheckup = () => {
    // If user says action was done but wasn't checked, we could auto-check it here
    // For now, just proceed
    setStep(1);
  };

  const handleSave = () => {
    // If user confirms they watched all network vidéos, update profile
    if (results.watchedNetworkVideosToday === true && onUpdateProfile) {
      onUpdateProfile({ watchedNetworkVideos: true });
    }
    onSave(results as any);
    clearDraft(userKey, currentDay);

    // Le bilan validé fait foi : il réécrit les compteurs du jour (tuiles Dashboard / Aujourd'hui)
    setAllCounters({
      conversations: results.callsMade || 0,
      contacts: results.contactsApproached || 0,
      r1: results.rdvR1Done || 0,
      r2: results.rdvR2Done || 0,
      visites: results.visitesDone || 0,
    });

    // Prepare next day tasks based on what was reported
    const reportedTasks: string[] = [];
    dailyActions.forEach(a => {
      const isRetoursAction = a.id === `retours-jour-${currentDay}`;
      if (actionVerifications[a.id] === false) {
        // Retours de visite : reporter seulement si des visites ont eu lieu
        if (isRetoursAction) {
          if (hadVisitsToday === true) {
            reportedTasks.push(`[Reporté] ${a.label} — Tu as eu des visites sans faire les comptes rendus`);
          }
          // Si pas de visite, ne rien reporter (c'est normal)
        } else {
          reportedTasks.push(`[Reporté] ${a.label}`);
        }
      }
    });
    // Tracfin : dès qu'un mandat ou une offre est enregistré, la tâche est créée
    // pour demain ET persiste (redondance) tant que le conseiller n'a pas répondu
    // « fait » ou « mandat annulé / offre n'aboutit pas ».
    if (results.mandatsSigned > 0 || results.offresWritten > 0) {
      const pending = {
        type: (results.mandatsSigned > 0 ? 'mandat' : 'offre') as 'mandat' | 'offre',
        since: toLocalDateKey(new Date()),
      };
      saveTracfinPending(userKey, pending);
      setTracfinPending(pending);
      reportedTasks.push(`🔴 Faire le tracfin ${pending.type === 'mandat' ? 'du mandat' : 'de l\'offre'} (30 min)`);
      if (results.offresWritten > 0) {
        reportedTasks.push('🔴 Prévoir un créneau de visite pour demain (obligatoire)');
      }
    } else if (tracfinPending) {
      // Redondance : tracfin toujours en attente → reporté à demain
      reportedTasks.push(`🔴 Faire le tracfin ${tracfinPending.type === 'mandat' ? 'du mandat' : 'de l\'offre'} (en retard — 30 min)`);
    }
    // R1 fait mais créneau estimation non bloqué → tâche pour demain
    if (results.rdvR1Done > 0 && results.r1EstimationBloquee !== true) {
      reportedTasks.push('📅 Bloquer 1 à 2 h pour l\'analyse et le dossier d\'estimation (avis de valeur)');
    }
    setNextDayTasks(reportedTasks);
    // MOD-35 : les tâches reportées sont persistées pour réapparaître demain
    // en tête de l'écran « Aujourd'hui » (badge « Reporté d'hier »).
    onPlanNextDay?.(reportedTasks);
    setStep(2);
  };

  const prospectionOptions = [
    { id: 'matin', label: '11 h – 13 h 30', desc: 'Créneau du midi' },
    { id: 'soir', label: '17 h – 19 h', desc: 'Créneau du soir' },
    { id: 'les-deux', label: 'Les deux', desc: '11 h – 13 h 30 + 17 h – 19 h' },
    { id: 'autre', label: 'Autre horaire', desc: 'Terrain hors créneaux' },
  ];

  // Step 0: Action Verification — porte sur la liste complète des actions du jour
  if (step === 0) {
    const verifiedCount = dailyActions.length - actionsRestantes;
    return (
      <div className="space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Vérification des actions — Jour {currentDay}</strong>
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Avant de faire ton bilan, vérifions les actions du jour. Celles déjà cochées dans « Aujourd'hui » sont pré-marquées ✅ — tu peux modifier chaque réponse.
          </p>
          <p className="text-xs font-semibold text-amber-700 mt-2">
            {verifiedCount}/{dailyActions.length} {plural(verifiedCount, 'action vérifiée', 'actions vérifiées')}
          </p>
        </div>

        <div className="space-y-3">
          {dailyActions.map((action, idx) => {
            const status = actionVerifications[action.id] == null ? undefined : actionVerifications[action.id];
            const isRetoursAction = action.id === `retours-jour-${currentDay}`;
            
            // Special handling for visit returns
            if (isRetoursAction && status === undefined) {
              return (
                <Card key={action.id} className="border-2 border-pink-200 bg-pink-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{action.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{action.label}</p>
                        <p className="text-xs text-gray-500">Action {idx + 1} sur {dailyActions.length}</p>
                      </div>
                    </div>
                    
                    {hadVisitsToday === null ? (
                      <div className="mt-3">
                        <p className="text-sm text-gray-700 mb-2">As-tu eu des visites aujourd'hui ?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setHasInteracted(true);
                              setHadVisitsToday(true);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-pink-100"
                          >
                            Oui, j'ai eu des visites
                          </button>
                          <button
                            onClick={() => {
                              setHadVisitsToday(false);
                              verifyAction(action.id, false);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            Non, pas de visite
                          </button>
                        </div>
                      </div>
                    ) : hadVisitsToday === true ? (
                      <div className="mt-3">
                        <p className="text-sm text-pink-700 mb-2">
                          Il faut faire les comptes rendus de tes visites ! C'est essentiel pour tes RDV de suivi.
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => verifyAction(action.id, true)}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-pink-600 text-white hover:bg-pink-700"
                          >
                            ✅ C'est fait
                          </button>
                          <button
                            onClick={() => {
                              onClose?.();
                              setTimeout(() => {
                                window.dispatchEvent(new CustomEvent('navigate-to-tab', { detail: 'report' }));
                              }, 200);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-pink-600 text-white hover:bg-pink-700"
                          >
                            📝 Aller aux comptes rendus
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              );
            }
            
            return (
              <Card key={action.id} className={`border-2 ${status === true ? 'border-green-200 bg-green-50/50' : status === false ? 'border-orange-200 bg-orange-50/50' : 'border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{action.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{action.label}</p>
                      <p className="text-xs text-gray-500">Action {idx + 1} sur {dailyActions.length}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => verifyAction(action.id, true)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          status === true ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100'
                        }`}
                      >
                        ✅ Faite
                      </button>
                      <button
                        onClick={() => verifyAction(action.id, false)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          status === false ? 'bg-orange-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-orange-100'
                        }`}
                      >
                        ❌ Pas faite
                      </button>
                    </div>
                  </div>
                  {status === false && (
                    <p className="text-xs text-orange-700 mt-2 bg-orange-100 rounded-lg p-2">
                      {isRetoursAction 
                        ? "Pas de visite aujourd'hui ? Pas de souci : elle sera reportée en priorité demain." 
                        : "Pas de souci ! Cette action sera reportée en priorité demain."}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bouton de validation explicite, fixe en bas du modal (visible sans scroll) */}
        <div className="sticky bottom-0 -mx-1 px-1 pt-3 pb-1 bg-gradient-to-t from-white via-white to-transparent">
          <Button
            onClick={handleProceedToCheckup}
            disabled={!allActionsVerified}
            className="w-full bg-red-600 hover:bg-red-700 py-3 text-base disabled:opacity-50 shadow-lg"
          >
            <ArrowRight className="w-4 h-4 mr-2" />
            {allActionsVerified ? 'Continuer vers mon bilan →' : `Vérifie les ${plural(actionsRestantes, 'action restante', 'actions restantes')}`}
          </Button>
        </div>
      </div>
    );
  }

  // Step 1: Main Checkup Form
  if (step === 1) {
    return (
      <div className="space-y-6">
        {/* Header row with close button */}
        {onClose && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">Prends 3 minutes pour faire le point</p>
            <button onClick={onRequestClose ?? onClose} className="text-gray-400 hover:text-red-500 text-sm">✕ Fermer</button>
          </div>
        )}

        {/* Welcome message */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-amber-800">
            <strong>Bilan de ta journée — Jour {currentDay}</strong> — C'est ce que font les meilleurs chaque soir. Tes bilans et réponses sont enregistrés sur ton appareil et synchronisés sur ton compte.
          </p>
        </div>

        {/* Récapitulatif repliable — affiché quand la vérification a été escamotée
            (journée déjà saisie au fil de l'eau). Permet de corriger en rouvrant la vérification. */}
        {verificationSkipped && (
          <Card className="bg-gray-50 border-gray-200">
            <CardContent className="p-4">
              <button
                onClick={() => setRecapOpen(o => !o)}
                className="w-full flex items-center justify-between text-left"
              >
                <p className="text-sm font-semibold text-gray-800">Ta journée en un coup d'œil</p>
                {recapOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
              </button>
              {recapOpen && (
                <div className="mt-3 space-y-3">
                  <div className="space-y-1.5">
                    {dailyActions.map(a => {
                      const status = actionVerifications[a.id];
                      const note = actionNotes[a.id];
                      return (
                        <div key={a.id} className="flex items-start gap-2 text-xs">
                          <span>{status === true ? '✅' : status === false ? '❌' : '➖'}</span>
                          <div className="flex-1 min-w-0">
                            <span className="text-gray-700">{a.icon} {a.label}</span>
                            {note && <p className="text-gray-500 italic mt-0.5">{note}</p>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{plural(counters.conversations, 'conversation')}</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{plural(counters.contacts, 'contact')}</span>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{counters.r1} R1</span>
                    <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">{counters.r2} R2</span>
                    <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">{plural(counters.visites, 'visite')}</span>
                  </div>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs font-medium text-red-600 hover:text-red-700 underline"
                  >
                    Corriger la vérification des actions
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Offer alert - if offer written */}
        {results.offresWritten > 0 && (
          <Card className="bg-red-50 border-red-300 animate-pulse">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">Tu as une offre en cours !</p>
                  <p className="text-xs text-red-600 mt-1">
                    🔴 <strong>Action obligatoire :</strong> Prévoir immédiatement un créneau de visite sur ton planning pour demain. C'est obligatoire si tu veux être dans les règles. Le tracfin doit être fait aussi.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Network vidéos check — asked during first 6 months until user confirms "yes" */}
        {shouldAskVideos && (
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <PlayCircle className="w-4 h-4 text-purple-600" />
                <p className="text-sm font-semibold text-purple-800">As-tu vu toutes les vidéos du réseau ?</p>
              </div>
              <p className="text-xs text-purple-600 mb-3">
                Mois {monthsSinceStart + 1}/6 — Ces bases juridiques te donnent les clés pour rentrer tes premiers mandats en toute confiance.
              </p>
              <div className="flex gap-2">
                {[
                  { val: true, label: 'Oui, toutes', icon: CheckCircle },
                  { val: false, label: 'Pas encore', icon: XCircle },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => update('watchedNetworkVideosToday', opt.val)}
                    className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                      results.watchedNetworkVideosToday === opt.val
                        ? opt.val
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    <opt.icon className="w-4 h-4" />
                    {opt.label}
                  </button>
                ))}
              </div>
              {/* Message if vidéos not watched */}
              {results.watchedNetworkVideosToday === false && (
                <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Chaque petite étape compte !</strong> Ces vidéos te préparent à signer tes premiers mandats : regarde-les en priorité. Et avant toute signature, vérifie que tu as bien reçu ton attestation d'habilitation de la part de ton réseau (loi Hoguet) : sans elle, tu ne peux pas signer de mandat. C'est elle qui te protège, toi et tes clients. Tu es sur la bonne voie !
                  </p>
                </div>
              )}
              {results.watchedNetworkVideosToday === true && (
                <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
                  <p className="text-sm text-green-800">
                    Super ! Tu as les bases solides. On ne te demandera plus cette question demain.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Terrain hours */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <p className="text-sm font-semibold text-blue-800">Tes créneaux de terrain recommandés</p>
            </div>
            <p className="text-sm text-blue-700"><strong>11 h – 13 h 30</strong> et <strong>17 h – 19 h</strong>, chaque jour ouvré, au choix — Meilleurs taux de réponse.</p>
          </CardContent>
        </Card>

        {/* Terrain time */}
        <div>
          <Label className="text-sm font-semibold text-gray-900 mb-2 block">Quand es-tu allé au contact aujourd'hui ?</Label>
          <div className="grid grid-cols-2 gap-2">
            {prospectionOptions.map(opt => (
              <button key={opt.id} onClick={() => update('prospectionTime', opt.id)}
                className={`p-3 rounded-lg border text-left transition-all ${results.prospectionTime === opt.id ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-200 hover:border-gray-300 text-gray-600'}`}>
                <p className="text-sm font-medium">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Question CRM */}
        <Card className="bg-teal-50 border-teal-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Database className="w-4 h-4 text-teal-600" />
              <p className="text-sm font-semibold text-teal-800">As-tu mis à jour ton CRM aujourd'hui ?</p>
            </div>
            <p className="text-xs text-teal-600 mb-3">
              Relance tes contacts, notes tes nouveaux prospects, mets à jour tes suivis. L'argent est dans le fichier !
            </p>
            <div className="flex gap-2">
              {[
                { val: true, label: 'Oui', icon: CheckCircle },
                { val: false, label: 'Non', icon: XCircle },
              ].map(opt => (
                <button
                  key={String(opt.val)}
                  onClick={() => update('crmUpdated', opt.val)}
                  className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition-all ${
                    results.crmUpdated === opt.val
                      ? opt.val
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <opt.icon className="w-4 h-4" />
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Conversations & Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardContent className="p-4">
            <Label className="flex items-center gap-2 text-sm font-medium"><Phone className="w-4 h-4 text-blue-600" /> Conversations avec les habitants du secteur</Label>
            <Input type="number" min={0} value={results.callsMade || ''} onChange={e => update('callsMade', Number(e.target.value))} placeholder="0" className="mt-2 text-lg font-semibold" />
            <p className="text-xs text-gray-400 mt-1">Téléphone + terrain : chaque échange avec un habitant compte</p>
          </CardContent></Card>
          <Card><CardContent className="p-4">
            <Label className="flex items-center gap-2 text-sm font-medium"><Users className="w-4 h-4 text-green-600" /> Nouveaux contacts physiques</Label>
            <Input type="number" min={0} value={results.contactsApproached || ''} onChange={e => update('contactsApproached', Number(e.target.value))} placeholder="0" className="mt-2 text-lg font-semibold" />
            <p className="text-xs text-gray-400 mt-1">Portes toquées où tu as eu un échange avec l'habitant</p>
          </CardContent></Card>
        </div>

        {/* RDVs */}
        <Card><CardContent className="p-4">
          <Label className="flex items-center gap-2 text-sm font-medium mb-3"><Calendar className="w-4 h-4 text-purple-600" /> Rendez-vous</Label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { field: 'rdvR1Fixed' as const, label: 'R1 nouvellement fixés ce jour' },
              { field: 'rdvR1Done' as const, label: 'R1 faits aujourd\'hui' },
              { field: 'rdvR2Done' as const, label: 'R2 faits aujourd\'hui' },
            ].map(item => (
              <div key={item.field}>
                <Label className="text-xs text-gray-500">{item.label}</Label>
                <Input type="number" min={0} value={results[item.field] || ''} onChange={e => update(item.field, Number(e.target.value))} placeholder="0" />
              </div>
            ))}
          </div>
        </CardContent></Card>

        {/* Results */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { field: 'mandatsSigned' as const, label: 'Mandats', icon: FileCheck, color: 'text-purple-600' },
            { field: 'visitesDone' as const, label: 'Visites', icon: Home, color: 'text-teal-600' },
            { field: 'offresWritten' as const, label: 'Offres', icon: TrendingUp, color: 'text-orange-600' },

          ].map(item => (
            <Card key={item.field}><CardContent className="p-3">
              <Label className="text-xs flex items-center gap-1"><item.icon className={`w-3 h-3 ${item.color}`} /> {item.label}</Label>
              <Input type="number" min={0} value={results[item.field] || ''} onChange={e => update(item.field, Number(e.target.value))} placeholder="0" className="mt-1" />
            </CardContent></Card>
          ))}
        </div>

        {/* Avertissement légal — enregistrement d'un mandat */}
        {results.mandatsSigned > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <p className="text-sm text-amber-800">
              ⚖️ Avant de signer, vérifie que tu as reçu ton attestation d'habilitation (loi Hoguet) et que tu as vu les vidéos de formation du réseau. En cas de doute, parles-en à ton manager.
            </p>
          </div>
        )}

        {/* Question R1 → blocage du créneau estimation pour demain */}
        {results.rdvR1Done > 0 && (
          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-indigo-800 mb-2">
                📅 Tu as fait {plural(results.rdvR1Done, 'R1')} aujourd'hui — as-tu bloqué dès demain 1 à 2 h pour l'analyse et le dossier d'estimation ?
              </p>
              <p className="text-xs text-indigo-600 mb-3">
                Selon ta maîtrise de l'outil d'avis de valeur, prévois 1 h à 2 h. C'est ce qui transforme un R1 en mandat.
              </p>
              <div className="flex gap-2">
                {[
                  { val: true, label: 'Oui, c\'est bloqué' },
                  { val: false, label: 'Pas encore' },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => update('r1EstimationBloquee', opt.val)}
                    className={`flex-1 p-2 rounded-lg border text-sm font-medium transition-all ${
                      results.r1EstimationBloquee === opt.val
                        ? opt.val
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracfin — mandat ou offre : rappel + proposition d'ajout à l'agenda */}
        {(results.mandatsSigned > 0 || results.offresWritten > 0) && (
          <Card className="bg-red-50 border-red-300">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-red-800 mb-1">
                🔴 Tracfin obligatoire {results.mandatsSigned > 0 ? 'pour ton mandat' : 'pour ton offre'}
              </p>
              <p className="text-xs text-red-600 mb-3">
                Il sera ajouté à tes tâches de demain et te sera rappelé chaque jour tant qu'il n'est pas fait.
              </p>
              <button
                type="button"
                onClick={() => {
                  const demain = new Date();
                  demain.setDate(demain.getDate() + 1);
                  const dateKey = toLocalDateKey(demain);
                  addRdv({
                    titre: `Tracfin ${results.mandatsSigned > 0 ? 'du mandat' : 'de l\'offre'} (30 min)`,
                    dateHeure: `${dateKey}T09:00`,
                    lieu: '',
                  });
                  setTracfinRdvAjoute(true);
                }}
                disabled={tracfinRdvAjoute}
                className="px-3 py-2 bg-red-600 hover:bg-red-700 disabled:bg-green-600 text-white rounded-lg text-xs font-medium transition-colors"
              >
                {tracfinRdvAjoute ? '✓ Ajouté à ton agenda pour demain 9 h' : '📅 Ajouter 30 min à mon agenda demain'}
              </button>
            </CardContent>
          </Card>
        )}

        {/* Rappel tracfin en attente (jours précédents) */}
        {tracfinPending && results.mandatsSigned === 0 && results.offresWritten === 0 && (
          <Card className="bg-red-50 border-red-300">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-red-800 mb-1">
                🔴 Tracfin en attente depuis le {tracfinPending.since}
              </p>
              <p className="text-xs text-red-600 mb-3">
                As-tu fait le tracfin {tracfinPending.type === 'mandat' ? 'de ton mandat' : 'de ton offre'} ?
              </p>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => clearTracfin()}
                  className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium"
                >
                  ✓ Fait
                </button>
                <button
                  type="button"
                  onClick={() => clearTracfin()}
                  className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-xs font-medium"
                >
                  Mandat annulé / offre n'aboutit pas
                </button>
              </div>
              <p className="text-[11px] text-red-500 mt-2">
                Sans réponse, il sera reporté à demain.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Wins */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium"><Trophy className="w-4 h-4 text-yellow-500" /> Tes victoires du jour</Label>
          <Textarea value={results.wins} onChange={e => update('wins', e.target.value)} placeholder="Même les petites victoires comptent : un RDV fixé, un contact sympa, une technique maîtrisée..." className="mt-1" />
        </div>

        {/* Challenges */}
        <div>
          <Label className="flex items-center gap-2 text-sm font-medium"><AlertTriangle className="w-4 h-4 text-amber-500" /> Difficultés rencontrées</Label>
          <Textarea value={results.challenges} onChange={e => update('challenges', e.target.value)} placeholder="Qu'est-ce qui a été difficile ? Ça m'aide à te proposer les bonnes actions demain." className="mt-1" />
        </div>

        {/* Mood */}
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Humeur du jour</Label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} onClick={() => update('mood', n)}
                className={`p-2 rounded-lg transition-colors ${results.mood === n ? 'bg-red-100 text-red-700' : 'bg-gray-50 hover:bg-gray-100'}`}>
                <Star className={`w-5 h-5 ${results.mood === n ? 'fill-current' : ''}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <Label className="text-sm font-medium text-gray-700">Notes du jour (optionnel)</Label>
          <Textarea value={results.notes} onChange={e => update('notes', e.target.value)} placeholder="Ce qui a marché, ce qui n'a pas marché, tes réflexions..." className="mt-1" />
        </div>

        {/* Question primo liste — fin de chaque mois */}
        {currentDay > 0 && currentDay % 30 === 0 && !profile.primoListeCalled && (
          <Card className="bg-rose-50 border-rose-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-rose-600" />
                <p className="text-sm font-semibold text-rose-800">Bilan mensuel — Ta primo liste</p>
              </div>
              <p className="text-xs text-rose-600 mb-3">
                As-tu appelé tous les gens de ta primo liste ce mois-ci ? (amis, famille, connaissances de ton répertoire téléphone + réseaux sociaux)
              </p>
              <div className="flex gap-2">
                {[
                  { val: true, label: 'Oui, tous appelés' },
                  { val: false, label: 'Pas encore tous' },
                ].map(opt => (
                  <button
                    key={String(opt.val)}
                    onClick={() => {
                      if (opt.val && onUpdateProfile) {
                        onUpdateProfile({ primoListeCalled: true });
                      }
                      update('primoListeChecked', opt.val);
                    }}
                    className={`flex-1 p-2 rounded-lg border text-sm font-medium transition-all ${
                      results.primoListeChecked === opt.val
                        ? opt.val
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {results.primoListeChecked === true && (
                <p className="text-xs text-green-600 mt-2">
                  ✅ Parfait ! La primo liste ne te sera plus proposée au quotidien. Tu pourras te concentrer sur les autres actions.
                </p>
              )}
              {/* 2e niveau : si « Pas encore tous » → reste-t-il du monde à contacter ?
                  Si non → on arrête de la mettre au planning du jour. */}
              {results.primoListeChecked === false && (
                <div className="mt-3 pt-3 border-t border-rose-200">
                  <p className="text-xs text-rose-700 font-medium mb-2">
                    Est-ce qu'il reste du monde à contacter dans ta primo liste ?
                  </p>
                  <div className="flex gap-2">
                    {[
                      { val: true, label: 'Oui, il en reste' },
                      { val: false, label: 'Non, liste épuisée' },
                    ].map(opt => (
                      <button
                        key={String(opt.val)}
                        onClick={() => {
                          if (!opt.val && onUpdateProfile) {
                            // Liste épuisée → on ne la propose plus au planning du jour
                            onUpdateProfile({ primoListeCalled: true });
                          }
                          update('primoListeRestant', opt.val);
                        }}
                        className={`flex-1 p-2 rounded-lg border text-xs font-medium transition-all ${
                          results.primoListeRestant === opt.val
                            ? opt.val
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {results.primoListeRestant === false && (
                    <p className="text-xs text-green-600 mt-2">
                      ✅ Compris — la primo liste ne te sera plus proposée dans les actions du jour.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Save button */}
        <Button onClick={handleSave} className="w-full bg-red-600 hover:bg-red-700 py-3 text-base">
          <ArrowRight className="w-4 h-4 mr-2" /> Enregistrer mon bilan
        </Button>
      </div>
    );
  }

  // Step 2: Post-checkup planning (replaces "Planifier demain")
  if (step === 2) {
    return (
      <div className="space-y-6">
        <div className="text-center" id="checkup-step-2">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mt-3">Bilan enregistré !</h3>
          <p className="text-gray-500 text-sm mt-1">Passons à la planification de demain.</p>
          {/* MOD-23 : teasing du défi de demain */}
          <p className="text-sm text-gray-600 mt-2">
            {isEs ? `Mañana, tu reto: ${defiDemain.titre} 🚪` : `Demain, ton défi : ${defiDemain.titre} 🚪`}
          </p>
        </div>

        {/* MOD-24 : témoignage dans l'écran de clôture du bilan */}
        {temoignage && <TemoignageCard temoignage={temoignage} isEs={isEs} />}

        {/* MOD-32 : coordonnées du parrain — demandées UNE FOIS (optionnel),
            « Plus tard » est définitif (parrainAsked persiste le choix) */}
        {profile.hasMentor && !profile.parrain && !profile.parrainAsked && onUpdateProfile && (
          <Card className="bg-violet-50 border-violet-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="w-4 h-4 text-violet-600" />
                <p className="text-sm font-semibold text-violet-800">Partage tes victoires avec ton parrain</p>
              </div>
              <p className="text-xs text-violet-600 mb-3">
                Tu as indiqué avoir un parrain ou une personne qui t'accompagne. Laisse ses coordonnées pour lui envoyer tes victoires en un clic — c'est facultatif, et on ne te le redemandera plus.
              </p>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-violet-800">Son prénom</Label>
                  <Input
                    value={parrainPrenom}
                    onChange={e => setParrainPrenom(e.target.value)}
                    placeholder="Ex : Karim"
                    className="mt-1 bg-white"
                  />
                </div>
                <div>
                  <Label className="text-xs text-violet-800">Son email ou son téléphone</Label>
                  <Input
                    value={parrainContact}
                    onChange={e => setParrainContact(e.target.value)}
                    placeholder="Ex : karim@email.com ou 06 12 34 56 78"
                    className="mt-1 bg-white"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    size="sm"
                    disabled={!parrainPrenom.trim() || !parrainContact.trim()}
                    onClick={() => onUpdateProfile({ parrain: { prenom: parrainPrenom.trim(), contact: parrainContact.trim() } })}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-xs disabled:opacity-50"
                  >
                    Enregistrer
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateProfile({ parrainAsked: true })}
                    className="flex-1 text-xs"
                  >
                    Plus tard
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* MOD-32 : partage de la victoire du jour (parrain si déclaré, sinon destinataire libre) */}
        {results.wins.trim() && (
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <p className="text-sm font-semibold text-yellow-800">Ta victoire du jour</p>
              </div>
              <p className="text-sm text-gray-700 italic mb-3">« {results.wins.trim()} »</p>
              <ShareVictoryButtons victoire={results.wins} profile={profile} />
            </CardContent>
          </Card>
        )}

        {/* Offer alert */}
        {results.offresWritten > 0 && (
          <Card className="bg-red-50 border-red-300">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-red-800">🔴 Action obligatoire — Tu as une offre !</p>
                  <p className="text-xs text-red-600 mt-1">
                    Tu dois impérativement prévoir un créneau de visite sur ton planning pour demain. C'est obligatoire pour rester dans les règles. Pense aussi au tracfin.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* R1 done → prepare avis de valeur tomorrow */}
        {results.rdvR1Done > 0 && (
          <Card className="bg-indigo-50 border-indigo-300">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <CalendarPlus className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-indigo-800">📅 Tu as fait un R1 aujourd'hui — Bloque 1 à 2h demain</p>
                  <p className="text-xs text-indigo-600 mt-1">
                    Dans ton agenda, bloque 1 à 2h sur ton lendemain pour <strong>préparer l'avis de valeur</strong> et le rendre à temps. C'est la clé pour transformer ton R1 en mandat. Ne reporte pas cette étape !
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reported tasks */}
        {nextDayTasks.length > 0 && (
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-orange-800 mb-2">📋 Tâches reportées pour demain</p>
              <div className="space-y-2">
                {nextDayTasks.map((task, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <ClipboardCheck className="w-4 h-4 text-orange-600" />
                    <p className="text-sm text-orange-700">{task}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Planning help — actions prévues pour demain */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <p className="text-sm font-semibold text-blue-800">Prépare ta journée de demain — Jour {currentDay + 1}</p>
            </div>
            <p className="text-sm text-blue-700 mb-3">
              Regarde les actions prévues pour demain et finis d'organiser ton planning maintenant, pendant que ta journée est encore fraîche en tête.
            </p>
            <p className="text-xs font-semibold text-blue-800 mb-1.5">📋 Prévu demain :</p>
            <div className="space-y-1.5">
              {actionsDemain.map(a => (
                <div key={a.id} className="flex items-center gap-2 text-sm text-blue-700">
                  <span>{a.icon}</span>
                  <span>{a.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-white/60 rounded-lg p-3 border border-blue-200">
              <p className="text-xs text-blue-600">
                💡 <strong>Conseil :</strong> Les meilleurs planifient leur lendemain le soir même. Note tes RDV et tes 3 priorités dans ton agenda.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Agenda reminder */}
        <Card className="bg-amber-50 border-amber-200 max-w-sm mx-auto">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CalendarPlus className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-800">Note dans ton agenda</p>
                <p className="text-sm text-amber-700 mt-1">
                  Pour ne rien oublier demain, note tes engagements dans ton agenda maintenant.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
            ← Modifier le bilan
          </Button>
          <Button onClick={onClose} className="flex-1 bg-red-600 hover:bg-red-700">
            <CheckCircle className="w-4 h-4 mr-2" /> C'est bon, je continue
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
