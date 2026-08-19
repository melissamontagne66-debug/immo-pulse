import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, Trophy, CheckCircle2 } from 'lucide-react';
import type { Defi } from '@/data/defis';

interface DefiCardProps {
  defi: Defi;
  isEs?: boolean;
  /** true si le défi a été coché comme fait dans « Aujourd'hui » (lien bidirectionnel). */
  done?: boolean;
}

// MOD-23 — Carte « Défi du jour » (une seule dans l'app, sur le dashboard).
// Action principale en 3 lignes max ; le script complet est replié dans un
// accordéon « Voir le script » (sans animation → respecte prefers-reduced-motion).
export function DefiCard({ defi, isEs = false, done = false }: DefiCardProps) {
  const [showScript, setShowScript] = useState(false);

  return (
    <Card className={`bg-gradient-to-r from-pink-50 to-violet-50 border-violet-200 ${done ? 'ring-2 ring-green-300' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <Trophy className="w-5 h-5 text-violet-600" />
          <p className="text-sm font-semibold text-violet-800">
            {isEs ? 'Reto del día' : 'Défi du jour'} : {defi.titre}
          </p>
          {done && (
            <span className="ml-auto flex items-center gap-1 text-xs font-semibold text-green-600">
              <CheckCircle2 className="w-4 h-4" />
              {isEs ? '¡Hecho!' : 'Fait !'}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{defi.description}</p>
        <p className="text-xs font-medium text-violet-700 mt-1">{defi.objectif}</p>
        <button
          onClick={() => setShowScript(prev => !prev)}
          className="mt-2 flex items-center gap-1.5 text-xs font-medium text-violet-700 hover:text-violet-900 transition-colors"
        >
          {isEs ? 'Ver el guion' : 'Voir le script'}
          {showScript ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
        {showScript && (
          <div className="mt-2 bg-white/70 rounded-lg p-3 border border-violet-200">
            <p className="text-xs text-gray-600 italic leading-relaxed whitespace-pre-line">{defi.script}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
