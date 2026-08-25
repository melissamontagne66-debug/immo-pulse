import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Minus, Plus, MoonStar, CalendarPlus } from 'lucide-react';
import { loadWeekendPending, saveWeekendPending, weekendQuoteOfDay } from '@/lib/weekend';

// ============================================
// Vue week-end de l'écran « Aujourd'hui » : aucune tâche n'est proposée
// (semaine = lundi → vendredi). Message repos/discipline + compteurs
// optionnels R1 / R2 / visites reportés au bilan de lundi.
// ============================================

interface WeekendViewProps {
  userKey: string;
  isEs: boolean;
}

interface CounterRowProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  isEs: boolean;
}

function CounterRow({ label, value, onChange, isEs }: CounterRowProps) {
  return (
    <div className="flex items-center gap-2 bg-white/80 border border-indigo-200 rounded-full px-3 py-1.5">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value <= 0}
        aria-label={isEs ? `Quitar 1 ${label}` : `Retirer 1 ${label}`}
        className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="text-sm font-bold min-w-[1.5rem] text-center text-gray-900">{value}</span>
      <button
        onClick={() => onChange(value + 1)}
        aria-label={isEs ? `Añadir 1 ${label}` : `Ajouter 1 ${label}`}
        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

export function WeekendView({ userKey, isEs }: WeekendViewProps) {
  const [totals, setTotals] = useState(() => {
    const pending = loadWeekendPending(userKey);
    return {
      rdvR1Done: pending?.rdvR1Done ?? 0,
      rdvR2Done: pending?.rdvR2Done ?? 0,
      visitesDone: pending?.visitesDone ?? 0,
    };
  });

  const update = (field: keyof typeof totals, value: number) => {
    const next = { ...totals, [field]: value };
    setTotals(next);
    saveWeekendPending(userKey, next);
  };

  const hasReport = totals.rdvR1Done + totals.rdvR2Done + totals.visitesDone > 0;

  return (
    <div className="space-y-4">
      {/* Message repos / discipline */}
      <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <MoonStar className="w-5 h-5 text-indigo-600" />
            <p className="text-base font-bold text-indigo-900">
              {isEs ? 'Es el fin de semana 🌿' : 'C\'est le week-end 🌿'}
            </p>
          </div>
          <p className="text-sm text-indigo-800 leading-relaxed">
            {isEs
              ? 'Ninguna tarea hoy: tu semana va del lunes al viernes. El éxito pasa por la disciplina — y el descanso también forma parte del rendimiento.'
              : 'Aucune tâche aujourd\'hui : ta semaine court du lundi au vendredi. Le succès passe par la discipline — et le repos fait aussi partie de la performance.'}
          </p>
          <p className="text-sm text-indigo-600 italic mt-3 border-l-2 border-indigo-300 pl-3">
            « {weekendQuoteOfDay(isEs)} »
          </p>
          <p className="text-xs text-indigo-500 mt-3">
            {isEs ? 'Nos vemos el lunes, en forma 💪' : 'À lundi, en forme 💪'}
          </p>
        </CardContent>
      </Card>

      {/* Report optionnel des RDV du week-end vers le bilan de lundi */}
      <Card className="border-2 border-indigo-100">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <CalendarPlus className="w-5 h-5 text-indigo-600" />
            <p className="text-sm font-semibold text-gray-900">
              {isEs ? '¿Has trabajado igualmente?' : 'Tu as quand même travaillé ?'}
            </p>
          </div>
          <p className="text-xs text-gray-500 mb-3">
            {isEs
              ? 'Anota tus R1, R2 o visitas del fin de semana: se sumarán automáticamente a tu balance del lunes.'
              : 'Note tes R1, R2 ou visites du week-end : ils seront ajoutés automatiquement à ton bilan de lundi.'}
          </p>
          <div className="flex flex-wrap gap-2">
            <CounterRow label="R1" value={totals.rdvR1Done} onChange={v => update('rdvR1Done', v)} isEs={isEs} />
            <CounterRow label="R2" value={totals.rdvR2Done} onChange={v => update('rdvR2Done', v)} isEs={isEs} />
            <CounterRow label={isEs ? 'Visitas' : 'Visites'} value={totals.visitesDone} onChange={v => update('visitesDone', v)} isEs={isEs} />
          </div>
          {hasReport && (
            <p className="text-xs text-indigo-600 mt-3">
              ✓ {isEs ? 'Se añadirá a tu balance del lunes' : 'Sera ajouté à ton bilan de lundi'}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
