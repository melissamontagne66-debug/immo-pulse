// MOD-24 — Base de témoignages personnalisés.
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
    id: 'julien-lille',
    prenom: 'Julien',
    ville: 'Lille',
    region: 'hauts-de-france',
    typeSecteur: 'centre-ville',
    profil: 'debutant',
    delaiPremierMandatJours: 34,
    histoire:
      'En arrivant, je ne connaissais personne dans l\'immobilier. Les trois premières semaines, j\'ai appelé dans le vide et toqué des portes sous la pluie de Lille, sans rien rentrer. Puis un boulanger de mon quartier m\'a glissé le nom d\'un couple qui hésitait à vendre. Un R1, un R2 dix jours plus tard, et mon premier mandat était signé au bout d\'un mois. Ce que j\'en retiens : les apporteurs, c\'est du temps investi qui finit toujours par payer.',
    tags: ['apporteurs', 'debutant', 'premiere-vente'],
  },
  {
    id: 'sophie-roubaix',
    prenom: 'Sophie',
    ville: 'Roubaix',
    region: 'hauts-de-france',
    typeSecteur: 'peripherie',
    profil: 'debutant',
    delaiPremierMandatJours: 52,
    histoire:
      'Je ne vais pas mentir : au bout de six semaines sans mandat, j\'ai failli tout arrêter. Mon conjoint me voyait rentrer chaque soir épuisée, avec zéro résultat. Un soir, en relançant un contact de plus de deux mois — un monsieur qui m\'avait dit non sèchement —, il m\'a dit que sa situation avait changé. Estimation la semaine suivante, mandat signé. Ce « non » m\'a appris que dans ce métier, non veut souvent dire « pas encore ».',
    tags: ['coup-dur', 'relance', 'premiere-vente'],
  },
  {
    id: 'karim-paris',
    prenom: 'Karim',
    ville: 'Paris',
    region: 'idf',
    typeSecteur: 'centre-ville',
    profil: 'quelques-semaines',
    delaiPremierMandatJours: 21,
    histoire:
      'Sur Paris, la concurrence est brutale : sur ma première pige, le vendeur m\'a raccroché au nez en me disant qu\'il avait déjà eu huit appels d\'agents ce jour-là. J\'ai changé d\'approche : au lieu de parler mandat, j\'ai parlé de mon acquéreur réel qui cherchait exactement son bien. Il m\'a écouté. Visite trois jours après, offre acceptée. Mon premier mandat est venu d\'une pige que tout le monde m\'avait déconseillée.',
    tags: ['pige', 'acquereur'],
  },
  {
    id: 'marie-versailles',
    prenom: 'Marie',
    ville: 'Versailles',
    region: 'idf',
    typeSecteur: 'luxe',
    profil: 'confirme',
    delaiPremierMandatJours: 12,
    histoire:
      'J\'avais déjà de l\'expérience en agence avant de passer mandataire, mais le luxe, c\'est un autre monde : les propriétaires testent votre crédibilité à chaque phrase. Mon premier mandat haut de gamme, je l\'ai eu par un ancien client qui m\'a recommandée à sa notaire. Douze jours après mon démarrage. Sur ce segment, un dossier R2 impeccable et des comparables irréprochables font toute la différence. Le bouche-à-oreille fait le reste.',
    tags: ['luxe', 'recommandation'],
  },
  {
    id: 'thomas-lyon',
    prenom: 'Thomas',
    ville: 'Lyon',
    region: 'ara',
    typeSecteur: 'centre-ville',
    profil: 'quelques-mois',
    delaiPremierMandatJours: 18,
    histoire:
      'Après deux mois d\'activité, je maîtrisais les scripts mais mes RDV ne transformaient pas. Mon erreur : je déroulais ma présentation sans écouter. Sur un R1 à Croix-Rousse, j\'ai décidé de me taire et de poser des questions pendant quarante minutes. Le vendeur m\'a dit en partant : « Vous êtes le premier qui ne m\'a pas parlé prix d\'entrée. » Mandat signé au R2. Écouter 80 % du temps, ce n\'est pas un slogan, ça change tout.',
    tags: ['r1', 'r2', 'ecoute'],
  },
  {
    id: 'aurelie-annecy',
    prenom: 'Aurélie',
    ville: 'Annecy',
    region: 'ara',
    typeSecteur: 'luxe',
    profil: 'quelques-semaines',
    delaiPremierMandatJours: 29,
    histoire:
      'Autour du lac, les prix partent très haut et les vendeurs sont méfiants. Mes deux premiers R1 se sont soldés par des « on va réfléchir ». Pour le troisième, j\'ai préparé mes comparables comme jamais : cinq ventes récentes imprimées, photos à l\'appui. Le propriétaire a feuilleté le dossier en silence, puis m\'a demandé quand on signait. La préparation du R2, c\'est 80 % de la signature. On ne m\'y reprendra plus à improviser.',
    tags: ['r2', 'luxe', 'preparation'],
  },
  {
    id: 'nicolas-bordeaux',
    prenom: 'Nicolas',
    ville: 'Bordeaux',
    region: 'nouvelle-aquitaine',
    typeSecteur: 'peripherie',
    profil: 'debutant',
    delaiPremierMandatJours: 47,
    histoire:
      'Un mois et demi sans mandat, un portable qui ne sonnait pas, et cette voix dans ma tête qui me disait que je n\'étais pas fait pour ça. Ce qui m\'a sauvé, c\'est le porte-à-porte du samedi matin en périphérie de Bordeaux. À la quinzième porte d\'une tournée où personne ne répondait, une dame m\'a ouvert, m\'a offert un café, et m\'a dit qu\'elle pensait vendre depuis un an sans oser. Mandat signé quinze jours plus tard.',
    tags: ['coup-dur', 'porte-a-porte', 'premiere-vente'],
  },
  {
    id: 'laura-biarritz',
    prenom: 'Laura',
    ville: 'Biarritz',
    region: 'nouvelle-aquitaine',
    typeSecteur: 'luxe',
    profil: 'quelques-mois',
    delaiPremierMandatJours: 24,
    histoire:
      'Sur la côte basque, beaucoup de biens appartiennent à des résidents secondaires absents. Inutile de toquer : il faut passer par les commerçants et les concierges. J\'ai présenté mon activité à trois commerces du centre, avec ma carte et un vrai argumentaire apporteur. Trois semaines plus tard, un restaurateur m\'a appelée : un client régulier vendait sa villa. Mandat exclusif. Le réseau local vaut toutes les publicités du monde ici.',
    tags: ['apporteurs', 'luxe', 'reseau'],
  },
  {
    id: 'mehdi-montpellier',
    prenom: 'Mehdi',
    ville: 'Montpellier',
    region: 'occitanie',
    typeSecteur: 'centre-ville',
    profil: 'debutant',
    delaiPremierMandatJours: 38,
    histoire:
      'J\'ai raté mon premier R1 comme on rate un examen qu\'on n\'a pas révisé : j\'ai donné le prix au bout de dix minutes, le vendeur a dit merci, et il a signé avec un confrère au prix que j\'avais annoncé. Dur. Depuis, je ne donne plus jamais de prix au R1. Mon premier mandat est arrivé trois semaines plus tard, sur une estimation offerte faite en sortant d\'une visite, chez un voisin. L\'échec du début m\'a construit.',
    tags: ['coup-dur', 'r1', 'voisinage'],
  },
  {
    id: 'celine-toulouse',
    prenom: 'Céline',
    ville: 'Toulouse',
    region: 'occitanie',
    typeSecteur: 'peripherie',
    profil: 'quelques-semaines',
    delaiPremierMandatJours: 26,
    histoire:
      'Ce qui a tout déclenché pour moi, c\'est ma fiche Google. Au début je trouvais ça gadget. J\'ai mis trois photos, publié un post par semaine, et demandé deux avis à d\'anciens collègues devenus clients. Un matin, un appel direct : « J\'ai vu votre fiche, vous êtes bien notée, vous pouvez estimer ma maison à Colomiers ? » Premier mandat, vingt-six jours après mon démarrage. La visibilité gratuite, ça existe encore.',
    tags: ['gmb', 'visibilite'],
  },
  {
    id: 'pierre-rennes',
    prenom: 'Pierre',
    ville: 'Rennes',
    region: 'bretagne',
    typeSecteur: 'rural',
    profil: 'debutant',
    delaiPremierMandatJours: 44,
    histoire:
      'En zone rurale autour de Rennes, tout le monde se connaît, et un inconnu qui toque, ça intrigue. Mes premières tournées, les gens répondaient à peine. Alors j\'ai changé : je me suis présenté à la mairie, au boulanger, au bar-tabac. Un mois plus tard, c\'est le maire d\'une commune voisine qui m\'a orienté vers une succession à régler. Premier mandat, quarante-quatre jours après le début. En rural, on ne vend pas d\'abord des maisons : on devient quelqu\'un du coin.',
    tags: ['rural', 'reseau', 'porte-a-porte'],
  },
  {
    id: 'emma-caen',
    prenom: 'Emma',
    ville: 'Caen',
    region: 'normandie',
    typeSecteur: 'peripherie',
    profil: 'quelques-semaines',
    delaiPremierMandatJours: 31,
    histoire:
      'Mon premier mois, j\'ai compté mes portes claquées : onze. Certaines avec des mots pas gentils. Ce qui m\'a fait tenir, c\'est de noter chaque « non » comme une donnée, pas comme une blessure. À la trentième porte d\'une tournée de voisinage après une visite, un jeune couple m\'a dit : « Justement, on se posait la question. » Mandat signé deux semaines plus tard. Onze portes claquées pour un mandat : je signe ce deal tous les jours.',
    tags: ['coup-dur', 'porte-a-porte', 'voisinage'],
  },
  {
    id: 'antoine-strasbourg',
    prenom: 'Antoine',
    ville: 'Strasbourg',
    region: 'grand-est',
    typeSecteur: 'centre-ville',
    profil: 'confirme',
    delaiPremierMandatJours: 10,
    histoire:
      'J\'ai rejoint le réseau avec sept ans d\'agence derrière moi et un fichier de clients qui me faisait confiance. Premier réflexe : reprendre contact avec mes anciens clients vendeurs et acheteurs. Le troisième appel, un couple m\'a dit : « On attendait que tu te relances pour vendre avec toi. » Mandat signé dix jours après mon arrivée. Le fichier, c\'est de l\'or — à condition de le travailler chaque semaine, pas une fois par an.',
    tags: ['relance', 'reseau', 'confirme'],
  },
  {
    id: 'ines-nantes',
    prenom: 'Inès',
    ville: 'Nantes',
    region: 'pays-de-la-loire',
    typeSecteur: 'peripherie',
    profil: 'quelques-mois',
    delaiPremierMandatJours: 58,
    histoire:
      'Mon premier mandat a mis presque deux mois à venir, et je pensais être anormalement lente. En réalité, je faisais tout bien mais dans le désordre : un jour du phoning, trois jours rien, une tournée, puis plus rien. Quand j\'ai imposé un rythme quotidien — appels le matin, terrain l\'après-midi, bilan le soir —, les RDV sont arrivés en dix jours. La régularité bat le talent. C\'est la constance qui a signé mon premier mandat, pas la chance.',
    tags: ['constance', 'methode', 'premiere-vente'],
  },
  {
    id: 'hugo-dijon',
    prenom: 'Hugo',
    ville: 'Dijon',
    region: 'bourgogne-franche-comte',
    typeSecteur: 'rural',
    profil: 'debutant',
    delaiPremierMandatJours: 62,
    histoire:
      'Deux mois complets sans rien signer. J\'étais à deux doigts de rendre ma carte. Mon mentor m\'a posé une question simple : « Tu as fait combien de R1 ? » Réponse : deux. Pas assez de volume, tout simplement. J\'ai doublé mes appels et mes tournées pendant quinze jours. Quatre R1, deux R2, un mandat signé au soixante-deuxième jour. Ce métier est une affaire de volume régulier. Le talent vient ensuite.',
    tags: ['coup-dur', 'constance', 'premiere-vente'],
  },
  {
    id: 'sarah-nice',
    prenom: 'Sarah',
    ville: 'Nice',
    region: 'paca',
    typeSecteur: 'centre-ville',
    profil: 'quelques-semaines',
    delaiPremierMandatJours: 19,
    histoire:
      'À Nice, mon premier mandat est venu des réseaux sociaux. Je publiais chaque jour les coulisses du métier : mes tournées, mes estimations, mes galères aussi — les gens adorent l\'authenticité. Au bout de trois semaines, une abonnée m\'a écrit en message privé : « Je vends mon appartement, tu as l\'air sincère, tu passes quand ? » Un post par jour, cinq réponses aux commentaires, et ça a suffi à lancer mon activité.',
    tags: ['reseaux-sociaux', 'visibilite'],
  },
];
