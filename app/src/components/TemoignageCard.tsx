import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, ChevronUp, MessageCircle } from 'lucide-react';
import type { Temoignage } from '@/data/temoignages';
import { testimonialsMode } from '@/config';
import { plural } from '@/lib/goals';

interface TemoignageCardProps {
  temoignage: Temoignage | null;
  isEs?: boolean;
}

// MOD-24 / MOD-25 — Carte « Ils sont passés par là » (1 témoignage/jour, repliable).
// En mode 'cadre', la mention légale « Parcours type » est affichée (MOD-25).
export function TemoignageCard({ temoignage, isEs = false }: TemoignageCardProps) {
  const [open, setOpen] = useState(true);
  if (!temoignage) return null;

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <button
          onClick={() => setOpen(prev => !prev)}
          className="w-full flex items-center justify-between gap-2 text-left"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-semibold text-blue-800">
              {isEs ? 'Ellos pasaron por aquí' : 'Ils sont passés par là'}
            </p>
          </div>
          {open ? <ChevronUp className="w-4 h-4 text-blue-500" /> : <ChevronDown className="w-4 h-4 text-blue-500" />}
        </button>
        {open && (
          <div className="mt-2">
            <p className="text-xs font-medium text-blue-700 mb-1">
              {temoignage.prenom}, {temoignage.ville} — {isEs
                ? `primer mandato firmado en ${plural(temoignage.delaiPremierMandatJours, 'día')}`
                : `premier mandat signé en ${plural(temoignage.delaiPremierMandatJours, 'jour')}`}
            </p>
            <p className="text-sm text-gray-700 leading-relaxed italic">« {temoignage.histoire} »</p>
            {testimonialsMode === 'cadre' && (
              <p className="text-xs text-gray-400 mt-2">
                {isEs
                  ? 'Recorrido tipo — situación inspirada en recorridos reales de agentes, nombre modificado.'
                  : 'Parcours type — situation inspirée de parcours réels de mandataires, prénom modifié.'}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
