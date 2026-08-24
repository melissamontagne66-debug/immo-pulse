export interface ScriptTemplate {
  id: string;
  title: string;
  category: string;
  content: string;
  usage: string;
  tags: string[];
}

export const scriptTemplates: ScriptTemplate[] = [
  {
    id: 'leboncoin-recherche-ouverture',
    title: 'Message LeBonCoin - Ouverture naturelle',
    category: 'prospection',
    usage: 'Premier contact téléphonique avec un vendeur PAP',
    content: `Bonjour, c'est bien [PRÉNOM] ?\n\nParfait, je vous appelé brièvement [PRÉNOM]. Je suis [TON PRÉNOM], conseiller immobilier indépendant, et je suis en recherche active pour un couple qui cherche [TYPE DE BIEN] dans votre secteur.\n\nJ'ai bien vu sur l'annonce que vous ne souhaitez pas d'agence, et je ne vous appelé absolument pas pour ça. Je vérifie simplément si votre bien correspond aux critères de mon acheteur. Il est très pressé, il vient de faire souffler une affaire et il a un financement validé.\n\nVous avez 3 minutes ? Si ça correspond pas, on en reste là et je ne vous dérange plus. Si ça correspond, on organise une visite rapidement. D'accord ?`,
    tags: ['selection', 'acquéreur', 'message', 'ouverture', 'leboncoin']
  },
  {
    id: 'leboncoin-recherche-questions',
    title: 'Message LeBonCoin - Questions qualifiantes',
    category: 'prospection',
    usage: 'Après l\'ouverture, qualifier le bien avant de proposer la visite',
    content: `Parfait, merci [PRÉNOM]. Pour être certain de ne pas déplacer mon client inutilement, j'ai quelques questions rapides :\n\n1. La maison fait environ combien de m² habitable ?\n2. Le terrain fait combien ?\n3. Les travaux sont récents ou il y a des choses à prévoir ?\n4. L'exposition c'est sud ? Vous avez une terrasse ou un jardin ?\n5. Vous êtes le seul propriétaire ?\n\n[PRENDRE DES NOTES]\n\nOK parfait, ça correspond vraiment à ce que mon client cherche. Je vais d'abord venir voir le bien moi-même pour vérifier que tout est OK, et si ça matche, je l'amène en visite dans la foulée. \n\nÇa vous irait demain vers 14h ou plutôt jeudi matin 10h ?`,
    tags: ['selection', 'questions', 'qualification', 'visite']
  },
  {
    id: 'relance-j3',
    title: 'Relance J+3',
    category: 'prospection',
    usage: 'Relancer un contact 3 jours après le premier échange',
    content: `Bonjour [PRÉNOM], c'est [TON PRÉNOM], on s'est parlé lundi à propos de votre projet de vente.\n\nJe voulais juste revenir vers vous car je pense que mon acheteur [DÉTAIL PERSONNEL] pourrait vraiment être intéressé.\n\nVous avez eu le temps de réfléchir ? Je peux passer vous voir ce week-end pour faire une estimation sans engagement ?`,
    tags: ['relance', 'j3', 'suivi', 'appel']
  },
  {
    id: 'relance-j15',
    title: 'Relance J+15 - Ajouter de la valeur',
    category: 'prospection',
    usage: 'Relancer en apportant une info utile (vente récente, marché)',
    content: `Bonjour [PRÉNOM], c'est [TON PRÉNOM].\n\nJe vous appelé rapidement car j'ai vendu une maison très similaire à la vôtre au [ADRESSE PROCHE] ce week-end à [PRIX]. Le marché est très actif en ce moment sur votre secteur.\n\nÇa vous dirait qu'on se voie pour faire le point sur votre projet ? Je peux vous montrer les comparables récents, ça vous donnera une bonne idée de la valeur réelle de votre bien. C'est sans engagement évidemment.\n\nDemain soir ou jeudi soir, ça vous irait ?`,
    tags: ['relance', 'j15', 'preuve sociale', 'vente comparable']
  },
  {
    id: 'r1-questions',
    title: 'R1 - Questions ouvertes essentielles',
    category: 'rdv',
    usage: 'Toutes les questions à poser au R1',
    content: `PHASE 1 - CONNAÎTRE LE VENDEUR\n• "Qu'est-ce qui vous a amenés à envisager ce changement de vie ?"\n• "Ça fait combien de temps que vous y pensez ?"\n• "C'est une décision mûrie depuis longtemps ?"\n\nPHASE 2 - COMPRENDRE LE BIEN\n• "Vous avez fait des travaux depuis que vous êtes là ?"\n• "Si vous aviez un budget travaux, quelle serait la première chose à changer ?"\n• "Vous avez les diagnostics ? Les plans ?"\n\nPHASE 3 - MOTIVATIONS PROFONDES\n• "Au-delà du prix, qu'est-ce qui est le plus important pour vous ?"\n• "Dans l'idéal, vous sériez installés dans votre nouveau logement quand ?"\n• "Si je trouve un acheteur qui correspond mais qui veut une date rapide, ça vous pose problème ?"\n\nPHASE 4 - ISOLER LES FREINS\n• "Vous avez déjà eu des estimations par le passé ?"\n• "Vous avez une idée de la fourchette de prix ?"\n• "Qu'est-ce qui vous ferait dire 'cet agent, je le choisis' ?"\n\n⚠️ Ne JAMAIS donner le prix au R1. C'est l'objectif du R2.\n⚠️ Fixe le R2 avec la règle des 2 options avant de partir.`,
    tags: ['r1', 'questions', 'écoute', 'motivation']
  },
  {
    id: 'r2-scénarios',
    title: 'R2 - Les 3 scénarios de prix',
    category: 'rdv',
    usage: 'Présenter les 3 scénarios de prix au R2',
    content: `[APRÈS AVOIR MONTRÉ LES PREUVES : biens vendus, comparables]\n\n"Voici ce que dit le marché aujourd'hui. J'ai analysé en détail les ventes récentes et les biens en ligne. Je vous propose 3 scénarios :\n\nSCÉNARIO 1 - PRIX ATTRACTIF : [PRIX BAS]\nOn positionné légèrement sous le prix du marché. Résultat : on déclenche la compétition entre acheteurs, on vend sous 1 mois, et souvent on dépasse le prix affiché. C'est la stratégie des ventes aux enchères.\n\nSCÉNARIO 2 - PRIX MARCHÉ (recommandé) : [PRIX JUSTE]\nOn positionné au prix juste du marché. On vend dans un délai de 2 à 3 mois, sans stress. C'est le juste milieu entre vitesse et prix maximum. C'est le scénario qui donne les meilleurs résultats dans 80\u00A0% des cas.\n\nSCÉNARIO 3 - PRIX AMBITIEUX : [PRIX HAUT]\nOn teste 10\u00A0% au-dessus du prix max du marché. Le risque : le bien peut stagner, perdre en visibilité, et on finit par baisser. Mais vous avez le droit de tester. Si on fait ça, on se reçoit dans 2 semaines pour faire le point.\n\n[FAIRE CHOISIR LE VENDEUR]\nCompte tenu de votre objectif de délai, quel scénario vous parle le plus ?"\n\n⚠️ RÈGLE DU SILENCE : Après avoir présenté, ferme-la. Compte jusqu'à 10 mentalement.`,
    tags: ['r2', 'prix', 'scénarios', 'preuve', 'marché']
  },
  {
    id: 'objection-concurrence',
    title: 'Objection - Plusieurs agences en concurrence',
    category: 'objections',
    usage: 'Quand le vendeur veut mettre plusieurs agences',
    content: `"Je comprends parfaitement votre réflexion. Vous voulez maximiser vos chances de vendre, c'est tout à fait légitime.\n\nCependant, laissez-moi vous partager mon expérience. Quand un vendeur met plusieurs agences en concurrence, voici ce qui se passe concrètement :\n\n1. Votre bien apparaît plusieurs fois sur les portails avec des prix différents → les acheteurs pensent que vous avez du mal à vendre\n2. Chaque agence investit moins car elle sait qu'elle n'a pas l'exclusivité\n3. Les acquéreurs négocient plus facilement car ils sentent la détresse\n4. Le temps de vente s'allonge et le bien se dévalorise\n\nC'est comme si vous disiez à tout le monde 'je suis pressé et je n'ai confiance en personne'.\n\nAvec l'exclusivité, c'est l'inverse : j'investis 100\u00A0% de mon temps et de mes ressources dans votre bien. Je suis votre seul interlocuteur. Et avec notre Clause de Confiance, si je ne tiens pas mes engagements, vous rompez sans pénalité.\n\nLa confiance n'exclut pas le contrôle. On y va ?"`,
    tags: ['objection', 'concurrence', 'exclusif', 'mandat simple']
  },
  {
    id: 'objection-prix-trop-haut',
    title: 'Objection - Le vendeur veut un prix trop élevé',
    category: 'objections',
    usage: 'Quand le vendeur veut fixer un prix supérieur au marché',
    content: `"Je comprends votre attachement à ce bien. Vous y avez vécu de beaux moments, vous avez investi dans les travaux... Cependant, le marché ne prend pas en compte les souvenirs.\n\nCe que les acheteurs regardent, ce sont les ventes comparables récentes. Et elles montrent que les biens similaires au vôtre se vendent entre [FOURCHETTE BASSE] et [FOURCHETTE HAUTE].\n\nSi on positionné au-dessus, voici ce qui va se passer :\n• Votre bien apparaît hors de la fourchette de recherche des acheteurs\n• Très peu de visites\n• Le bien stagne en ligne\n• Les acheteurs pensent qu'il y a un problème\n• Au final, on est obligé de baisser, et on vend souvent moins cher que le prix du marché initial\n\nCe que je vous propose : on part sur le prix du marché [PRIX]. À ce prix, on crée l'événement. On a beaucoup de visites, de l'engagement, et souvent plusieurs offres. C'est comme ça qu'on vend au mieux.\n\nEt si vous voulez vraiment tester plus haut, on peut le faire MAIS avec un point de contrôle dans 2 semaines. D'accord ?"`,
    tags: ['objection', 'prix', 'trop cher', 'marché']
  },
  {
    id: 'clause-confiance',
    title: 'Clause de Confiance - Script complet',
    category: 'mandats',
    usage: 'Présenter la clause de confiance au vendeur',
    content: `"Avant de signer, je veux vous parler de quelque chose d'important : notre Clause de Confiance.\n\nC'est un engagement que je prends envers vous, avec des points précis et mesurables :\n\n1. Votre bien sera mis en ligne sous 72h avec photos professionnelles\n2. Vous aurez minimum 5 visites qualifiées dans les 30 jours\n3. Je vous envoie un compte-rendu après chaque visite sous 24h\n4. Point téléphonique chaque semaine pour faire le point\n5. Si après 30 jours on n'a pas d'offre, on réévalue ensemble la stratégie\n\nSi je ne tiens pas un de ces engagements, vous pouvez résilier le mandat sans aucune pénalité. Zéro.\n\nC'est notre contrat de confiance. La confiance n'exclut pas le contrôle. Ça vous rassure ?"`,
    tags: ['clause', 'confiance', 'engagement', 'garantie']
  },
  {
    id: 'debrief-visite',
    title: 'Débrief après visite (SMS)',
    category: 'suivi',
    usage: 'SMS au vendeur après chaque visite',
    content: `Bonjour [PRÉNOM],\n\nPetit compte-rendu après la visite de ce [JOUR] :\n\n[NOMBRE] acquéreur(s) ont visité votre bien aujourd'hui.\n\nRetours :\n• [Point positif 1 : "Séduits par la luminosité"]\n• [Point positif 2 : "Le jardin a beaucoup plu"]\n• [Point de vigilance : "Question sur les travaux de la salle de bain"]\n\nProchaines étapes :\n[Action prévue : "Relance des acquéreurs demain / Nouvelle visite prévue jeudi"]\n\nBonne soirée,\n[TON PRÉNOM]\n[TÉLÉPHONE]`,
    tags: ['débrief', 'visite', 'sms', 'vendeur', 'compte-rendu']
  },
  {
    id: 'email-notaire',
    title: 'Email au notaire - Dossier complet',
    category: 'notaire',
    usage: 'Envoyer le dossier au notaire après offre acceptée',
    content: `Bonjour Maître [NOM],\n\nJ'ai le plaisir de vous transmettre le dossier relatif à la vente du bien situé au [ADRESSE].\n\nRÉCAPITULATIF :\n• Prix FAI : [MONTANT] €\n• Prix net vendeur : [MONTANT] €\n• Honoraires TTC : [MONTANT] €\n\nPARTIES :\nVendeur(s) : [NOMS + COORDONNÉES + ÉTAT CIVIL]\nAcquéreur(s) : [NOMS + COORDONNÉES + ÉTAT CIVIL]\n\nNOTAIRES :\nNotaire vendeur : [NOM + COORDONNÉES]\nNotaire acheteur : [NOM + COORDONNÉES]\n\nCONDITIONS SUSPENSIVES :\n[Lister chaque condition avec délai]\n\nPIÈCES JOINTES :\n1. Offre d'achat acceptée et signée\n2. Mandat de vente\n3. Pièces d'identité (vendeurs + acheteurs)\n4. Titre de propriété\n5. Diagnostics techniques complets\n6. Dossier copropriété (PV AG, charges, règlement)\n7. Attestation de financement acquéreur\n8. Liste des meubles meublants\n\nLCB/FT effectué : Oui\n\nPouvez-vous me confirmer réception et me signaler s'il manque des pièces ?\n\nBien cordialement,\n[TON NOM]\nConseiller immobilier\n[TÉLÉPHONE]`,
    tags: ['notaire', 'email', 'dossier', 'offre acceptée', 'transmission']
  },
  {
    id: 'demande-avis-google',
    title: 'Demande avis Google',
    category: 'suivi',
    usage: 'Demander un avis Google au client après acte ou compromis',
    content: `Bonjour [PRÉNOM],\n\nJ'espère que vous vous êtes bien installés dans votre nouveau logement ! 🏠\n\nJe vous écris pour vous demander un petit service : votre avis sur mon accompagnement.\n\nVotre témoignage m'aide énormément à développer mon activité et à aider d'autrès personnes comme vous à réussir leur projet immobilier.\n\nPour laisser votre avis, c'est très simple :\n[LIEN GOOGLE MY BUSINESS]\n\nQuelques idées de ce que vous pouvez mentionner :\n• Le type de bien et la ville\n• Ce qui vous a plu dans mon accompagnement\n• Le délai de vente / achat\n\nMerci infiniment pour votre confiance !\n\n[TON PRÉNOM]`,
    tags: ['avis', 'google', 'témoignage', 'recommandation', 'gmb']
  },
  {
    id: 'garantie-30-script',
    title: 'Garantie 30 Jours - Script de vente',
    category: 'mandats',
    usage: 'Présenter la garantie 30 jours au R2',
    content: `"[PRÉNOM], je vais vous proposer quelque chose que très peu d'agents osent proposer.\n\nJe suis tellement certain de vendre votre bien rapidement que je vous propose notre Garantie 30 Jours.\n\nVoici comment ça marche :\n• Je m'engage à vous apporter minimum 5 visites qualifiées sous 30 jours\n• Votre bien sera mis en ligne sous 72h avec photos professionnelles\n• Diffusion sur 100+ portails immobiliers\n\nSi sous 30 jours, je n'ai pas vendu votre bien :\n→ Je vous rembourse intégralement mes honoraires.\n→ Vous ne payez rien. Zéro.\n\nC'est sans risque pour vous. Vous ne perdez que du temps si ça ne marche pas. Et honnêtement, si à ce prix, avec cette stratégie, on ne vend pas sous 30 jours... c'est que le marché a changé et qu'il faudrait rêvoir le prix.\n\nLa confiance n'exclut pas le contrôle. On signé ?"`,
    tags: ['garantie 30', 'g30', 'différenciateur', 'engagement']
  },
  {
    id: 'post-vendu-réseaux',
    title: 'Publication "Vendu" - Réseaux sociaux',
    category: 'réseaux',
    usage: 'Post Facebook/Instagram quand un bien est vendu',
    content: `🏠 VENDU ! 🎉\n\nEncore une belle histoire qui se termine bien !\n\n[TYPE DE BIEN] à [VILLE/QUARTIER]\nvendu en [DÉLAI] à [PRIX] €\n\nUn grand merci à [PRÉNOM VENDEUR] pour sa confiance et à [PRÉNOM ACHETEUR] pour son projet !\n\nVous aussi vous envisagez de vendre ou d'achétér dans le secteur de [VILLE] ?\nContactez-moi pour une estimation gratuite et sans engagement.\n\n📞 [TÉLÉPHONE]\n📧 [EMAIL]\n\n#Immobilier[Ville] #Vendu #ConseillerImmobilier #Immobilier`,
    tags: ['post', 'vendu', 'réseaux sociaux', 'facebook', 'instagram']
  },
  {
    id: 'push-offre',
    title: 'Pousser à l\'offre après visite',
    category: 'négociation',
    usage: 'Quand l\'acquéreur a aimé le bien mais hésite',
    content: `[SORTIR DU BIEN - DÉBRIEF IMMÉDIAT]\n\n"Alors, comment vous sentez-vous ici ?"\n\n[LAISSEZ PARLER - ÉCOUTER L'ÉMOTION]\n\n"C'est vrai que [REPRENDRE CE QUI A PLU]. C'est un point fort de ce bien.\n\nJe vais être transparent avec vous : il y a d'autrès personnes intéressées. J'ai une visite programmée [demain / ce week-end]. Et honnêtement, dans ce secteur, à ce prix, les biens partent vite.\n\nCe que je vous propose : on rédige votre offre maintenant. Ça vous prend 10 minutes, ça vous engage à rien, mais ça vous met premiers dans la file. Si vous attendez, vous risquez de devoir répartir en recherche.\n\nLa différence de quelques milliers d'euros, est-ce que ça vaut le risque de devoir recommencer vos recherches pendant des mois ?"\n\n[SI HÉSITATION]\n"D'accord, je comprends. Mais au minimum, donnez-moi votre fourchette aujourd'hui, et je vais en parler au vendeur pour voir ce qui est possible."`,
    tags: ['offre', 'push', 'débrief', 'urgence', 'fomo']
  },
  {
    id: 'mail-chasse',
    title: 'Mail de prospection - Maisons inhabitées',
    category: 'prospection',
    usage: 'Courrier pour maisons inhabitées ou successions',
    content: `Bonjour,\n\nJe suis [TON PRÉNOM], conseiller immobilier indépendant sur [VILLE/QUARTIER].\n\nJe suis actuellement en recherche active pour un client sérieux qui cherche [TYPE DE BIEN] dans votre secteur. Son financement est validé et il souhaite emménager [DÉLAI].\n\nVotre maison pourrait correspondre parfaitement à ses critères.\n\nSeriez-vous intéressé par une estimation gratuite et sans engagement de votre bien ? Cela vous permettrait de connaître sa valeur sur le marché actuel, sans aucun engagement de votre part.\n\nJe reste disponible pour en discuter :\n📞 [TÉLÉPHONE]\n📧 [EMAIL]\n\nBien cordialement,\n[TON PRÉNOM]\nConseiller immobilier`,
    tags: ['mail', 'prospection', 'maison vide', 'succession', 'courrier']
  },
  {
    id: 'qualification-acheteur',
    title: 'Découverte Acquéreur - 4 piliers',
    category: 'visite',
    usage: 'Qualifier un acquéreur avant de faire visiter',
    content: `PILIER 1 - PROJET ET DÉLAI\n• "Qu'est-ce qui vous amène à déménager ?"\n• "Dans l'idéal, quand souhaitez-vous emménager ?"\n• "Qu'avez-vous déjà visité ? Qu'est-ce qui a empêché de faire une offre ?"\n\nPILIER 2 - CRITÈRES ET EXIGENCES\n• "Quelles sont les 2 choses pour lesquelles vous ne ferez jamais de compromis ?"\n• "Vous avez des critères rédhibitoires ?"\n\nPILIER 3 - BUDGET ET FINANCEMENT\n• "Quel est votre budget maximum ? Frais de notaire inclus ?"\n• "Financement par prêt ou comptant ?"\n• "Avez-vous déjà fait valider votre financement ?"\n  → Si NON : orienter vers courtier partenaire\n\nPILIER 4 - LE FILTRE\n• Vérifier que le budget correspond au bien\n• Vérifier que les critères correspondent\n• Si financement non validé : proposer courtier AVANT visite\n\n⚠️ Ne pas faire visiter si : critère rédhibitoire, budget incompatible, financement non vérifié.`,
    tags: ['qualification', 'acquéreur', 'découverte', '4 piliers', 'budget']
  },
  {
    id: 'sms-r2-confirm',
    title: 'SMS après R1 - Confirmation R2',
    category: 'rdv',
    usage: 'SMS au vendeur après le R1 pour confirmer le R2',
    content: `Bonjour [PRÉNOM],\n\nMerci pour cet échange enrichissant aujourd'hui. J'ai hâte de vous présenter mon analyse du marché et les comparables de vente mercredi à 18h.\n\nEn attendant, n'hésitez pas si vous avez dès questions.\n\nBonne soirée,\n[TON PRÉNOM]\n[TÉLÉPHONE]`,
    tags: ['sms', 'r1', 'r2', 'confirmation', 'suivi']
  }
];

export const scriptCategories = [
  { id: 'prospection', label: 'Prospection' },
  { id: 'rdv', label: 'R1 & R2' },
  { id: 'objections', label: 'Objections' },
  { id: 'mandats', label: 'Mandats' },
  { id: 'visite', label: 'Visites' },
  { id: 'négociation', label: 'Négociation' },
  { id: 'notaire', label: 'Notaire' },
  { id: 'suivi', label: 'Suivi Client' },
  { id: 'réseaux', label: 'Réseaux Sociaux' },
];

export function searchScripts(query: string): ScriptTemplate[] {
  const q = query.toLowerCase();
  return scriptTemplates.filter(s =>
    s.title.toLowerCase().includes(q) ||
    s.content.toLowerCase().includes(q) ||
    s.tags.some(t => t.includes(q)) ||
    s.category.includes(q)
  );
}
