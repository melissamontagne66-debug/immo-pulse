import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { NextDayPlan } from '@/types';
import { onboardingPlan } from '@/data/onboardingPlan';
import { toLocalDateKey } from '@/lib/utils';
import { Sun, Check, AlertTriangle, ChevronRight } from 'lucide-react';

interface NextDayPlannerProps {
  currentDay: number;
  onPlan: (plan: NextDayPlan) => void;
  onSkip: () => void;
}

interface SkippedAction {
  actionId: string;
  reason: 'blocage' | 'difficulté' | 'report' | 'autre';
  detail: string;
  reportDate: string;
}

// Clé locale du lendemain (YYYY-MM-DD) — pas toISOString() (UTC) : entre
// 00h et 02h locales, le plan « de demain » serait daté d'aujourd'hui.
function tomorrowDateKey(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toLocalDateKey(d);
}

// Langue lue depuis la session (iad-coach-session) puis le profil local
// (iad-coach-profile-{email}) — le composant ne reçoit pas le profil en props.
function readIsEs(): boolean {
  try {
    const sessionRaw = localStorage.getItem('iad-coach-session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const email = session?.email;
    if (!email) return false;
    const profileRaw = localStorage.getItem(`iad-coach-profile-${email}`);
    const profile = profileRaw ? JSON.parse(profileRaw) : null;
    return profile?.language === 'es';
  } catch {
    return false;
  }
}

export function NextDayPlanner({ currentDay, onPlan, onSkip }: NextDayPlannerProps) {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [skippedActions, setSkippedActions] = useState<SkippedAction[]>([]);
  const [showAntiProcrastine, setShowAntiProcrastine] = useState(false);
  const [validated, setValidated] = useState(false);
  const [currentSkipAction, setCurrentSkipAction] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState<SkippedAction['reason']>('blocage');
  const [skipDetail, setSkipDetail] = useState('');

  const isEs = readIsEs();

  // Récupérer les actions du jour suivant
  let foundNextDay = false;
  let nextDayActions: { id: string; title: string; description: string; category: string }[] = [];
  const nextDay = currentDay + 1;

  for (const month of onboardingPlan) {
    for (const week of month.weeks) {
      const dayActions = week.days.filter(d => d.day === nextDay);
      if (dayActions.length > 0) {
        nextDayActions = dayActions.map(d => ({ id: d.id, title: d.title, description: d.description, category: d.category }));
        foundNextDay = true;
        break;
      }
    }
    if (foundNextDay) break;
  }

  const toggleAction = (id: string) => {
    setSelectedActions(prêv =>
      prêv.includes(id) ? prêv.filter(a => a !== id) : [...prêv, id]
    );
  };

  const handleSkipAction = (actionId: string) => {
    setCurrentSkipAction(actionId);
    setSkipReason('blocage');
    setSkipDetail('');
  };

  const confirmSkip = () => {
    if (!currentSkipAction) return;
    setSkippedActions(prêv => [...prêv, {
      actionId: currentSkipAction,
      reason: skipReason,
      detail: skipDetail,
      reportDate: skipReason === 'report' ? tomorrowDateKey() : '',
    }]);
    setCurrentSkipAction(null);
  };

  const handleValidate = () => {
    const unselected = nextDayActions.filter(a => !selectedActions.includes(a.id));
    if (unselected.length > 0 && !showAntiProcrastine) {
      setShowAntiProcrastine(true);
      return;
    }
    const plan: NextDayPlan = {
      date: tomorrowDateKey(),
      actions: selectedActions,
      validated: true,
      skippedActions: skippedActions.map(s => ({
        actionId: s.actionId,
        reason: s.reason,
        detail: s.detail,
        reportDate: s.reportDate,
      })),
    };
    setValidated(true);
    onPlan(plan);
  };

  const reasonLabels: Record<string, string> = {
    blocage: isEs ? 'Un bloqueo me impide avanzar' : 'Un blocage m\'empêche d\'avancer',
    difficulté: isEs ? 'Es demasiado difícil para mi nivel actual' : 'C\'est trop difficile pour mon niveau actuel',
    report: isEs ? 'Prefiero posponerlo para más tarde' : 'Je préfère reporter à plus tard',
    autre: isEs ? 'Otra razón' : 'Autre raison',
  };

  if (validated) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{isEs ? '¡Plan de mañana guardado!' : 'Plan de demain enregistré !'}</h3>
        <p className="text-gray-500">{isEs ? `Ha seleccionado ${selectedActions.length} acción(es) para mañana. ¡Mucho ánimo!` : `Tu as sélectionné ${selectedActions.length} action(s) pour demain. Bon courage !`}</p>
        {skippedActions.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 max-w-md mx-auto text-left">
            <p className="text-sm font-semibold text-amber-800 mb-2">{isEs ? 'Acciones pospuestas:' : 'Actions reportées :'}</p>
            {skippedActions.map((s, i) => (
              <p key={i} className="text-sm text-amber-700">
                • {nextDayActions.find(a => a.id === s.actionId)?.title} — {reasonLabels[s.reason]}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
          <Sun className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">{isEs ? 'Planifique el día de mañana' : 'Planifie ton lendemain'}</h3>
          <p className="text-sm text-gray-500">{isEs ? `Seleccione las acciones que desea realizar mañana (Día ${nextDay})` : `Sélectionne les actions que tu veux réaliser demain (Jour ${nextDay})`}</p>
        </div>
      </div>

      {nextDayActions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">{isEs ? `No hay ninguna acción prevista para el día ${nextDay}.` : `Aucune action prévue pour le jour ${nextDay}.`}</p>
            <Button onClick={onSkip} variant="outline" className="mt-4">{isEs ? 'Cerrar' : 'Fermer'}</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {nextDayActions.map(action => {
              const isSelected = selectedActions.includes(action.id);
              const isSkipped = skippedActions.some(s => s.actionId === action.id);

              return (
                <Card
                  key={action.id}
                  className={`transition-all duration-200 ${
                    isSelected ? 'border-green-300 bg-green-50/50' : isSkipped ? 'border-amber-300 bg-amber-50/30 opacity-60' : 'border-gray-200'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => !isSkipped && toggleAction(action.id)}
                        className="mt-0.5 flex-shrink-0"
                        disabled={isSkipped}
                      >
                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        ) : isSkipped ? (
                          <AlertTriangle className="w-6 h-6 text-amber-500" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-gray-400" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium text-sm ${isSelected ? 'text-green-800' : isSkipped ? 'text-amber-700 line-through' : 'text-gray-900'}`}>
                          {action.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
                        {isSkipped && (
                          <p className="text-xs text-amber-600 mt-1">
                            {reasonLabels[skippedActions.find(s => s.actionId === action.id)?.reason || 'autre']}
                            {skippedActions.find(s => s.actionId === action.id)?.detail ? ` — ${skippedActions.find(s => s.actionId === action.id)?.detail}` : ''}
                          </p>
                        )}
                      </div>

                      {!isSelected && !isSkipped && (
                        <button
                          onClick={() => handleSkipAction(action.id)}
                          className="text-xs text-gray-400 hover:text-amber-600 px-2 py-1 rounded hover:bg-amber-50 transition-colors"
                        >
                          {isEs ? 'Posponer' : 'Reporter'}
                        </button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Anti-procrastination message */}
          {showAntiProcrastine && skippedActions.length === 0 && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-red-800">{isEs ? 'No ha seleccionado todas las acciones' : 'Tu n\'as pas sélectionné toutes les actions'}</p>
                    <p className="text-sm text-red-700 mt-1">
                      {isEs
                        ? 'Es normal si algunas acciones no le parecen prioritarias. Pero para las que no va a hacer: ¿se trata de un bloqueo, de una dificultad, o simplemente prefiere posponerlas? Esto me ayuda a aconsejarle.'
                        : 'C\'est normal si certaines actions ne te semblent pas prioritaires. Mais pour celles que tu ne fais pas : est-ce un blocage, une difficulté, ou tu préfères juste reporter ? Cela m\'aide à te conseiller.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3 pt-2">
            {skippedActions.length > 0 && (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <p className="text-xs text-amber-700">
                  {isEs
                    ? `💡 Ha pospuesto ${skippedActions.length} ${skippedActions.length > 1 ? 'acciones' : 'acción'}. No dude en hablarlo con la persona con la que colabora (padrino, mentor, socio) para desbloquear la situación.`
                    : `💡 Tu as reporté ${skippedActions.length} ${skippedActions.length > 1 ? 'actions' : 'action'}. N'hésite pas à en parler avec la personne avec qui tu collabores (parrain, mentor, partenaire) pour débloquer la situation.`}
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onSkip} className="flex-1">
                {isEs ? 'Posponer' : 'Reporter'}
              </Button>
              <Button
                onClick={handleValidate}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={selectedActions.length === 0 && skippedActions.length === 0}
              >
                <ChevronRight className="w-4 h-4 mr-1" />
                {isEs ? 'Validar mi plan' : 'Valider mon plan'}
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Dialog for skip reason */}
      <Dialog open={!!currentSkipAction} onOpenChange={() => setCurrentSkipAction(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              {isEs ? '¿Por qué no va a hacer esta acción?' : 'Pourquoi tu ne fais pas cette action ?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {isEs ? 'Acción' : 'Action'} : <strong>{nextDayActions.find(a => a.id === currentSkipAction)?.title}</strong>
            </p>
            <div className="space-y-2">
              {(['blocage', 'difficulté', 'report', 'autre'] as const).map(reason => (
                <button
                  key={reason}
                  onClick={() => setSkipReason(reason)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    skipReason === reason
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-600'
                  }`}
                >
                  <p className="text-sm font-medium">{reasonLabels[reason]}</p>
                </button>
              ))}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-2">{isEs ? 'Detalle (opcional)' : 'Détail (optionnel)'}</p>
              <Textarea
                value={skipDetail}
                onChange={e => setSkipDetail(e.target.value)}
                placeholder={isEs ? 'Explique su bloqueo si lo desea...' : 'Explique ton blocage si tu veux...'}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentSkipAction(null)} className="flex-1">
                {isEs ? 'Cancelar' : 'Annuler'}
              </Button>
              <Button onClick={confirmSkip} className="flex-1 bg-red-600 hover:bg-red-700">
                {isEs ? 'Confirmar' : 'Confirmer'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
