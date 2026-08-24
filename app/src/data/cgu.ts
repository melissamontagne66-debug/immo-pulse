// ============================================
// Conditions Générales d'Utilisation — Immo Pulse
// Version 1.0 — affichée dans la modale CGU (inscription + footer)
// ============================================

export const CGU_VERSION = '1.0';
export const CGU_DATE = '09/08/2026';

export interface CguArticle {
  titre: string;
  paragraphes: string[];
}

export const CGU_ARTICLES: CguArticle[] = [
  {
    titre: 'Article 1 — Nature et périmètre de l\'outil',
    paragraphes: [
      'Outil d\'organisation personnelle. Immo Pulse (la « Plateforme ») est un outil d\'aide à la gestion des tâches quotidiennes, de rappels relationnels et d\'organisation personnelle de la prospection brute, destiné aux agents immobiliers mandataires. Elle ne constitue en aucun cas un logiciel de transaction immobilière, un registre de mandats, un logiciel de gestion de la relation client (CRM) au sens professionnel du terme, ni un système pérenne de conservation de données clients.',
      'Phase amont exclusive. L\'utilisation de la Plateforme est strictement réservée à la gestion de la prospection brute à chaud (contacts de rue, pige initiale, réseau relationnel). Dès lors qu\'un prospect exprime un projet immobilier formalisé (demande d\'estimation, projet de vente ou d\'achat identifié) ou qu\'un rendez-vous d\'estimation est fixé, l\'Utilisateur s\'engage à transférer sans délai la fiche prospect sur l\'intranet officiel de son réseau mandant.',
      'Aucune valeur juridique des contenus. Les bilans, compteurs, comptes rendus de visite, estimations de commission et messages générés par la Plateforme sont des aides à l\'organisation et à la rédaction. Ils ne constituent ni des documents contractuels, ni des preuves, ni des conseils juridiques, fiscaux ou comptables. Les calculs affichés (commissions, charges, estimations de prix) sont des hypothèses indicatives que l\'Utilisateur doit vérifier selon sa situation réelle et les textes en vigueur.',
    ],
  },
  {
    titre: 'Article 2 — Indépendance vis-à-vis des têtes de réseau',
    paragraphes: [
      'Absence de lien de subordination ou d\'affiliation. La Plateforme est un service totalement indépendant. Elle n\'est ni éditée, ni sponsorisée, ni affiliée, ni approuvée de quelque manière que ce soit par les têtes de réseau de mandataires, notamment IAD France, ni par aucun autre réseau.',
      'Priorité des obligations contractuelles. L\'Utilisateur reste seul responsable du respect des obligations découlant de son contrat d\'habilitation ou de mandat avec son réseau principal. L\'utilisation de la Plateforme ne le dispense en aucun cas de l\'utilisation obligatoire de l\'intranet et des logiciels officiels mis à sa disposition par son réseau pour la saisie de ses actes, mandats et fiches clients, ni du respect de la loi n° 70-9 du 2 janvier 1970 (dite loi Hoguet) et de son décret d\'application.',
    ],
  },
  {
    titre: 'Article 3 — Traitement des données personnelles (RGPD)',
    paragraphes: [
      'Responsabilité des données saisies. L\'Utilisateur agit en qualité de responsable de traitement des données personnelles qu\'il saisit sur la Plateforme dans le cadre de sa prospection (prospects, vendeurs, acquéreurs, apporteurs). Il lui appartient de s\'assurer de la légitimité de la collecte de ces données, d\'informer les personnes concernées et de respecter leurs droits (accès, rectification, opposition, suppression).',
      'Rôle de l\'Éditeur. L\'Éditeur agit en qualité d\'hébergeur technique des données (stockage local sur l\'appareil de l\'Utilisateur et synchronisation sécurisée sur son compte, hébergée par Cloudflare — Workers et base D1). L\'Éditeur n\'exploite, ne revend ni ne partage aucune donnée à des fins commerciales ou publicitaires.',
      'Politique de conservation et purge automatique. Afin de garantir le principe de minimisation et de limitation de la durée de conservation des données : toute fiche prospect n\'ayant fait l\'objet d\'aucune interaction enregistrée (appel, note, relance ou modification) pendant une durée continue de quatre-vingt-dix (90) jours est automatiquement et définitivement supprimée de la Plateforme, sur l\'appareil de l\'Utilisateur comme sur le compte synchronisé. Il appartient à l\'Utilisateur de veiller à la bascule des données qualifiées sur son outil officiel d\'entreprise avant l\'expiration de ce délai. L\'Éditeur ne pourra être tenu responsable de la perte de données consécutive à l\'application de cette purge automatique.',
      'Droit à l\'oubli. L\'Utilisateur peut supprimer son compte et l\'intégralité de ses données à tout moment depuis les réglages de l\'application. La suppression est définitive et entraîne l\'effacement des données de l\'appareil et du compte synchronisé.',
    ],
  },
  {
    titre: 'Article 4 — Extension pour navigateur et assistances à la saisie',
    paragraphes: [
      'Assistant visuel sous contrôle humain. Si l\'Utilisateur utilise l\'extension pour navigateur mise à disposition pour faciliter la retranscription des données vers son intranet professionnel, il reconnaît que cette extension agit comme un simple assistant de saisie semi-automatique, et non comme un outil d\'automatisation.',
      'Usage exclusif de la session active. L\'extension s\'exécute exclusivement au sein de la session active ouverte manuellement par l\'Utilisateur sur son navigateur. Aucune donnée d\'authentification (identifiant, mot de passe, jeton d\'accès) n\'est collectée, stockée ou transmise par la Plateforme.',
      'Validation humaine. L\'Utilisateur conserve l\'entière responsabilité de vérifier l\'exactitude des informations pré-remplies par l\'extension avant toute validation finale sur son intranet professionnel.',
      'Conditions d\'utilisation des outils tiers. L\'Utilisateur est seul responsable de vérifier que les conditions générales de son intranet professionnel autorisent l\'usage d\'un tel assistant de saisie. En cas d\'interdiction ou de restriction imposée par son réseau, l\'Utilisateur s\'engage à ne pas utiliser l\'extension avec cet outil.',
    ],
  },
  {
    titre: 'Article 5 — Contenus de motivation et assistants de rédaction',
    paragraphes: [
      'Témoignages « Parcours type ». Les témoignages affichés dans la Plateforme sont des parcours types rédigés à visée de motivation : situations inspirées de parcours réels de mandataires, prénoms modifiés. Ils ne constituent pas des témoignages clients authentiques au sens de l\'article L121-2 du Code de la consommation et sont présentés comme tels dans l\'interface.',
      'Assistants de rédaction. Les messages types générés (retours de visite, relances) sont des propositions de rédaction issues de règles déterministes. Ils sont systématiquement soumis à la relecture de l\'Utilisateur avant envoi, qui reste seul responsable du contenu définitivement transmis à ses contacts.',
    ],
  },
  {
    titre: 'Article 6 — Communications de la Plateforme',
    paragraphes: [
      'Emails et notifications de relance. Dans le cadre de l\'exécution du service, la Plateforme peut adresser à l\'Utilisateur des emails de relance (rappel de bilan, inactivité, félicitations de paliers) et des notifications push (rappel du bilan). L\'Utilisateur peut se désinscrire des emails à tout moment via le lien de désinscription présent dans chaque email, et désactiver les notifications push depuis les réglages.',
    ],
  },
  {
    titre: 'Article 7 — Limitation de responsabilité',
    paragraphes: [
      'L\'Éditeur ne saurait être tenu responsable :',
      '— de tout manquement ou faute contractuelle commise par l\'Utilisateur vis-à-vis de son réseau mandant du fait d\'une utilisation non conforme de la Plateforme (notamment rétention de données de mandats, non-saisie sur l\'intranet officiel) ;',
      '— de toute perte ou dommage direct ou indirect découlant de la suppression automatique des données inactives au terme du délai de 90 jours ;',
      '— des évolutions techniques apportées par des tiers (notamment les mises à jour des interfaces d\'intranet professionnels) rendant temporairement inopérantes les fonctionnalités de saisie semi-automatique ;',
      '— de toute décision professionnelle, commerciale, juridique ou fiscale prise par l\'Utilisateur sur la base des contenus, calculs, estimations ou suggestions affichés par la Plateforme.',
      'Disponibilité. La Plateforme est fournie « en l\'état ». L\'Éditeur s\'efforce d\'en assurer la disponibilité mais ne garantit pas un fonctionnement ininterrompu ni l\'absence d\'erreurs.',
    ],
  },
  {
    titre: 'Article 8 — Acceptation et évolution',
    paragraphes: [
      'L\'utilisation de la Plateforme est subordonnée à l\'acceptation expresse des présentes CGU, matérialisée par une case à cocher lors de la création du compte. La date et la version des CGU acceptées sont enregistrées.',
      'L\'Éditeur peut faire évoluer les présentes CGU. Toute évolution substantielle sera signalée à l\'Utilisateur lors de sa prochaine connexion et nécessitera une nouvelle acceptation.',
      'Droit applicable : droit français. En cas de litige, les parties rechercheront d\'abord une solution amiable ; à défaut, les tribunaux français seront compétents.',
    ],
  },
];

// Phrase de la case à cocher obligatoire à l'inscription (FR + ES)
export const CGU_CHECKBOX_LABEL_FR = 'J\'accepte les CGU et je reconnais que cet outil ne se substitue pas à l\'intranet de mon réseau.';
export const CGU_CHECKBOX_LABEL_ES = 'Acepto las CGU y reconozco que esta herramienta no sustituye la intranet de mi red.';

// Rappel affiché dans l'interface (footer / dashboard)
export const CGU_REMINDER_FR = 'Prospects inactifs conservés 90 jours max — bascule tes RDV sur l\'intranet.';
export const CGU_REMINDER_ES = 'Prospectos inactivos conservados 90 días máx. — traslada tus citas a la intranet.';
