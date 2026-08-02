import type { KnowledgeModule } from '@/types';

export const aiPersona = {
  name: "Coach",
  rôle: "Coach Immobilier basé sur les méthodes des tops performers",
  tone: "direct, chaleureux, exigeant mais bienveillant. Inspiré des meilleurs conseillers immobiliers qui font 300k€+ de CA. Conseils concrets, pas de théorie. Tutoiement. Encouragement mais push à l'action."
};

export const knowledgeModules: KnowledgeModule[] = [
  {
    id: "loi-des-nombres",
    title: "La Loi des Nombres - Prospection Prédictible",
    category: "prospection",
    content: `La prospection n'est ni un talent, ni de la chance. C'est une science basée sur la Loi des Nombres.

PRINCIPE: Pour X contacts établis, tu obtiendras Y rendez-vous d'estimation, qui donneront Z mandats signés.

RATIOS DE REFERENCE:
- 20 appels = 1 RDV (en moyenne)
- 4 RDV = 1 mandat signé
- Pour 4 mandats/mois: 320 appels/mois = 16 appels/jour

Rituels quotidiens:
- Scanner PAP: trouver 15 nouvelles annonces/jour
- Appeler: minimum 20 nouveaux appels/jour
- Relancer: 5 à 10 anciens contacts/jour
- Objectif: 1 à 2 RDV qualifiés/jour

Actions terrain:
- Flyers & commerçants: 5 voisins ou commerçants/jour
- Pitch: "J'ai vendu dans le quartier, j'ai des acheteurs frustrés"
- Laisser une trace: flyers, affichés chez commerçants

Actions digitale:
- 1 contenu/jour sur réseaux (FB, Insta, LinkedIn)
- Ajouter commerçants et habitants en amis
- Répondre aux commentaires et messages

Le suivi: L'argent est dans le fichier.
- Nôter chaque échange avec détails personnels
- Mettre à jour le statut dans le fichier
- Planifier les relances J+3, J+7, J+15`,
    keyPoints: [
      "La prospection est une science, pas un talent",
      "16 appels/jour minimum pour 4 mandats/mois",
      "Bloquer un créneau fixe chaque jour (11h-12h30 ou 18h-19h)",
      "L'argent est dans le suivi",
      "La régularité crée l'effet boule de neige"
    ],
    scripts: [
      "Bonjour c'est [Prénom], je suis passé devant votre maison...",
      "J'ai vendu dans le quartier, j'ai des acheteurs frustrés...",
      "La confiance n'exclut pas le contrôle..."
    ]
  },
  {
    id: "r1-préparation",
    title: "R1 - Préparation et Stratégie",
    category: "rdv",
    content: `Le R1 est le premier contact physique. Objectif: prendre un maximum d'informations pour l'Avis de Valeur au R2.

PREPARATION EN AMONT:
- Analyse du secteur: ventes récentes, prix au m² (outils le réseau + bases notariales)
- Vérification environnement: Google Maps, cadastre (bruit, commerces, parc)
- Pitch clair sur les 60 premières secondes

MATERIEL INDISPENSABLE:
- 5-10 cartes de visite minimum
- Fiche d'estimation ou tablette (chargée!)
- Mètre laser (indispensable pour crédibilité)
- Agenda ouvert et prêt
- Smartphone chargé pour photos d'estimation

4 ERREURS CRITIQUES A EVITER:
1. L'amateurisme matériel (arriver sans matériel)
2. La question fermée (oui/non) → utilisér questions ouvertes
3. Répondre au prix au R1 → jamais! "C'est l'objectif du R2"
4. Quitter sans R2 fixé → taux de retour divisé par 2

Questions ouvertes clés:
- "Qu'est-ce qui a initié l'idée de ce changement de vie?"
- "Au-delà du prix, qu'est-ce qui est le plus important?"
- "Si vous aviez un budget travaux, quelle serait la première chose à changer?"

Clôture R1:
- Récupérer diags et plans existants
- Fixer R2 avec règle des 2 options: "Mercredi 18h ou jeudi 19h?"`,
    keyPoints: [
      "Le R1 se gagne avant d'arriver",
      "Ne jamais donner le prix au R1",
      "Le mètre laser = crédibilité immédiate",
      "Toujours fixer le R2 avant de partir",
      "Écouter 80%, parler 20%"
    ]
  },
  {
    id: "r2-stratégie",
    title: "R2 - L'Avis de Valeur Irrésistible",
    category: "rdv",
    content: `Le R2 est où tout se joue. Bien rentrer le mandat au bon prix pour vendre rapidement.

MINDSET DE L'EXPERT:
- Tu es le professionnel qui apporte LA solution
- "Ce n'est pas moi qui fais le prix, ce n'est pas vous non plus, c'est le marché"
- Préparer la preuve irréfutable entre les 2 rendez-vous

VERROUILLAGE R1:
- Rêvalider les motivations profondes (délai, sérénité, manque de temps)
- Rêvenir sur les points d'amélioration que le vendeur a admis lui-même

STRATÉGIE DES 3 SCENARIOS:
1. Prix Attractif: déclencher compétition, vente sous 1 mois
2. Prix Marché: prix juste optimal, vente 2-3 mois
3. Prix Ambitieux: 10% au-dessus max, risque de stagnation

PREUVE IRREFUTABLE:
- Ventes comparables: 3-5 biens vendus < 3 mois (non négociables)
- Concurrence: 3 biens < 3 mois en ligne + 3 biens > 6 mois
- Explication Temps/Prix: plus ça traîne, plus on perd

CLOTURE PRIX:
- Ne jamais donner le prix! Faire choisir le vendeur
- "Selon vous, dans quelle gamme?"
- "Compte tenu de votre objectif, quel scénario?"

Si prix trop haut:
- Stratégie de repli: accepter 10% au-dessus avec point sous 1 semaine
- "S'il n'y a pas assez d'appels/visites, on ajuste immédiatement"
- Savoir dire non si nécessaire`,
    keyPoints: [
      "Le R2 est une formalité de validation si bien préparé",
      "3 scénarios de prix, le vendeur choisit",
      "La preuve = biens VENDUS, pas les annonces en ligne",
      "Faire dire le prix au vendeur, pas l'inverse",
      "Ne jamais accepter un prix trop haut sans plan B"
    ]
  },
  {
    id: "mandats",
    title: "Les Différents Mandats",
    category: "technique",
    content: `Le mandat est le contrat obligatoire (loi Hoguet 1970). Sans mandat signé = ZÉRO commercialisation.

MANDAT SIMPLE (stratégie de repli):
- Le client autorise plusieurs agences + vente directe
- CONTRE-productif: dévalorisation, perte de rareté, moins d'investissement
- Si accepté: max 2-3 partenaires, même prix FAI

MANDAT EXCLUSIF (objectif prioritaire):
- Garantie de performance, un seul conseiller
- Durée: 3 mois irrévocables (plan marketing complet)
- Le vendeur ne peut pas vendre seul
- Crée la rareté = meilleur prix + meilleur délai

MANDAT SUCCES (variante):
- Le vendeur peut trouver l'acquéreur
- Doit le référer pour sécurisation transaction
- Vente via contact vendeur = 50% réduction honoraires
- "Mieux vaut la moitié de quelque chose que le tôtalité de rien"

CLAUSE DE CONFIANCE:
- Contrat de performance: engagements précis et mesurables
- Si engagement non tenu → résiliation sans pénalité
- Désamorce l'objection "pieds et poings liés"
- Transforme la contrainte en garantie de service

15 Arguments Anti-Objection:
1. Vente au prix fort (rareté)
2. Sécurité juridique (70% transactions PAP échouent)
3. Garantie de performance (Clause Confiance)
4. Qualification acheteur (pas de curieux)
5. Transparence du suivi (CR après chaque visite)
6. Investissement maximal (outils premium)
7. Réseau la synergie du réseau (15000 conseillers)
8. Contrôle du temps (90 jours optimal)
9. Expertise négociation
10. Désamorçage dévalorisation`,
    keyPoints: [
      "Mandat obligatoire par la loi Hoguet",
      "Exclusif ou Succès = objectifs prioritaires",
      "Clause de Confiance = arme anti-objection",
      "Mandat simple = perte de rareté et de valeur",
      "La confiance n'exclut pas le contrôle"
    ]
  },
  {
    id: "lpsi",
    title: "LPSI - Présentation des Services",
    category: "rdv",
    content: `Le LPSI est le moment de valider le prix et la stratégie. On fait participer le vendeur régulièrement pour qu'il dise oui tout du long.

STRUCTURE DU LPSI:
1. Introduction: valider les objectifs "Vendre dans les meilleures conditions?"
2. Présentation le réseau: stabilité, 98% satisfaction, couverture
3. Mise en valeur: photos pro, home-staging 3D, vidéo
4. Diffusion massive: 100+ portails, le réseau international
5. Synergie réseau: 15000 conseillers, prèscription
6. Les 3 stratégies: Simple vs Exclusif vs Succès
7. Clause de Confiance: engagements précis
8. Prix: preuve par biens vendus

VALORISATION PHOTOS:
- Les acheteurs passent 60% de leur temps sur les photos
- Mauvaise photo = baisse de 15% de la valeur perçue
- Photographe pro spécialisé immobilier
- Home-staging virtuel 3D: 75% des biens vendus mieux

DIFFUSION:
- Vitrine le réseau + sites premium
- e-Bouquet: national, régional, luxe, international
- le réseau international: 96 portails, 61 pays, 225M visiteurs
- Synergie interne: 1/3 des ventes en collaboration

TECHNIQUE DE VERROUILLAGE:
- "D'accord?" → oui
- "Ça vous plaît?" → oui
- "On inclut ça dans la clause?" → oui
- Série de petits oui qui mènent au grand oui final`,
    keyPoints: [
      "Faire dire oui tout le long de la présentation",
      "Photos pro = premier argument de vente",
      "Diffusion massive sur 100+ portails",
      "le réseau international = acheteur international",
      "La synergie interne = 1/3 des ventes"
    ]
  },
  {
    id: "objections",
    title: "Gérer les Objections",
    category: "nego",
    content: `Les objections ne sont pas des rejets, ce sont des demandes d'information supplémentaires.

MÉTHODE DES 3 ÉTAPES:
1. COMPRENDRE: Écouter, valider le sentiment
   "Je comprends parfaitement votre inquiétude concernant [X]. C'est une question légitime."

2. REFORMULER ET ISOLER:
   "Si je comprends bien, la seule chose qui vous pose question est [Y]?"
   "Si nous trouvons une solution, nous y allons?"

3. REPONDRE AVEC SOLUTION + VALIDER:
   Utiliser "cependant" ou "néanmoins" au lieu de "mais"
   "Cela répond-il à votre question?" → attendre le oui
   "Parfait, cela vous convient?" → attendre le oui

8 OBJECTIONS COURANTES ET RÉPONSES:

1. "Je veux le mandat simple pour mettre plusieurs agences en concurrence"
→ "La concurrence entre agences crée un message de panique. L'exclusivité = stratégie unique maîtrisée. + Garantie Confiance."

2. "Votre commission est trop élevée"
→ "Si je ne suis pas capable de défendre la valeur de mon travail, comment puis-je défendre votre prix?"

3. "Je veux essayer de vendre seul (PAP)"
→ "50%+ des transactions PAP échouent. Mon rôle est d'éliminer ce risque."

4. "Envoyez-moi l'estimation par email"
→ "Le prix ne vaut rien sans la stratégie. L'estimation = plan d'action."

5. "Le délai de 3 mois est trop long"
→ "Garantie Confiance: si je manque à un engagement, vous rompez sans frais."

6. "Je veux un prix 10k€ au-dessus"
→ "Prix trop haut = assurance de prix final bas. Mon expertise = vendre au max du marché."

7. "Je n'aime pas l'idée du panneau"
→ "50% des acheteurs sont des voisins ou connaissent le quartier."

8. "Je dois y réfléchir / en parler à mon conjoint"
→ "Si votre conjoint était là, qu'est-ce qui le ferait hésiter le plus?"`,
    keyPoints: [
      "Objection = intérêt, pas rejet",
      "3 étapes: Comprendre → Réformuler → Résoudre",
      "Toujours valider avec un 'oui'",
      "Utiliser 'cependant' pas 'mais'",
      "Pré-traiter les objections avant qu'elles deviennent dès questions"
    ]
  },
  {
    id: "leboncoin-recherche",
    title: "La Recherche sur LeBonCoin",
    category: "prospection",
    content: `Technique pour décrocher des R1 en appelant avec un acquéreur en main.

MINDSET: Passer de "Agent qui veut un mandat" à "Expert qui a un client prêt à achétér"

TECHNIQUE DES 3 "OUI":
1. "Bonjour c'est bien [Prénom]?" → OUI
2. "Vous vendez bien la maison à [Adresse]?" → OUI
3. "C'est toujours à la vente?" → OUI

SCRIPT D'OUVERTURE:
"Parfait, je vous appelé brièvement [Prénom]. Je suis [Nom], en recherche active pour un couple qui veut [X,Y,Z]. J'ai bien vu que vous ne souhaitez pas d'agence, et je ne vous appelé pas pour ça. Je vérifie si votre bien correspond à mon acheteur. Il est très pressé, il vient de faire souffler une affaire."

PHASE D'OUVERTURE:
"Vous avez 3 minutes? Si ça correspond pas on en reste là, si ça correspond on organise une visite rapidement. D'accord?"

5 TYPES DE BIENS À CIBLER:
1. L'Ancien (60+ jours): vendeur fatigué, stratégie inefficace
2. Mauvais positionnément prix: annonces chères, biens baissés
3. Qualité annonce médiocre: mauvaises photos, description courte
4. Le petit nouveau (< 15 jours): plein d'espoir, mais reactif
5. Le parfait: photos top, prix juste → reactivité maximale

TIPS CONCRETS:
- Questions sur infos PAS sur l'annonce (montrer expertise)
- "Pour être certain de ne pas déplacer mon client inutilement, je vais d'abord voir le bien moi-même"
- Proposer 2 créneaux: "Demain 14h ou jeudi 10h?"
- Offrir estimation en échange de la visite
- Toujours prendre les photos au R1
- Toujours fixer R2 ou demander mandat pour amener acquéreur`,
    keyPoints: [
      "Appeler pour un acquéreur, pas pour un mandat",
      "Technique des 3 oui pour désarmer",
      "Cibler les biens 30+ jours en ligne",
      "80% des personnes qui décroche donnent un RDV",
      "Toujours proposer la visite pour 'vérifier' avant d'amener le client"
    ]
  },
  {
    id: "dossier-mandat",
    title: "Récolter et Organiser les Dossiers",
    category: "admin",
    content: `Un dossier incomplet = vente en danger. Objectif: dossier complet sous 48h.

4 PILIERS DU DOSSIER:

Pilier 1 - Documents Contractuels:
- Mandat signé (obligatoire loi Hoguet)
- Pièce d'identité de tous les propriétaires
- Titre de propriété (4-5 premières pages)
- État civil complet (régime matrimonial)
- Coordonnées complètes

Pilier 2 - Infos sur le Bien:
- Superficie exacte (Loi Carrez si copro)
- Adresse, étage, lots, parcelle
- Plan du logement ou croquis
- Historique des travaux avec factures
- Permis de construire + DAACT si travaux < 10 ans

Pilier 3 - Documents Financiers:
- Taxes foncières et d'habitation
- Dossier copropriété: PV AG (3 dernières), charges, fonds travaux

Pilier 4 - Diagnostics Techniques (DDT):
- DPE (obligatoire pour publication)
- Plomb, Amiante, Électricité, Gaz, Termites
- ERP, Bruit, Assainissement
- Loi Carrez (si copro)

ORGANISATION:
- Nommage unique: [CP] - [Nom] - [Type Bien]
- Renommer chaque fichier: 4-DUPONT-TaxeFonciere2024.pdf
- Jamais IMG_4589.pdf!
- Dossier complet = accélérateur de compromis`,
    keyPoints: [
      "Dossier complet sous 48h = reactivité",
      "Sans DPE = publication illégale",
      "Nommage clair = professionnalisme",
      "PV AG = point le plus bloquant en copro",
      "Le notaire ne peut pas rédiger le compromis sans DDT complet"
    ]
  },
  {
    id: "visite-qualifiee",
    title: "Découverte Acquéreur & Visites Qualifiées",
    category: "visite",
    content: `Le reproche n°1 des vendeurs: des visites qui ne correspondent pas aux critères.

PROTOCOLE DE DECOUVERTE - 4 PILIERS:

Pilier 1 - Projet et Délai:
- "Qu'est-ce qui vous amène à déménager?"
- "Dans l'idéal, quand souhaitez-vous emménager?"
- "Qu'avez-vous déjà visité? Qu'est-ce qui a empêché de faire une offre?"

Pilier 2 - Critères et Exigences:
- "Quelles sont les 1-2 choses pour lesquelles vous ne ferez jamais de compromis?"
- Vérifier rédhibitoires avant la visite

Pilier 3 - Budget et Financement:
- "Quel est votre budget maximum? Frais de notaire inclus?"
- "Financement par prêt ou comptant?"
- "Avez-vous déjà fait valider votre financement?"
- Si non validé → orienter vers courtier partenaire

Pilier 4 - Le Filtre:
- Ne pas faire visiter si critère rédhibitoire
- Ne pas faire visiter si financement non vérifié
- "Mieux vaut dire NON en amont que perdre 1h sur place"

MATCHING PLAY::
- Enregistrer critères acquéreur dans Play
- Rapprochement automatique biens le réseau + inter-agence
- Devenir le "central d'achat" du marché pour l'acquéreur

MANDAT DE RECHERCHE:
- Formalise la mission de recherche
- Protège la rémunération
- Autorise démarches off-market`,
    keyPoints: [
      "Qualifier avant de faire visiter",
      "4 piliers de découverte obligatoires",
      "Pas de visite sans financement vérifié",
      "Mandat de recherche = protection",
      "Le 'non' en amont = professionnalisme"
    ]
  },
  {
    id: "visite-technique",
    title: "Maîtriser la Visite et Obtenir l'Offre",
    category: "visite",
    content: `La visite n'est pas une promenade, c'est le moment de créer l'urgence.

STRATÉGIE DES FLUX:
- Espacer les visites de 10-15 minutes
- Faire croiser les acquéreurs (FOMO)
- "Excusez-moi, je termine avec la famille X qui vient de partir"

RÈGLE 80/20:
- L'acheteur parle 80% du temps
- Toi seulement 20%
- S'il parle de décoration et travaux = bon signe (se projette)

ITINERAIRE STRATEGIQUE:
- Commencer par pièce la plus valorisanté
- Finir par le point fort émotionnel (terrasse, jardin)
- Faire s'assoir dans le salon face à la vue
- Ne jamais finir dans le garage ou la cave

DEBRIEFING IMMEDIAT:
- Sortir du bien → débrief à chaud
- "Comment vous sentez-vous ici?" (émotion d'abord)
- "Quels sont les points qui vous ont le plus séduit?"
- "Par rapport aux autrès biens, comment vous positionnéz-vous?"

PUSHER A L'OFFRE:
- "D'autrès personnes sont en train de rêvisiter"
- "Je propose qu'on rédigeie votre offre pour être premiers positionnés"
- "La différence de X€, est-ce que ça vaut le risque de devoir recommencer vos recherches?"

BON DE VISITE: Toujours faire signer avant/après la visite (sécurité juridique)`,
    keyPoints: [
      "Faire croiser les visites = créer l'urgence",
      "80/20: l'acheteur parle, toi tu guides",
      "Finir sur le point fort émotionnel",
      "Débrief immédiat à chaud",
      "Ne jamais partir sans prochaine étape claire"
    ]
  },
  {
    id: "offre-achat",
    title: "Psychologie de l'Offre d'Achat",
    category: "nego",
    content: `L'offre est un acte émotionnel qui touche l'argent et l'avenir. Maîtriser les 3 acteurs: acheteur, vendeur, et toi.

PSYCHOLOGIE DE L'ACHETEUR:
- Peur du regret (payer trop cher)
- Peur de perdre le bien (FOMO)
- Erreur d'achat (doute)
- Stratégie: ancrer ratio/perte, créer urgence, valider le cœur

PSYCHOLOGIE DU VENDEUR:
- Affectif (surévalue les travaux/souvenirs)
- Déception (offre basse = insulte)
- Anxiété du process (délai court, veut tout savoir)
- Stratégie: rationaliser, médiation objectivité, rassurer

PSYCHOLOGIE DU CONSEILLER:
- Peur de la négociation → corriger: tu es l'expert
- Anxiété de l'offre manquée → Règle du Silence
- Attâchement au fichier → ta fidélité est au mandat

PRESENTER UNE OFFRE:
1. Raconter l'histoire de l'acheteur
2. Ce qui lui plaît, ce qui plaît moins
3. Dossier de financement (documents pour prouver)
4. Prix de l'offre écrite (matérialiser)

CONSIGNE: Toujours présenter en face-à-face avec tous les décisionnaires

CONTRE-OFFRE:
- Toujours répartir avec une contre-offre
- "Je vais me battre bec et ongle mais je ne peux rien promettre"
- Si offre acceptée: faire l'ascenseur émotionnel (fermer avant d'annoncer)

NEGOCIATION:
- Toujours tirer l'offre de l'acheteur vers le haut
- Toujours tirer la contre-offre du vendeur vers le bas
- Le non tu l'as déjà, cherche le oui
- Règle du silence après avoir posé la question`,
    keyPoints: [
      "3 psychologies à maîtriser: acheteur, vendeur, conseiller",
      "Règle du silence = arme de négociation",
      "Toujours présenter l'offre écrite en face-à-face",
      "Toujours répartir avec une contre-offre",
      "L'ascenseur émotionnel pour annoncer une bonne nouvelle"
    ]
  },
  {
    id: "intercabinet",
    title: "L'Intercabinet - Maîtrise et Éthique",
    category: "technique",
    content: `L'intercabinet = extension de ton catalogue. Mais c'est un partenariat professionnel.

RÈGLE D'OR: Ne jamais contourner l'agent mandataire

ETHIQUE:
- Respecter le mandat et la chaîne de commandement
- Votre seul interlocuteur = l'agent mandataire
- Ne jamais contacter le vendeur directement
- Toutes les questions passent par le mandataire

TRANSPARENCE:
- Confirmer le partage des honoraires AVANT la visite
- Email de confirmation: "Visite mercredi 15h, partage 50/50 si offre"
- Ne jamais laisser l'acheteur négocier avec le mandataire

CONTROLE:
- Vous êtes le seul point de contact de votre acquéreur
- Coordonnées partagées uniquement si offre acceptée
- Vous accompagnez votre acquéreur à chaque visite

EXCELLENCE OPERATIONNELLE:
- Qualifier l'acquéreur avant de demander visite
- Ponctualité: arriver en avance
- Feedback immédiat après visite (ne pas attendre qu'on te relance)
- Transmettre un dossier clé en main (offre + ID + financement + résumé)

SUIVI:
- Suivre le dossier notaire avec l'agent
- Renvoyer l'ascenseur quand tu as un mandat exclusif
- Devenir le partenaire de choix`,
    keyPoints: [
      "Ne jamais contourner l'agent mandataire",
      "Confirmer honoraires avant chaque visite",
      "Feedback immédiat après visite",
      "Dossier offre clé en main = partenaire privilégié",
      "La réputation = monnaie de l'immobilier"
    ]
  },
  {
    id: "notaire",
    title: "Transmission et Suivi du Dossier Notaire",
    category: "notaire",
    content: `Après l'acceptation de l'offre: devenir le Chef de Projet Juridique.

RAPIDITE = SECURITE:
- Dossier envoyé sous 4h après acceptation
- Le délai de rétractation de 10 jours ne commence qu'à réception du compromis
- Plus vite = moins de risque de rétractation

KIT NOTAIRE (email unique et clair):
1. Offre acceptée signée par les 2 parties
2. Mandat de vente
3. Coordonnées et état civil (vendeurs + acheteurs)
4. Pièces d'identité
5. Titre de propriété complet
6. Diagnostics techniques complets (DDT)
7. Permis de construire / conformité si travaux
8. Dossier copropriété (PV AG, charges, règlement)
9. Financement acquéreur (attestation ou accord principe)
10. Liste des meubles meublants avec valorisation

SYNTHESE EMAIL:
- Prix FAI, prix net vendeur, honoraires
- Désignation notariale (notaire vendeur + acheteur)
- Conditions négociées (suspensives, délais)
- Confirmation LCB/FT réalisé

SUIVI ACTIF:
- Relance sous 24h: confirmation réception + pièces manquantes
- Bloquer date signature compromis au plus tôt
- Gérer les situations complexes (succession, divorce, occupants)
- Débloquér les pièces toi-même (ne pas transférer au notaire)

GESTION DES MEUBLES:
- Liste détaillée pièce par pièce
- Valoriser au prix d'occasion (pas neuf, pas achat d'époque)
- Maximum 5% du prix sans justificatifs détaillés
- Réduit les frais de mutation pour l'acquéreur`,
    keyPoints: [
      "Dossier complet sous 4h",
      "Le délai SRU ne commence qu'avec le compromis",
      "Relance notaire sous 24h",
      "Débloquér les pièces toi-même",
      "Meubles: max 5% sans justificatifs"
    ]
  },
  {
    id: "compromis",
    title: "Le Compromis - Anticiper pour Maîtriser",
    category: "notaire",
    content: `Le compromis transforme l'accord de principe en engagement juridique.

PREPARATION:
- Demander le projet de compromis AVANT signature
- Le lire point par point (ne pas faire en diagonale)
- Vérifier que tout ce qui a été promis à l'oral est écrit
- Valider avec vendeur et acheteur les points importants

POINTS DE VIGILANCE:
- Conditions suspensives: montant, durée, taux max du prêt
- Délai SRU: nôter la date de fin dans l'agenda
- Dépôt de garantie: vérifier sous 48-72h
- Dates butoir: dépôt dossier prêt, obtention offre
- Préemption urbaine: surveiller les délais administratifs

PENDANT LA LECTURE:
- Valider les points déjà traités: "Effectivement Maître, c'est un point qu'on a validé"
- Faire profil bas sur les points non vus
- Montrer que le dossier est préparé
- Rassurer les parties

APRÈS COMPROMIS:
- Suivi dépôt de garantie (48-72h)
- Suivi dépôt dossier prêt (rappel 15 jours avant échéance)
- Purge droit de préemption
- Point régulier avec notaire, vendeur, acheteur

ACTE AUTHENTIQUE:
- Relever compteurs (eau, élec, gaz) 24h avant avec photos
- Vérifier vide et propreté
- Dernière visite de contrôle
- Champagne + mot manuscrit + demande avis Google`,
    keyPoints: [
      "Lire le compromis AVANT, pas en diagonale",
      "Tout ce qui est promis à l'oral doit être écrit",
      "Vérifier dépôt de garantie sous 48-72h",
      "Suivre dates butoirs prêt",
      "Relever compteurs 24h avant l'acte"
    ]
  },
  {
    id: "mise-en-ligne",
    title: "Mise en Valeur et Mise en Ligne",
    category: "miseenligne",
    content: `Les premières 72h après signature du mandat sont critiques.

MISE EN VALEUR:
- Désencombrement: 50% des objets personnels en moins
- Nettoyage extrême (vitrès, miroirs, joints salle de bain)
- Circulation sans obstacle (lignes de fuite)
- Vendeurs absents pour 70% des visites

PHOTOS:
- Grand-angle indispensable
- Lumière naturelle max + toutes les lumières allumées
- Angle depuis coin de pièce, hauteur poitrine
- Première photo = point fort absolu
- Série logique comme une visite
- Photos droites impérativement
- JAMAIS de photos toilettes

REDACTION ANNONCE:
- Titre = émotion (pas "Maison 4 pièces" mais "Magnifique Atelier d'Artiste")
- Corps = raconter l'expérience de visite
- Citer marques/matériaux de qualité
- Gérer les objections dans l'annonce
- Appel à l'action en clôture

72H MAXIMUM:
- Photos, conseil home staging, rédaction annonce
- Capitaliser sur l'effet nouveauté
- Les premières visites = feedback marché immédiat
- 14 jours de délai de rétractation du mandat = tout mettre en œuvre vite`,
    keyPoints: [
      "72h max pour tout mettre en ligne",
      "Désencombrer 50% minimum",
      "Toutes les lumières allumées pour les photos",
      "Titre = émotion pas description",
      "Effet nouveauté = critique pour le prix"
    ]
  },
  {
    id: "travail-prix",
    title: "Le Travail du Prix des Mandats",
    category: "nego",
    content: `Si un mandat stagne après 2-3 semaines, le prix est le problème.

PSYCHOLOGIE DU PRIX:
- Le vendeur est attaché à son bien (effet de dotation)
- Il additionne souvenirs + travaux (irrationnel)
- Les frais de notaire ne sont PAS amortis sur courte période
- Le marché ne paie pas le coût des travaux, mais la valeur ajoutée perçue

CONSEQUENCES PRIX TROP HAUT:
- Moins d'acheteurs voient l'annonce (hors tranche de recherche)
- Dévalorisation dans le temps
- Garantie de baisse future

CONSEQUENCES PRIX JUSTE:
- Trafic massif, concurrence entre acheteurs
- Urgence, offres rapides au prix
- Garantie de vente

INDICATEURS (après 2-3 semaines):
- Très peu de visites ET d'appels = prix trop haut
- Visites mais pas de contre-visite/offre = prix trop haut
- Ne jamais attendre plus de 3 semaines pour réagir

STRATÉGIE DU 5%:
- Baisser d'au moins 5% du prix initial
- Répéter jusqu'à ce que le téléphone sonne
- Garantit un effet "nouveauté" sur les alertes

RÈGLE DES 3 SCENARIOS:
- Présenter le prix actuel comme "Scénario Test"
- "Comme convenu au R2, on passe au Scénario Réaliste"
- Le vendeur s'était engagé à baisser si pas de réaction du marché

ACTE DE CLOTURE:
- Ne pas demander, expliquer comment on passe à l'action
- "Pour relancer l'urgence, on valide l'avenant et je modifié dès ce soir"
- Être ferme, c'est ton métier`,
    keyPoints: [
      "Prix trop haut = invisible pour la bonne cible",
      "Réagir au maximum sous 3 semaines",
      "Baisser d'au moins 5% à chaque fois",
      "Le marché est le seul qui décide du prix",
      "Toujours donner une fourchette, pas un prix exact"
    ]
  },
  {
    id: "gestion-temps",
    title: "Gestion du Temps et Priorisation",
    category: "admin",
    content: `La plupart des novices courent après leur journée. Les pros pilotent leur business.

MATRICE D'EISENHOWER:
Q1 (Urgent+Important): Cercle de Crise (client rétracte, erreur compromis)
Q2 (Non Urgent+Important): Cercle du Succès = PROSPECTION, suivi, formation
Q3 (Urgent+Non Important): Cercle des Autrès (appels curieux, sollicitations)
Q4 (Ni Urgent Ni Important): Cercle de la Fuite (scroll réseaux, discussions)

TIME BLOCKING:
- 9h-12h: Le Bloc "Chasse" (selection LeBonCoin, relances, R1, R2) - SACRE
- 14h-18h: Terrain & Suivi (visites, R1, R2)
- 18h-19h: Gestion & Futur (mails, préparation lendemain)
- Ne jamais traiter les mails le matin!

BATCHING:
- Mails: 30 min/jour max (pas un par un toute la journée)
- Rappels: bloc à 17h
- Le cerveau met 15 min à se reconcentrer après interruption

GESTION DE L'ENERGIE:
- Blocs de 50 min de travail intense + 10 min déconnexion
- Automatiser les routines du matin
- Alternance travail/récupération
- "Manger le crapaud" dès 9h01 (tâche la plus dure en premier)

SEMAINE TYPE:
- Lundi: Préparation semaine + prospection massive
- Mardi-Jeudi: R1, R2, visites
- Vendredi: Suivi, administratif, planification
- Samedi: Visites acquéreurs

RÈGLE DU ONE MORE THING:
- Avant de quitter: faire UNE chose de plus du Q2
- Un dernier appel, un dernier mot à un ancien client
- C'est ce petit plus quotidien qui crée l'écart`,
    keyPoints: [
      "Q2 = prospection = cercle du succès",
      "Ne jamais traiter les mails le matin",
      "Time blocking: 9-12h = chasse sacrée",
      "Batching: traiter par lots pas un par un",
      "Manger le crapaud dès le matin"
    ]
  },
  {
    id: "diagnostics",
    title: "Les Diagnostics de Vente (DDT)",
    category: "technique",
    content: `Les diagnostics protègent le vendeur et sécurisent l'acquéreur.

DPE (Diagnostic Performance Énergétique):
- Obligatoire pour publication
- Classe A à G
- Note F/G = passoire thérmique
- Location DPE G interdite depuis 01/01/2025
- Le DPE est un bilan théorique: ne pas se formaliser excessivement

PLomb (CREP) + Amiante (DTA):
- Plomb: biens avant 1949
- Amiante: biens avant 1997
- Si positif: informer, pas toujours travaux immédiats
- Amiante non dégradée = pas de danger immédiat
- Si travaux nécessaires: faire chiffrer 2 entreprises

TERMITE + PARASITES:
- Essentiel en zones à risque
- Négatif = sérénité majeure
- Positif: demander facture d'éradication

ELECTRICITE + GAZ:
- Installations > 15 ans
- Informatifs (pas prèscriptifs)
- Signalent dangers pour assurance

LOI CARREZ:
- Uniquement ventes lots de copropriété
- Si surface réelle < 5% surface acte = réduction prix possible
- Délai d'action: 1 an après acte authentique

STRATÉGIE:
- Ne jamais envoyer les diagnostics sans appeler pour expliquer
- Les diagnostics paraissent alarmistes pour un non-initié
- Expliquer rassure = évite que l'acheteur ne se rétracte
- Utiliser les défauts comme arguments de prix`,
    keyPoints: [
      "DPE obligatoire pour publier",
      "Appeler pour expliquer les diagnostics avant envoi",
      "Passoire thérmique ne bloqué pas la vente",
      "Loi Carrez: -5% surface = réduction prix",
      "Utiliser les défauts comme levier de négociation"
    ]
  },
  {
    id: "réseau-social",
    title: "Google My Business & Réseaux Sociaux",
    category: "prospection",
    content: `80% des parcours de vente commencent par une recherche locale.

GOOGLE MY BUSINESS:
- Titre: [Prénom Nom] - Conseiller Immobilier [Ville]
- Zone: 5-10 quartiers précis (pas tout le département)
- Description: vendre une solution pas un CV (750 caractères)
- Catégories: Agence immobilière + Évaluateur + Négociateur

AVIS CLIENTS:
- Timing: après estimation, après visites, après compromis, après acte
- Guider le client: mentionner type de bien + ville + transformation
- Répondre à TOUS les avis (signal vital pour Google)
- Réponse avec mots-clés pour SEO
- Avis négatif = meilleure opportunité de briller

GOOGLE POSTS:
- Post "Vendu" avec photo + bouton appel à l'action
- Post "À Vendre" avec lien vers annonce
- Info locale: "Les prix à [Quartier] grimpent"

PHOTOS:
- Photos RÉELLES (pas de banque d'images)
- Renommer fichiers: conseiller-immobilier-[ville].jpg

CANVA:
- Templates pour chaque étape: Nouveau Mandat → Sous Offre → Compromis → Vendu
- Flyers "J'ai Vendu" pour le terrain
- Carré visuel cohérent (couleurs, polices, logo)

FACEBOOK/INSTA:
- 1 contenu/jour minimum
- Montrer le processus, pas que les résultats
- Stories: coulisses, estimation, visite, signature`,
    keyPoints: [
      "GMB = vitrine n°1, gratuite, 24h/24",
      "Demander avis à chaque étape clé",
      "Répondre à tous les avis (mots-clés SEO)",
      "Séquence de contenu: Nouveau Mandat → Vendu",
      "Photos réelles renommées pour SEO"
    ]
  },
  {
    id: "assurance",
    title: "Négociation et Assurance",
    category: "nego",
    content: `Ce que tes clients achètent: ton ASSURANCE. Pas tes photos, pas tes annonces.

LE TRANSFERT DE CERTITUDE:
- Le client arrive avec 90% d'incertitude
- Si ta certitude est à 50%, il ne signera jamais
- Ton job: faire déborder ta certitude dans son réservoir

ASSURANCE AU R1:
- "Le marché valide ce prix à 285k€. Voici les 3 ventes qui le prouvent."
- "À ce prix, on crée l'événement. Au-dessus, on crée l'oubli."
- Pas de "Je pense que..." ou "On pourrait essayer..."

ASSURANCE FACE A L'ACHETEUR:
- "J'ai noté ce point. Voici le devis de l'artisan. C'est intégré dans le prix."
- Ton calme face au problème = assurance que c'est géré

LE "NON" DE L'EXPERT:
- "Si vous voulez tester 50k€ au-dessus, je ne vous accompagnerai pas"
- Celui qui est prêt à quitter la table mène la danse
- Le détâchement émotionnel est ta plus grande force

MINDSET DU ROC:
- Dans la tempête, le client cherche un roc
- Si tu paniques avec lui, le dossier coule
- Si tu restes calme, il survit
- Le besoin tue l'assurance: si tu as besoin du mandat pour payer ton loyer, il va le sentir

FORGER L'ASSURANCE:
- Modéliser les meilleurs (posture, voix, gestes)
- Journal des succès: nôter chaque petite victoire
- Accepter le "Non" comme protection
- Entrer en RDV en se disant: "C'est le vendeur qui a besoin de ma stratégie"

3 EXERCICES POUR DEMAIN:
1. Le Silence: après ton estimation, compter jusqu'à 5 sans parler
2. Isoler le vrai problème: "Au-delà du prix, qu'est-ce qui vous empêche de me faire confiance?"
3. Posture physique: avant de sortir de la voiture, se redresser, respirer`,
    keyPoints: [
      "Ton assurance = ton produit principal",
      "Le transfert de certitude est la clé",
      "Savoir dire non = pouvoir de négociation",
      "Le besoin tue l'assurance",
      "3 exercices: silence, isoler, posture"
    ]
  },
  {
    id: "vente-cascade",
    title: "La Vente en Cascade",
    category: "suivi",
    content: `La vente en cascade = acquéreur qui devient vendeur. C'est le business le plus facile.

MOMENT CLÉ: L'offre acceptée
- "Félicitations! Maintenant, parlons de votre bien à vendre"
- Ne pas attendre la signature du compromis
- Le plus tôt c'est abordé, le mieux c'est

AVANTAGES:
- Prospection ZÉRO: le client vient de toi
- Confiance déjà établie
- Timing parfait (délai de vente = délai achat)
- Tu connais déjà la situation

ÉTAPES:
1. Dès l'offre acceptée: aborder le sujet
2. Dès le compromis: signer le mandat
3. Parallèle: vendre le bien actuel + finaliser l'achat
4. Coordination des dates notaires

SE CURER EN AMONT:
- "Si vous vendiez votre bien, dans quelle fourchette?"
- "Quel délai envisageriez-vous?"
- Planifier l'avenir avant que l'offre ne soit signée

GESTION DES CHAINES:
- Être transparent sur les délais
- Garder tout le monde informé
- Avoir un plan B si un maillon casse
- La communication = clé de la sérénité`,
    keyPoints: [
      "Acquéreur = futur vendeur",
      "Aborder la vente DÈS l'offre acceptée",
      "Pas de prospection nécessaire",
      "Gérer les délais en parallèle",
      "La communication rassure tout le monde"
    ]
  },
  {
    id: "garantie-30j",
    title: "La Garantie 30 Jours",
    category: "suivi",
    content: `La Garantie 30 jours = différenciateur ultime et preuve de confiance.

PRINCIPE:
- Si le bien n'est pas vendu sous 30 jours = remboursement des honoraires
- Seulement en mandat exclusif
- N'engage AUCUN risque si le prix est le bon

CONDITIONS:
- Mandat exclusif 3 mois minimum
- Prix validé par le conseiller (prix marché)
- Diagnostics à charge du vendeur
- Engagement: 5 visites qualifiées minimum sous 30 jours

SCRIPT DE PRESENTATION:
"Je suis tellement certain de vendre votre bien rapidement que je vous propose notre garantie 30 jours. Si sous 30 jours, je n'ai pas vendu votre bien, je vous rembourse intégralement mes honoraires. C'est sans risque pour vous."

PSYCHOLOGIE:
- Démontre une confiance absolue
- Élimine la dernière hésitation
- Crée l'engagement réciproque
- Seuls les experts peuvent proposer ça

ATTENTION:
- Ne proposer que si le prix est vraiment au marché
- S'assurer de la qualité du bien
- Préparer le plan marketing dès le lendemain
- Honorer l'engagement si besoin (réputation!)`,
    keyPoints: [
      "Garantie 30j = différenciateur puissant",
      "Prouve la confiance dans le prix",
      "Sans risque si le prix est juste",
      "Uniquement en exclusif",
      "Réputation avant tout: honorer si nécessaire"
    ]
  },
  {
    id: "leboncoin-maisons-vides",
    title: "Sélection sur LeBonCoin - Maisons Inhabitées",
    category: "prospection",
    content: `Les maisons inhabitées sont des opportunités cachées.

SIGNE EXTERIEURS:
- Volets fermés en permanence
- Jardin non entréténu
- Pas de voiture régulièrement
- Accumulation de courrier
- Pas de lumière le soir

SOURCES DE PIQUE:
- Filiations (décès → succession)
- Divorces (annonces légales)
- Déménagements à l'étranger
- Relogement EHPAD
- Changement de zone scolaire

ABORDER LES VOISINS:
- "Je cherche un bien dans le secteur, auriez-vous des infos?"
- "Savez-vous si des voisins envisagent de déménager?"
- Offrir son service: "Si vous connaissez quelqu'un, je suis disponible"

COURRIER PERSONNALISÉ:
- Courrier manuscrit (pas d'impression)
- Photo du quartier
- Mention: "Je cherche pour un client sérieux"
- Numéro direct + email

SUIVI:
- Rêvenir 2 semaines après
- Laisser une trace (carte de visite sous la porte)
- Être patient mais régulier`,
    keyPoints: [
      "Observer les signes extérieurs",
      "Les successions = opportunités",
      "Les voisins sont des alliés",
      "Courrier manuscrit = touche personnelle",
      "Patience et régularité"
    ]
  },
  {
    id: "top-performer",
    title: "Le Mindset du Top Performer",
    category: "formation",
    content: `Ce qui sépare un bon conseiller d'un top performer, ce n'est pas le talent, c'est la discipline.

LES 5 HABITUDES:
1. Se lever tôt: 6h-7h, routine matinale fixe
2. Bloc de prospection sacré: jamais décalé, jamais annulé
3. Suivi rigoureux: chaque contact noté, chaque promesse tenue
4. Apprentissage continu: 30 min de formation par jour
5. One More Thing: toujours faire une action de plus avant de partir

MINDSET:
- "Je ne cherche pas de clients, je les attire"
- Chaque "non" = un pas vers le "oui"
- La réputation = capital le plus précieux
- Le client ne paie pas pour ton temps, il paie pour ton expertise

ROUTINE MATINALE:
- 6h30: Lever, café, 10 min de lecture/motivation
- 7h: Planification de la journée (3 objectifs)
- 7h30: 1 post réseau social
- 8h: Préparation des appels (fichier, scripts)
- 9h: BLOC CHASSE sacré

MENSURATION:
- Suivre ses chiffres chaque semaine
- Appels, RDV, mandats, visites, offres, ventes
- Analyser les ratios
- S'améliorer chaque semaine

ENVIRONNEMENT:
- Entourer-toi de gens positifs
- Éviter les complaintes des agences traditionnelles
- Célébrer chaque victoire (même les petites)
- Ne jamais comparer ton début au milieu de quelqu'un d'autre`,
    keyPoints: [
      "La discipline bat le talent",
      "Routine matinale non négociable",
      "Suivre ses chiffres chaque semaine",
      "Entourage = clé du mindset",
      "Célébrer chaque victoire"
    ]
  }
];

