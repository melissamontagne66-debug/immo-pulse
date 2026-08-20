// Actions de prospection terrain — cycle de 90 jours (3 mois)
// Rotation : après le jour 90, on recommence au jour 1
// 5 types d'actions principaux qui alternent :
// 1. Estimation patrimoniale offerte (flyers biens vendus/en vente/recherche acquéreur)
// 2. Apporteurs d'affaires (panneaux "Estimation offerte" rémunérés)
// 3. Commerçants (flyers sur le comptoir, QR code, échanges)
// 4. Contact terrain (picking — outil interne, recherche acquéreur, RDV)
// 5. Rapport local immobilier (envoi aux propriétaires du secteur)
// 6. PIGE Légale (SMS prospection)
// 7. Inter-cabinets
// 8. Tâches proactives mandat

export type ProspectionCategory =
  | 'estimation'
  | 'apporteurs'
  | 'commerçants'
  | 'picking'
  | 'rapport-local'
  | 'relances'
  | 'inter-cabinets'
  | 'social'
  | 'mandat-proactif';

export interface ProspectionAction {
  id: string;
  day: number;
  category: ProspectionCategory;
  title: string;
  description: string;
  script: string;
  objectif: string;
  duree: string;
  titleEs?: string;
  descriptionEs?: string;
  scriptEs?: string;
  objectifEs?: string;
  dureeEs?: string;
}

