// MOD-23 — Pool de 12 défis quotidiens.
// Sélection déterministe : un défi différent chaque jour, stable dans la journée
// (un F5 ne change pas le défi du jour).

export interface Defi {
  titre: string;
  description: string;
  objectif: string;
  // Script complet affiché dans l'accordéon « Voir le script »
  script: string;
}

export const DEFIS_POOL: Defi[] = [
  {
    titre: 'Relance express',
    description: 'Relance 5 contacts de plus de 30 jours.',
    objectif: 'Objectif : 1 RDV obtenu.',
    script:
      '« Bonjour [Prénom], c\'est [Ton prénom], on avait échangé il y a quelques semaines au sujet de votre projet. ' +
      'Je reprends vos nouvelles : où en êtes-vous ? » Écoute, puis : « Justement, le marché a bougé sur votre secteur — ' +
      'je peux vous faire un point valeur actualisé, ça prend 20 minutes. Vous préférez jeudi ou samedi ? »',
  },
  {
    titre: 'Porte-à-porte ciblé',
    description: 'Toque 20 portes autour d\'un bien vendu récemment sur ton secteur.',
    objectif: 'Objectif : 3 conversations.',
    script:
      '« Bonjour, je suis [Ton prénom], conseiller immobilier sur le quartier. On vient de vendre le bien au [N°/rue] — ' +
      'et j\'ai encore des acheteurs qui cherchent ici. Vous connaissez quelqu\'un dans le voisinage qui penserait à vendre ? ' +
      'Et vous, si vous deviez vendre, vous savez ce que vaut votre bien aujourd\'hui ? »',
  },
  {
    titre: 'Appel de la primo-liste',
    description: 'Appelle 10 contacts de ta primo-liste avec le script « J\'ai une bonne nouvelle ».',
    objectif: 'Objectif : 1 R1 fixé.',
    script:
      '« Salut [Prénom] ! J\'ai une bonne nouvelle : je me suis lancé dans l\'immobilier, accompagné et formé par un grand réseau. ' +
      'Tu peux me rendre un service ? Qui connais-tu autour de toi qui voudrait connaître la valeur de son bien ? ' +
      'C\'est la base de mon métier — le notaire, les assurances le demandent régulièrement. » Note chaque nom, propose le RDV.',
  },
  {
    titre: 'Estimation offerte',
    description: 'Propose une estimation offerte à 5 propriétaires de ta rue cible.',
    objectif: 'Objectif : 1 visite d\'estimation.',
    script:
      '« Bonjour, je suis [Ton prénom], conseiller immobilier du secteur. Cette semaine, j\'offre une estimation précise ' +
      'de leur bien aux propriétaires de la rue — comparables récents à l\'appui, sans engagement. ' +
      'Ça vous dirait de savoir ce que vaut votre maison aujourd\'hui ? Je passe mardi ou jeudi, qu\'est-ce qui vous arrange ? »',
  },
  {
    titre: 'Réseau d\'apporteurs',
    description: 'Va voir 3 commerçants/artisans de ton secteur (boulanger, plombier, coiffeur) et présente-toi.',
    objectif: 'Objectif : 2 apporteurs inscrits.',
    script:
      '« Bonjour ! Je suis [Ton prénom], conseiller immobilier ici dans le quartier. Je cherche des partenaires locaux : ' +
      'quand vous entendez qu\'un client veut vendre, vous me glissez le contact — et si la vente se fait, ' +
      'vous êtes rémunéré comme apporteur d\'affaires. Ça vous intéresse qu\'on en parle 5 minutes ? »',
  },
  {
    titre: 'Panneaux jour',
    description: 'Pose 2 panneaux « estimation offerte » à des adresses visibles.',
    objectif: 'Objectif : 2 panneaux posés + photo.',
    script:
      'Cible les apporteurs et commerçants déjà inscrits, ou les emplacements à fort passage (carrefours, entrées de lotissement). ' +
      '« Bonjour, je vous avais parlé de mon activité — je pose des panneaux "estimation offerte" chez mes partenaires. ' +
      'Votre emplacement est parfait : chaque appel qui vient de ce panneau vous est attribué. » Photographie chaque panneau posé.',
  },
  {
    titre: 'Fiche Google',
    description: 'Mets à jour ta fiche Google Business Profile : 3 photos + 1 post.',
    objectif: 'Objectif : fiche à 100 %.',
    script:
      'Check-list : 3 photos (portrait pro, ton secteur, un bien ou un panneau), 1 post (« Le marché de [ta ville] ce mois-ci : ' +
      'prix moyen, délai de vente, un conseil »), horaires et zone d\'intervention remplis, description avec tes mots-clés ' +
      '(« conseiller immobilier [ville] », « estimation offerte »). Termine en demandant 1 avis client.',
  },
  {
    titre: 'Voisinage de visite',
    description: 'Après ta prochaine visite, toque les 10 portes voisines avec le script voisinage.',
    objectif: 'Objectif : 1 contact chaud.',
    script:
      '« Bonjour, je suis [Ton prénom], conseiller immobilier — je viens de faire visiter le bien d\'à côté, ' +
      'il a beaucoup de succès. Vous savez ce que vaut le vôtre dans la foulée ? J\'ai les chiffres des ventes du quartier sur moi, ' +
      'je peux vous faire un avis en 10 minutes, maintenant ou à un moment qui vous arrange. »',
  },
  {
    titre: 'Pige assumée',
    description: 'Appelle 5 annonces de particuliers en te déclarant professionnel (script conforme).',
    objectif: 'Objectif : 1 R1.',
    script:
      '« Bonjour, je vous appelle pour votre annonce sur [plateforme]. Je suis transparent : je suis conseiller immobilier ' +
      'sur [secteur]. Je ne vous appelle pas pour vous vendre quoi que ce soit — j\'ai un acquéreur sérieux qui cherche ' +
      'exactement votre type de bien. Seriez-vous ouvert à une visite si ça peut aboutir à une offre ? »',
  },
  {
    titre: 'Anciens clients',
    description: 'Reprends contact avec 3 anciens clients pour prendre des nouvelles (script relance).',
    objectif: 'Objectif : 1 recommandation demandée.',
    script:
      '« Bonjour [Prénom], c\'est [Ton prénom] — je repassais vers vous pour prendre de vos nouvelles. ' +
      'Votre installation se passe bien ? » Écoute vraiment. Puis : « Au fait, qui connaissez-vous autour de vous ' +
      'qui envisage de vendre ou qui voudrait simplement connaître la valeur de son bien ? ' +
      'Chaque client satisfait est mon meilleur ambassadeur. »',
  },
  {
    titre: 'Post réseaux',
    description: 'Publie 1 contenu « coulisses du métier » sur tes réseaux (story ou post).',
    objectif: 'Objectif : 1 publication + 5 réponses aux commentaires.',
    script:
      'Idées de contenu : « 7 h du matin, je prépare ma tournée de terrain », « Ce qu\'on ne voit pas derrière une estimation », ' +
      '« Pourquoi je toque aux portes alors que tout est en ligne ». Poste, puis réponds à CHAQUE commentaire dans l\'heure — ' +
      'c\'est l\'engagement qui déclenche la portée. Termine par une question pour relancer la conversation.',
  },
  {
    titre: 'Journée R2',
    description: 'Prépare ton prochain R2 : comparables imprimés, dossier prêt, objections anticipées.',
    objectif: 'Objectif : 1 R2 préparé à 100 %.',
    script:
      'Check-list R2 : 3 à 5 comparables vendus imprimés, avis de valeur rédigé, mandat et documents prêts, ' +
      'plan de présentation (services → clause de confiance → 3 scénarios → avis de valeur → objections → pièces d\'identité). ' +
      'Anticipe 3 objections probables (« votre commission est trop chère », « on veut réfléchir »…) et écris ta réponse à chacune.',
  },
];

// Défi du jour : déterministe, différent chaque jour, stable dans la journée.
// `day` = jour depuis l'inscription (currentDay dans App/useProgress).
export function getDefiForDay(day: number): Defi {
  const len = DEFIS_POOL.length;
  const idx = ((day % len) + len) % len;
  return DEFIS_POOL[idx];
}