export const categories = [
  { id: 'prospection', label: 'Prospection', color: 'bg-blue-500' },
  { id: 'rdv', label: 'Rendez-vous', color: 'bg-green-500' },
  { id: 'technique', label: 'Technique', color: 'bg-purple-500' },
  { id: 'admin', label: 'Administratif', color: 'bg-gray-500' },
  { id: 'formation', label: 'Formation', color: 'bg-orange-500' },
  { id: 'visite', label: 'Visites', color: 'bg-teal-500' },
  { id: 'nego', label: 'Négociation', color: 'bg-red-500' },
  { id: 'notaire', label: 'Notaire', color: 'bg-indigo-500' },
  { id: 'miseenligne', label: 'Mise en Ligne', color: 'bg-pink-500' },
  { id: 'suivi', label: 'Suivi', color: 'bg-yellow-500' },
];

export function getModuleById(id: string): KnowledgeModule | undefined {
  return knowledgeModules.find(m => m.id === id);
}

export function getModulesByCategory(category: string): KnowledgeModule[] {
  return knowledgeModules.filter(m => m.category === category);
}

export function searchKnowledge(query: string): KnowledgeModule[] {
  const q = query.toLowerCase();
  return knowledgeModules.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.content.toLowerCase().includes(q) ||
    m.keyPoints.some(kp => kp.toLowerCase().includes(q)) ||
    m.category.toLowerCase().includes(q)
  );
}