const categories: Record<ProspectionCategory, { label: string; color: string; icon: string }> = {
  estimation: { label: 'Estimation patrimoniale offerte', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '📊' },
  apporteurs: { label: 'Apporteurs d\'affaires', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🤝' },
  commerçants: { label: 'Commerçants', color: 'bg-green-100 text-green-700 border-green-200', icon: '🏪' },
  picking: { label: 'Contact terrain', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🚪' },
  'rapport-local': { label: 'Rapport local immobilier', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📈' },
  'inter-cabinets': { label: 'Inter-cabinets', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: '🔄' },
  'relances': { label: 'Relances mensuelles', color: 'bg-lime-100 text-lime-700 border-lime-200', icon: '📬' },
  'social': { label: 'Réseaux sociaux', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200', icon: '📱' },
  'mandat-proactif': { label: 'Actions proactives mandat', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: '🚀' },
};

// === CYCLE DE 90 JOURS ===
// Mois 1 : fondations + acquisition méthode
// Mois 2 : intensification + diversification apporteurs
// Mois 3 : optimisation + pérennisation

const actionsCycle: ProspectionAction[] = [
  // ========== SEMAINE 1 — FONDATIONS ==========
  // J1 — ACTION ADAPTÉE AU PROFIL (anciennement J13)
  {
    id: 'p-01',
    day: 1,
    category: 'estimation',
    title: 'Action recommandée — Sors sur le terrain et fais parler de toi !',
    description: `🗓 **ACTION URGENTE — Bloque ton agenda maintenant :** Mets 2h de prospection dans ton agenda chaque jour du lundi au vendredi. Chaque jour ouvré, au créneau de ton choix : 11 h – 13 h 30 ou 17 h – 19 h. Ces 2h sont sacrées — terrain, PIGE, réseaux sociaux, tout ce qui te met au contact des propriétaires compte.

**Si tu es débutant** : Tu débutes et ton fichier est encore petit — parfait, c'est normal. Aujourd'hui : du terrain classique.

Sélectionne 2 biens en vente sur ton outil interne, va taper aux portes de ces biens puis chez les voisins dans cette rue ou très proche.
Toque aux biens ciblés + 10 voisins.

**À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et prends le RDV pour une première visite, puis une fois que tu as posé de nombreuses questions pour bien vérifier si ça correspond à ce que tes acheteurs cherchent : "Je vous propose qu'on fasse un premier rdv, je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez. Donc pour prendre l'ensemble des détails techniques et en parler aux acheteurs, et rapidement les amener en visite vous préférez le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — c'est une estimation patrimoniale offerte — autrement dit un avis de valeur indicatif. Il n'a pas de valeur opposable pour une assurance ou une succession (seule une expertise certifiée en a), mais il aide à y voir clair, même sans projet immédiat.

Pas de fichier ancien ? Pas de problème. Chaque porte toquée aujourd'hui = un contact à relancer sous 3 à 6 mois. Ce que tu construis aujourd'hui, tu le récolteras dans 6 mois.

**Si tu es confirmé** : Ta force, c'est ton fichier. Aujourd'hui tu relances tes anciens clients : vendeurs et acheteurs.

"Bonjour, c'est [Ton prénom], je repassais vers vous pour prendre de vos nouvelles. Votre installation se passe bien ?" Écoute, montre que tu te soucies d'eux.

Puis demande naturellement : "Au fait, j'ai changé d'agence / de réseau — qui connaissez-vous autour de vous qui envisage de vendre, de chercher un bien, ou qui souhaite simplement connaître la valeur de son patrimoine ?"

Chaque ancien client satisfait = 2 à 3 recommandations naturelles.`,
    script: 'Conseil méthodo — Que tu sois débutant ou confirmé, l\'essentiel est de BOUGER aujourd\'hui. Pas d\'excuse. Sélectionne tes biens en vente sur ton outil interne, prépare ton angle, et sors. Tes scripts et mémos de formation sont à ta disposition.',
    objectif: '🎯 Débutant : 2 biens en vente ciblés, 10 portes toquées, 1 R1 minimum // Confirmé : 10 anciens clients relancés, 2 recommandations obtenues',
    duree: '11 h – 13 h 30 ou 17 h – 19 h',
  },
  // J2 — Apporteurs : panneaux avec sélection ciblée
  {
    id: 'p-02',
    day: 2,
    category: 'apporteurs',
    title: 'Apporteurs — Sélectionne et pose tes panneaux "Estimation offerte"',
    description: `Aujourd\'hui : sélectionne 2 à 3 apporteurs d\'affaires Bien placés sur ton secteur, avec du passage, et à qui tu vas proposer de mettre un panneau "Estimation offerte".\n\nLe panneau se met à leur fenêtre, visible depuis la rue.\n\nLe deal est simple :\n→ Tu l\'enregistres en apporteur d\'affaires officiel\n→ Dès qu\'il y a un appel entrant, tu demandes sur quel panneau ils ont eu tes coordonnées, et tu transmets l\'info à l\'apporteur dans le cadre du programme de recommandation de ton réseau — c\'est lui qui gère la contrepartie prévue, dans les règles (loi Hoguet). Ne promets jamais de rémunération directe à un particulier\n\nChaque panneau posé = un apporteur qui travaille pour toi 24h/24.\n\n**Méthodologie** : Pose le panneau pour qu\'il soit bien en vue, enregistre-le en apporteur d\'affaires officiel et prends une photo à publier sur tes réseaux sociaux.`,
    script: 'Conseil méthodo — Tes scripts et mémos de formation sont à ta disposition pour aborder tes apporteurs. Choisis des emplacements stratégiques : rue passante, angle de rue, proximité d\'arrêt de bus. La visibilité = l\'efficacité.',
    objectif: '🎯 2-3 apporteurs sélectionnés et approchés, 2 panneaux "Estimation offerte" posés minimum, 2 apporteurs enregistrés dans ton CRM',
    duree: '10h-12h',
  },
  // J3 — Commerçants : flyers avec QR code
  {
    id: 'p-03',
    day: 3,
    category: 'commerçants',
    title: 'Commerçants — Flyers VENDU + EN VENTE avec QR code',
    description: `**Cette action s'active dès que tu as au moins 1 mandat OU 1 vente d'enregistrée.**\n\n**Avant de commencer** : Demande le fichier de flyer pré-conçu à ton manager, pour gagner un temps précieux. Tu peux en imprimer uniquement 100 ou 200 maxi, c'est suffisant.\n\nPrépare TON flyer : un seul flyer avec 2 produits — un bien VENDU (secteur uniquement, pas d\'adresse précise) et un bien EN VENTE actuel. Ajoute un QR code "Voir l\'ensemble des biens actualisés" pour que les gens puissent aller sur ton site voir tous tes biens, même si le flyer n\'en montre que 2.\n\nVa voir tes 5 commerçants partenaires. Laisse les flyers sur le comptoir, discute des nouvelles du quartier.\n\n**Conseil crucial** : Ne reste pas seul avec le commerçant ! Quand des clients attendent chez le commerçant, plaisante avec eux, inclue-les dans la conversation. Parle du marché immobilier du secteur, demande-leur s\'ils connaissent la valeur de leur bien. C\'est souvent comme ça que de nouveaux contacts naissent — les gens aiment donner leur avis et se sentir inclus.\n\nChaque flyer sur un comptoir = des yeux qui voient ton activité.`,
    script: 'Conseil méthodo — Le QR code est essentiel : il transforme un flyer statique en porte d\'entrée vers tous tes biens. Les gens scannent par curiosité, et tombent peut-être sur LE bien qui les intéresse. N\'oublie pas d\'inclure les clients qui attendent chez le commerçant — c\'est ta cible !',
    objectif: '🎯 5 commerçants revisités avec nouveaux flyers, 10 flyers déposés, 2 nouveaux contacts qualifiés (dont 1 client du commerce)',
    duree: '10h-12h',
  },
  // J4 — Estimation : secteur avec bien vendu (version 1/3)
  {
    id: 'p-04',
    day: 4,
    category: 'estimation',
    title: 'Rapport local immobilier — Ton arme de prospection massive',
    description: `Génère ton rapport local immobilier ultra détaillé avec notre outil interne (3 min max pour l'éditer) et va à la rencontre des propriétaires de ton secteur pour le leur proposer ou à leur entourage (en échange de l'adresse email pour le leur envoyer).\n\n**Comment l'utiliser :**\n1. Génère ton rapport local avec l'outil interne (max 3 min)\n2. Envoie-le à tes contacts de ce secteur\n3. Sélectionne 10 propriétaires ciblés dans ton secteur (voisins de biens vendus, contacts existants, rue à conquérir)\n4. "Je suis [Ton prénom], conseiller immobilier sur le secteur. Je viens de publier un rapport très complet sur l'évolution des prix dans votre quartier. Ça peut vous intéresser pour connaître la valeur de votre patrimoine, ou pour votre entourage. Si vous me laissez votre email, je vous l'envoie immédiatement."\n5. Profite-en pour discuter avec eux et proposer une estimation patrimoniale ou les enregistrer comme apporteurs.\n\nChaque rapport envoyé = un contact chaud + une preuve de ton expertise.\n\n💡 **Ce rapport te servira 1 à 2 mois.** Conserve-le précieusement. La prochaine fois que l'action "rapport local" revient, tu n'as pas besoin de le régénérer — tu iras sur le terrain près de biens en vente (recherche acheteurs) ET proposeras ce même rapport déjà détaillé. Une pierre deux coups.`,
    script: 'Conseil méthodo — Le rapport local est une machine à R1. Il te prouve ton expertise, apporte une valeur concrète au propriétaire, et te donne une raison naturelle de recontacter. Envoie-le par email puis appelle pour discuter. Objectif : 10 propriétaires contactés, 5 emails récoltés, 1 R1 estimation minimum.',
    objectif: '🎯 1 rapport local généré, 10 propriétaires contactés, 5 adresses emails récoltées, 1 R1 estimation minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J5 — Contact terrain : rue entière
  {
    id: 'p-05',
    day: 5,
    category: 'picking',
    title: 'Contact terrain — Conquête d\'une rue entière',
    description: `Choisis une rue que tu ne connais pas bien. Sélectionne 2 biens en vente sur ton outil interne dans cette rue ou très proche. Toque au bien + aux 8 voisins.\n\n**À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et prends le RDV pour une première visite, puis une fois que tu as posé de nombreuses questions pour bien vérifier si ça correspond à ce que tes acheteurs cherchent : "Je vous propose qu'on fasse un premier rdv, je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez. Donc pour prendre l'ensemble des détails techniques et en parler aux acheteurs, et rapidement les amener en visite vous préférez le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — c'est une estimation patrimoniale offerte — autrement dit un avis de valeur indicatif. Il n'a pas de valeur opposable pour une assurance ou une succession (seule une expertise certifiée en a), mais il aide à y voir clair, même sans projet immédiat.\n\nL\'objectif n\'est pas de vendre aujourd\'hui — c\'est d\'obtenir un RDV d\'estimation patrimoniale offerte.\n\nChaque R1 obtenu = un mandat potentiel dans 30-90 jours ou une recommandation pour leur entourage, puisqu\'ils savent ton sérieux, tes méthodes et qu\'ils t\'ont vu à l\'œuvre.`,
    script: 'Conseil méthodo — Conquiers une rue entière : toque au bien + 8 voisins. Chaque porte toquée = un contact enregistré dans le CRM. Propose systématiquement une estimation patrimoniale — c\'est ta mission première. Idéalement, présente-toi avec un seul flyer.',
    objectif: '🎯 2 biens en vente ciblés sur ton outil, 10 portes voisines, 1 R1 estimation minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J6 — Contact terrain (nouvelle action)
  {
    id: 'p-06',
    day: 6,
    category: 'picking',
    title: 'Contact terrain — Tournée de relance post-R1',
    description: `Tu as fait un R1 récemment ? Parfait. Avant de rentrer, toque aux 5 portes autour du bien que tu viens de visiter.

**La question magique :** "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"

Chaque R1 = 5 portes de plus touchées sans effort supplémentaire. En 1 semaine, ça fait 15-25 portes en plus rien qu'en sortant de tes rendez-vous.

Si personne n'est là, glisse un mot dans la boîte aux lettres (voir la méthode dans les actions de picking).`,
    script: 'Conseil méthodo — Le post-R1 systématique est la CLE. 5 portes après chaque R1 = 15-25 portes par semaine sans effort additionnel. Chaque porte toquée = un contact enregistré.',
    objectif: '🎯 5 portes post-R1 par R1 fait aujourd\'hui, 1 estimation spontanée minimum',
    duree: '15 min après chaque R1',
  },
// J7 — Commerçants : nouveaux contacts périphérie + clients
  {
    id: 'p-07',
    day: 7,
    category: 'commerçants',
    title: 'Commerçants — Nouveaux contacts en périphérie',
    description: `Cherche de nouveaux commerçants partenaires dans des zones où tu n\'es pas encore passé.\n\nPrésente-toi avec ton flyer (1 vendu + 1 en vente + QR code).\n\n**Conseil** : Quand des clients attendent chez le commerçant, inclue-les ! Dis : "Vous connaissez la valeur de votre bien sur ce secteur ? C\'est fou comment le marché a bougé..." Les gens aiment parler immobilier, et tu crées un contact naturel sans pression.\n\nObjectif : 2 nouveaux commerçants partenaires aujourd\'hui.`,
    script: 'Conseil méthodo — Inclue les clients qui attendent — c\'est ta cible ! Ils sont détendus, en confiance grâce au commerçant, et curieux. Un échange de 2 minutes peut déboucher sur un RDV d\'estimation. Tes scripts sont dans tes mémos.',
    objectif: '🎯 3 nouveaux contacts qualifiés, 1 panneau "Estimation offerte" posé chez un nouveau commerçant, 2 apporteurs enregistrés',
    duree: '10h-12h',
  },

  // ========== SEMAINE 2 — INTENSIFICATION ==========
  // J8 — Estimation : secteur avec bien EN VENTE (version 2/3)
  {
    id: 'p-08',
    day: 8,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Bien EN VENTE actuellement"',
    description: `Tu as un bien EN VENTE dans une rue ? Utilise-le comme levier.\n\nImprime ton flyer avec le bien EN VENTE (photo, prix, secteur) et "Estimation offerte pour les voisins — je connais les acheteurs de ce secteur".\n\nToque aux 10 portes.\n\nAngle : "Ce bien est en vente chez vos voisins sur le secteur, j\'organise les visites ce week-end. J\'ai entendu dire qu\'il y avait un bien en vente, vous en avez entendu parler ? Je vous propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. Et puis c\'est ça la base même de mon métier : apporter une information fiable aux habitants de mon secteur."\n\nLe bien en vente = crédibilité instantanée.`,
    script: 'Conseil méthodo — Le bien EN VENTE = crédibilité instantanée. Tu organises les visites ce week-end, tu connais les acheteurs du secteur. "J\'ai entendu dire qu\'il y avait un bien en vente, vous en avez entendu parler ?" — cette question engage la conversation sans être directif.',
    objectif: '🎯 10 portes toquées avec levier "EN VENTE", 3 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J9 — Contact terrain : post-R1
  {
    id: 'p-09',
    day: 9,
    category: 'picking',
    title: 'Contact terrain post-R1 — Capitaliser sur chaque rendez-vous',
    description: `Tu viens de faire un R1 ou une estimation ? Parfait. Avant de repartir, toque aux 5 portes autour.\n\n"Je viens d\'estimer le bien de vos voisins, j\'apporte une info sur la valeur du patrimoine de cette rue. Que vous ayez un projet de vente ou pas, peu importe, c\'est toujours important de connaître la valeur de son patrimoine, pour les projets futurs, pour les assurances, ou les successions. Donc je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. Et puis c\'est ça la base même de mon métier, apporter une information fiable aux habitants de mon secteur."\n\nChaque R1 = une occasion d\'aller au contact immédiate. Tu deviens LE conseiller de la rue.`,
    script: 'Conseil méthodo — Chaque R1 = occasion d\'aller au contact immédiate. Toque 5 portes autour après chaque rendez-vous. "Que vous ayez un projet de vente ou pas, peu importe" — cette phrase désamorce le refus. Tes scripts sont dans tes mémos.',
    objectif: '🎯 5 portes toquées après chaque R1, 1 estimation spontanée déclenchée',
    duree: '15 min après chaque R1',
  },
  // J10 — Apporteurs : challenge + nouveaux apporteurs originaux
  {
    id: 'p-10',
    day: 10,
    category: 'apporteurs',
    title: 'Apporteurs — Challenge et nouveaux apporteurs originaux',
    description: `Lance un challenge entre tes apporteurs : "Celui qui me fait le plus de mises en relation qualifiées ce mois-ci, je lui offre un dîner au meilleur resto du coin".\n\nAujourd\'hui, trouve 1 NOUVEAU apporteur ORIGINAL que tu n\'as jamais approché. Voici des idées :\n• **Cuisiniste** — Le client hésite à signer un devis de 15 000€ s\'il ne sait pas s\'il va récupérer l\'argent à la vente\n• **Brocanteur / vide-maison** — Quand on vide une maison de fond en comble, c\'est parce qu\'elle va être vendue (succession, EHPAD)\n• **Pharmacien** — Le confident du quartier, il sait qui part en maison de retraite ou qui divorce\n• **Toiletteur pour chiens** — Les maîtres parlent de leur vie pendant que Médor se fait toiletter\n\nTes scripts détaillés pour chaque apporteur sont dans tes mémos de formation.`,
    script: 'Conseil méthodo — Tes scripts et mémos de formation sont à ta disposition. Lance un challenge pour motiver tes apporteurs actifs, et trouve 1 nouvel apporteur original aujourd\'hui. Les apporteurs sous-exploités (cuisinistes, brocanteurs...) ont souvent des contacts de meilleure qualité que les apporteurs classiques.',
    objectif: '🎯 1 challenge lancé entre tes apporteurs, 1 nouvel apporteur original enregistré dans ton CRM',
    duree: '1h',
  },
  // J11 — Commerçants : mise à jour flyers
  {
    id: 'p-11',
    day: 11,
    category: 'commerçants',
    title: 'Commerçants — Mise à jour flyers + nouveautés du mois',
    description: `Retire les vieux flyers de tes commerçants (ceux de plus de 3 semaines / 1 mois). Remplace-les par des nouveaux : un "VENDU" frais et un "EN VENTE" actuel, avec ton QR code.\n\nDiscute des nouvelles du quartier : "Vous avez entendu parler de quelqu\'un qui vend ? Qui déménage ?"\n\n**Conseil** : Inclue les clients qui attendent ! C\'est souvent eux qui ont le projet immobilier caché. Une conversation de 3 minutes peut déboucher sur un RDV.\n\nChaque mise à jour = une nouvelle conversation = un nouveau contact potentiel. N\'oublie pas de remercier systématiquement.`,
    script: 'Conseil méthodo — Retire les vieux flyers (+3 semaines), remplace par des nouveaux avec QR code. Discute 5 min des nouvelles du quartier. Inclue les clients qui attendent — c\'est ta meilleure cible ! Toujours remercier, même sans contact.',
    objectif: '🎯 5 commerçants mis à jour avec flyers frais, 10 flyers neufs déposés, 1 nouveau contact qualifié',
    duree: '45 min',
  },
  // J12 — Contact terrain : Annonce de transaction (remplace "Sous offre/Vendu")
  {
    id: 'p-12',
    day: 12,
    category: 'picking',
    title: 'Contact terrain — Annonce de transaction fraîche',
    description: `Un bien est passé "Sous offre", "Compromis signé" ou "Vendu" dans une rue ? C\'est l\'occasion idéale.\n\nLes voisins se demandent tous : "Combien ça a été vendu ? Est-ce que mon bien vaut pareil ?"\n\nToque avec un flyer "VENDU sur le secteur — Estimation offerte pour les voisins".\n\n"Vos voisins ont vendu, le marché bouge sur cette rue. Voulez-vous savoir ce que vaut votre bien aujourd\'hui ? Je vous apporte une info fiable sur la valeur de votre patrimoine."\n\nLe FOMO (fear of missing out) est ton allié.`,
    script: 'Conseil méthodo — "Annonce de transaction fraîche" sonne mieux que "Sous offre/Vendu". Le FOMO est ton allié. Un bien vendu dans la rue = le voisin se demande "Combien ?". Propose une estimation patrimoniale offerte — c\'est ta mission première.',
    objectif: '🎯 1 transaction annoncée avec flyer, 8 portes toquées, 2 estimations offertes',
    duree: '11h-13h ou 17h-19h',
  },
  // J13 — PIGE Légale (SMS prospection)
  {
    id: 'p-13',
    day: 13,
    category: 'relances',
    title: 'Relances mensuelles — Prospects et estimations',
    description: `Aujourd'hui : ta session de relances mensuelles — 30 minutes pour relancer tes prospects et tes estimations passées.

**Le principe :** Tu relances les contacts que tu as déjà rencontrés : estimations faites, prospects qualifiés, et anciens clients. Le but est de transformer ces contacts en R1.

**Ta méthode (30 min chrono) :**
1. Ouvre ton CRM et liste tes contacts des 30 derniers jours
2. Sélectionne 5-8 contacts prioritaires (estimations non suivies, prospects chauds, contacts J+7 à J+30)
3. Envoie un message court et personnalisé :
   "Bonjour [Prénom], c'est [Ton prénom]. Je repassais vers vous car je me disais que votre situation avait peut-être évolué. Seriez-vous ouvert à un échange rapide ?"
4. Quand un contact te rappelle : écoute, montre que tu te souviens de lui, et propose un R1.

Chaque relance = un R1 potentiel. Ton fichier est ton actif numéro 1.`,
    script: 'Conseil méthodo — La PIGE Légale est ultra-puissante car le propriétaire TE rappelle. Envoie très tôt le matin pour que les vendeurs rappellent dans la journée. Ne fais jamais l\'appel sans être devant la bonne annonce. Tes modèles de messages sont dans tes mémos de formation.',
    objectif: '🎯 5-8 messages envoyés en 30 min, 2-3 réponses dans la journée, 1 R1 fixé',
    duree: '30 min (7h-8h30)',
  },
  // J14 — Terrain pur + rapport local
  {
    id: 'p-14',
    day: 14,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Ton arme de prospection massive',
    description: `Génère ton rapport local immobilier ultra détaillé avec notre outil interne (max 3 min pour l\'éditer) et va au contact des propriétaires de ton secteur pour le leur proposer ou pour leur entourage (contre adresse email pour leur envoyer).\n\n**Ta méthode** :\n1. Génère ton rapport local avec l\'outil interne (3 min max)\n2. Sélectionne 10 propriétaires ciblés sur ton secteur (voisins de biens vendus, contacts existants, rue à conquérir)\n3. Toque à leur porte ou appelle-les : "Je suis [Ton prénom], conseiller immobilier sur le secteur. Je viens de publier un rapport très complet sur l\'évolution des prix dans votre quartier. Ça peut vous intéresser pour connaître la valeur de votre patrimoine, ou pour votre entourage. Si vous me laissez votre email, je vous l\'envoie immédiatement."\n4. Profite-en pour discuter avec eux et pour finir par leur proposer une estimation patrimoniale ou de les enregistrer en apporteurs d\'affaires.\n\nChaque rapport envoyé = un contact chaud + une preuve de ton expertise.

💡 **Ce rapport te servira 1 à 2 mois.** Garde-le précieusement. La prochaine fois que l'action "rapport local" revient, tu n'as pas besoin de le régénérer — tu iras sur le terrain proche de biens en vente (recherche acquéreurs) ET tu proposeras ce même rapport local déjà détaillé. Une pierre deux coups.`,
    script: 'Conseil méthodo — Le rapport local est une machine à R1. Il prouve ton expertise, apporte une valeur concrète au propriétaire, et te donne une raison naturelle de recontacter. Profite de l\'échange pour proposer l\'estimation ou enregistrer l\'apporteur. Tes scripts sont dans tes mémos.',
    objectif: '🎯 1 rapport local généré, 10 propriétaires contactés, 5 adresses emails collectées, 1 R1 estimation minimum',
    duree: '11h-13h ou 17h-19h',
  },

  // ========== SEMAINE 3 — DIVERSIFICATION APPORTEURS ==========
  // J15 — Estimation : recherche acquéreur (version 3/3)
  {
    id: 'p-15',
    day: 15,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Recherche acquéreur active"',
    description: `Tu recherches activement un acquéreur pour un bien sur ce secteur ? Parfait, c\'est ton levier.\n\nImprime ton flyer : "Je recherche activement un acquéreur sur ce secteur — Estimation offerte pour les voisins".\n\nToque aux 10 portes.\n\nAngle : "J\'ai entendu dire qu\'il y avait un bien en vente sur ce secteur, vous en avez entendu parler ? Je recherche activement un acquéreur et du coup je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. Et puis c\'est ça la base même de mon métier : apporter une information fiable aux habitants de mon secteur."\n\nTu viens avec une VRAIE recherche acquéreur — ce n\'est pas du démarchage, tu apportes de la valeur.`,
    script: 'Conseil méthodo — "J\'ai entendu dire qu\'il y avait un bien en vente, vous en avez entendu parler ?" — cette question ouvre la conversation naturellement. Tu n\'es pas un démarcheur, tu es un conseiller qui a un acheteur sérieux. Chaque estimation offerte = un futur mandat.',
    objectif: '🎯 10 portes toquées avec levier "Recherche acquéreur", 3 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J16 — Apporteurs : cuisiniste
  {
    id: 'p-16',
    day: 16,
    category: 'apporteurs',
    title: 'Apporteurs — Cibler les cuisinistes du secteur',
    description: `Le cuisiniste est le premier au courant du projet de vie. Un proprio qui veut vendre se dit : "Si je refais la cuisine, je vendrai plus cher". Il va voir le cuisiniste AVANT l\'agent immobilier.\n\n**Ton script** :\n"Je vous propose un partenariat pour transformer vos devis dormants en ventes. Quand un client hésite à signer parce qu\'il a un projet de vente, parlez de moi. Je fais l\'estimation, je conseille sur la rentabilité des travaux, et si le vendeur ne fait pas les travaux, je présente vos plans 3D à tous mes acheteurs. Vous touchez 6 % de ma commission via Propertips."\n\nTrouve 2 cuisinistes sur ton secteur et lance-toi !`,
    script: 'Conseil méthodo — Le cuisiniste est bloqué : le client hésite à signer un devis de 15 000€. Tu deviens son sauveur en apportant la clarté sur la plus-value. Tes scripts complets pour les cuisinistes sont dans tes mémos.',
    objectif: '🎯 2 cuisinistes contactés, 1 partenariat conclu minimum',
    duree: '1h',
  },
  // J17 — Commerçants : routine
  {
    id: 'p-17',
    day: 17,
    category: 'commerçants',
    title: 'Commerçants — Routine hebdomadaire',
    description: `Va voir tes 5 commerçants partenaires. Flyers frais (VENDU + EN VENTE + QR code), discute des nouvelles du quartier.\n\n**Conseil** : Inclue systématiquement les clients qui attendent. Parle du marché, demande s\'ils connaissent la valeur de leur bien. C\'est ta méthode de prospection la plus naturelle.\n\nRetire les vieux flyers (+3 semaines / 1 mois).`,
    script: 'Conseil méthodo — La routine hebdo avec les commerçants crée la constance. Les commerçants deviennent tes relais, et les clients qui attendent deviennent tes contacts. N\'oublie jamais le QR code sur tes flyers !',
    objectif: '🎯 5 commerçants revisités, 10 flyers déposés, 1 nouveau contact',
    duree: '45 min',
  },
  // J18 — Contact terrain : rue inexplorée
  {
    id: 'p-18',
    day: 18,
    category: 'picking',
    title: 'Contact terrain — Conquête d\'une zone inexplorée',
    description: `Choisis une rue ou un quartier où tu n\'es JAMAIS allé.\n\nSélectionne 3 biens en vente sur ton outil dans cette zone ou très proche.\n\nToque au bien + aux 10 voisins.\n\nTon angle : **À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et finis par dire qu'effectivement ça a l'air de coller avec la recherche de tes acheteurs. Prends le RDV pour une première visite : "Je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez — pour prendre l'ensemble des détails techniques et en parler aux acheteurs, pour rapidement les amener en visite. Plutôt le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — tu apportes une info fiable sur la valeur de leur patrimoine. Ça sert toujours, même sans projet immédiat.\n\nChaque nouvelle rue conquise = un territoire de plus où tu es LE conseiller.

**Si la personne n'est pas là**, écris un mot rapidement sur papier libre :
"Bonjour, je suis en recherche très active, j'ai entendu dire qu'il y avait un bien en vente dans cette rue qui pourrait apparemment correspondre à ce que je recherche. Je recherche une maison/appartement, de minimum Xm², avec X chambres, + un critère particulier du bien (identifié sur l'annonce) et absolument dans ce secteur. Si toutefois vous êtes au courant de quelque chose, merci de me rappeler ou de m'envoyer un SMS. [Ton prénom]"

On plie en deux et on met dans la boîte aux lettres (moins de chance d'être jeté qu'un flyer et tu ne seras pas passé pour rien à cette porte, ça attise la curiosité).\n\n⚡ Astuce : emmène un panneau "Estimation offerte". Si tu trouves un apporteur sympa dans la zone, pose-le direct.`,
    script: 'Conseil méthodo — Du terrain, du terrain, du terrain. C\'est le seul moteur de ton business. Sélectionne des biens en vente, toque, enregistre, relance. Rien de plus. Un seul flyer suffit.',
    objectif: '🎯 3 biens en vente ciblés dans une nouvelle zone, 13 portes toquées, 2 contacts qualifiés minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J19 — PIGE Légale (2x par semaine)
  {
    id: 'p-19',
    day: 19,
    category: 'relances',
    title: 'Relances mensuelles — Relance de tes estimations et contacts',
    description: `Ta session PIGE Légale du jour — 30 minutes chrono.

**Ta méthode :**
1. **Très tôt le matin** (7h-8h30) : scanne les nouvelles annonces de ton secteur
2. Sélectionne 5-8 biens qui correspondent à tes recherches acquéreurs
3. Envoie tes messages personnalisés AVANT 9h
4. Quand un propriétaire te rappelle : **ne fais JAMAIS l'appel sans être devant la bonne annonce.** Redemande les infos basiques du bien et le prix pour les avoir sous les yeux. Si tu n'es pas disponible, calme un moment pour le rappeler en étant au calme.

**Cette semaine :** varie ton angle. Si la semaine dernière tu parlais de tes acquéreurs, cette semaine parle d'une estimation offerte : "Je suis [Ton prénom], conseiller immobilier sur [secteur]. Je suis en train de constituer mes rapports locaux et je voudrais inclure votre bien. Seriez-vous ouvert à une estimation offerte sans engagement ?"

Les vendeurs rappellent dans la journée — sois prêt.\n\n📌 La stratégie complète de la PIGE (celle mise au point par ton réseau) est dans tes vidéos de formation — regarde-les si tu ne la maîtrises pas encore. Et avant tout appel à un particulier, vérifie qu'il n'est pas inscrit sur Bloctel : c'est la loi.`,
    script: 'Conseil méthodo — Vary tes messages à chaque vague. Les voisins de biens vendus = cible ultra-réceptive au FOMO. Dès qu\'un proprio répond, appelle dans la minute pour fixer le R1. Tes modèles de SMS sont dans tes mémos.',
    objectif: '🎯 15 messages SMS envoyés, 3 réponses positives, 1 R1 fixé',
    duree: '1h',
  },
  // J20 — Inter-cabinets (1x par semaine)
  {
    id: 'p-20',
    day: 20,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Débloquer tes biens invendus',
    description: `Aujourd\'hui : sollicite les inter-cabinets pour aller chercher des visites sur les biens sur lesquels tu n\'arrives pas à baisser le prix.\n\n**Ta méthode** :\n1. Fais ta recherche sur les sites d\'annonces avec les mêmes critères objectifs que ton bien\n2. Élargis ta recherche à 5km\n3. Trouve les biens en dessous du prix de ton bien\n4. Envoie un message aux confrères : "Bonjour, j\'ai un bien similaire au vôtre sur [secteur]. J\'ai des acquéreurs sérieux qui ont visité votre bien ou un similaire. Le propriétaire est ouvert à des offres raisonnables même s\'il ne veut pas baisser le prix public. Seriez-vous ouvert à un inter-cabinet ?"\n5. Attends que les confrères te rappellent\n6. Propose-leur de venir avec les acquéreurs sérieux qui étaient intéressés pour leur bien similaire, en expliquant que le propriétaire veut bien baisser mais qu\'il ne veut pas baisser le prix public. L\'idée est de venir en visite et de faire une offre raisonnable.\n\nSi vente : 50/50. Avantage : ça t\'aide à travailler le prix voire de faire ta vente.`,
    script: 'Conseil méthodo — L\'inter-cabinet est ta solution pour les biens invendus. Un confrère avec un acquéreur chaud = une vente potentielle. Sois transparent sur la stratégie de prix avec ton confrère. Tes scripts d\'approche sont dans tes mémos.',
    objectif: '🎯 5 confrères contactés, 2 réponses positives, 1 visite inter-cabinet programmée',
    duree: '1h',
  },
  // J21 — Apporteurs : brocanteurs / vide-maison
  {
    id: 'p-21',
    day: 21,
    category: 'apporteurs',
    title: 'Apporteurs — Cibler les brocanteurs et vide-maison',
    description: `Quand on vide une maison de fond en comble, ce n\'est jamais pour refaire la déco : c\'est parce que la maison va être vendue. Généralement suite à un décès (succession) ou un départ en EHPAD.\n\n**Ton script** :\n"Je vois souvent vos camions sur le secteur. J\'accompagne beaucoup de familles en succession et elles me demandent souvent qui peut vider la maison proprement. J\'aimerais vous recommander systématiquement. Et quand vous videz une maison qui va être mise en vente, proposez-leur de me rencontrer. Je m\'occupe de tout : estimation, notaire, visites. Vous touchez 6 % via Propertips."\n\nTrouve 2 entreprises de vide-maison ou brocanteurs sur ton secteur.`,
    script: 'Conseil méthodo — Le brocanteur est souvent le PREMIER prestataire appelé, parfois même avant le notaire. S\'il te recommande à ce moment-là, tu as 90 % de chances de prendre le mandat sans concurrence. Tes scripts complets sont dans tes mémos.',
    objectif: '🎯 2 brocanteurs/vide-maison contactés, 1 partenariat conclu minimum',
    duree: '1h',
  },

  // ========== MOIS 2 — SEMAINES 4-6 ==========
  // SEMAINE 4
  // J22 — Contact terrain : rue avec panneaux concurrents
  {
    id: 'p-22',
    day: 22,
    category: 'picking',
    title: 'Contact terrain — Cibler les rues avec panneaux concurrents',
    description: `Cible les rues où tes concurrents ont des panneaux "À vendre".\n\nSélectionne 2 biens en vente sur ton outil dans cette rue ou très proche.\n\nToque au bien + aux 8 voisins.\n\n**À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et prends le RDV : "Je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez — pour prendre l'ensemble des détails techniques et en parler aux acheteurs, pour rapidement les amener en visite. Plutôt le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte.\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"`,
    script: 'Conseil méthodo — Les rues avec panneaux concurrents = preuve que le marché est actif. Les voisins voient le panneau, se posent des questions, et toi tu arrives avec la réponse. Sois discret, professionnel, jamais agressif envers les concurrents.',
    objectif: '🎯 2 biens en vente ciblés, 10 portes toquées, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J23 — Rapport local
  {
    id: 'p-23',
    day: 23,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Mise à jour et nouveaux contacts',
    description: `Ton rapport local est toujours d'actualité (il te sert 1 à 2 mois). Aujourd'hui, combine-le avec du terrain proche de biens en vente.

**Ta méthode :**
1. Prends ton rapport local déjà détaillé (pas besoin de le régénérer !)
2. Sélectionne 2-3 biens en vente sur ton outil interne dans une rue ou très proche
3. Toque au bien + 10 voisins avec ta recherche acquéreur : "Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.
4. Si c'est la bonne porte, prends le RDV visite technique : "Plutôt le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"
5. Chez les voisins, propose ton rapport local : "Je viens de publier un rapport très complet sur l'évolution des prix dans votre quartier. Si vous me laissez votre email, je vous l'envoie immédiatement."
6. Profite de l'échange pour proposer une estimation patrimoniale ou enregistrer l'apporteur.

**Rappel :** ton rapport local te sert 1 à 2 mois. La prochaine fois, même méthode : terrain + rapport déjà prêt.`,
    script: 'Conseil méthodo — Le rapport actualisé est une raison parfaite de recontacter. Les propriétaires aiment voir l\'évolution des prix. Profite de l\'échange pour proposer l\'estimation ou enregistrer l\'apporteur.',
    objectif: '🎯 1 rapport actualisé généré, 5 anciens contacts recontactés, 5 nouveaux propriétaires, 1 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J24 — Estimation : bien vendu (rotation)
  {
    id: 'p-24',
    day: 24,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Bien vendu" (rotation)',
    description: `Rotation des 3 leviers d\'estimation — aujourd\'hui : le bien VENDU.\n\n"Je viens de vendre sur ce secteur, j\'ai des acheteurs en attente. Je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. Et puis c\'est ça la base même de mon métier : apporter une information fiable aux habitants de mon secteur."\n\nToque aux 10 portes avec ton flyer. Un seul flyer.`,
    script: 'Conseil méthodo — Rotation des 3 leviers : Bien vendu / En vente / Recherche acquéreur. Chaque levier fonctionne différemment selon le secteur et le moment. Teste, observe, ajuste.',
    objectif: '🎯 10 portes toquées, 3 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J25 — Apporteurs : pharmacien
  {
    id: 'p-25',
    day: 25,
    category: 'apporteurs',
    title: 'Apporteurs — Cibler les pharmaciens de quartier',
    description: `Le pharmacien est l\'un des derniers commerces de proximité où l\'on se confie. Il est le premier au courant des "accidents de vie" qui déclenchent une vente : grand âge, séparation, naissance.\n\n**Ton script** (hors heures de pointe, 14h-15h) :\n"Je suis [Ton Nom], conseiller immobilier ici dans le quartier. Dans mon métier, j\'accompagne souvent des personnes qui doivent vendre leur bien suite à un changement de vie. Si l\'un de vos patients vous confie qu\'il est inquiet pour la gestion de sa maison, donnez-lui simplement ma carte. Je m\'occupe de tout avec une douceur totale. Vous touchez 6 % via Propertips."\n\n**Important** : Ne cible pas seulement le titulaire. Les préparateurs passent le plus de temps à discuter avec les clients.`,
    script: 'Conseil méthodo — Le pharmacien a une relation de confiance absolue. S\'il dit "Allez voir [Ton Nom]", vous avez déjà gagné 80 % de la confiance. Discrétion et éthique avant tout. Tes scripts complets sont dans tes mémos.',
    objectif: '🎯 2 pharmacies contactées, 1 partenariat conclu minimum',
    duree: '1h',
  },
  // J26 — PIGE Légale
    // J26 — Relance estimations
  {
    id: 'p-26',
    day: 26,
    category: 'picking',
    title: 'Relance tes estimations — Convertis les contacts en mandats',
    description: `Aujourd'hui, tu relances les personnes à qui tu as fait une estimation patrimoniale offerte. C'est l'action la plus sous-estimée des conseillers — et pourtant, c'est là que se cachent tes mandats.

**Ta méthode de relance :**

1. **Ouvre ton CRM** et liste tous les contacts à qui tu as fait une estimation :
   - **Projet proche** (vente dans 0-3 mois) → relance toutes les 7-10 jours
   - **Projet moyen** (vente dans 3-6 mois) → relance toutes les 2-3 semaines
   - **Projet lointain** (vente dans 6+ mois) → relance tous les mois
   - **Pas de projet** → relance tous les 2-3 mois avec une info valeur

2. **Personnalise chaque relance** selon le profil :
   - Proche : "Bonjour [Prénom], je repassais vers vous car le marché bouge beaucoup en ce moment. Vous m'aviez dit que vous envisagiez de vendre prochainement — je voulais vous dire que j'ai des acquéreurs très actifs sur votre secteur en ce moment. Puis-je vous appeler 5 minutes ?"
   - Moyen/lointain : "Bonjour [Prénom], je vous envoie mon rapport local actualisé du secteur. Les prix ont bien évolué depuis mon passage. Si vous voulez connaître la valeur actualisée de votre bien, je passe dans le coin cette semaine."
   - Pas de projet : "Bonjour [Prénom], je vous envoie mon dernier rapport sur l'évolution du marché dans votre quartier. Même sans projet de vente, c'est toujours utile de suivre la valeur de son patrimoine. N'hésitez pas à le transmettre à votre entourage."

3. **Chaque relance = un RDV potentiel.** Un contact qui a déjà reçu une estimation de toi = 3x plus facile à convertir qu'un contact froid.`,
    script: `Conseil méthodo — La relance des estimations est l'action la plus rentable de ton business. Un contact qui t'a déjà vu à l'œuvre, qui connaît ta méthode et ton sérieux = un mandat à 80 % si tu relances au bon moment. Segmentez, personnalisez, convertissez.`,
    objectif: '🎯 10 estimations relancées, 3 contacts avec projet proche rappelés, 1 R1 fixé minimum',
    duree: '1h',
  },
  // J27 — Commerçants
  {
    id: 'p-27',
    day: 27,
    category: 'commerçants',
    title: 'Commerçants — Routine + nouveaux contacts',
    description: `Routine hebdo : flyers frais, QR code, nouvelles du quartier.\n\nTrouve aussi 1 nouveau commerçant cette semaine. Pense aux :\n• Fleuriste (mariages, successions = déménagements)\n• Boulanger (tout le monde y va, les commères du village)\n• Coiffeur (les confidences en tête-à-tête)\n\n**Conseil** : Inclue toujours les clients qui attendent. C\'est ta règle d\'or chez les commerçants.`,
    script: 'Conseil méthodo — Chaque nouveau commerçant = un nouveau relais. Le boulanger voit tout le monde, le coiffeur entend tout. Ton réseau de commerçants est un actif qui grandit chaque semaine.',
    objectif: '🎯 5 commerçants revisités, 1 nouveau commerçant, 2 contacts qualifiés',
    duree: '45 min',
  },
  // J28 — Contact terrain : post-vente
  {
    id: 'p-28',
    day: 28,
    category: 'picking',
    title: 'Contact terrain — Tour de la rue après chaque vente',
    description: `Tu viens de vendre un bien ? Félicitations ! Maintenant, toque aux 10 portes de la rue avec un flyer "VENDU sur le secteur".\n\n"Vos voisins ont vendu, le marché bouge sur cette rue. Voulez-vous savoir ce que vaut votre bien aujourd\'hui ? Je propose aux propriétaires une estimation patrimoniale totalement offerte."\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nL\'effet boule de neige est réel. Un voisin qui vend = un mandat facile.`,
    script: 'Conseil méthodo — Après chaque vente, le tour de la rue est OBLIGATOIRE. C\'est le moment où ta crédibilité est au maximum. Les voisins se demandent "combien ?" — toi tu apportes la réponse + l\'estimation offerte.',
    objectif: '🎯 10 portes toquées post-vente, 3 estimations offertes, 1 apporteur enregistré',
    duree: '11h-13h ou 17h-19h',
  },

  // SEMAINE 5
  // J29 — Estimation : en vente (rotation)
  {
    id: 'p-29',
    day: 29,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "En vente" (rotation)',
    description: `"J\'ai entendu dire qu\'il y avait un bien en vente sur ce secteur, vous en avez entendu parler ? J\'organise les visites ce week-end et je connais les acheteurs du secteur. Je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte."\n\nToque aux 10 portes. Le bien en vente = crédibilité.`,
    script: 'Conseil méthodo — Rotation des leviers. Le bien EN VENTE prouve que tu es actif sur le secteur. "J\'organise les visites ce week-end" = preuve d\'activité.',
    objectif: '🎯 10 portes toquées, 3 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  
  // J29b — Apporteurs : Remercier les actifs (FIN DE MOIS)
  {
    id: 'p-29b',
    day: 29,
    category: 'apporteurs',
    title: 'Apporteurs — Remercier les actifs, renforcer les liens',
    description: `C'est la fin du mois — le moment idéal pour remercier tes apporteurs qui ont livré.

Aujourd'hui : va voir tes apporteurs qui t'ont fait des recommandations ce mois-ci. Amène un petit cadeau : chocolats, une bouteille, un bouquet. Remercie-les de vive voix. Le succès doit se voir.

Si un apporteur a posé un panneau et que tu n'as rien eu en retour depuis 2 mois, retourne le voir : peut-être que le panneau est caché, peut-être qu'il a oublié. Sans reproche — juste de la présence et de l'entraide.

**Nouveauté** : Trouve 1 apporteur ORIGINAL cette semaine. Pense au cuisiniste, au brocanteur/débarras, au pharmacien, au toiletteur canin... Tes scripts détaillés pour ces apporteurs sous-exploités sont dans tes mémos de formation.`,
    script: 'Conseil méthodo — Le succès doit se voir : amène un petit cadeau, remercie de vive voix. Si un panneau est caché, repositionne-le. Teste un nouvel apporteur cette semaine — un cuisiniste ou un débarras peut te surprendre par la qualité de ses mises en relation.',
    objectif: '🎯 3 apporteurs remerciés en personne avec cadeau, 2 panneaux vérifiés, 1 nouvel apporteur original contacté',
    duree: '1h',
  },
// J30 — Apporteurs : toiletteur pour chiens
  {
    id: 'p-30',
    day: 30,
    category: 'apporteurs',
    title: 'Apporteurs — Cibler les toiletteurs pour chiens',
    description: `Le propriétaire d\'un chien traite son animal comme un membre de la famille. Pendant que Médor se fait une beauté, le maître discute de sa vie : le déménagement, la séparation, l\'agrandissement.\n\n**Ton script** (décontracté, pas en costume) :\n"Salut ! Je suis [Ton Nom], conseiller immo ici. Tu entres chez les gens toute la journée, tu crées un lien super fort. Quand un client te dit qu\'il déménage ou qu\'il cherche plus grand, glisse-lui mon nom. Pour chaque vente qui se fait grâce à toi, tu touches 6 % de mes honoraires. Et je dirige tous mes nouveaux acquéreurs avec chiens vers toi !"\n\nEmmène ton chien si tu en as un !`,
    script: 'Conseil méthodo — Le toiletteur a des infos "fraîches" et ultra-locales. La posture est amicale, communautaire. Si tu aimes les animaux, tu as déjà un point commun énorme. Tes scripts complets sont dans tes mémos.',
    objectif: '🎯 2 toiletteurs contactés, 1 partenariat conclu minimum',
    duree: '1h',
  },
  // J31 — Inter-cabinets
  {
    id: 'p-31',
    day: 31,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Relance tes biens invendus',
    description: `Relance inter-cabinets pour tes biens qui traînent depuis plus de 3 semaines.\n\n1. Identifie tes biens invendus (pas de visite depuis 15 jours ou prix bloqué)\n2. Cherche des biens similaires sur les sites d\'annonces dans un rayon de 5km\n3. Contacte les confrères qui ont des biens en dessous de ton prix\n4. Propose-leur : "J\'ai des acquéreurs sérieux qui cherchaient un bien comme le vôtre. Le propriétaire est ouvert aux offres mais ne veut pas baisser le prix public. Vos acquéreurs pourraient faire une offre raisonnable en visite. 50/50 si vente."\n\nL\'inter-cabinet débloque les situations bloquées.`,
    script: 'Conseil méthodo — Relance tes inter-cabinets chaque semaine. Un bien invendu = un mandat qui perd de la valeur chaque jour. L\'inter-cabinet apporte de nouveaux acquéreurs sans effort de prospection.',
    objectif: '🎯 3 biens invendus identifiés, 5 confrères contactés, 1 visite inter-cabinet programmée',
    duree: '1h',
  },
  // J32 — Rapport local
  {
    id: 'p-32',
    day: 32,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Expansion sur nouveau secteur',
    description: `Génère un rapport local pour un NOUVEAU secteur adjacent. L'occasion d'étendre ton territoire.

1. Génère le rapport pour le nouveau secteur avec l'outil interne (3 min max)
2. Sélectionne 2-3 biens en vente sur ton outil dans cette zone
3. Toque au bien avec recherche acquéreur + 10 voisins + estimation offerte
4. Propose le rapport aux voisins : "Je viens de publier un rapport sur l'évolution des prix dans ce quartier. Ça peut vous intéresser ou intéresser votre entourage."
5. Collecte les emails, propose l'estimation, enregistre les apporteurs

💡 **Ce rapport te servira 1 à 2 mois** pour ce nouveau secteur. La prochaine fois, tu réutiliseras ce même rapport + terrain proche de biens en vente.`,
    script: 'Conseil méthodo — L\'expansion territoriale se fait naturellement avec le rapport local. Les propriétaires du secteur adjacent te voient comme l\'expert qui arrive. Profite de l\'échange pour proposer l\'estimation ou enregistrer l\'apporteur.',
    objectif: '🎯 1 rapport généré pour nouveau secteur, 10 propriétaires contactés, 3 emails collectés, 1 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J33 — Contact terrain : rue entière
  {
    id: 'p-33',
    day: 33,
    category: 'picking',
    title: 'Contact terrain — Conquête complète d\'une rue',
    description: `Choisis une rue que tu ne connais pas bien. Sélectionne 3 biens en vente sur ton outil dans cette rue ou très proche.\n\nToque au bien + aux 10 voisins.\n\n**À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et finis par dire qu'effectivement ça a l'air de coller avec la recherche de tes acheteurs. Prends le RDV pour une première visite : "Je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez — pour prendre l'ensemble des détails techniques et en parler aux acheteurs, pour rapidement les amener en visite. Plutôt le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — tu apportes une info fiable sur la valeur de leur patrimoine. Ça sert toujours, même sans projet immédiat.\n\n**Question magique à chaque porte** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nConquiers la rue entière.`,
    script: 'Conseil méthodo — Conquiers la rue de fond en comble. Chaque porte = un contact. La question magique à chaque porte = des recommandations que tu n\'aurais jamais eues autrement. Un seul flyer suffit.',
    objectif: '🎯 3 biens en vente ciblés, 13 portes toquées, 2 contacts qualifiés, 1 apporteur enregistré',
    duree: '11h-13h ou 17h-19h',
  },
  // J34 — PIGE Légale
  {
    id: 'p-34',
    day: 34,
    category: 'relances',
    title: 'Relances mensuelles — Relance de tes contacts qualifiés',
    description: `Session PIGE Légale avec ciblage avancé.\n\nCette fois, segmente ta liste :\n• **Propriétaires de plus de 5 ans** : "Le marché a beaucoup évolué depuis votre achat. Voulez-vous connaître la valeur actuelle de votre patrimoine ?"\n• **Voisins de biens vendus** : FOMO classique\n• **Anciens contacts non convertis** : Relance douce\n\nPersonnalise chaque message selon le segment. Un message personnalisé = un taux de réponse 3x plus élevé.\n\n📌 La stratégie complète de la PIGE (celle mise au point par ton réseau) est dans tes vidéos de formation — regarde-les si tu ne la maîtrises pas encore. Et avant tout appel à un particulier, vérifie qu'il n'est pas inscrit sur Bloctel : c'est la loi.`,
    script: 'Conseil méthodo — Le ciblage précis change tout. Un propriétaire depuis 5 ans veut savoir "combien j\'ai gagné ?". Un ancien contact veut sentir que tu n\'as pas oublié. Segmentez, personnalisez, convertissez.',
    objectif: '🎯 15 SMS segmentés envoyés, 4 réponses positives, 2 R1 fixés',
    duree: '30 min (7h-8h30)',
  },
  // J35 — Commerçants
  {
    id: 'p-35',
    day: 35,
    category: 'commerçants',
    title: 'Commerçants — Gamification avec tes partenaires',
    description: `Routine commerçants + gamification.\n\nLance un challenge entre tes commerçants partenaires : "Celui qui me fait le plus de contacts qualifiés ce mois-ci gagne un dîner pour deux au [meilleur resto du coin]."\n\nFlyers frais avec QR code, nouvelles du quartier, inclusion des clients qui attendent.\n\nRetire les vieux flyers (+3 semaines / 1 mois).`,
    script: 'Conseil méthodo — La gamification motive tes commerçants à parler de toi ACTIVEment, pas juste à laisser ton flyer sur le comptoir. Un commerçant motivé = 3-5 contacts qualifiés par mois.',
    objectif: '🎯 5 commerçants revisités, challenge lancé, 3 contacts qualifiés',
    duree: '45 min',
  },

  // SEMAINE 6
  // J36 — Estimation : recherche acquéreur (rotation)
  {
    id: 'p-36',
    day: 36,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Recherche acquéreur" (rotation)',
    description: `"J\'ai entendu dire qu\'il y avait un bien en vente sur ce secteur, vous en avez entendu parler ? Je recherche activement un acquéreur pour mes clients. Je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. C\'est la base de mon métier : apporter une information fiable aux habitants de mon secteur."\n\nToque aux 10 portes. Un seul flyer.`,
    script: 'Conseil méthodo — Rotation des 3 leviers. La recherche acquéreur fonctionne particulièrement bien sur les secteurs avec peu de biens en vente. Tu apportes ce que personne d\'autre n\'a : un acheteur prêt.',
    objectif: '🎯 10 portes toquées, 3 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J37 — Apporteurs : apporteurs originaux variés
  {
    id: 'p-37',
    day: 37,
    category: 'apporteurs',
    title: 'Apporteurs — Diversifier avec des apporteurs originaux',
    description: `Aujourd\'hui, trouve 2 nouveaux apporteurs dans des métiers sous-exploités :\n\n• **Loueur de box de stockage** — On loue un box parce qu\'on est en transition immobilière (déménagement, séparation, home staging)\n• **Cabinet de courtage en assurance (Pro)** — Il assure les locaux commerciaux, il sait qui prépare sa retraite ou qui a un sinistre déclencheur\n• **Ostéopathe / Kiné** — Le patient se confie pendant 30-45 min, parle de sa maison trop grande, de ses escaliers...\n\nTes scripts détaillés pour chaque métier sont dans tes mémos de formation.`,
    script: 'Conseil méthodo — Plus tu diversifies tes apporteurs, plus tu couvres les "signaux de vie" qui déclenchent une vente. Un loueur de box voit le déménagement AVANT tout le monde. Tes scripts sont dans tes mémos.',
    objectif: '🎯 2 nouveaux apporteurs originaux contactés, 1 partenariat conclu minimum',
    duree: '1h30',
  },
  // J38 — Inter-cabinets
  {
    id: 'p-38',
    day: 38,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Session hebdomadaire',
    description: `Session inter-cabinets hebdomadaire.\n\nIdentifie tes biens qui stagnent depuis 3+ semaines. Pour chacun :\n1. Analyse les prix des biens similaires dans un rayon de 5km\n2. Contacte les confrères avec des biens similaires vendus récemment\n3. Propose l\'inter-cabinet avec la stratégie de prix discrète\n4. Programme les visites\n\n**Message type** : "J\'ai un bien similaire au vôtre, des acquéreurs intéressés, et un propriétaire ouvert aux offres raisonnables sans baisser le prix public. Intéressé par un 50/50 ?"`,
    script: 'Conseil méthodo — L\'inter-cabinet hebdo doit devenir une habitude. Un bien invendu = un mandat qui perd de la crédibilité chaque jour. L\'inter-cabinet = nouveaux acquéreurs sans effort de prospection.',
    objectif: '🎯 4 biens analysés, 6 confrères contactés, 2 visites programmées',
    duree: '1h',
  },
  // J39 — Contact terrain : post-R1
  {
    id: 'p-39',
    day: 39,
    category: 'picking',
    title: 'Contact terrain — Post-R1 systématique',
    description: `Chaque R1 que tu fais cette semaine = 5 portes toquées après.\n\n"Je viens d\'estimer le bien de vos voisins, j\'apporte une info sur la valeur du patrimoine de cette rue. Que vous ayez un projet de vente ou pas, peu importe, c\'est toujours important de connaître la valeur de son patrimoine, pour les projets futurs, pour les assurances, ou les successions."\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nSystématise ce geste. C\'est le geste qui fait la différence entre un bon et un excellent conseiller.`,
    script: 'Conseil méthodo — Le post-R1 systématique est la CLE. 5 portes après chaque R1 = 15-25 portes par semaine sans effort supplémentaire. Tu es déjà sur place, profite-en !',
    objectif: '🎯 5 portes toquées après chaque R1 cette semaine, 1 estimation spontanée minimum',
    duree: '15 min après chaque R1',
  },
  // J40 — Rapport local
    // J40 — Relance estimations
  {
    id: 'p-40',
    day: 40,
    category: 'picking',
    title: 'Relance tes estimations — Convertis les contacts en mandats',
    description: `Aujourd'hui, tu relances les personnes à qui tu as fait une estimation patrimoniale offerte. C'est l'action la plus sous-estimée — et pourtant, c'est là que se cachent tes mandats.

**Ta méthode de relance :**
1. **Ouvre ton CRM** et liste tous les contacts à qui tu as fait une estimation :
   - **Projet proche** (vente dans 0-3 mois) → relance toutes les 7-10 jours
   - **Projet moyen** (vente dans 3-6 mois) → relance toutes les 2-3 semaines  
   - **Projet lointain** (6+ mois) → relance tous les mois
   - **Pas de projet** → relance tous les 2-3 mois avec une info valeur

2. **Personnalise chaque relance** selon le profil :
   - Proche : "Bonjour [Prénom], je repassais vers vous car le marché bouge beaucoup. Vous m'aviez dit envisager de vendre prochainement — j'ai des acquéreurs très actifs sur votre secteur. Puis-je vous appeler 5 minutes ?"
   - Moyen/lointain : "Bonjour [Prénom], je vous envoie mon rapport local actualisé. Les prix ont bien évolué depuis mon passage. Si vous voulez connaître la valeur actualisée, je passe dans le coin cette semaine."
   - Pas de projet : "Bonjour [Prénom], mon dernier rapport sur l'évolution du marché dans votre quartier. Même sans projet de vente, c'est toujours utile. N'hésitez pas à le transmettre à votre entourage."

3. **Chaque relance = un RDV potentiel.** Un contact qui a déjà reçu une estimation de toi = 3x plus facile à convertir qu'un contact froid.`,
    script: `Conseil méthodo — La relance des estimations est l'action la plus rentable de ton business. Un contact qui t'a déjà vu à l'œuvre = un mandat à 80 % si tu relances au bon moment.`,
    objectif: '🎯 10 estimations relancées, 3 contacts avec projet proche rappelés, 1 R1 fixé minimum',
    duree: '1h',
  },
  // J41 — PIGE Légale
  {
    id: 'p-41',
    day: 41,
    category: 'relances',
    title: 'Relances mensuelles — Relance de tes prospects chauds',
    description: `Dernière PIGE Légale de la semaine. Cette fois, relance UNIQUEMENT les non-répondants des 2 vagues précédentes avec un message différent.\n\n"Bonjour [Prénom], c\'est [Ton prénom] du secteur. Je repasse vers vous car je viens de vendre un bien très proche du vôtre et les acquéreurs sont toujours à la recherche. Si vous ou quelqu\'un de votre entourage envisagez de vendre, je vous propose une estimation offerte sans engagement. Puis-je vous appeler 5 minutes ?"\n\nLa preuve sociale ("je viens de vendre") + l\'urgence ("les acquéreurs cherchent toujours") = motivation maximale.\n\n📌 La stratégie complète de la PIGE (celle mise au point par ton réseau) est dans tes vidéos de formation — regarde-les si tu ne la maîtrises pas encore. Et avant tout appel à un particulier, vérifie qu'il n'est pas inscrit sur Bloctel : c'est la loi.`,
    script: 'Conseil méthodo — La relance des non-répondants est souvent plus productive que les premiers messages. Ils ont vu ton nom, ils commencent à te reconnaître. La preuve sociale franchit la dernière barrière.',
    objectif: '🎯 15 relances envoyées, 3 réponses positives, 1 R1 fixé',
    duree: '30 min (7h-8h30)',
  },
  // J42 — Commerçants + apporteurs remerciés
  {
    id: 'p-42',
    day: 42,
    category: 'commerçants',
    title: 'Commerçants — Routine + remercier tes meilleurs apporteurs',
    description: `Routine commerçants : flyers frais, QR code, nouvelles du quartier, inclusion des clients.\n\n**Et surtout** : remercie tes 2 meilleurs commerçants apporteurs ce mois-ci. Un petit cadeau, un mot sincère devant ses collègues. Le succès doit se voir.\n\nRetire les vieux flyers (+3 semaines / 1 mois).`,
    script: 'Conseil méthodo — Le remerciement public devant les collègues du commerçan = motivation x10 pour lui ET envie x10 pour ses collègues de devenir aussi tes apporteurs. Le succès doit se voir, toujours.',
    objectif: '🎯 5 commerçants revisités, 2 meilleurs apporteurs remerciés, 3 contacts qualifiés',
    duree: '1h',
  },

  // ========== MOIS 3 — SEMAINES 7-9 : OPTIMISATION ==========
  // SEMAINE 7
  // J43 — Estimation : bien vendu (rotation)
  {
    id: 'p-43',
    day: 43,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Bien vendu" (M3)',
    description: `"Je viens de vendre sur ce secteur, j\'ai des acheteurs en attente. Je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. C\'est la base de mon métier : apporter une information fiable aux habitants de mon secteur."\n\nToque aux 10 portes. Un seul flyer VENDU sur le secteur.`,
    script: 'Conseil méthodo — Mois 3 — tu maîtrises la méthode. Chaque phrase, chaque gestion, chaque relance doit être parfaite. C\'est l\'écart entre un bon et un excellent conseiller.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J44 — Apporteurs : gardienne
  {
    id: 'p-44',
    day: 44,
    category: 'apporteurs',
    title: 'Apporteurs — Cibler les gardiennes d\'immeuble',
    description: `La gardienne d\'immeuble sait TOUT : qui divorce, qui attend un enfant, qui h\érite, qui s\'en va. C\'est la pige immobili\ère à la source historique.

**Ton script** :
"Bonjour [Pr\énom], vous faites un super boulot pour tenir la r\ésidence. Comme vous \êtes au c\œur de l\'immeuble, vous savez toujours tout avant tout le monde ! D\ès que vous entendez parler d\'un projet de vente, vous m\'envoyez l\'info. Si je vends, vous touchez 6 % de ma commission. Sur un appartement \à 200 000\€, \ça vous fait un tr\ès beau ch\èque pour une simple info."`,
    script: 'Conseil m\éthodo — La gardienne = source d\'infos en temps r\éel. Elle conna\ît tous les mouvements de l\'immeuble. Tes scripts complets sont dans tes m\émos.',
    objectif: '🎯 2 gardiennes contact\ées, 1 partenariat conclu minimum',
    duree: '1h',
  },
// J45 — Contact terrain : nouvelle zone
  {
    id: 'p-45',
    day: 45,
    category: 'picking',
    title: 'Contact terrain — Expansion sur zone adjacente',
    description: `Tu maîtrises ton secteur principal. Il est temps d\'étendre ton territoire.\n\nChoisis une zone adjacente où tu n\'es pas encore allé.\n\nSélectionne 3 biens en vente sur ton outil dans cette zone ou très proche.\n\nToque au bien + aux 10 voisins.\n\n**À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et finis par dire qu'effectivement ça a l'air de coller avec la recherche de tes acheteurs. Prends le RDV pour une première visite : "Je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez — pour prendre l'ensemble des détails techniques et en parler aux acheteurs, pour rapidement les amener en visite. Plutôt le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — tu apportes une info fiable sur la valeur de leur patrimoine. Ça sert toujours, même sans projet immédiat.\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"`,
    script: 'Conseil méthodo — L\'expansion territoriale est naturelle quand tu maîtrises la méthode. Chaque nouvelle zone = de nouveaux mandats sans cannibaliser ton secteur principal. Un seul flyer.',
    objectif: '🎯 3 biens en vente ciblés, 13 portes toquées, 3 contacts qualifiés, 1 apporteur enregistré',
    duree: '11h-13h ou 17h-19h',
  },
  // J46 — Rapport local
  {
    id: 'p-46',
    day: 46,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Trimestriel complet',
    description: `Génère ton rapport local trimestriel COMPLET. Ce rapport couvre les 3 derniers mois d\'évolution des prix, les transactions, les tendances.\n\n1. Génère le rapport trimestriel (3 min)\n2. Envoie-le à TOUS les contacts qui ont déjà reçu un rapport (mise à jour)\n3. Cible 10 nouveaux propriétaires\n4. "Voici mon rapport trimestriel sur l\'évolution du marché dans votre quartier. Les chiffres sont très parlants..."\n\nLe rapport trimestriel = preuve de ton expertise sur le long terme. Les propriétaires commencent à t\'attendre.

💡 **Ton rapport local te sert 1 à 2 mois.** La prochaine fois que cette action revient, réutilise ce même rapport et combine-le avec du terrain proche de biens en vente (recherche acquéreurs).`,
    script: 'Conseil méthodo — Le rapport trimestriel crée l\'attente. Les propriétaires qui ont reçu tes 2 premiers rapports attendent le 3ème. Tu deviens leur référence immobilière naturelle.',
    objectif: '🎯 1 rapport trimestriel généré, 15 anciens contacts recontactés, 10 nouveaux, 2 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J47 — PIGE Légale
    // J47 — Relance estimations
  {
    id: 'p-47',
    day: 47,
    category: 'picking',
    title: 'Relance tes estimations — Convertis les contacts en mandats',
    description: `Aujourd'hui, tu relances les personnes à qui tu as fait une estimation patrimoniale offerte. C'est l'action la plus sous-estimée — et pourtant, c'est là que se cachent tes mandats.

**Ta méthode de relance :**
1. **Ouvre ton CRM** et liste tous les contacts à qui tu as fait une estimation :
   - **Projet proche** (vente dans 0-3 mois) → relance toutes les 7-10 jours
   - **Projet moyen** (vente dans 3-6 mois) → relance toutes les 2-3 semaines  
   - **Projet lointain** (6+ mois) → relance tous les mois
   - **Pas de projet** → relance tous les 2-3 mois avec une info valeur

2. **Personnalise chaque relance** selon le profil :
   - Proche : "Bonjour [Prénom], je repassais vers vous car le marché bouge beaucoup. Vous m'aviez dit envisager de vendre prochainement — j'ai des acquéreurs très actifs sur votre secteur. Puis-je vous appeler 5 minutes ?"
   - Moyen/lointain : "Bonjour [Prénom], je vous envoie mon rapport local actualisé. Les prix ont bien évolué depuis mon passage. Si vous voulez connaître la valeur actualisée, je passe dans le coin cette semaine."
   - Pas de projet : "Bonjour [Prénom], mon dernier rapport sur l'évolution du marché dans votre quartier. Même sans projet de vente, c'est toujours utile. N'hésitez pas à le transmettre à votre entourage."

3. **Chaque relance = un RDV potentiel.** Un contact qui a déjà reçu une estimation de toi = 3x plus facile à convertir qu'un contact froid.`,
    script: `Conseil méthodo — La relance des estimations est l'action la plus rentable de ton business. Un contact qui t'a déjà vu à l'œuvre = un mandat à 80 % si tu relances au bon moment.`,
    objectif: '🎯 10 estimations relancées, 3 contacts avec projet proche rappelés, 1 R1 fixé minimum',
    duree: '1h',
  },
  // J48 — Inter-cabinets
  {
    id: 'p-48',
    day: 48,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Session optimisée',
    description: `Session inter-cabinets hebdomadaire optimisée.\n\nAnalyse tes résultats des semaines précédentes :\n• Quels confrères ont le mieux répondu ? → Priorise-les\n• Quels biens se sont vendus en inter-cabinet ? → Répète la formule\n• Quels biens stagnent encore ? → Change d\'approche (nouveaux confrères, ajustement de prix)\n\nL\'inter-cabinet doit devenir un canal régulier de vente, pas juste une solution de dernier recours.`,
    script: 'Conseil méthodo — Analyse tes résultats d\'inter-cabinet. Double les efforts sur ce qui marche, ajuste ce qui coince. L\'inter-cabinet peut représenter 20-30 % de tes ventes si tu le systématises.',
    objectif: '🎯 5 biens analysés, 8 confrères contactés, 3 visites programmées',
    duree: '1h',
  },
  // J49 — Commerçants
  {
    id: 'p-49',
    day: 49,
    category: 'commerçants',
    title: 'Commerçants — Routine + nouveaux produits',
    description: `Routine commerçants : flyers frais (VENDU + EN VENTE + QR code), nouvelles du quartier, inclusion des clients.\n\n**Nouveauté** : présente aussi tes nouveaux biens en exclusivité à tes commerçants. Ils sont fiers de dire : "Mon conseiller immobilier a un bien EXCLUSIF en ce moment, il est superbe !"\n\nUn commerçan qui parle de TES biens = un vendeur déporté gratuit.`,
    script: 'Conseil méthodo — Fais de tes commerçants tes ambassadeurs. Quand ils parlent de tes exclusivités à leurs clients, tu as un vendeur déporté qui travaille pour toi sans que tu paies un salaire.',
    objectif: '🎯 5 commerçants revisités, 2 exclusivités présentées, 3 contacts qualifiés',
    duree: '45 min',
  },

  // SEMAINE 8
  // J50 — Estimation : en vente (rotation)
  {
    id: 'p-50',
    day: 50,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "En vente" (M3)',
    description: `"J\'ai entendu dire qu\'il y avait un bien en vente sur ce secteur, vous en avez entendu parler ? J\'organise les visites ce week-end et je connais les acheteurs du secteur. Je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. C\'est la base de mon métier."\n\nToque aux 10 portes. Rotation des leviers.`,
    script: 'Conseil méthodo — Mois 3, semaine 8. Tu es en mode optimisé. Chaque action doit être parfaite. Analyse ce qui a marché ces 7 dernières semaines et double les efforts sur les gagnants.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J51 — Apporteurs : DPE / diagnostiqueur
  {
    id: 'p-51',
    day: 51,
    category: 'apporteurs',
    title: 'Apporteurs — Cibler les diagnostiqueurs DPE',
    description: `Le diagnostiqueur DPE fait face à des propriétaires dépités par une mauvaise note (F ou G) qui se rendent compte que les travaux coûtent trop cher. Le client dit : "Laissez tomber, je vais vendre en l\'état."\n\n**Ton script** :\n"On travaille souvent ensemble en bout de chaîne, mais je te propose qu\'on s\'entraide au début. Quand tu tombes sur un propriétaire dépité par son DPE, ne le laisse pas dans l\'impasse. Dis-lui que tu connais un agent expert qui sait valoriser les passoires thermiques auprès d\'investisseurs. Tu me mets en relation sur Propertips, tu prends tes 6 %, et je te confie systématiquement les diagnostics de mes futurs mandats."\n\nC\'est gagnant-gagnant sur toute la ligne.`,
    script: 'Conseil méthodo — Le diagnostiqueur DPE = apporteur de qualité. Les propriétaires avec passoires thermiques veulent vendre VITE. Tes scripts complets sont dans tes mémos.',
    objectif: '🎯 2 diagnostiqueurs DPE contactés, 1 partenariat conclu minimum',
    duree: '1h',
  },
  // J52 — Contact terrain : rue avec transaction récente
  {
    id: 'p-52',
    day: 52,
    category: 'picking',
    title: 'Contact terrain — Rue avec transaction récente',
    description: `Identifie une rue où il y a eu une transaction récente (vente, compromis, sous-offre).\n\nToque aux 10 portes avec un flyer "VENDU sur le secteur".\n\n"Vos voisins ont vendu, le marché bouge sur cette rue. Voulez-vous savoir ce que vaut votre bien aujourd\'hui ?"\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nL\'annonce de transaction fraîche = FOMO maximal.`,
    script: 'Conseil méthodo — "Annonce de transaction fraîche" crée l\'urgence. Les voisins veulent savoir "combien ?" ET si leur bien vaut pareil. Tu apportes les deux réponses + l\'estimation offerte.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J53 — Rapport local
  {
    id: 'p-53',
    day: 53,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Spécial investisseurs',
    description: `Génère un rapport local spécial "marché des investisseurs".\n\n1. Analyse les rendements locatifs, les prix au m², les délais de vente\n2. Génère le rapport (3 min)\n3. Cible les propriétaires multi-biens et les potentiels investisseurs\n4. "Voici mon rapport spécial investisseurs du secteur. Les rendements ont évolué, j\'ai quelques opportunités intéressantes à vous présenter..."\n\nLe segment investisseur = clients récurrents, achats multiples.

💡 **Ton rapport local te sert 1 à 2 mois.** La prochaine fois que cette action revient, réutilise ce même rapport et combine-le avec du terrain proche de biens en vente (recherche acquéreurs).`,
    script: 'Conseil méthodo — Le segment investisseur est ultra-puissant : un bon investisseur = 3-5 transactions par an. Le rapport spécial investisseurs prouve que tu maîtrises ce segment.',
    objectif: '🎯 1 rapport investisseur généré, 6 investisseurs contactés, 2 emails collectés, 1 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J54 — PIGE Légale
    // J54 — Relance estimations
  {
    id: 'p-54',
    day: 54,
    category: 'picking',
    title: 'Relance tes estimations — Convertis les contacts en mandats',
    description: `Aujourd'hui, tu relances les personnes à qui tu as fait une estimation patrimoniale offerte. C'est l'action la plus sous-estimée — et pourtant, c'est là que se cachent tes mandats.

**Ta méthode de relance :**
1. **Ouvre ton CRM** et liste tous les contacts à qui tu as fait une estimation :
   - **Projet proche** (vente dans 0-3 mois) → relance toutes les 7-10 jours
   - **Projet moyen** (vente dans 3-6 mois) → relance toutes les 2-3 semaines  
   - **Projet lointain** (6+ mois) → relance tous les mois
   - **Pas de projet** → relance tous les 2-3 mois avec une info valeur

2. **Personnalise chaque relance** selon le profil :
   - Proche : "Bonjour [Prénom], je repassais vers vous car le marché bouge beaucoup. Vous m'aviez dit envisager de vendre prochainement — j'ai des acquéreurs très actifs sur votre secteur. Puis-je vous appeler 5 minutes ?"
   - Moyen/lointain : "Bonjour [Prénom], je vous envoie mon rapport local actualisé. Les prix ont bien évolué depuis mon passage. Si vous voulez connaître la valeur actualisée, je passe dans le coin cette semaine."
   - Pas de projet : "Bonjour [Prénom], mon dernier rapport sur l'évolution du marché dans votre quartier. Même sans projet de vente, c'est toujours utile. N'hésitez pas à le transmettre à votre entourage."

3. **Chaque relance = un RDV potentiel.** Un contact qui a déjà reçu une estimation de toi = 3x plus facile à convertir qu'un contact froid.`,
    script: `Conseil méthodo — La relance des estimations est l'action la plus rentable de ton business. Un contact qui t'a déjà vu à l'œuvre = un mandat à 80 % si tu relances au bon moment.`,
    objectif: '🎯 10 estimations relancées, 3 contacts avec projet proche rappelés, 1 R1 fixé minimum',
    duree: '1h',
  },
  // J55 — Inter-cabinets
  {
    id: 'p-55',
    day: 55,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Session de suivi',
    description: `Session inter-cabinets : suivi des visites de la semaine précédente + nouvelles propositions.\n\n1. Appelle les confrères qui ont fait des visites la semaine dernière → feedback, offres ?\n2. Identifie les nouveaux biens invendus → nouvelles propositions\n3. Programme les visites de la semaine à venir\n\nL\'inter-cabinet doit devenir un RENDEZ-VOUS hebdomadaire dans ton agenda, comme un R1 ou un R2.`,
    script: 'Conseil méthodo — L\'inter-cabinet mérite sa place dans ton agenda hebdo. 1h par semaine consacrée aux inter-cabinets = 20-30 % de ventes en plus. C\'est le meilleur ROI de ton temps.',
    objectif: '🎯 4 suivis de visites, 5 nouveaux confrères contactés, 3 visites programmées',
    duree: '1h',
  },
  // J56 — Commerçants + remerciements
  {
    id: 'p-56',
    day: 56,
    category: 'commerçants',
    title: 'Commerçants — Routine + bilan mensuel apporteurs',
    description: `Routine commerçants : flyers frais, QR code, nouvelles du quartier, inclusion des clients.\n\n**Bilan mensuel** : qui a délivré ce mois-ci ? Remercie les actifs, relance les inactifs avec enthousiasme.\n\nRetire les vieux flyers (+3 semaines / 1 mois).`,
    script: 'Conseil méthodo — Le bilan mensuel des commerçants apporteurs crée la régularité. Un commerçan qui sait que tu fais le bilan chaque mois = un commerçan qui parle de toi activement.',
    objectif: '🎯 5 commerçants revisités, bilan mensuel fait, 3 contacts qualifiés',
    duree: '1h',
  },

  // SEMAINE 9
  // J57 — Estimation : recherche acquéreur (rotation)
  {
    id: 'p-57',
    day: 57,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Recherche acquéreur" (M3)',
    description: `"J\'ai entendu dire qu\'il y avait un bien en vente sur ce secteur, vous en avez entendu parler ? Je recherche activement un acquéreur pour mes clients. Je propose aux propriétaires de la rue une estimation patrimoniale totalement offerte. C\'est la base de mon métier."\n\nToque aux 10 portes. Rotation des 3 leviers — dernière rotation du mois 3.`,
    script: 'Conseil méthodo — Dernière semaine du mois 3. Analyse tes résultats sur les 90 jours. Quelle action a rapporté le plus de mandats ? Quel apporteur délivre ? Quel levier d\'estimation fonctionne le mieux sur ton secteur ? Double les gagnants.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 3 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J58 — Apporteurs : apporteurs originaux (suite)
  {
    id: 'p-58',
    day: 58,
    category: 'apporteurs',
    title: 'Apporteurs — Conciergerie Airbnb et gestionnaires',
    description: `Les gestionnaires de conciergerie Airbnb gèrent les appartements d\'investisseurs. Ils sont en contact direct avec des propriétaires bailleurs qui vivent parfois à l\'autre bout de la France.\n\n**Ton script** :\n"Vous gérez des parcs de biens pour des investisseurs. Vous savez comme moi que certains propriétaires se lassent de la gestion ou s\'inquiètent des nouvelles lois sur les meublés touristiques. Si l\'un de vos clients veut arbitrer son patrimoine et vendre son bien, ne le laissez pas chercher une agence au hasard. Proposez-lui mes services. Vous me mettez en relation sur Propertips, et vous touchez 6 %. En plus, je propose vos services de conciergerie à tous mes acheteurs investisseurs."\n\nC\'est un partenariat durable.`,
    script: 'Conseil méthodo — Le gestionnaire de conciergerie = apporteur récurrent. Un investisseur qui vend = souvent un autre qui achète. Tes scripts complets sont dans tes mémos.',
    objectif: '🎯 2 conciergeries contactées, 1 partenariat conclu minimum',
    duree: '1h',
  },
  // J59 — Contact terrain : rue entière avec post-R1
  {
    id: 'p-59',
    day: 59,
    category: 'picking',
    title: 'Contact terrain — Rue entière + post-R1 systématique',
    description: `Conquête d\'une rue entière AVEC post-R1 systématique.\n\nSélectionne 3 biens en vente sur ton outil.\n\nToque au bien + 10 voisins.\n\nPuis après CHAQUE R1 de la semaine, toque 5 portes autour.\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nTu combines contact terrain + post-R1 + question magique. C\'est la méthode optimale.`,
    script: 'Conseil méthodo — La combinaison rue entière + post-R1 + question magique = la méthode des tops performers. Systématise ces 3 gestes et tu auras plus de mandats que tu ne peux en gérer.',
    objectif: '🎯 3 biens en vente ciblés, 13 portes toquées, 5 portes post-R1, 3 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J60 — Rapport local
  {
    id: 'p-60',
    day: 60,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Dernier rapport du trimestre',
    description: `Dernier rapport local du trimestre. Génère-le, envoie-le à tous tes contacts, et cible les derniers propriétaires non contactés.\n\n1. Génère le rapport final du T1 (3 min)\n2. Envoie-le à tous tes contacts (email + WhatsApp)\n3. Cible les 10 derniers propriétaires de ton secteur\n4. "Voici mon dernier rapport du trimestre. Les chiffres sont très parlants. Si vous ou votre entourage souhaitez connaître la valeur de votre patrimoine..."\n\nBilan du trimestre : combien de mandats as-tu signé grâce au rapport local ?

💡 **Ton rapport local te sert 1 à 2 mois.** La prochaine fois que cette action revient, réutilise ce même rapport et combine-le avec du terrain proche de biens en vente (recherche acquéreurs).`,
    script: 'Conseil méthodo — Bilan du trimestre. Le rapport local a probablement généré 30-40 % de tes mandats. Continue sur cette lancée au trimestre 2. Chaque rapport = un actif qui grandit.',
    objectif: '🎯 1 rapport final généré, 20 contacts recontactés, 5 nouveaux propriétaires, 2 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J61 — PIGE Légale
    // J61 — Relance estimations
  {
    id: 'p-61',
    day: 61,
    category: 'picking',
    title: 'Relance tes estimations — Convertis les contacts en mandats',
    description: `Aujourd'hui, tu relances les personnes à qui tu as fait une estimation patrimoniale offerte. C'est l'action la plus sous-estimée — et pourtant, c'est là que se cachent tes mandats.

**Ta méthode de relance :**
1. **Ouvre ton CRM** et liste tous les contacts à qui tu as fait une estimation :
   - **Projet proche** (vente dans 0-3 mois) → relance toutes les 7-10 jours
   - **Projet moyen** (vente dans 3-6 mois) → relance toutes les 2-3 semaines  
   - **Projet lointain** (6+ mois) → relance tous les mois
   - **Pas de projet** → relance tous les 2-3 mois avec une info valeur

2. **Personnalise chaque relance** selon le profil :
   - Proche : "Bonjour [Prénom], je repassais vers vous car le marché bouge beaucoup. Vous m'aviez dit envisager de vendre prochainement — j'ai des acquéreurs très actifs sur votre secteur. Puis-je vous appeler 5 minutes ?"
   - Moyen/lointain : "Bonjour [Prénom], je vous envoie mon rapport local actualisé. Les prix ont bien évolué depuis mon passage. Si vous voulez connaître la valeur actualisée, je passe dans le coin cette semaine."
   - Pas de projet : "Bonjour [Prénom], mon dernier rapport sur l'évolution du marché dans votre quartier. Même sans projet de vente, c'est toujours utile. N'hésitez pas à le transmettre à votre entourage."

3. **Chaque relance = un RDV potentiel.** Un contact qui a déjà reçu une estimation de toi = 3x plus facile à convertir qu'un contact froid.`,
    script: `Conseil méthodo — La relance des estimations est l'action la plus rentable de ton business. Un contact qui t'a déjà vu à l'œuvre = un mandat à 80 % si tu relances au bon moment.`,
    objectif: '🎯 10 estimations relancées, 3 contacts avec projet proche rappelés, 1 R1 fixé minimum',
    duree: '1h',
  },
  // J62 — Inter-cabinets
  {
    id: 'p-62',
    day: 62,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Bilan et planification',
    description: `Dernière session inter-cabinets du mois. Bilan + planification.\n\n1. Bilan du mois : combien de ventes en inter-cabinet ? Quels confrères sont les plus actifs ?\n2. Planifie les inter-cabinets du mois prochain\n3. Identifie les biens qui nécessiteront un inter-cabinet dès la semaine prochaine\n4. Remercie les confrères qui ont bien fonctionné\n\nL\'inter-cabinet est maintenant un canal de vente régulier.`,
    script: 'Conseil méthodo — Bilan mensuel des inter-cabinets. Les confrères qui délivrent méritent un remerciement. Les biens qui stagnent méritent une nouvelle stratégie. Planifie le mois prochain.',
    objectif: '🎯 Bilan mensuel fait, 6 confrères contactés, 4 visites programmées pour le mois prochain',
    duree: '1h',
  },
  // J63 — Commerçants : clôture du trimestre
  {
    id: 'p-63',
    day: 63,
    category: 'commerçants',
    title: 'Commerçants — Clôture du trimestre',
    description: `Dernière routine commerçants du trimestre.\n\nFlyers frais, QR code, nouvelles du quartier, inclusion des clients.\n\n**Et surtout** : remercie TES commerçants qui ont délivré ce trimestre. Un cadeau, un dîner, une mention sur tes réseaux sociaux. Le succès doit se voir.\n\nPrésente aussi tes objectifs pour le trimestre 2. Les commerçants qui voient que tu as un plan = des commerçants qui te font confiance.`,
    script: 'Conseil méthodo — La clôture du trimestre est un moment clé. Remercie publiquement, mentionne sur les réseaux, montre que tu as un plan pour le T2. Les commerçants deviendront tes ambassadeurs.',
    objectif: '🎯 5 commerçants revisités, remerciements publics, 3 contacts qualifiés',
    duree: '1h',
  },

  // ========== MOIS 3 — SEMAINES 10-12+ : RÉPÉTITION ET OPTIMISATION ==========
  // SEMAINE 10 — Révision des meilleures actions
  {
    id: 'p-64',
    day: 64,
    category: 'picking',
    title: 'Contact terrain — Rue avec transaction récente (optimisé)',
    description: `Semaine 10 — Tu recommandes le cycle avec l\'expérience de 9 semaines.\n\nCible une rue avec transaction récente.\n\nToque aux 10 portes.\n\n"Vos voisins ont vendu, le marché bouge. Voulez-vous savoir ce que vaut votre bien ?"\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nTu sais maintenant ce qui marche sur ton secteur. Fais-le parfaitement.`,
    script: 'Conseil méthodo — Semaine 10 = recommencement du cycle avec l\'expérience. Tu sais quelles rues rapportent, quels leviers fonctionnent, quels apporteurs délivrent. Fais chaque action parfaitement.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 2 contacts qualifiés, 1 apporteur enregistré',
    duree: '11h-13h ou 17h-19h',
  },
  // J65 — Estimation : bien vendu (rotation M3+)
  {
    id: 'p-65',
    day: 65,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Bien vendu" (M3+)',
    description: `"Je viens de vendre sur ce secteur, j\'ai des acheteurs en attente. Je propose aux propriétaires une estimation patrimoniale totalement offerte. C\'est la base de mon métier."\n\nToque aux 10 portes. Rotation des leviers — optimisée avec ton expérience.`,
    script: 'Conseil méthodo — Le cycle se répète mais TU as changé. Tu as 2 mois d\'expérience, un fichier qui grandit, des apporteurs qui délivrent. Chaque action est maintenant plus efficace.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  // J66 — Apporteurs : renforcement du réseau existant
  {
    id: 'p-66',
    day: 66,
    category: 'apporteurs',
    title: 'Apporteurs — Renforcement du réseau existant',
    description: `Aujourd\'hui : renforce les liens avec tes apporteurs existants.\n\nPasse chez tes 5 meilleurs apporteurs avec un petit cadeau et des nouvelles du marché.\n\n"Je passais dans le coin, je voulais savoir comment se passe votre mois, est-ce que les gens ont des projets de rénovation en ce moment ? Comment est le marché ? J\'ai parlé de vous cette semaine !"\n\nLe feedback est obligatoire : dès qu\'une mise en relation est faite, tiens-le au courant de CHAQUE étape.\n\nTrouve aussi 1 nouvel apporteur original.`,
    script: 'Conseil méthodo — "Café stratégique" mensuel avec chaque apporteur. Ne viens pas demander "t\'as un mandat ?" — viens pour discuter du marché. Le feedback systématique après chaque mise en relation = un apporteur motivé à 200 %.',
    objectif: '🎯 5 apporteurs renforcés avec cadeau, 1 nouvel apporteur original contacté',
    duree: '2h',
  },
  // J67 — PIGE Légale
  {
    id: 'p-67',
    day: 67,
    category: 'relances',
    title: 'PIGE Légale — Ciblage avancé',
    description: `Ta session PIGE Légale — 30 minutes chrono, très tôt le matin.

PIGE Légale avec ciblage avancé basé sur tes résultats des 10 semaines précédentes.\n\nQuel segment a le mieux répondu ? Double les efforts dessus.\n• Voisins de biens vendus → FOMO\n• Anciens contacts → maturité\n• Propriétaires 5+ ans → curiosité\n• Nouveaux contacts → fraîcheur\n\nAnalyse, segmente, convertis.\n\n📌 La stratégie complète de la PIGE (celle mise au point par ton réseau) est dans tes vidéos de formation — regarde-les si tu ne la maîtrises pas encore. Et avant tout appel à un particulier, vérifie qu'il n'est pas inscrit sur Bloctel : c'est la loi.`,
    script: 'Conseil méthodo — Les données des 10 semaines te disent exactement quoi faire. Quel segment a le meilleur taux de conversion ? Double les efforts. Quel message a le mieux répondu ? Utilise-le plus. Les données ne mentent pas.',
    objectif: '🎯 15 SMS segmentés envoyés, 5 réponses positives, 2 R1 fixés',
    duree: '30 min (7h-8h30)',
  },
  // J68 — Rapport local
  {
    id: 'p-68',
    day: 68,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Début du T2',
    description: `Premier rapport du trimestre 2. Les chiffres ont évolué depuis le T1.\n\n1. Génère le rapport T2-Q1 (3 min)\n2. Envoie-le à tous tes contacts avec une note : "Nouveau trimestre, nouveaux chiffres !"\n3. Cible 10 nouveaux propriétaires\n4. "Voici mon premier rapport du trimestre 2. Le marché a évolué, voici les chiffres actualisés..."\n\nChaque nouveau trimestre = une raison de recontacter = un R1 potentiel.

💡 **Ton rapport local te sert 1 à 2 mois.** La prochaine fois que cette action revient, réutilise ce même rapport et combine-le avec du terrain proche de biens en vente (recherche acquéreurs).`,
    script: 'Conseil méthodo — Le début du T2 = une raison naturelle de recontacter tout ton fichier. "Nouveau trimestre, nouveaux chiffres" = les propriétaires sont curieux de voir l\'évolution.',
    objectif: '🎯 1 rapport T2 généré, 25 contacts recontactés, 5 nouveaux, 2 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  // J69 — Inter-cabinets
  {
    id: 'p-69',
    day: 69,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Session T2-S1',
    description: `Première session inter-cabinets du trimestre 2.\n\nNouveaux biens invendus du T1 à relancer, nouveaux confrères à contacter, nouvelles stratégies de prix.\n\nL\'inter-cabinet est maintenant un rendez-vous hebdomadaire immuable dans ton agenda.`,
    script: 'Conseil méthodo — Trimestre 2, semaine 1. L\'inter-cabinet fait partie de ta routine. Chaque semaine, 1h consacrée aux confrères = 20-30 % de ventes en plus.',
    objectif: '🎯 5 biens analysés, 7 confrères contactés, 3 visites programmées',
    duree: '1h',
  },
  // J70 — Commerçants
  {
    id: 'p-70',
    day: 70,
    category: 'commerçants',
    title: 'Commerçants — Routine T2-S1',
    description: `Première routine commerçants du trimestre 2.\n\nFlyers frais avec les dernières exclusivités, QR code, nouvelles du quartier, inclusion des clients.\n\nPrésente tes objectifs du T2 à tes commerçants. Ils doivent sentir que tu progresses.\n\nRetire les vieux flyers (+3 semaines / 1 mois).`,
    script: 'Conseil méthodo — Le T2 commence. Tes commerçants doivent sentir l\'énergie nouvelle. Présente-leur tes nouveaux biens, tes nouveaux objectifs. Un commerçan qui te voit progresser = un commerçan qui parle de toi avec enthousiasme.',
    objectif: '🎯 5 commerçants revisités, 2 exclusivités présentées, 3 contacts qualifiés',
    duree: '45 min',
  },
  // J71 à J77 — Réflexion des actions clés du cycle
  {
    id: 'p-71',
    day: 71,
    category: 'picking',
    title: 'Contact terrain — Rue inexplorée (T2)',
    description: `Nouveau trimestre, nouvelles rues à conquérir.\n\nChoisis une rue où tu n\'es pas encore allé ce trimestre.\n\nSélectionne 3 biens en vente sur ton outil dans cette rue ou très proche.\n\nToque au bien + aux 10 voisins.\n\n**À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et finis par dire qu'effectivement ça a l'air de coller avec la recherche de tes acheteurs. Prends le RDV pour une première visite : "Je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez — pour prendre l'ensemble des détails techniques et en parler aux acheteurs, pour rapidement les amener en visite. Plutôt le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — tu apportes une info fiable sur la valeur de leur patrimoine. Ça sert toujours, même sans projet immédiat.\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"`,
    script: 'Conseil méthodo — Chaque trimestre = de nouvelles rues à conquérir. Ton territoire s\'étend naturellement. Un seul flyer. Sélectionne des biens en vente. Toque. Enregistre. Relance.',
    objectif: '🎯 3 biens en vente ciblés, 13 portes toquées, 3 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  {
    id: 'p-72',
    day: 72,
    category: 'apporteurs',
    title: 'Apporteurs — Cuisiniste (rotation T2)',
    description: `Rotation des apporteurs originaux — retour chez les cuisinistes.\n\nPasse voir tes cuisinistes partenaires : nouvelles du mois, feedback sur les derniers contacts, petit cadeau.\n\nTrouve aussi 1 nouveau cuisiniste sur un secteur adjacent.\n\n**Rappel du deal** : devis en attente → mise en relation → 6 % sur vente + plans 3D présentés aux acheteurs si le vendeur ne fait pas les travaux.`,
    script: 'Conseil méthodo — La rotation des apporteurs originaux assure que tu ne les oublies pas. Un cuisiniste qui n\'a pas de tes nouvelles depuis 2 mois = un cuisiniste qui oublie de parler de toi. Le "café stratégique" mensuel est obligatoire.',
    objectif: '🎯 2 cuisinistes relancés, 1 nouveau contacté, 1 mise en relation activée',
    duree: '1h',
  },
  {
    id: 'p-73',
    day: 73,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Secteur adjacent (T2)',
    description: `Génère ton rapport local pour un secteur adjacent que tu as commencé à explorer.\n\n1. Génère le rapport (3 min)\n2. Envoie-le aux contacts de ce secteur\n3. Cible 10 nouveaux propriétaires dans cette zone\n4. "Voici mon rapport sur [secteur adjacent]. Le marché est très dynamique en ce moment..."\n\nL\'expansion territoriale continue.

💡 **Ton rapport local te sert 1 à 2 mois.** La prochaine fois que cette action revient, réutilise ce même rapport et combine-le avec du terrain proche de biens en vente (recherche acquéreurs).`,
    script: 'Conseil méthodo — L\'expansion territoriale est la clé de la croissance au T2. Chaque nouveau secteur = de nouveaux mandats sans cannibaliser ton secteur principal. Le rapport local facilite cette expansion.',
    objectif: '🎯 1 rapport généré, 10 nouveaux propriétaires contactés, 3 emails, 1 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  {
    id: 'p-74',
    day: 74,
    category: 'relances',
    title: 'PIGE Légale — Rotation T2',
    description: `PIGE Légale du T2 — rotation des segments.\n\nSi au T1 tu as ciblé les voisins de biens vendus → cette semaine cible les propriétaires depuis 5+ ans.\n\nAlterne les segments chaque semaine pour ne pas saturer.\n\n"Bonjour [Prénom], c\'est [Ton prénom] du secteur. Le marché a beaucoup évolué depuis votre achat. Si vous souhaitez connaître la valeur actualisée de votre patrimoine ou celle de votre entourage, je vous propose une estimation offerte sans engagement."\n\n📌 La stratégie complète de la PIGE (celle mise au point par ton réseau) est dans tes vidéos de formation — regarde-les si tu ne la maîtrises pas encore. Et avant tout appel à un particulier, vérifie qu'il n'est pas inscrit sur Bloctel : c'est la loi.`,
    script: 'Conseil méthodo — La rotation des segments évite la saturation. Un propriétaire qui reçoit 3 SMS sur 3 mois avec des angles différents = un propriétaire curieux. Un propriétaire qui reçoit 3 SMS identiques = un propriétaire agacé.',
    objectif: '🎯 15 SMS envoyés, 4 réponses positives, 2 R1 fixés',
    duree: '30 min (7h-8h30)',
  },
  {
    id: 'p-75',
    day: 75,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Session T2-S2',
    description: `Session inter-cabinets hebdomadaire.\n\nSuis les visites de la semaine précédente, identifie les nouveaux biens invendus, programme les visites à venir.\n\nL\'inter-cabinet est maintenant aussi naturel que le terrain.`,
    script: 'Conseil méthodo — Semaine après semaine, l\'inter-cabinet devient un réflexe. Les confrères te connaissent, ils te font confiance, ils t\'appellent quand ils ont un acquéreur. C\'est un canal de vente à part entière.',
    objectif: '🎯 4 suivis, 6 confrères contactés, 3 visites programmées',
    duree: '1h',
  },
  {
    id: 'p-76',
    day: 76,
    category: 'commerçants',
    title: 'Commerçants — Routine T2-S2',
    description: `Routine commerçants : flyers frais, QR code, nouvelles du quartier, inclusion des clients qui attendent.\n\nTrouve 1 nouveau commerçant ce mois-ci.\n\nRetire les vieux flyers (+3 semaines / 1 mois).`,
    script: 'Conseil méthodo — Routine + nouveauté. Chaque mois, 1 nouveau commerçan = 12 nouveaux relais par an. En 2 ans, tu as un réseau de 24 commerçants qui parlent de toi. Imagine l\'impact.',
    objectif: '🎯 5 commerçants revisités, 1 nouveau contacté, 3 contacts qualifiés',
    duree: '45 min',
  },
  {
    id: 'p-77',
    day: 77,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "En vente" (T2)',
    description: `"J\'ai entendu dire qu\'il y avait un bien en vente sur ce secteur, vous en avez entendu parler ? J\'organise les visites ce week-end. Je propose aux propriétaires une estimation patrimoniale totalement offerte. C\'est la base de mon métier."\n\nToque aux 10 portes. Rotation des leviers.`,
    script: 'Conseil méthodo — T2, le cycle continue. Tu maîtrises maintenant les 3 leviers d\'estimation. Chaque action est plus efficace qu\'au tour précédent. Les données guident tes décisions.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 2 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },

  // SEMAINE 12 et au-delà — Le cycle continue avec rotation
  // J78 à J84
  {
    id: 'p-78',
    day: 78,
    category: 'picking',
    title: 'Contact terrain — Post-R1 systématique (T2)',
    description: `Chaque R1 = 5 portes toquées après. Systématique.\n\n"Je viens d\'estimer le bien de vos voisins. Que vous ayez un projet de vente ou pas, peu importe, c\'est toujours important de connaître la valeur de son patrimoine."\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nTu es maintenant un professionnel. Chaque geste est parfait.`,
    script: 'Conseil méthodo — Le post-R1 systématique est devenu un réflexe. Tu ne quittes plus une rue sans avoir toqué aux voisins. C\'est ce geste qui fait la différence entre un bon et un excellent conseiller.',
    objectif: '🎯 5 portes post-R1 par R1, 1 estimation spontanée minimum',
    duree: '15 min après chaque R1',
  },
  {
    id: 'p-79',
    day: 79,
    category: 'apporteurs',
    title: 'Apporteurs — Brocanteur / vide-maison (rotation T2)',
    description: `Rotation des apporteurs originaux — retour chez les brocanteurs et vide-maison.\n\nPasse voir tes partenaires : nouvelles du mois, feedback, petit cadeau.\n\nTrouve 1 nouveau brocanteur sur un secteur adjacent.\n\n**Rappel du deal** : vide-maison → mise en relation → 6 % sur vente + recommandation systématique à tes clients en succession.`,
    script: 'Conseil méthodo — Le brocanteur te met en contact avec des vendeurs en succession = mandats sans concurrence dans 90 % des cas. C\'est l\'apporteur le plus rentable si tu entretiens bien la relation.',
    objectif: '🎯 2 brocanteurs relancés, 1 nouveau contacté, 1 mise en relation',
    duree: '1h',
  },
  {
    id: 'p-80',
    day: 80,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Actualisation mensuelle',
    description: `Génère ton rapport local actualisé pour le mois en cours.\n\n1. Génère le rapport (3 min)\n2. Envoie-le à tous tes contacts\n3. Cible 10 nouveaux propriétaires\n4. "Voici mon rapport actualisé du mois. Les chiffres ont évolué..."\n\nL\'actualisation mensuelle = une raison de recontacter = un R1 potentiel.

💡 **Ton rapport local te sert 1 à 2 mois.** La prochaine fois que cette action revient, réutilise ce même rapport et combine-le avec du terrain proche de biens en vente (recherche acquéreurs).`,
    script: 'Conseil méthodo — L\'actualisation mensuelle du rapport local crée un rendez-vous régulier avec tes contacts. Ils attendent ton rapport comme on attend le journal du soir.',
    objectif: '🎯 1 rapport actualisé, 20 contacts recontactés, 5 nouveaux, 2 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  {
    id: 'p-81',
    day: 81,
    category: 'relances',
    title: 'PIGE Légale — Rotation segment (T2)',
    description: `PIGE Légale — rotation des segments pour le mois en cours.\n\nAlterne : voisins de biens vendus → anciens contacts → propriétaires 5+ ans → nouveaux contacts.\n\nChaque segment a un angle différent. Chaque angle a un taux de conversion différent.\n\nTeste, mesure, optimise.\n\n📌 La stratégie complète de la PIGE (celle mise au point par ton réseau) est dans tes vidéos de formation — regarde-les si tu ne la maîtrises pas encore. Et avant tout appel à un particulier, vérifie qu'il n'est pas inscrit sur Bloctel : c'est la loi.`,
    script: 'Conseil méthodo — La rotation des segments = la clé de la PIGE Légale sur le long terme. Tu ne satures aucune cible, tu testes tous les angles, et tu doubles les efforts sur ce qui marche le mieux.',
    objectif: '🎯 15 SMS envoyés, 4 réponses positives, 2 R1 fixés',
    duree: '30 min (7h-8h30)',
  },
  {
    id: 'p-82',
    day: 82,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Session hebdo (T2)',
    description: `Session inter-cabinets hebdomadaire.\n\nSuivi, nouvelles propositions, planification. L\'inter-cabinet est un rendez-vous immuable dans ton agenda.\n\nLes confrères qui te connaissent = des confrères qui t\'appellent quand ils ont un acquéreur chaud.`,
    script: 'Conseil méthodo — L\'inter-cabinet hebdo = 20-30 % de tes ventes. C\'est le meilleur ROI de ton temps. 1h par semaine = des ventes que tu n\'aurais jamais faites seul.',
    objectif: '🎯 4 suivis, 6 confrères contactés, 3 visites programmées',
    duree: '1h',
  },
  {
    id: 'p-83',
    day: 83,
    category: 'commerçants',
    title: 'Commerçants — Routine + remerciements (T2)',
    description: `Routine commerçants : flyers frais, QR code, nouvelles du quartier, inclusion des clients.\n\nRemercie tes 2 meilleurs commerçants apporteurs du mois.\n\nRetire les vieux flyers (+3 semaines / 1 mois).`,
    script: 'Conseil méthodo — Les remerciements mensuaux créent l\'attente. Les commerçants se demandent "est-ce que je serai dans les remerciés ce mois-ci ?" = motivation à te parler activement.',
    objectif: '🎯 5 commerçants revisités, 2 remerciés, 3 contacts qualifiés',
    duree: '1h',
  },
  {
    id: 'p-84',
    day: 84,
    category: 'estimation',
    title: 'Estimation patrimoniale offerte — Levier "Recherche acquéreur" (T2)',
    description: `"J\'ai entendu dire qu\'il y avait un bien en vente sur ce secteur, vous en avez entendu parler ? Je recherche activement un acquéreur pour mes clients. Je propose aux propriétaires une estimation patrimoniale totalement offerte. C\'est la base de mon métier."\n\nToque aux 10 portes.`,
    script: 'Conseil méthodo — T2, semaine 12. Le cycle se répète mais à chaque tour, tu es plus fort. Plus de contacts, plus d\'apporteurs, plus d\'expérience. Chaque action est plus efficace.',
    objectif: '🎯 10 portes toquées, 4 estimations offertes, 3 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },

  // SEMAINE 13+ — Le cycle se poursuit, les actions se répètent avec optimisation
  {
    id: 'p-85',
    day: 85,
    category: 'picking',
    title: 'Contact terrain — Rue entière (T2-S5)',
    description: `Conquête d\'une rue entière.\n\nSélectionne 3 biens en vente sur ton outil dans cette rue ou très proche.\n\nToque au bien + aux 10 voisins.\n\n**À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et finis par dire qu'effectivement ça a l'air de coller avec la recherche de tes acheteurs. Prends le RDV pour une première visite : "Je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez — pour prendre l'ensemble des détails techniques et en parler aux acheteurs, pour rapidement les amener en visite. Plutôt le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — tu apportes une info fiable sur la valeur de leur patrimoine. Ça sert toujours, même sans projet immédiat.\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"\n\nLe cycle continue. Chaque tour est plus fort.`,
    script: 'Conseil méthodo — Le cycle de 90 jours se répète indéfiniment. Après le jour 90, on recommence au jour 1. Mais TU n\'es plus le même conseiller. Chaque tour = plus d\'expérience, plus de contacts, plus de mandats.',
    objectif: '🎯 3 biens en vente ciblés, 13 portes toquées, 3 contacts qualifiés',
    duree: '11h-13h ou 17h-19h',
  },
  {
    id: 'p-86',
    day: 86,
    category: 'apporteurs',
    title: 'Apporteurs — Pharmacien (rotation T2)',
    description: `Rotation des apporteurs originaux — retour chez les pharmaciens.\n\nPasse voir tes partenaires : nouvelles du mois, feedback, petit cadeau.\n\nTrouve 1 nouvelle pharmacie sur un secteur adjacent.\n\n**Rappel** : discrétion et éthique avant tout. Jamais "qui est malade ?" — toujours "je suis une ressource pour vos patients en difficulté".`,
    script: 'Conseil méthodo — Le pharmacien = relation de confiance absolue. S\'il recommande = 80 % de la confiance est déjà gagnée. Le "café stratégique" mensuel est obligatoire pour entretenir cette relation précieuse.',
    objectif: '🎯 2 pharmaciens relancés, 1 nouvelle pharmacie contactée, 1 mise en relation',
    duree: '1h',
  },
  {
    id: 'p-87',
    day: 87,
    category: 'rapport-local',
    title: 'Rapport local immobilier — Nouveau format',
    description: `Varie les formats de ton rapport local pour maintenir l\'intérêt.\n\nCette fois : format "infographie visuelle" ou "comparatif quartier par quartier".\n\n1. Génère le rapport dans un nouveau format (3 min)\n2. Envoie-le à tes contacts avec une note sur la nouveauté\n3. Cible 10 nouveaux propriétaires\n\nLa variété des formats = l\'intérêt maintenu sur le long terme.

💡 **Ton rapport local te sert 1 à 2 mois.** La prochaine fois que cette action revient, réutilise ce même rapport et combine-le avec du terrain proche de biens en vente (recherche acquéreurs).`,
    script: 'Conseil méthodo — La variété des formats évite la lassitude. Un rapport infographique, un comparatif, un focus investisseur... Chaque format attire un type de propriétaire différent. Teste, observe, ajuste.',
    objectif: '🎯 1 rapport nouveau format, 15 contacts recontactés, 5 nouveaux, 2 R1 minimum',
    duree: '11h-13h ou 17h-19h',
  },
  {
    id: 'p-88',
    day: 88,
    category: 'relances',
    title: 'PIGE Légale — Dernier segment du mois',
    description: `Dernière PIGE Légale du mois en cours.\n\nCible le dernier segment non exploré ce mois-ci.\n\nMessage personnalisé selon le segment.\n\nClôture le mois en beauté avec un maximum de R1.\n\n📌 La stratégie complète de la PIGE (celle mise au point par ton réseau) est dans tes vidéos de formation — regarde-les si tu ne la maîtrises pas encore. Et avant tout appel à un particulier, vérifie qu'il n'est pas inscrit sur Bloctel : c'est la loi.`,
    script: 'Conseil méthodo — Dernière PIGE du mois. Chaque SMS = une chance de signer un dernier mandat avant la fin du mois. Ne laisse aucune opportunité passer.',
    objectif: '🎯 15 SMS envoyés, 4 réponses positives, 2 R1 fixés',
    duree: '30 min (7h-8h30)',
  },
  {
    id: 'p-89',
    day: 89,
    category: 'inter-cabinets',
    title: 'Inter-cabinets — Bilan mensuel',
    description: `Dernier inter-cabinet du mois. Bilan + planification.\n\n1. Bilan : combien de ventes ce mois-ci ? Quels confrères ont délivré ?\n2. Remercie les confrères actifs\n3. Planifie les inter-cabinets du mois prochain\n4. Identifie les biens qui bloquent et ajuste la stratégie\n\nL\'inter-cabinet = 20-30 % de tes ventes. Entretiens ce canal précieux.`,
    script: 'Conseil méthodo — Bilan mensuel des inter-cabinets. Les confrères qui délivrent méritent un remerciement. Les biens qui stagnent méritent une nouvelle stratégie. Planifie le mois prochain avec ambition.',
    objectif: '🎯 Bilan mensuel fait, 8 confrères contactés, 4 visites programmées pour le mois prochain',
    duree: '1h',
  },
  {
    id: 'p-90',
    day: 90,
    category: 'commerçants',
    title: 'Commerçants — Clôture du mois et bilan trimestriel',
    description: `Dernière routine commerçants du mois.\n\nFlyers frais, QR code, nouvelles du quartier, inclusion des clients.\n\n**Bilan trimestriel** :\n• Quels commerçants ont délivré ce trimestre ?\n• Combien de contacts qualifiés en tout ?\n• Quels nouveaux commerçants à intégrer au T3 ?\n\nRemercie publiquement tes meilleurs commerçants. Le succès doit se voir.\n\n**Retire les vieux flyers (+3 semaines / 1 mois).**\n\n🎉 Félicitations — tu as complété un cycle de 90 jours ! Le prochain cycle commence demain, et tu recommences avec l\'expérience de ces 90 jours.`,
    script: 'Conseil méthodo — Jour 90 = un cycle complet ! Tu as maintenant une méthode, un réseau, une routine. Demain, on recommence au jour 1 — mais cette fois, tu n\'es plus un débutant. Chaque tour du cycle est plus efficace. Félicite-toi, tu as fait le plus dur : tu es resté constants.',
    objectif: '🎯 5 commerçants revisités, bilan trimestriel fait, remerciements publics, 3 contacts qualifiés',
    duree: '1h',
  },
];

import { actionsEs } from '@/i18n/actionsEs';

export function getProspectionActionForDay(currentDay: number, level?: string, lang: 'fr' | 'es' = 'fr'): ProspectionAction {
  const cycleLength = actionsCycle.length; // 90 jours
  const cycleDay = ((currentDay - 1) % cycleLength) + 1;
  const action = actionsCycle.find(a => a.day === cycleDay) || actionsCycle[0];

  // Si langue ES, remplace les textes FR par ES
  if (lang === 'es') {
    const es = actionsEs[cycleDay];
    if (es) {
      return {
        ...action,
        title: es.title,
        description: es.description,
        script: es.script,
        objectif: es.objectif,
      };
    }
  }

  // J1 s'adapte selon le profil — une SEULE variante affichée, jamais les deux.
  // 'quelques-semaines' suit la variante débutant, 'quelques-mois' la variante confirmé.
  if (cycleDay === 1 && level) {
    if (level === 'débutant' || level === 'quelques-semaines') {
      return {
        ...action,
        title: 'Action adaptée à ton profil — Terrain classique pour débutant',
        description: `Tu débutes et ton fichier est encore petit — parfait, c\'est normal. Aujourd\'hui : du terrain classique.\n\nSélectionne 2 biens en vente sur ton outil interne, va taper aux portes de ces biens puis chez les voisins dans cette rue ou très proche.
Toque aux biens ciblés + 10 voisins. **À l'adresse exacte du bien en vente :**
"Bonjour, je me permets de vous appeler : je suis [Ton prénom]. Je viens de voir votre annonce. J'accompagne plusieurs acquéreurs sur ce type de bien — accepteriez-vous que je vous pose deux ou trois questions pour voir si ça peut matcher ?"

✅ Toujours déclarer ta qualité de professionnel dès le premier contact : c'est la loi, et c'est aussi ce qui te différencie des démarcheurs douteux.

Si c'est la bonne porte, pose des questions ouvertes sur le bien, parle du prix, et prends le RDV pour une première visite, puis une fois que tu as posé de nombreuses questions pour bien vérifier si ça correspond à ce que tes acheteurs cherchent : "Je vous propose qu'on fasse un premier rdv, je ne peux décemment pas découvrir le bien en même temps que mes acheteurs, vous le comprenez. Donc pour prendre l'ensemble des détails techniques et en parler aux acheteurs, et rapidement les amener en visite vous préférez le matin ou l'après-midi, qu'est-ce qui vous va le mieux ?"

**Chez les voisins (les 10 portes autour) :**
Là, tu passes à l'estimation patrimoniale offerte. Tu n'es pas là pour vendre — c'est une estimation patrimoniale offerte — autrement dit un avis de valeur indicatif. Il n'a pas de valeur opposable pour une assurance ou une succession (seule une expertise certifiée en a), mais il aide à y voir clair, même sans projet immédiat.\n\nPas de fichier ancien ? Pas de problème. Chaque porte toquée aujourd\'hui = un contact à relancer sous 3 à 6 mois. Ce que tu construis aujourd\'hui, tu le récolteras dans 6 mois. C\'est comme ça que ça marche.\n\n**Question magique** : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"`,
        objectif: '🎯 2 biens en vente ciblés, 10 portes toquées, 1 R1 estimation minimum',
      };
    }
    if (level === 'confirmé' || level === 'quelques-mois') {
      return {
        ...action,
        title: 'Action adaptée à ton profil — Relance anciens clients',
        description: `Tu es confirmé — ta force, c\'est ton fichier. Aujourd\'hui tu relances tes anciens clients : vendeurs et acheteurs.\n\n"Bonjour, c\'est [Ton prénom], je repassais vers vous pour prendre de vos nouvelles. Votre installation se passe bien ? Vous êtes bien installés ?" Écoute, montre que tu te soucies d\'eux.\n\nPuis demande naturellement : "Au fait, j\'ai changé d\'agence / de réseau — qui connaissez-vous autour de vous qui envisage de vendre, de chercher un bien, ou qui souhaite simplement connaître la valeur de son patrimoine ?"\n\nChaque ancien client satisfait = 2 à 3 recommandations naturelles. C\'est la base de ton business.`,
        objectif: '🎯 10 anciens clients relancés par appel vocal, 2 recommandations obtenues minimum',
      };
    }
  }

  return action;
}

const categoriesEs: Record<ProspectionCategory, { label: string; color: string; icon: string }> = {
  estimation: { label: 'Estimación patrimonial ofrecida', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: '📊' },
  apporteurs: { label: 'Colaboradores de negocios', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: '🤝' },
  commerçants: { label: 'Comerciantes', color: 'bg-green-100 text-green-700 border-green-200', icon: '🏪' },
  picking: { label: 'Contacto terreno', color: 'bg-orange-100 text-orange-700 border-orange-200', icon: '🚪' },
  'rapport-local': { label: 'Informe local inmobiliario', color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '📈' },
  'inter-cabinets': { label: 'Inter-agencias', color: 'bg-cyan-100 text-cyan-700 border-cyan-200', icon: '🔄' },
  'relances': { label: 'Reintentos mensuales', color: 'bg-lime-100 text-lime-700 border-lime-200', icon: '📬' },
  'social': { label: 'Redes sociales', color: 'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200', icon: '📱' },
  'mandat-proactif': { label: 'Acciones proactivas mandato', color: 'bg-violet-100 text-violet-700 border-violet-200', icon: '🚀' },
};

export function getProspectionCategoryInfo(category: ProspectionCategory, lang: 'fr' | 'es' = 'fr') {
  return lang === 'es' ? categoriesEs[category] : categories[category];
}

export function getWeekProspectionActions(weekStartDay: number): ProspectionAction[] {
  const actions: ProspectionAction[] = [];
  for (let i = 0; i < 7; i++) {
    actions.push(getProspectionActionForDay(weekStartDay + i));
  }
  return actions;
}
