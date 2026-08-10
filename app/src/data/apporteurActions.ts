// Actions pour trouvér et entretenir des apporteurs d'affaires SOUS-COTES
// 20+ types de contacts souvent délaisses par les confreres
// Base sur la méthode des apporteurs d'affaires

export interface ApporteurAction {
  id: string;
  day: number;
  apporteurType: string;
  title: string;
  pourquoi: string;
  action: string;
  script: string;
  routine: string;
  objectif: string;
  duree: string;
}

// Cycle de 24 jours d'actions de contacts
export const apporteurActionsCycle: ApporteurAction[] = [
  // J1 — Cuisiniste (Partie 1 : Approche)
  {
    id: 'app-01',
    day: 1,
    apporteurType: 'Cuisiniste',
    title: 'Partenariat Cuisiniste — L\'approche',
    pourquoi: 'La cuisine est le projet n°1 des Francais. Quand un propriétaire veut vendre, il se dit "Si je refais la cuisine, je vendrai plus cher". Il và voir le cuisiniste AVANT l\'agent immobilier. Le cuisiniste est donc le premier au courant du projet de vie. Il est bloque car il ne peut pas répondre sur l\'aspect immobilier — c\'est la que tu deviens son sauveur.',
    action: 'Va au magasin de cuisine du secteur. Présente-toi comme un conseiller local. Discute avec le vendeur, apprends a le connaître. Présente le principe du partenariat : tu l\'aides a vendre ses devis en apportant la vision immobiliere, il te met en relation avec des vendeurs potentiels. Inscris-le dans ton réseau de contacts.',
    script: '"Je vous proposé un partenariat pour transformer vos devis dormants en ventes. Quand un client hésite a signer parce qu\'il a un projet de vente, parlez de moi. Je fais l\'estimation, je conseille sur la rentabilité des travaux, et si je vends, vous touchez 6 % de ma commission via ton réseau de contacts. Vous n\'avez aucun travail supplementaire."',
    routine: 'Une fois par mois : café strategique. Ne demande pas "T\'as un mandat ?". Passe pour savoir comment se passe son mois, s\'il y a des projets de renovation. Feedback obligatoire dès que tu vois un de ses clients. Petit geste quand ca aboutit (chocolats, bouteille).',
    objectif: '1 cuisiniste approche, 1 inscription dans ton réseau de contacts',
    duree: '1h',
  },
  // J2 — Cuisiniste (Partie 2 : Cafe strategique)
  {
    id: 'app-02',
    day: 2,
    apporteurType: 'Cuisiniste',
    title: 'Cuisiniste — Cafe strategique de suivi',
    pourquoi: 'L\'apporteur n\'est pas une machine, c\'est une relation humaine. S\'il t\'oublie, il oubliera de parler de toi. Le café mensuel est essentiel pour rester "Top of Mind" — le premier a qui il pense.',
    action: 'Retourne voir le cuisiniste inscrit la semaine derniere. Apporte-lui un café ou un petit déjeuner. Montre-lui comment envoyer un contact via ton réseau de contacts. Raconte-lui une anecdote positive (même inventee) pour montrer que ca marche. Demande-lui s\'il a des clients en projet de vente.',
    script: '"Je passais dans le coin, je voulais savoir comment se passe votre mois. Est-ce que les gens ont des projets de renovation en ce moment ? J\'ai parle de vous cette semaine a un client qui cherchait un cuisiniste !"',
    routine: 'Cafe mensuel + feedback systematique dès que tu vois un de ses clients + petit geste quand ca aboutit.',
    objectif: '1 café strategique, 1 demonstration ton réseau de contacts',
    duree: '30 min',
  },
  // J3 — Brocanteur / Vide-maison (Partie 1)
  {
    id: 'app-03',
    day: 3,
    apporteurType: 'Brocanteur / Vide-maison',
    title: 'Partenariat Brocanteur — La sentinelle des successions',
    pourquoi: 'Quand on vide une maison de fond en comble, ce n\'est jamais pour refaire la deco : c\'est parce que la maison va être vendue. Généralement suite a un décès ou un depart en EHPAD. Le brocanteur est souvent le premier prèstataire appelé, parfois même avant le notaire. S\'il parle de toi, tu as 90 % de chances de prendre le mandat sans concurrence.',
    action: 'Repère les camions de debarras dans tes rues ou cherché-les sur Google Maps. Va les voir sur un chantier ou a leur depot. Respecte leur métier — ce sont des entreprenéurs courageux. Présente le service "Cle en main" : toi + lui = zero stress pour la famille.',
    script: '"Bonjour, je suis [Ton Nom], conseiller immobilier. Je vois souvent vos camions sur le secteur et j\'apprecie la qualité de votre travail. J\'accompagne beaucoup de familles en succession, et elles me demandent souvent : \'Qui peut nous vider la maison proprement ?\'. J\'aimerais vous recommandér systématiquement. Et quand vous videz une maison qui va être vendue, proposéz-leur de me rencontrer. Pour chaque vente, vous touchez 6 % de ma commission."',
    routine: 'Passe une fois par mois avec un café. Tiens-le au courant de CHAQUE dossier qu\'il t\'envoie, même si ca ne se vend pas.',
    objectif: '2 brocanteurs/vide-maison approches, 1 inscrit ton réseau de contacts',
    duree: '1h30',
  },
  // J4 — Pharmacien
  {
    id: 'app-04',
    day: 4,
    apporteurType: 'Pharmacien',
    title: 'Partenariat Pharmacien — Le confident du changement',
    pourquoi: 'Le pharmacien est le premier au courant des "accidents de la vie" qui declenchent une vente : grand age (escaliers + lit médicalise), séparation (divorce), naissance (besoin de plus grand). Il a une relation de confiance absolue. S\'il dit "Allez voir [Ton Nom], c\'est quelqu\'un de bien", tu as déjà gagne 80 % de la confiance.',
    action: 'Và voir le pharmacien du secteur entre 14h et 15h (hors heures de pointe). Sois impeccable. Présente-toi comme un acteur local qui, comme lui, accompagne les familles. Proposé-lui d\'être une ressource pour ses patients inquiets pour leur maison. Inscris-le dans ton réseau de contacts.',
    script: '"Bonjour, je suis [Ton Nom], conseiller immobilier du quartier. On partage la même clientèle, et je sais que vous êtes un pilier de confiance. Quand un patient vous confie qu\'il est inquiet pour sa maison ou qu\'il doit déménager, donnez-lui simplément ma carte. Je fais une estimation discrété, je conseille sur les aides, et je gère la vente si nécessaire. En tant qu\'apporteur enregistré, vous touchez 6 % de ma commission."',
    routine: 'Passage mensuel discret. Jamais de question sur qui est malade. Feedback de chaque contact. Si le pharmacien refuse les 6 %, proposé de les verser a une association locale.',
    objectif: '1 pharmacien approche, 1 inscription dans ton réseau de contacts',
    duree: '30 min',
  },
  // J5 — Toiletteur pour chiens
  {
    id: 'app-05',
    day: 5,
    apporteurType: 'Toiletteur pour chiens',
    title: 'Partenariat Toiletteur — Le capteur d\'ultra-local',
    pourquoi: 'Pendant que Medor se fait une beaute, le maître discute. Et de quoi ? Du déménagement ("C\'est sa derniere coupe, on part en Bretagne"), de la séparation ("C\'est moi qui garde le chien"), de l\'agrandissement ("On cherché une maison avec jardin"). Le toiletteur sait qui part, qui arrive et qui cherché — bien avant que l\'annonce ne soit sur le marche.',
    action: 'Và voir le toiletteur du secteur en fin de journée. Sois decontracte — pas de costume-cravate. Si tu as un chien, emmene-le ! Présente le partenariat : il te renvoie des clients qui déménagent, toi tu renvoies les nouveaux propriétaires avec chiens.',
    script: '"Bonjour, je suis [Ton Nom], conseiller immobilier sur le quartier. Je cherché souvent des maisons avec jardins pour des familles qui adorent leurs animaux. Si un client vous dit qu\'il déménage ou qu\'il cherché plus grand, glisséz-lui mon nom. En échange, dès que j\'installe une nouvelle famille avec un chien, je leur donne votre carte. Et pour chaque vente, vous touchez 6 % de ma commission."',
    routine: 'Passe une fois par mois avec un café. Si tu as un chien, emmene-le toujours.',
    objectif: '1 toiletteur approche, 1 inscription dans ton réseau de contacts',
    duree: '30 min',
  },
  // J6 — Self-Storage
  {
    id: 'app-06',
    day: 6,
    apporteurType: 'Self-Storage',
    title: 'Partenariat Self-Storage — Le détecteur de transitions',
    pourquoi: 'On ne loue pas un box par plaisir. On loue un box parce qu\'on est dans une phase de transition immobiliere. 3 types de clients pepites : le "Pre-Vente" (desencombre pour le home-staging), la Séparation/Succèsion (entreposé en attendant), et le "Relais" (a vendu mais pas encore trouvé). Le gérant voit passer des dizaines de personnes en plein déménagement.',
    action: 'Và voir le gérant du centre de self-storage. Proposé-lui de laisser tes cartes et tes guides a l\'accueil. En échange, tu recommandés son centre a tous tes clients qui font du home-staging. Enregistre-le dans ton réseau de contacts.',
    script: '"Je vois que vous avez beaucoup de clients en transition immobiliere. Quand quelqu\'un stocke depuis 6 mois et semble stresse par son achat ou sa vente, donnez-lui mon numéro. Je lui offre une heure de conseil strategique pour debloquer sa situation. Pour chaque mise en relation qui aboutit, vous touchez 6 % de ma commission."',
    routine: 'Passe une fois par mois avec un café. Vérifie que tes cartes sont bien en évidence.',
    objectif: '1 self-storage approche, 1 inscription dans ton réseau de contacts',
    duree: '30 min',
  },
  // J7 — Courtier en assurance Pro
  {
    id: 'app-07',
    day: 7,
    apporteurType: 'Courtier en assurance Pro',
    title: 'Partenariat Courtier Assurance — Le partenaire d\'elite',
    pourquoi: 'On parle de l\'assureur qui assure les locaux commerciaux, les entrepots et les flottes d\'entreprises. Il détecte 3 signaux : le "Pivot" Professionnel (l\'artisan qui change de local), la Cession d\'Activite/Retraite (le patron qui arrété), et le Sinistre "Declencheur" (degats des eaux, incendie). Il a une image de conseiller de confiance.',
    action: 'Và voir un cabinet de courtage en assurance spécialise Pro/Entreprise. Proposé-lui de réaliser des estimations gratuites pour ses clients VIP (pour mettre a jour les plafonds d\'assurance). En échange, il te renvoie les clients en transition.',
    script: '"Vos clients ont besoin d\'une valeur venale réélle pour être bien assures. Je proposé de réaliser cet avis de valeur gratuitement pour vos clients VIP. Et si vous voyez un client qui se plaint de la gestion de ses locataires ou qui prépare sa retraite, donnez-lui mon numéro. Pour chaque vente, vous touchez 6 % via ton réseau de contacts."',
    routine: 'Un contact par mois. Offre régulière d\'estimations pour ses clients.',
    objectif: '1 courtier approche, 1 inscription dans ton réseau de contacts',
    duree: '45 min',
  },
  // J8 — Menuisier / Fenêtrès
  {
    id: 'app-08',
    day: 8,
    apporteurType: 'Menuisier / Fenêtrès',
    title: 'Partenariat Menuisier — L\'œil du changement',
    pourquoi: 'Le menuisier est dans les maisons tous les jours. Il sait qui change ses fenêtrès pour vendre, qui refait sa porte d\'entréé pour faire bonne impression, et qui commence des travaux de renovation avant mise en vente. C\'est un observateur privilegie du "pre-vente".',
    action: 'Và voir les menuisiers et poséurs de fenêtrès du secteur. Présente-toi, montre-lui que tu comprends son métier. Proposé le partenariat classique : lui te renvoie des vendeurs potentiels, toi tu renvoies des achetéurs qui veulent refaire leurs fenêtrès.',
    script: '"Je vois souvent vos camions sur le secteur. Vous êtes dans les maisons tous les jours — vous voyez qui prépare une vente avant tout le monde. Quand un client vous dit qu\'il refait ses fenêtrès pour vendre, parlez-lui de moi. Je fais l\'estimation, je gère la vente, et vous touchez 6 %. En échange, tous mes achetéurs qui veulent refaire leurs ouvertures, je leur donne votre carte."',
    routine: 'Passe une fois par mois. Apporte un café ou un petit-déjeuner pour l\'équipe.',
    objectif: '2 menuisiers approches, 1 inscription dans ton réseau de contacts',
    duree: '1h',
  },
  // J9 — Plombier / Electricien
  {
    id: 'app-09',
    day: 9,
    apporteurType: 'Plombier / Electricien',
    title: 'Partenariat Artisans du batiment',
    pourquoi: 'Le plombier et l\'électricien sont dans les maisons a chaque instant. Ils savent qui a un degat des eaux récurrent (vendeur potentiel), qui refait l\'electricite entiere (gros projet), et qui fait des travaux "pour vendre". Ils sont souvent sous-cotes car on pense que leur métier est "technique" — mais ils voient tout.',
    action: 'Và voir 2 artisans du batiment (plombier + électricien). Présente le partenariat. Montre-lui que tu respecte son métier technique. Inscris-les dans ton réseau de contacts.',
    script: '"Vous êtes dans les maisons tous les jours. Vous voyez qui fait des travaux pour vendre, qui a des problèmes récurrents, qui veut partir. Quand vous sentez qu\'un client va vendre, donnez-lui ma carte. Je gère tout, et vous touchez 6 %. C\'est un complément de rêvenu facile."',
    routine: 'Un contact par mois par artisan. Cafe ou petit geste.',
    objectif: '2 artisans approches, 2 inscriptions ton réseau de contacts',
    duree: '1h',
  },
  // J10 — Coiffeur / Barbier
  {
    id: 'app-10',
    day: 10,
    apporteurType: 'Coiffeur / Barbier',
    title: 'Partenariat Coiffeur — Le confident du quartier',
    pourquoi: 'Le coiffeur sait TOUT. Qui divorce, qui herite, qui déménage, qui acheté, qui vend. C\'est le comptoir du village. Les clients parlent pendant 30 minutes, les mains occupees, la tête détendue. Le coiffeur entend des confidences que personne d\'autre n\'entend.',
    action: 'Va chez ton coiffeur (ou un nouveau du secteur). Fais-toi couper les cheveux. Pendant la coupe, discute naturellement. Présente-toi, parle de ton métier. A la fin, proposé le partenoir et inscris-le dans ton réseau de contacts.',
    script: '"Vous êtes le coeur du quartier. Vous entendez tout — qui déménage, qui se sépare, qui cherché plus grand. Si un client vous parle d\'un projet immobilier, glisséz-lui ma carte. En échange, tous mes clients qui s\'installent dans le coin, je leur donne votre adresse. Et pour chaque vente, vous touchez 6 %."',
    routine: 'Passe régulièrement pour te faire couper les cheveux. Un client qui rêvient = un apporteur fidele.',
    objectif: '2 coiffeurs approches, 1 inscription dans ton réseau de contacts',
    duree: '45 min (le temps d\'une coupe)',
  },
  // J11 — Boulanger / Pâtissier
  {
    id: 'app-11',
    day: 11,
    apporteurType: 'Boulanger / Pâtissier',
    title: 'Partenariat Boulanger — Le point de rencontre',
    pourquoi: 'Le boulanger voit tout le monde, tous les jours. Il sait qui arrive, qui part, qui a des enfants, qui est seul. C\'est le point de rencontre du quartier. Et il a une vitrine ideale pour ton panneau "Estimation offerte".',
    action: 'Va chez le boulanger du secteur. Achété une tarte ou des croissants. Discute avec lui. Proposé de posér un panneau dans sa vitrine. Inscris-le dans ton réseau de contacts.',
    script: '"Vous êtes le centre du quartier. Tout le monde passe chez vous. J\'aimerais posér un panneau \'Estimation offerte\' dans votre vitrine. Et si un client vous parle d\'un projet de vente ou d\'achat, glisséz-lui ma carte. Pour chaque vente grâce a vous, vous touchez 6 %."',
    routine: 'Passe achetér ton pain chez lui tous les jours. Un apporteur qu\'on voit tous les jours ne t\'oublie jamais.',
    objectif: '2 boulangers approches, 2 panneaux posés',
    duree: '30 min',
  },
  // J12 — Notaire
  {
    id: 'app-12',
    day: 12,
    apporteurType: 'Notaire',
    title: 'Partenariat Notaire — Le gardien des transitions',
    pourquoi: 'Le notaire gère les successions, les divorces, les ventes obligatoires. Il est au courant des projets de vente avant tout le monde. Mais il est très sollicité — il faut se différencier en apportant de la valeur, pas en demandant des mandats.',
    action: 'Và voir un notaire du secteur. Ne demande pas de mandats. Proposé de l\'aider : tu peux faire des estimations gratuites pour ses clients qui ont besoin de connaître la valeur d\'un bien (succession, donation, divorce). Sois un partenaire, pas un demandeur.',
    script: '"Je suis conseiller immobilier sur le secteur. Je sais que vous accompagnez beaucoup de familles en succession ou en divorce. Je peux réaliser des estimations gratuites pour vos clients qui en ont besoin. C\'est un service que je vous offre — sans contrépartie. Et si un client vous demande un conseiller immobilier de confiance, pensez a moi."',
    routine: 'Un contact par trimestre. Offre des estimations sans contrépartie. Sois patient — la confiance avec un notaire se construit sur des annees.',
    objectif: '1 notaire approche',
    duree: '30 min',
  },
  // J13 — Syndic / Concierge
  {
    id: 'app-13',
    day: 13,
    apporteurType: 'Syndic / Concierge',
    title: 'Partenariat Syndic — L\'œil dans l\'immeuble',
    pourquoi: 'Le syndic et le concierge savent tout ce qui se passe dans l\'immeuble. Qui déménage, qui divorce, qui herite, qui a des problèmes de voisinage, qui ne paie plus ses charges. Ils sont les premiers au courant des changements.',
    action: 'Và voir les syndics et concierges de tes immeubles ciblés. Présente-toi comme un partenaire de confiance. Proposé de les aider quand un copropriétaire veut vendre. Inscris-les dans ton réseau de contacts.',
    script: '"Vous êtes au coeur de la vie de l\'immeuble. Quand un copropriétaire veut vendre, vous êtes souvent le premier au courant. Si ca arrive, donnez-lui ma carte. Je connais bien la copropriété et je saurai le conseiller. Pour chaque vente, vous touchez 6 %."',
    routine: 'Un contact par mois par immeuble. Cafe ou petit geste.',
    objectif: '2 syndics/concierges approches, 1 inscription dans ton réseau de contacts',
    duree: '1h',
  },
  // J14 — Fleuriste
  {
    id: 'app-14',
    day: 14,
    apporteurType: 'Fleuriste',
    title: 'Partenariat Fleuriste — Le témoin des étapes de vie',
    pourquoi: 'Le fleuriste est présent a chaque étape de vie : mariage, naissance, décès, anniversaire. Il sait qui se marie (achat commun), qui a un bebe (besoin de plus grand), qui perd un proche (succession). Et il a une vitrine parfaite pour ton panneau.',
    action: 'Va chez le fleuriste du secteur. Achété un bouquet. Discute avec lui. Proposé le partenoir et un panneau. Inscris-le dans ton réseau de contacts.',
    script: '"Vous accompagnez les gens dans leurs moments de vie. Mariage, naissance, deuil... chaque moment peut être lie a un projet immobilier. Si un client vous parle d\'un déménagement ou d\'une vente, glisséz-lui ma carte. Et pour chaque vente, vous touchez 6 %."',
    routine: 'Passe achetér des fleurs une fois par mois. Un apporteur qu\'on voit régulièrement reste actif.',
    objectif: '1 fleuriste approche, 1 panneau posé',
    duree: '20 min',
  },
  // J15 — Agent immobilier concurrent
  {
    id: 'app-15',
    day: 15,
    apporteurType: 'Agent immobilier concurrent',
    title: 'Partenariat Agent Concurrent — L\'alliance strategique',
    pourquoi: 'Un agent concurrent n\'est pas un ennemi — c\'est un partenaire potentiel. Il a des biens qui ne correspondent pas a son portefeuille, des clients qui cherchént hors de sa zone, des projets qu\'il ne peut pas prendre. Toi, tu fais la même chose. Echangez vos surplus = plus de mandats pour tout le monde.',
    action: 'Contacte 2 agents immobiliers d\'autrès réseaux ou d\'autrès secteurs. Proposé un partenoir de co-intermediation : tu leur renvoies les biens hors de ta zone, ils te renvoient les tiens. Inscris-les dans ton réseau de contacts.',
    script: '"Je travaille sur [secteur]. J\'ai souvent des clients qui cherchént hors de ma zone, et des biens que je ne peux pas prendre. Si vous faites la même chose, on pourrait s\'échanger nos surplus. C\'est gagnant-gagnant. Pour chaque affaire, on partage la commission."',
    routine: 'Un contact par mois. Echange régulier de biens et de clients. Sois honnête — la réputation se construit sur la confiance.',
    objectif: '2 agents approches, 1 partenariat formel',
    duree: '1h',
  },
  // J16 — Garagiste / Carrossier
  {
    id: 'app-16',
    day: 16,
    apporteurType: 'Garagiste / Carrossier',
    title: 'Partenariat Garagiste — Le mécanicien du quartier',
    pourquoi: 'Le garagiste voit tout le monde. Il sait qui a change de voiture (nouveau budget, nouveau style de vie), qui a un accident (changement brutal), qui fait des gros travaux sur sa voiture (a les moyens de faire des travaux sur sa maison). Et les gens parlent pendant qu\'ils attendent.',
    action: 'Va chez le garagiste du secteur. Fais rêviser ta voiture ou prends un rendez-vous. Discute avec lui pendant l\'attente. Proposé le partenoir et un panneau. Inscris-le dans ton réseau de contacts.',
    script: '"Vous connaissez tout le monde sur le secteur. Les gens parlent pendant qu\'ils attendent. Si un client vous parle d\'un déménagement ou d\'un projet de vente, glisséz-lui ma carte. Je gère tout, et vous touchez 6 %. En échange, tous mes clients qui ont besoin d\'un garagiste de confiance, je leur donne votre adresse."',
    routine: 'Passe régulièrement pour ta voiture. Un apporteur qu\'on voit souvent reste actif.',
    objectif: '1 garagiste approche, 1 inscription dans ton réseau de contacts',
    duree: '30 min',
  },
  // J17 — Instituteur / Professeur
  {
    id: 'app-17',
    day: 17,
    apporteurType: 'Instituteur / Professeur',
    title: 'Partenariat Education — Le réseau des familles',
    pourquoi: 'L\'instituteur et le professeur connaissent les familles. Ils savent qui a des enfants en age d\'aller au college (besoin de déménager), qui divorce (deux foyers), qui a des problèmes (vente forcee). Et ils sont des figures de confiance dans le quartier.',
    action: 'Và voir les directeurs d\'ecole ou les professeurs du secteur. Présente-toi comme un parent ou un conseiller local. Proposé de les aider quand une famille a un projet immobilier. Sois discret et respectueux.',
    script: '"Je suis conseiller immobilier sur le secteur, et je connais bien les enjeux des familles qui doivent déménager pour l\'ecole ou le college. Si une famille vous confie des difficultés liees a leur logement, vous pouvez leur donner ma carte. Je les aiderai avec discretion et sérieux."',
    routine: 'Un contact par trimestre. Sois très discret — la confiance se construit lentement.',
    objectif: '1 ecole approche',
    duree: '20 min',
  },
  // J18 — Avocat
  {
    id: 'app-18',
    day: 18,
    apporteurType: 'Avocat',
    title: 'Partenariat Avocat — Le conseiller des transitions',
    pourquoi: 'L\'avocat est au coeur des transitions de vie : divorce, succession, liquidation, procédure. Il sait quand un bien va être vendu bien avant l\'annonce. Et ses clients ont besoin d\'un conseiller de confiance pour estimér et vendre rapidement.',
    action: 'Và voir un avocat du secteur (droit de la famille, droit immobilier). Proposé-lui de réaliser des estimations gratuites pour ses clients. Sois un partenaire professionnel, pas un vendeur.',
    script: '"Je suis conseiller immobilier sur le secteur. Je sais que vous accompagnez beaucoup de clients en divorce ou en succession qui doivent vendre un bien. Je peux réaliser des estimations gratuites et discrêtes pour eux. C\'est un service que j\'offre — sans contrépartie. Pensez a moi si un client vous demande un conseiller de confiance."',
    routine: 'Un contact par trimestre. Estimations gratuites pour ses clients. Sois patient.',
    objectif: '1 avocat approche',
    duree: '30 min',
  },
  // J19 — Relance apporteurs existants
  {
    id: 'app-19',
    day: 19,
    apporteurType: 'Relance',
    title: 'Relance de tous tes apporteurs existants',
    pourquoi: 'Un apporteur qu\'on n\'a pas vu depuis 2 mois est un apporteur mort. La relance régulière est ESSENTIELLE. Aujourd\'hui, tu contactés tous tes apporteurs inscrits pour donner des nouvelles, remercier, et raviver la flamme.',
    action: 'Fais le tour de tous tes apporteurs inscrits dans ton réseau de contacts. Un coup de fil rapide ou un passage rapide pour dire bonjour. Pas de demande de mandat — juste de la présence et de la reconnaissance.',
    script: '"Salut [Prenom] ! Je passais te donner des nouvelles. J\'ai vendu un bien grâce a un apporteur cette semaine — ca m\'a rappelé que je te devais un café ! Tu as des nouvelles de ton cote ? Des clients qui parlent de projet immobilier ?"',
    routine: 'Relance systematique TOUS les apporteurs une fois par mois minimum.',
    objectif: 'Tous les apporteurs inscrits contactés',
    duree: '2h',
  },
  // J20 — Avis Google
  {
    id: 'app-20',
    day: 20,
    apporteurType: 'Avis Google',
    title: 'Relance avis Google + Nouvelles apporteurs',
    pourquoi: 'Les avis Google sont ta vitrine en ligne. Chaque avis positif = un futur client qui te choisit. Et relancer les gens qui se sont engages a mettre un avis montre que tu es sérieux. Aujourd\'hui, double objectif : avis Google + nouvelles apporteurs.',
    action: '1) Appelle ou envoie un message vocal a toutes les personnes qui se sont engagees a mettre un avis Google et qui ne l\'ont pas fait. 2) Appelle tes apporteurs pour des nouvelles — pas pour demander des mandats, juste pour entretenir la relation.',
    script: '"Salut [Prenom] ! Tu m\'avais dit que tu mettrais un avis Google — je te fais un petit rappel, ca prend 2 minutes et ca m\'aide énormément. Et sinon, tu as des nouvelles ? Quelque chose de nouveau dans le secteur ?"',
    routine: 'Relance avis Google une fois par semaine. Appel aux nouvelles une fois par semaine.',
    objectif: '5 relances avis Google, 5 appels aux nouvelles',
    duree: '1h30',
  },
  // J21 — Événement / Visibilite
  {
    id: 'app-21',
    day: 21,
    apporteurType: 'Visibilite',
    title: 'Organise un événement ou une visibilité pour tes apporteurs',
    pourquoi: 'Inviter tes apporteurs a un événement (petit-déjeuner, apéro, atelier) crée du lien, renforcé la relation, et montre que tu es un partenaire sérieux. C\'est aussi l\'occasion de les faire se rencontrer — un réseau d\'apporteurs qui se connaît est plus fort.',
    action: 'Organise un petit événement pour tes apporteurs : petit-déjeuner, apéro, ou simple café collectif. 5-10 personnes maximum. Présente-toi, remercie-les, donne des chiffres (combien de ventes grâce a eux), et montre que ca marche.',
    script: '"Je voulais vous remercier d\'être mes partenaires. Grâce a vous, j\'ai vendu X biens ce mois-ci. J\'aimerais vous inviter a un petit déjeuner pour vous remercier et échanger. C\'est aussi l\'occasion de vous faire rencontrer — peut-être que certains d\'entre vous pourraient aussi faire des affaires entre vous !"',
    routine: 'Un événement par trimestre. 5-10 apporteurs. Petit format, convivial.',
    objectif: '1 événement planifie, 5 invitations envoyees',
    duree: '2h',
  },
  // J22 — Coach sportif / Salle de sport
  {
    id: 'app-22',
    day: 22,
    apporteurType: 'Coach sportif / Salle de sport',
    title: 'Partenariat Salle de sport — Le réseau des nouveaux arrivants',
    pourquoi: 'Les gens qui viennent d\'arriver dans le secteur s\'inscrivent a la salle de sport. Ce sont des achetéurs frais qui cherchént a s\'installer. Et les membres réguliers parlent de leur vie pendant l\'entraînement. Le coach sportif est un excellent capteur de nouveaux arrivants.',
    action: 'Và voir les salles de sport et coachs du secteur. Proposé un partenoir : tu leur envoies les nouveaux résidents qui cherchént une salle, ils te renvoient les membres qui déménagent. Inscris-les dans ton réseau de contacts.',
    script: '"Vous voyez passer beaucoup de nouveaux résidents qui viennent de s\'installer. Je cherché souvent des achetéurs qui viennent d\'arriver dans le secteur. Si un membre vous dit qu\'il déménage ou qu\'il connaît quelqu\'un qui cherché a achetér, glisséz-lui ma carte. Pour chaque vente, vous touchez 6 %."',
    routine: 'Un contact par mois. Inscris-toi a la salle — un membre régulier = un apporteur fidele.',
    objectif: '1 salle de sport approchee, 1 inscription dans ton réseau de contacts',
    duree: '30 min',
  },
  // J23 — Restaurateur / Traiteur
  {
    id: 'app-23',
    day: 23,
    apporteurType: 'Restaurateur / Traiteur',
    title: 'Partenariat Restaurateur — Le creuset du quartier',
    pourquoi: 'Le restaurant est le lieu ou les gens parlent. Entre deux plats, on discute de sa vie — du déménagement, de la succession, de l\'heritage. Le restaurateur entend tout. Et il a une vitrine ideale pour ton panneau.',
    action: 'Va chez le restaurateur du secteur. Mange un plat. Discute avec le patron. Proposé un panneau et le partenoir. Inscris-le dans ton réseau de contacts.',
    script: '"Votre restaurant est le coeur du quartier. Les gens parlent de leur vie ici. Si un client vous parle d\'un projet immobilier, glisséz-lui ma carte. Je gère tout, et vous touchez 6 %. En échange, tous mes clients qui s\'installent, je leur recommandé votre table."',
    routine: 'Mange chez lui une fois par mois. Un apporteur qu\'on voit régulièrement reste actif.',
    objectif: '1 restaurateur approche, 1 panneau posé',
    duree: '45 min',
  },
  // J24 — Bilan apporteurs
  {
    id: 'app-24',
    day: 24,
    apporteurType: 'Bilan',
    title: 'Bilan mensuel de tes apporteurs — Qui delivre ?',
    pourquoi: 'Chaque mois, tu dois faire le bilan de ton réseau d\'apporteurs. Qui a envoyé des contacts ? Qui est silencieux ? Qui délivre des mandats ? C\'est le moment de remercier les bons, relancer les inactifs, et remplacer ceux qui ne fonctionnent pas.',
    action: 'Ouvre ton réseau de contacts et ton CRM. Fais le bilan : combien d\'apporteurs actifs ? Combien de contacts reçus ? Combien de R1 ? Combien de mandats ? Combien de commissions payees ? Remercie les bons avec un petit geste. Relance les inactifs. Remplace les inactifs persistants par de nouveaux.',
    script: 'Pas de script — c\'est un travail individuel. Regarde tes chiffres, prends des decisions.',
    routine: 'Bilan mensuel obligatoire. Le premier vendredi de chaque mois.',
    objectif: 'Bilan complet, 3 remerciements, 5 relances, 2 nouveaux apporteurs a troucher',
    duree: '1h',
  },
];

// Fonction pour obtenir l'action d'apporteur du jour
export function getApporteurActionForDay(currentDay: number): ApporteurAction {
  const cycleLength = apporteurActionsCycle.length; // 24 jours
  const cycleDay = ((currentDay - 1) % cycleLength) + 1;
  return apporteurActionsCycle.find(a => a.day === cycleDay) || apporteurActionsCycle[0];
}

// Fonction pour obtenir les actions de la semaine
export function getWeekApporteurActions(weekStartDay: number): ApporteurAction[] {
  const actions: ApporteurAction[] = [];
  for (let i = 0; i < 7; i++) {
    actions.push(getApporteurActionForDay(weekStartDay + i));
  }
  return actions;
}
