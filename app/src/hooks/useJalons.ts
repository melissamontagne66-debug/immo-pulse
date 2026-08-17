import { useEffect, useMemo, useRef, useState } from 'react';
import type { UserProgress } from '@/types';
import type { Sale } from '@/hooks/useSales';
import { getJalons, getJalonsCelebres, markJalonsCelebres, type Jalon } from '@/lib/jalons';

// ============================================
// MOD-31 — Détection + célébration des jalons de carrière.
// Renvoie la liste complète (page « Mon parcours ») et le jalon à célébrer
// en plein écran (Celebration dans App.tsx) à sa PREMIÈRE occurrence.
// Les jalons déjà célébrés sont persistés dans localStorage
// `iad-coach-milestones-{email}` (sync cloud prévue plus tard).
// ============================================

export interface JalonCelebration {
  titre: string;
  sub?: string;
}

export function useJalons(progress: UserProgress, sales: Sale[], email?: string) {
  const jalons = useMemo(() => getJalons(progress, sales), [progress, sales]);
  const [newJalon, setNewJalon] = useState<JalonCelebration | null>(null);
  // Garde anti double-effet (StrictMode) : ensemble d'ids déjà traité.
  const handledRef = useRef<string>('');

  useEffect(() => {
    const atteints = jalons.filter(j => j.atteint);
    const key = atteints.map(j => j.id).join(',');
    if (key === handledRef.current) return;
    handledRef.current = key;

    const celebres = getJalonsCelebres(email);
    if (celebres === null) {
      // Première exécution de la fonctionnalité : les jalons déjà atteints
      // sont marqués comme vus, SANS célébration rétroactive (sinon un
      // compte existant déclencherait 10 célébrations d'un coup).
      markJalonsCelebres(atteints.map(j => j.id), email);
      return;
    }

    const nouveaux = atteints.filter(j => !celebres.includes(j.id));
    if (nouveaux.length === 0) return;
    markJalonsCelebres(nouveaux.map(j => j.id), email);
    const autres = nouveaux.slice(1).map(j => j.titre);
    const celebration: JalonCelebration = { titre: nouveaux[0].titre };
    if (autres.length > 0) celebration.sub = `Et aussi : ${autres.join(' · ')}`;
    // Différé d'un tick : pas de setState synchrone dans l'effet (rendu en
    // cascade) — la Celebration s'affiche juste après le rendu courant.
    const t = setTimeout(() => setNewJalon(celebration), 0);
    return () => clearTimeout(t);
  }, [jalons, email]);

  return { jalons, newJalon, dismissJalon: () => setNewJalon(null) };
}

export type { Jalon };