const dailyTips = [
  { category: 'prospection', text: "Aujourd'hui, concentre-toi sur la qualité de tes appels plutôt que la quantité. 15 appels bien faits > 30 appels bancals." },
  { category: 'rdv', text: "Avant chaque R1, prends 5 minutes pour visualiser le RDV réussi. La préparation mentale est aussi importante que la préparation matérielle." },
  { category: 'technique', text: "Vérifie aujourd'hui que tes mandats exclusifs sont bien signés avec la Clause de Confiance. C'est ta meilleure arme anti-objection." },
  { category: 'admin', text: "Prends 20 minutes ce matin pour organiser tes dossiers. Un dossier bien rangé = un compromis plus rapide." },
  { category: 'visite', text: "Pour tes visites d'aujourd'hui, pense à faire croiser les acquéreurs. Le FOMO est le meilleur moteur d'offre." },
  { category: 'nego', text: "Aujourd'hui, pratique la Règle du Silence. Après chaque proposition, compte jusqu'à 5 mentalement avant de reprendre la parôle." },
  { category: 'notaire', text: "Relance tes dossiers notaires en cours aujourd'hui. Un point toutes les 48h = zéro surprise." },
  { category: 'miseenligne', text: "Vérifie tes annonces aujourd'hui. Photos droites? Titre émotionnel? Description qui raconte une histoire?" },
  { category: 'suivi', text: "Envoie un message à tes anciens clients aujourd'hui. Un petit mot gratuit = un recommandateur potentiel." },
  { category: 'formation', text: "Regarde une formation ou relis un module aujourd'hui. 30 min d'apprentissage quotidien = expertise exponentielle." },
];

export function getDailyTip(dayIndex: number): typeof dailyTips[0] {
  return dailyTips[dayIndex % dailyTips.length];
}
