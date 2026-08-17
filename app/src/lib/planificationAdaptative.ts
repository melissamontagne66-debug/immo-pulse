import type { DailyResults } from '@/types';

// MOD-35 — Messages adaptatifs du lendemain, déterministes, basés sur le
// bilan de la veille. Fonction pure (testable) — branchée dans useSmartDashboard.

export interface ActionAdaptative {
  id: string;
  title: string;
  message: string;
  emoji: string;
}

// Normalisation sans accents pour la détection des mots-clés de difficultés
function normalizeText(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

export function getPlanificationAdaptative(yesterday: DailyResults | undefined): ActionAdaptative[] {
  if (!yesterday) return [];
  const actions: ActionAdaptative[] = [];

  // 1. 0 conversation hier → prospection la plus légère, ton encourageant
  if (yesterday.callsMade === 0) {
    actions.push({
      id: 'adaptatif-remise-en-route',
      emoji: '📞',
      title: 'On remet le compteur en route aujourd\'hui',
      message: 'Hier c\'était calme côté contacts — aujourd\'hui on remet le compteur en route, ensemble. Commence par la prospection la plus légère : 5 portes ou 5 appels, à ton rythme. Un premier contact et la machine repart.',
    });
  }

  // 2. ≥ 4 contacts mais 0 R1 → script de transition contact → R1
  if (yesterday.contactsApproached >= 4 && yesterday.rdvR1Fixed + yesterday.rdvR1Done === 0) {
    actions.push({
      id: 'adaptatif-contact-vers-r1',
      emoji: '🎯',
      title: 'Conversion contact → R1',
      message: 'Tu crées des contacts mais pas encore de RDV — voici la phrase qui débloque : « Je vous propose 20 minutes chez vous, sans engagement, pour vous donner une valeur précise de votre bien — ça vous dit ? »',
    });
  }

  // 3. Difficultés « portes closes / absence » → créneau du soir
  const difficultes = normalizeText(yesterday.challenges || '');
  if (/(porte|personne|absent|ferme)/.test(difficultes)) {
    actions.push({
      id: 'adaptatif-creneau-soir',
      emoji: '🕔',
      title: 'Teste le créneau du soir',
      message: 'Teste le créneau 17 h – 19 h aujourd\'hui : plus de monde chez soi.',
    });
  }

  // 4. R2 fait sans mandat → relance du vendeur sous 48 h
  if (yesterday.rdvR2Done > 0 && yesterday.mandatsSigned === 0) {
    actions.push({
      id: 'adaptatif-relance-r2',
      emoji: '📲',
      title: 'Relance ton vendeur sous 48 h',
      message: 'Relance ton vendeur sous 48 h : « Je viens de recevoir deux demandes qui correspondent à votre bien… »',
    });
  }

  return actions;
}
