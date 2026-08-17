// MOD-34 — Pool de 15 conseils quotidiens.
// Sélection déterministe : un conseil différent chaque jour, stable dans la
// journée (un F5 ne change pas le conseil du jour).

export const CONSEILS_POOL: string[] = [
  'Un « non » aujourd\'hui est souvent un « oui » dans 3 mois : note tout, relance tout.',
  'Ne donne jamais le prix au R1. Ta valeur, c\'est ta méthode.',
  '10 portes, 2 conversations, 1 contact : les journées moyennes font les mois exceptionnels.',
  'Le vendeur ne choisit pas le meilleur agent : il choisit celui en qui il a confiance.',
  'Bloque ton créneau de prospection dans ton agenda comme un RDV client. Il est aussi important.',
  'Relance à 9 h : les vendeurs décrochent le matin.',
  'Après chaque visite : 10 portes voisines. C\'est le moment où le quartier te regarde.',
  'Ton fichier de contacts vaut plus que ta mémoire. Note tout, tout de suite.',
  'Un R2 se gagne avant d\'entrer : comparables prêts, objections anticipées.',
  'La constance bat le talent les jours de pluie.',
  'Un apporteur bien entretenu vaut 10 heures de porte-à-porte.',
  'Demande toujours : « Qui connaissez-vous qui pense vendre ? » — à tout le monde.',
  'Le moral remonte quand on regarde ses propres chiffres, pas ceux des autres.',
  'Une estimation offerte aujourd\'hui = un mandat dans 6 semaines.',
  'Termine chaque journée par ton bilan : c\'est ce qui transforme l\'expérience en progression.',
];

// Conseil du jour : déterministe, différent chaque jour, stable dans la journée.
// `day` = jour depuis l'inscription (currentDay dans App/useProgress).
export function getConseilForDay(day: number): string {
  const len = CONSEILS_POOL.length;
  const idx = ((day % len) + len) % len;
  return CONSEILS_POOL[idx];
}
