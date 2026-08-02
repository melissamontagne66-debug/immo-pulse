import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { NextDayPlan } from '@/types';
import { onboardingPlan } from '@/data/onboardingPlan';
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

export function NextDayPlanner({ currentDay, onPlan, onSkip }: NextDayPlannerProps) {
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [skippedActions, setSkippedActions] = useState<SkippedAction[]>([]);
  const [showAntiProcrastine, setShowAntiProcrastine] = useState(false);
  const [validated, setValidated] = useState(false);
  const [currentSkipAction, setCurrentSkipAction] = useState<string | null>(null);
  const [skipReason, setSkipReason] = useState<SkippedAction['reason']>('blocage');
  const [skipDetail, setSkipDetail] = useState('');

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
      reportDate: skipReason === 'report' ? new Date(Date.now() + 86400000).toISOString().split('T')[0] : '',
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
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
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
    blocage: 'Un blocage m\'empêche d\'avancer',
    difficulté: 'C\'est trop difficile pour mon niveau actuel',
    report: 'Je préfère reporter à plus tard',
    autre: 'Autre raison',
  };

  if (validated) {
    return (
      <div className="text-center space-y-4 py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Plan de demain enregistré !</h3>
        <p className="text-gray-500">Tu as sélectionné {selectedActions.length} action(s) pour demain. Bon courage !</p>
        {skippedActions.length > 0 && (
          <div className="bg-amber-50 rounded-xl p-4 max-w-md mx-auto text-left">
            <p className="text-sm font-semibold text-amber-800 mb-2">Actions reportées :</p>
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
          <h3 className="text-lg font-bold text-gray-900">Planifie ton lendemain</h3>
          <p className="text-sm text-gray-500">Sélectionne les actions que tu veux réaliser demain (Jour {nextDay})</p>
        </div>
      </div>

      {nextDayActions.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">Aucune action prévue pour le jour {nextDay}.</p>
            <Button onClick={onSkip} variant="outline" className="mt-4">Fermer</Button>
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
                          Reporter
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
                    <p className="text-sm font-semibold text-red-800">Tu n'as pas sélectionné toutes les actions</p>
                    <p className="text-sm text-red-700 mt-1">
                      C'est normal si certaines actions ne te semblent pas prioritaires. Mais pour celles que tu ne fais pas :
                      est-ce un blocage, une difficulté, ou tu préfères juste reporter ? Cela m'aide à te conseiller.
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
                  💡 Tu as reporté {skippedActions.length} action(s). N'hésite pas à en parler avec la personne avec qui tu collaborer (parrain, mentor, partenaire) pour débloquér la situation.
                </p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onSkip} className="flex-1">
                Reporter
              </Button>
              <Button
                onClick={handleValidate}
                className="flex-1 bg-red-600 hover:bg-red-700"
                disabled={selectedActions.length === 0 && skippedActions.length === 0}
              >
                <ChevronRight className="w-4 h-4 mr-1" />
                Valider mon plan
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
              Pourquoi tu ne fais pas cette action ?
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Action : <strong>{nextDayActions.find(a => a.id === currentSkipAction)?.title}</strong>
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
              <p className="text-sm text-gray-500 mb-2">Détail (optionnel)</p>
              <Textarea
                value={skipDetail}
                onChange={e => setSkipDetail(e.target.value)}
                placeholder="Explique ton blocage si tu veux..."
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setCurrentSkipAction(null)} className="flex-1">
                Annuler
              </Button>
              <Button onClick={confirmSkip} className="flex-1 bg-red-600 hover:bg-red-700">
                Confirmer
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
