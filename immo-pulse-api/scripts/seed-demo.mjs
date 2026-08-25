// Génère les données de démo du compte melissa.montagne66@gmail.com.
// Usage : node scripts/seed-demo.mjs  → écrit scripts/seed-demo.sql
// Puis  : npx wrangler d1 execute immo-pulse-db --remote --file=scripts/seed-demo.sql
//
// Ne PAS committer le SQL généré (données de démo propres à un compte).
// Le compte est créé via l'API s'il n'existe pas (comme la migration au login).

const API = 'https://immo-pulse-api.melissa-montagne66.workers.dev';
const EMAIL = 'melissa.montagne66@gmail.com';
const PASSWORD = '123456'; // mot de passe du compte pré-enregistré (migration)

const res = await fetch(`${API}/api/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: EMAIL, password: PASSWORD, firstName: 'Mélissa', lastName: 'Montagne' }),
});
const data = await res.json();
if (!data.token) {
  console.error('Échec register :', JSON.stringify(data));
  process.exit(1);
}
const userId = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString()).sub;
console.log('Compte prêt, user_id =', userId);

// ---------- Helpers ----------
const esc = (s) => String(s).replace(/'/g, "''");
const q = (s) => `'${esc(s)}'`;
const n = (v) => (v === null || v === undefined ? 'NULL' : Number(v));

// Jours ouvrés du 03/08 au 24/08/2026 (programme : jours 1 à 16)
const days = [
  // [date, calls, contacts, r1, r2, mandats, visites, offres, mood, wins, challenges]
  ['2026-08-03', 3, 2, 0, 0, 0, 0, 0, 4, 'Premier jour sur le terrain — 2 contacts notés !', ''],
  ['2026-08-04', 8, 5, 0, 0, 0, 0, 0, 4, 'Ma première recherche acquéreur a débouché sur un échange de 10 minutes', ''],
  ['2026-08-05', 10, 6, 1, 0, 0, 0, 0, 4, 'Premier R1 fixé !', 'La transition vers la proposition d\'estimation à travailler'],
  ['2026-08-06', 12, 7, 0, 0, 0, 0, 0, 3, '', 'Porte-à-porte difficile sous la pluie'],
  ['2026-08-07', 11, 8, 1, 0, 0, 0, 0, 4, '2 apporteurs enregistrés (boulanger + coiffeur)', ''],
  ['2026-08-10', 14, 9, 1, 1, 1, 0, 0, 5, 'PREMIER MANDAT SIGNÉ 🎉 Villa des Oliviers !', ''],
  ['2026-08-11', 9, 5, 0, 0, 0, 1, 0, 4, 'Première visite faite — acquéreur intéressé', ''],
  ['2026-08-12', 13, 6, 1, 0, 0, 1, 0, 4, 'Retour de visite envoyé en 10 min grâce à l\'app', ''],
  ['2026-08-13', 10, 7, 0, 0, 0, 0, 0, 3, '', 'Journée molle, peu de réponses au téléphone'],
  ['2026-08-14', 15, 8, 2, 0, 0, 1, 0, 5, '2 R1 dans la journée + 1 visite !', ''],
  ['2026-08-17', 12, 6, 1, 1, 1, 0, 0, 5, '2ᵉ mandat signé — Appartement du Centre 🎉', ''],
  ['2026-08-18', 11, 5, 0, 0, 0, 1, 1, 4, 'Première offre écrite remise au vendeur', 'Ne pas oublier le tracfin de l\'offre'],
  ['2026-08-19', 13, 7, 1, 0, 0, 0, 0, 4, 'Un cuisiniste (apporteur) m\'a fait une mise en relation', ''],
  ['2026-08-20', 10, 6, 0, 0, 0, 1, 0, 4, 'Mon post LinkedIn a amené 2 demandes d\'estimation', ''],
  ['2026-08-21', 14, 8, 1, 0, 0, 1, 0, 4, '3 avis Google obtenus cette semaine', ''],
  ['2026-08-24', 12, 6, 1, 1, 1, 0, 0, 5, '3ᵉ mandat signé 🎉 + semaine à 4 RDV', ''],
];

const sum = (i) => days.reduce((s, d) => s + d[i], 0);

// ---------- SQL ----------
const sql = [];
sql.push('-- Données de démo (générées par scripts/seed-demo.mjs)');

// Bilans quotidiens
for (const [date, calls, contacts, r1, r2, mandats, visites, offres, mood, wins, challenges] of days) {
  sql.push(
    `INSERT OR REPLACE INTO daily_results (id, user_id, date, calls_made, contacts_approached, rdv_r1_done, rdv_r2_done, mandats_signed, visites_done, offres_written, mood, wins, challenges, coach_question, coach_answer) VALUES (${q(`${userId}-${date}`)}, ${q(userId)}, ${q(date)}, ${n(calls)}, ${n(contacts)}, ${n(r1)}, ${n(r2)}, ${n(mandats)}, ${n(visites)}, ${n(offres)}, ${n(mood)}, ${q(wins)}, ${q(challenges)}, '', '');`
  );
}

// Actions cochées (ids de goals.ts / DailyActions)
const actionIds = [];
days.forEach((_, i) => {
  const day = i + 1;
  if (day === 1) {
    actionIds.push('blocs-agenda-jour-1', 'gmb-jour-1', 'social-jour-1');
  } else {
    actionIds.push(`plateformes-jour-${day}`, `prospection-jour-${day}`, `social-jour-${day}`);
  }
  actionIds.push('daily-crm-update');
});
for (const id of [...new Set(actionIds)]) {
  sql.push(`INSERT OR IGNORE INTO completed_actions (user_id, action_id) VALUES (${q(userId)}, ${q(id)});`);
}

// Progression cloud (profil laissé vide : le profil local de l'utilisatrice prime)
const progress = {
  currentDay: 17,
  completedDays: [...new Set(actionIds)],
  debriefs: [],
  dailyResults: days.map(([date, calls, contacts, r1, r2, mandats, visites, offres, mood, wins, challenges]) => ({
    date, callsMade: calls, contactsApproached: contacts, rdvR1Done: r1, rdvR2Done: r2,
    mandatsSigned: mandats, visitesDone: visites, offresWritten: offres, mood, wins, challenges,
  })).reverse(),
  nextDayPlans: [],
  streak: { count: 16, lastBilanDate: '2026-08-24', freezesAvailable: 1, freezesUsedThisWeek: 0, lastFreezeDate: null },
  totalCalls: sum(1),
  totalRdv: sum(3) + sum(4),
  totalMandats: sum(5),
  totalVisites: sum(6),
  totalOffres: sum(7),
  totalVentes: 0,
};
sql.push(
  `INSERT OR REPLACE INTO profiles (user_id, data, progress, updated_at) VALUES (${q(userId)}, '{}', ${q(JSON.stringify(progress))}, datetime('now'));`
);

// Ventes enregistrées (calculateur de commission)
const sales = [
  { id: 'sale-demo-1', name: 'Villa des Oliviers', price: 320000, net: 12400, fees: 16000, palier: 80, date: '2026-08-10', countsAsMandat: true },
  { id: 'sale-demo-2', name: 'Appartement du Centre', price: 185000, net: 7100, fees: 12025, palier: 75, date: '2026-08-17', countsAsMandat: true },
  { id: 'sale-demo-3', name: 'Maison Bel Air', price: 265000, net: 9800, fees: 13250, palier: 75, date: '2026-08-24', countsAsMandat: false },
];
sql.push(`INSERT OR REPLACE INTO sales (user_id, data, updated_at) VALUES (${q(userId)}, ${q(JSON.stringify(sales))}, datetime('now'));`);

// Comptes rendus de visite
const visits = [
  {
    id: 'visit-demo-1', date: '2026-08-11', address: '12 rue des Lilas, Perpignan', seller: 'Mme Fabre', buyer: 'M. et Mme Roche',
    status: 'intéressé', price: 'Dans le budget', location: 'Quartier calme, proche écoles', work: 'Cuisine à rafraîchir',
    general: 'Bonne impression générale', weak: 'Cuisine à rafraîchir', strong: 'Luminosité, jardin',
    msg: 'Bonjour Mme Fabre, suite à la visite du 11/08 avec M. et Mme Roche : acquéreur intéressé, je reste en contact rapproché.',
  },
  {
    id: 'visit-demo-2', date: '2026-08-18', address: '8 avenue de la Gare, Perpignan', seller: 'M. Vidal', buyer: 'Mme Serra',
    status: 'offre', price: 'Offre à 240 000 € envisagée', location: 'Très bien placé', work: 'Aucun',
    general: 'Coup de cœur', weak: '', strong: 'Emplacement, état général',
    msg: 'Bonjour M. Vidal, très bonne nouvelle : Mme Serra souhaite faire une offre. Je la prépare avec elle et reviens vers vous très vite.',
  },
  {
    id: 'visit-demo-3', date: '2026-08-21', address: '3 impasse du Moulin, Cabestany', seller: 'M. et Mme Pelissier', buyer: 'M. Costa',
    status: 'réflexion', price: 'À étudier', location: 'Un peu excentré pour lui', work: 'Toiture à surveiller',
    general: 'Prend le temps de réfléchir', weak: 'Excentré, toiture', strong: 'Surface, garage double',
    msg: 'Bonjour, suite à la visite du 21/08 avec M. Costa : il prend le temps de la réflexion, je le relance sous 48 h.',
  },
];
for (const v of visits) {
  sql.push(
    `INSERT OR REPLACE INTO visit_reports (id, user_id, date, property_address, seller_name, buyer_name, status, price_feedback, location_feedback, work_feedback, general_feedback, weak_points, strong_points, generated_message) VALUES (${q(v.id)}, ${q(userId)}, ${q(v.date)}, ${q(v.address)}, ${q(v.seller)}, ${q(v.buyer)}, ${q(v.status)}, ${q(v.price)}, ${q(v.location)}, ${q(v.work)}, ${q(v.general)}, ${q(v.weak)}, ${q(v.strong)}, ${q(v.msg)});`
  );
}

// Contacts (dont 2 relances dues et 1 anniversaire aujourd'hui)
const contacts = [
  {
    id: 'contact-demo-1', name: 'Dupont', firstName: 'Bernard', phone: '06 12 34 56 78', context: 'Estimation faite le 12/08 — vendeur villa des Lilas, projet région parisienne',
    origin: 'Porte-à-porte', followUp: '2026-08-25', status: 'chaud', created: '2026-08-12',
    email: '', birthdate: '1962-03-14', address: '12 rue des Lilas', zip: '66000', city: 'Perpignan',
    notes: '2026-08-12: Estimation remise, très réceptif\n2026-08-19: Relance — décision en couple ce week-end',
  },
  {
    id: 'contact-demo-2', name: 'Martin', firstName: 'Claire', phone: '06 98 76 54 32', context: 'Recherche acquéreur T4 — son appartement à vendre ensuite',
    origin: 'Recherche acquéreur', followUp: '2026-08-26', status: 'chaud', created: '2026-08-14',
    email: 'claire.martin@example.com', birthdate: '1985-08-25', address: '8 avenue de la Gare', zip: '66000', city: 'Perpignan',
    notes: '2026-08-14: R1 fait, R2 à caler\n2026-08-21: Lui envoyer les photos retouchées',
  },
  {
    id: 'contact-demo-3', name: 'Haddad', firstName: 'Karim', phone: '07 11 22 33 44', context: 'Contact au vide-grenier — maison des parents à vendre un jour',
    origin: 'Événement local', followUp: '', status: 'froid', created: '2026-05-10',
    email: '', birthdate: '', address: '', zip: '', city: 'Perpignan',
    notes: '2026-05-10: Premier contact, pas de projet avant 2027',
  },
  {
    id: 'contact-demo-4', name: 'Lambert', firstName: 'Sophie', phone: '06 55 44 33 22', context: 'R1 fait le 21/08 — succession, 2 héritiers à aligner',
    origin: 'Apporteur (notaire)', followUp: '2026-08-28', status: 'chaud', created: '2026-08-21',
    email: '', birthdate: '1978-11-02', address: '3 impasse du Moulin', zip: '66330', city: 'Cabestany',
    notes: '2026-08-21: R1 — bloquer le créneau estimation\n2026-08-24: Dossier estimation en cours',
  },
  {
    id: 'contact-demo-5', name: 'Moreau', firstName: 'Luc', phone: '06 77 88 99 00', context: 'Boulanger partenaire — apporteur d\'affaires enregistré',
    origin: 'Commerçant', followUp: '2026-08-25', status: 'chaud', created: '2026-08-07',
    email: '', birthdate: '', address: '25 rue de la République', zip: '66000', city: 'Perpignan',
    notes: '2026-08-07: Flyers + QR code déposés\n2026-08-19: M\'a mis en relation avec un client',
  },
];
for (const c of contacts) {
  sql.push(
    `INSERT OR REPLACE INTO contacts (id, user_id, name, phone, context, origin, follow_up_date, status, created_at, first_name, email, birthdate, address, zip_code, city, notes, updated_at) VALUES (${q(c.id)}, ${q(userId)}, ${q(c.name)}, ${q(c.phone)}, ${q(c.context)}, ${q(c.origin)}, ${c.followUp ? q(c.followUp) : 'NULL'}, ${q(c.status)}, ${q(c.created)}, ${q(c.firstName)}, ${q(c.email)}, ${q(c.birthdate)}, ${q(c.address)}, ${q(c.zip)}, ${q(c.city)}, ${q(c.notes)}, ${q(c.created)});`
  );
}

const { writeFileSync } = await import('node:fs');
writeFileSync(new URL('./seed-demo.sql', import.meta.url), sql.join('\n') + '\n');
console.log('seed-demo.sql écrit :', sql.length - 1, 'commandes');
