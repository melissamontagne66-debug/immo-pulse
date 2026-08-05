import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { VisitReport, VisitStats, VisitStatus } from '@/types';

const STORAGE_PREFIX = 'immo-pulse-visits';

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}-${userKey}`;
}

function loadVisits(userKey: string): VisitReport[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveVisits(userKey: string, visits: VisitReport[]) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(visits));
}

function extractObjections(visits: VisitReport[]): { objection: string; count: number }[] {
  const keywords: Record<string, string[]> = {
    'Prix trop élevé': ['cher', 'trop cher', 'prix', 'expensive', 'budget', 'trop haut', 'élevé'],
    'Travaux nécessaires': ['travaux', 'rénovation', 'vieux', 'à rafraîchir', 'refaire', 'cuisine', 'salle de bain', 'électricité', 'plomberie'],
    'Pas assez grand': ['petit', 'étroit', 'surface', 'm²', 'chambre', 'manque de place', 'pas assez'],
    'Emplacement': ['bruyant', 'transports', 'école', 'commerces', 'loin', 'isolation', 'calme', 'vue'],
    'Pas de parking': ['parking', 'garage', 'stationner', 'voiture'],
    'Charges trop élevées': ['charges', 'copropriété', 'syndic'],
    'Besoin d\'extérieur': ['jardin', 'terrasse', 'balcon', 'extérieur', 'verdure'],
  };

  const counts: Record<string, number> = {};
  visits.forEach(v => {
    const text = `${v.rawFeedback || ''} ${v.priceFeedback || ''} ${v.locationFeedback || ''} ${v.workFeedback || ''} ${v.generalFeedback || ''}`.toLowerCase();
    for (const [label, words] of Object.entries(keywords)) {
      for (const word of words) {
        if (text.includes(word)) {
          counts[label] = (counts[label] || 0) + 1;
          break;
        }
      }
    }
  });

  return Object.entries(counts)
    .map(([objection, count]) => ({ objection, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export function useVisits(userKey: string) {
  const [visits, setVisits] = useState<VisitReport[]>(() => loadVisits(userKey));
  const loadedKey = useRef(userKey);

  // React to userKey changes
  useEffect(() => {
    if (userKey !== loadedKey.current) {
      loadedKey.current = userKey;
      const stored = loadVisits(userKey);
      setVisits(stored);
    }
  }, [userKey]);

  // Inject cloud data (called from App.tsx after apiSyncLoad)
  const loadFromCloud = useCallback((cloudVisits: any[] | null) => {
    if (!cloudVisits || cloudVisits.length === 0) return;
    setVisits(prev => {
      // Merge: cloud visits + local visits not in cloud (by id)
      const cloudIds = new Set(cloudVisits.map((v: any) => v.id));
      const localOnly = prev.filter(v => !cloudIds.has(v.id));
      const merged = [...cloudVisits, ...localOnly] as VisitReport[];
      saveVisits(loadedKey.current, merged);
      return merged;
    });
  }, []);

  const addVisit = useCallback((visit: VisitReport) => {
    setVisits(prev => {
      const updated = [visit, ...prev];
      saveVisits(loadedKey.current, updated);
      return updated;
    });
  }, []);

  const updateVisit = useCallback((id: string, updates: Partial<VisitReport>) => {
    setVisits(prev => {
      const updated = prev.map(v => v.id === id ? { ...v, ...updates } : v);
      saveVisits(loadedKey.current, updated);
      return updated;
    });
  }, []);

  const deleteVisit = useCallback((id: string) => {
    setVisits(prev => {
      const updated = prev.filter(v => v.id !== id);
      saveVisits(loadedKey.current, updated);
      return updated;
    });
  }, []);

  const deleteProperty = useCallback((address: string) => {
    setVisits(prev => {
      const updated = prev.filter(v => v.propertyAddress.toLowerCase().trim() !== address.toLowerCase().trim());
      saveVisits(loadedKey.current, updated);
      return updated;
    });
  }, []);

  const getVisitsByProperty = useCallback((address: string): VisitReport[] => {
    return visits.filter(v => v.propertyAddress.toLowerCase().trim() === address.toLowerCase().trim());
  }, [visits]);

  const stats: VisitStats = useMemo(() => {
    const byStatus: Record<VisitStatus, number> = {
      intéressé: 0,
      réflexion: 0,
      négatif: 0,
      offre: 0,
    };

    const byProperty: Record<string, VisitReport[]> = {};

    visits.forEach(v => {
      byStatus[v.status] = (byStatus[v.status] || 0) + 1;
      const addr = v.propertyAddress || 'Non spécifié';
      if (!byProperty[addr]) byProperty[addr] = [];
      byProperty[addr].push(v);
    });

    return {
      totalVisits: visits.length,
      byStatus,
      topBuyerObjections: extractObjections(visits),
      byProperty,
    };
  }, [visits]);

  return {
    visits,
    addVisit,
    updateVisit,
    deleteVisit,
    deleteProperty,
    getVisitsByProperty,
    stats,
    loadFromCloud,
  };
}
