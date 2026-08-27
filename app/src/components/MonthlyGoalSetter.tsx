import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { UserProfile, MonthlyGoal } from '@/types/profile';
import { calculateTargetsFromCA6Months } from '@/types/profile';
import { formatEuro } from '@/lib/utils';
import { TrendingUp, Phone, DoorOpen, Calendar, Sparkles, X } from 'lucide-react';

interface MonthlyGoalSetterProps {
  profile: UserProfile;
  onSave: (goal: MonthlyGoal) => void;
  onCancel: () => void;
}

export function MonthlyGoalSetter({ profile, onSave, onCancel }: MonthlyGoalSetterProps) {
  const [caTarget, setCaTarget] = useState(profile.currentMonthGoal.caTarget);
  const isEs = profile.language === 'es';
  const COMMISSION = 5;

  const monthNames = isEs
    ? ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']
    : ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const currentMonth = new Date().getMonth();
  const monthLabel = monthNames[currentMonth];

  const targets = calculateTargetsFromCA6Months(profile.ca6MonthsTarget, COMMISSION, profile.averagePrice, profile.expérienceLevel, profile.currentMonthGoal.month);

  const handleSave = () => {
    const goal: MonthlyGoal = {
      month: profile.currentMonthGoal.month + 1,
      caTarget,
      commissionsPct: COMMISSION,
      averagePrice: profile.averagePrice,
      conversionRate: 2.5,
      ...targets,
    };
    onSave(goal);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">{isEs ? `Objetivos de ${monthLabel}` : `Objectifs de ${monthLabel}`}</h2>
              <p className="text-red-100 text-sm">{isEs ? 'Ajustar mi rumbo: los objetivos son siempre por día' : 'Ajuster mon cap — les objectifs sont toujours par jour'}</p>
            </div>
            <button onClick={onCancel} className="text-white/80 hover:text-white"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-blue-700">
                <strong>{isEs ? 'Mi objetivo de facturación:' : 'Mon CA visé :'}</strong> {formatEuro(profile.ca6MonthsTarget)}<br />
                {isEs ? `Comisión fija: ${COMMISSION}% · Precio medio: ${formatEuro(profile.averagePrice)}` : `Commission fixe : ${COMMISSION}% · Prix moyen : ${formatEuro(profile.averagePrice)}`}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-red-500" /> {isEs ? `Facturación ajustada para ${monthLabel} (€)` : `CA ajusté pour ${monthLabel} (€)`}</Label>
                <span className="text-lg font-bold text-red-600">{formatEuro(caTarget)}</span>
              </div>
              <Slider value={[caTarget]} onValueChange={v => setCaTarget(v[0])} min={5000} max={100000} step={1000} />
            </div>

            {/* Objectifs PAR JOUR — jamais par mois */}
            <div className="bg-red-50 rounded-xl p-4 border border-red-200">
              <p className="text-xs text-red-600 font-medium uppercase tracking-wide mb-3">{isEs ? 'Mis objetivos HOY' : "Mes objectifs AUJOURD'HUI"}</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{Math.max(10, Math.ceil(targets.appelsTarget / 22))}</p>
                    <p className="text-xs text-gray-500">{isEs ? 'conversaciones/día' : 'conversations/jour'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <DoorOpen className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{Math.max(3, Math.ceil(targets.appelsTarget / 22 / 3))}</p>
                    <p className="text-xs text-gray-500">{isEs ? 'contactos presenciales/día' : 'contacts physiques/jour'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{Math.max(1, Math.ceil(targets.rdvR1Target / 22))}</p>
                    <p className="text-xs text-gray-500">{isEs ? 'R1/día' : 'R1/jour'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-xl font-bold text-gray-900">{Math.max(0, Math.ceil(targets.rdvR2Target / 22))}</p>
                    <p className="text-xs text-gray-500">{isEs ? 'R2/día' : 'R2/jour'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>{isEs ? 'Consejo de los mejores' : 'Conseil des meilleurs'}</strong><br />
                {isEs ? 'Aumente sus objetivos progresivamente. Un +10 a 20 % al mes es un ritmo sano y sostenible.' : 'Augmente progressivement tes objectifs. +10 à 20 % par mois est un rythme sain et durable.'}
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={onCancel} className="flex-1">{isEs ? 'Cancelar' : 'Annuler'}</Button>
              <Button onClick={handleSave} className="flex-1 bg-red-600 hover:bg-red-700">
                <Sparkles className="w-4 h-4 mr-2" /> {isEs ? 'Guardar' : 'Enregistrer'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
