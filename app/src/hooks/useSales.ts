import { useState, useCallback, useRef, useEffect } from 'react';

// ============================================
// Ventes enregistrées (calculateur de commission)
// localStorage : immo-pulse-sales-{userKey}
// ============================================

export interface Sale {
  id: string;
  name: string;
  price: number;          // prix de vente du bien
  net: number;            // net final dans la poche du conseiller
  fees: number;           // honoraires TTC (price × taux de commission)
  palier: number;         // palier de commission (69-87)
  date: string;           // ISO YYYY-MM-DD
  countsAsMandat: boolean; // le bien était aussi un mandat signé
}

const STORAGE_PREFIX = 'immo-pulse-sales';
const LEGACY_STORAGE_PREFIX = 'immo-pulse-simulations';

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}-${userKey}`;
}

// Ancien format « simulations » du calculateur (avant MOD-12)
interface LegacySimulation {
  id: number;
  nomVente: string;
  prixVente: number;
  tauxCommission: number;
  commissionTTC: number;
  commissionHT: number;
  apporteur: number;
  pallier: number;
  impotPourcent: number;
}

// Migre les anciennes « simulations » (même chose : des ventes enregistrées)
// vers le format Sale. Net recalculé avec les charges AE par défaut (21,2 %),
// date = date de migration, countsAsMandat = true (c'étaient des ventes).
function migrateLegacySimulations(userKey: string): Sale[] {
  try {
    const stored = localStorage.getItem(`${LEGACY_STORAGE_PREFIX}-${userKey}`);
    if (!stored) return [];
    const legacy = JSON.parse(stored) as LegacySimulation[];
    if (!Array.isArray(legacy) || legacy.length === 0) return [];
    const today = new Date().toISOString().split('T')[0];
    const migrated: Sale[] = legacy.map(sim => {
      const netPallier = Math.round(sim.commissionHT * (sim.pallier / 100));
      const charges = Math.round(netPallier * 0.212);
      const impot = Math.round(netPallier * (sim.impotPourcent / 100));
      return {
        id: `sale-migrated-${sim.id}`,
        name: sim.nomVente,
        price: sim.prixVente,
        net: netPallier - charges - impot - (sim.apporteur || 0),
        fees: sim.commissionTTC,
        palier: sim.pallier,
        date: today,
        countsAsMandat: true,
      };
    });
    localStorage.removeItem(`${LEGACY_STORAGE_PREFIX}-${userKey}`);
    return migrated;
  } catch {
    return [];
  }
}

function loadSales(userKey: string): Sale[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    if (stored) return JSON.parse(stored);
    // Première ouverture : migrer les éventuelles anciennes simulations
    const migrated = migrateLegacySimulations(userKey);
    if (migrated.length > 0) {
      localStorage.setItem(getStorageKey(userKey), JSON.stringify(migrated));
      return migrated;
    }
  } catch { /* ignore */ }
  return [];
}

function saveSales(userKey: string, sales: Sale[]) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(sales));
}

export function useSales(userKey: string) {
  const [sales, setSales] = useState<Sale[]>(() => loadSales(userKey));
  const loadedKey = useRef(userKey);

  // React to userKey changes
  useEffect(() => {
    if (userKey !== loadedKey.current) {
      loadedKey.current = userKey;
      setSales(loadSales(userKey));
    }
  }, [userKey]);

  const addSale = useCallback((sale: Sale) => {
    setSales(prev => {
      const updated = [sale, ...prev];
      saveSales(loadedKey.current, updated);
      return updated;
    });
  }, []);

  const removeSale = useCallback((id: string) => {
    setSales(prev => {
      const updated = prev.filter(s => s.id !== id);
      saveSales(loadedKey.current, updated);
      return updated;
    });
  }, []);

  // Ventes triées de la plus récente à la plus ancienne
  const listSales = useCallback((): Sale[] => {
    return [...sales].sort((a, b) => b.date.localeCompare(a.date));
  }, [sales]);

  // Somme des honoraires (fees) pour un mois donné (format 'YYYY-MM')
  const feesForMonth = useCallback((month: string): number => {
    return sales
      .filter(s => s.date.startsWith(month))
      .reduce((sum, s) => sum + s.fees, 0);
  }, [sales]);

  // Nombre de ventes qui comptent comme mandat pour un mois donné
  const mandatsForMonth = useCallback((month: string): number => {
    return sales.filter(s => s.countsAsMandat && s.date.startsWith(month)).length;
  }, [sales]);

  return {
    sales,
    addSale,
    removeSale,
    listSales,
    feesForMonth,
    mandatsForMonth,
  };
}
