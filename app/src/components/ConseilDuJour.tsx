import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { getConseilForDay } from '@/data/conseils';

interface ConseilDuJourProps {
  day: number;
  isEs?: boolean;
}

// MOD-34 — Carte « Le conseil du jour » (pool de 15 conseils, src/data/conseils.ts).
// Distincte du défi (violet) et du témoignage (bleu) : ton ambre sobre.
export function ConseilDuJour({ day, isEs = false }: ConseilDuJourProps) {
  const conseil = getConseilForDay(day);

  return (
    <Card className="bg-amber-50 border-amber-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Lightbulb className="w-5 h-5 text-amber-600" />
          <p className="text-sm font-semibold text-amber-800">
            {isEs ? 'El consejo del día' : 'Le conseil du jour'}
          </p>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">💡 {conseil}</p>
      </CardContent>
    </Card>
  );
}
