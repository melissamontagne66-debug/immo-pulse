// MOD-24 — Base de témoignages personnalisés.
// MOD-26 — Les 12 témoignages ci-dessous sont les textes exacts fournis
// par le client (première personne, délais crédibles : débutants 35-70 j,
// confirmés 10-25 j, secteurs variés).
// En mode 'cadre' (voir src/config.ts), ces parcours sont des situations types
// inspirées de parcours réels, prénoms modifiés — la mention légale est
// affichée sur chaque carte par TemoignageCard.

export interface Temoignage {
  id: string;
  prenom: string;
  ville: string;
  region: string;          // ex. 'hauts-de-france', 'idf', 'ara', 'nouvelle-aquitaine'
  typeSecteur: 'centre-ville' | 'peripherie' | 'rural' | 'luxe';
  profil: 'debutant' | 'quelques-semaines' | 'quelques-mois' | 'confirme';
  delaiPremierMandatJours: number;  // 10 à 70
  histoire: string;                 // 60-100 mots, première personne, réaliste
  tags: string[];                   // ex. ['coup-dur', 'porte-a-porte', 'pige', 'premiere-vente']
}

export const TEMOIGNAGES: Temoignage[] = [
  {
    id: 'karim-lille',
    prenom: 'Karim',
    ville: 'Lille',
    region: 'hauts-de-france',
    typeSecteur: 'centre-ville',
    profil: 'debutant',
    delaiPremierMandatJours: 47,
    histoire:
      "Mon premier mois, j’ai toqué à peu près 400 portes pour zéro mandat. J’ai failli tout lâcher au jour 40. Le jour 47, une dame m’a ouvert parce que son voisin vendait « avec le monsieur aux panneaux » — c’était moi. Mandat signé le soir même. Personne ne voit le travail tant qu’il n’a pas payé. Il finit toujours par payer.",
    tags: ['coup-dur', 'porte-a-porte', 'premier-mandat'],
  },
  {
    id: 'elodie-vincennes',
    prenom: 'Élodie',
    ville: 'Vincennes',
    region: 'idf',
    typeSecteur: 'centre-ville',
    profil: 'debutant',
    delaiPremierMandatJours: 39,
    histoire:
      "En région parisienne, la concurrence est brutale : sur ma première pige, le vendeur avait déjà vu 6 agents. J’ai signé parce que j’étais la seule à avoir préparé un vrai dossier de comparables, imprimé. 39 jours sans rien signer, puis 2 mandats en 10 jours. La préparation paie cash, mais avec du retard.",
    tags: ['pige', 'premier-mandat'],
  },
  {
    id: 'marion-villeurbanne',
    prenom: 'Marion',
    ville: 'Villeurbanne',
    region: 'ara',
    typeSecteur: 'peripherie',
    profil: 'debutant',
    delaiPremierMandatJours: 52,
    histoire:
      "52 jours avant mon premier mandat. Ce qui m’a sauvée : l’estimation offerte, systématique, même pour les « je vends dans 2 ans ». Mon premier mandat venait d’une estimation faite 6 semaines plus tôt. Je notais tout, je relançais à date fixe. Le fichier, c’est vraiment là qu’est l’argent.",
    tags: ['coup-dur', 'estimation'],
  },
  {
    id: 'thomas-saint-emilion',
    prenom: 'Thomas',
    ville: 'Saint-Émilion',
    region: 'nouvelle-aquitaine',
    typeSecteur: 'rural',
    profil: 'debutant',
    delaiPremierMandatJours: 63,
    histoire:
      "En milieu rural, on ne toque pas aux portes comme en ville : on va voir le boulanger, le maire, le café du village. 63 jours pour mon premier mandat, obtenu parce que la boulangère avait parlé de moi au frère de la vendeuse. Ici, ta réputation fait le travail à ta place — mais elle met 2 mois à se construire.",
    tags: ['rural', 'bouche-a-oreille'],
  },
  {
    id: 'sophie-lyon',
    prenom: 'Sophie',
    ville: 'Lyon 6e',
    region: 'ara',
    typeSecteur: 'luxe',
    profil: 'debutant',
    delaiPremierMandatJours: 58,
    histoire:
      "Sur le haut de gamme, personne ne te confie un appartement à 800 000 € après 3 semaines de métier. Mon premier mandat est venu au jour 58, d’un propriétaire qui m’avait vue 3 fois : estimation, visite en accompagnement, puis réponse à une question de copropriété que j’étais allée vérifier. La régularité rassure plus que le discours.",
    tags: ['luxe', 'premier-mandat'],
  },
  {
    id: 'julie-bordeaux',
    prenom: 'Julie',
    ville: 'Bordeaux',
    region: 'nouvelle-aquitaine',
    typeSecteur: 'peripherie',
    profil: 'quelques-semaines',
    delaiPremierMandatJours: 35,
    histoire:
      "Après chaque visite, je toquais les 10 portes autour avec le script voisinage. Trois visites, trente portes, un propriétaire « qui y pensait depuis des mois ». Premier mandat au jour 35. Le voisinage d’une visite, c’est le moment où les gens ont le sujet immobilier sous les yeux. Ne rate jamais ce créneau.",
    tags: ['visite', 'voisinage'],
  },
  {
    id: 'camille-nantes',
    prenom: 'Camille',
    ville: 'Nantes',
    region: 'pays-de-la-loire',
    typeSecteur: 'centre-ville',
    profil: 'quelques-mois',
    delaiPremierMandatJours: 28,
    histoire:
      "Mon premier mandat n’était pas un nouveau contact : c’était une relance. Une estimation faite au jour 9, restée sans réponse. J’ai rappelé au jour 28 avec les chiffres des ventes du quartier. Signé dans la semaine. Depuis, ma règle : tout contact est relancé minimum 3 fois avant d’être rangé au froid.",
    tags: ['relance', 'premier-mandat'],
  },
  {
    id: 'lucas-roubaix',
    prenom: 'Lucas',
    ville: 'Roubaix',
    region: 'hauts-de-france',
    typeSecteur: 'centre-ville',
    profil: 'debutant',
    delaiPremierMandatJours: 44,
    histoire:
      "Au jour 30, j’avais un moral à zéro : mes deux collègues de promo avaient déjà signé, pas moi. Mon parrain m’a dit : « compare-toi à ton fichier, pas aux autres ». J’avais 90 contacts, j’ai relancé les 15 plus chauds. Deux R1, un mandat au jour 44. Le moral remonte quand on regarde ses propres chiffres.",
    tags: ['coup-dur', 'moral'],
  },
  {
    id: 'nadia-montreuil',
    prenom: 'Nadia',
    ville: 'Montreuil',
    region: 'idf',
    typeSecteur: 'peripherie',
    profil: 'quelques-semaines',
    delaiPremierMandatJours: 33,
    histoire:
      "Je publiais une story par jour : coulisses des visites, chiffres du quartier. Au jour 33, une abonnée m’a écrit : « tu fais les estimations ? ». Mandat exclusif. Les réseaux ne remplacent pas le terrain, mais ils chauffent les gens qui t’observent en silence — et ils sont plus nombreux qu’on croit.",
    tags: ['reseaux-sociaux', 'premier-mandat'],
  },
  {
    id: 'antoine-aubagne',
    prenom: 'Antoine',
    ville: 'Aubagne',
    region: 'paca',
    typeSecteur: 'rural',
    profil: 'confirme',
    delaiPremierMandatJours: 14,
    histoire:
      "En arrivant dans le réseau avec déjà de l’expérience, j’ai mis 14 jours à signer : pas parce que je suis meilleur, mais parce que j’ai activé mes apporteurs dès le jour 1. Plombier, coiffeur, agent d’assurance : 8 personnes prévenues en une semaine. Le premier mandat venait du plombier. Ton réseau existant est ton raccourci.",
    tags: ['apporteurs', 'confirme'],
  },
  {
    id: 'sarah-annecy',
    prenom: 'Sarah',
    ville: 'Annecy',
    region: 'ara',
    typeSecteur: 'centre-ville',
    profil: 'confirme',
    delaiPremierMandatJours: 11,
    histoire:
      "Reconversion réussie, mais nouveau secteur : je ne connaissais personne à Annecy. Pige téléphonique assumée, 15 appels par jour, qualité professionnelle déclarée d’emblée. Premier R1 au jour 4, premier mandat au jour 11. Ce qui change avec l’expérience : on sait qu’un « non » n’est pas un échec, c’est juste un « pas encore ».",
    tags: ['confirme', 'pige'],
  },
  {
    id: 'hugo-bayonne',
    prenom: 'Hugo',
    ville: 'Bayonne',
    region: 'nouvelle-aquitaine',
    typeSecteur: 'peripherie',
    profil: 'debutant',
    delaiPremierMandatJours: 41,
    histoire:
      "Mon premier mandat signé au jour 41 s’est vendu en 19 jours — coup de chance, le bon acheteur était déjà là. Mais la commission encaissée m’a surtout appris une chose : tout ce que j’avais noté pendant les semaines « vides » (noms, contextes, dates de relance) est devenu mon pipeline. Les semaines vides ne sont jamais vides si tu notes.",
    tags: ['coup-dur', 'porte-a-porte', 'premiere-vente'],
  },
];
