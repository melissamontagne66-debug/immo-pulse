import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

// Info-bulle ⓘ expliquant R1 / R2 à la première occurrence (dashboard,
// récap onboarding). Tooltip contrôlé : le tap mobile toggle l'ouverture
// (le survol desktop passe par onOpenChange).
const TEXTS = {
  r1: {
    fr: "R1 = rendez-vous de découverte chez le vendeur. Objectif : comprendre son projet, visiter le bien, créer la relation. On ne donne JAMAIS de prix au R1.",
    es: 'R1 = cita de descubrimiento en casa del vendedor. Objetivo: comprender su proyecto, visitar el bien, crear la relación. NUNCA se da el precio en el R1.',
  },
  r2: {
    fr: "R2 = rendez-vous de signature. Objectif : présenter l'estimation et signer le mandat.",
    es: 'R2 = cita de firma. Objetivo: presentar la estimación y firmar el mandato.',
  },
};

export function RdvInfoTooltip({ type, isEs = false }: { type: 'r1' | 'r2'; isEs?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
          aria-label={isEs ? `¿Qué es un ${type.toUpperCase()} ?` : `C'est quoi un ${type.toUpperCase()} ?`}
          className="inline-flex align-middle text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-64 text-left leading-relaxed">
        {TEXTS[type][isEs ? 'es' : 'fr']}
      </TooltipContent>
    </Tooltip>
  );
}
