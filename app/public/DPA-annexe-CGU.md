# ANNEXE AUX CGU — ACCORD DE TRAITEMENT DES DONNÉES (DPA)
## Data Processing Agreement — conforme à l'article 28 du RGPD

**Version 1.0 — 09/08/2026**

**Entre :**
- **L'Utilisateur** de la Plateforme Immo Pulse (agent immobilier mandataire), ci-après « le Responsable de Traitement »,
- **L'Éditeur** de la Plateforme Immo Pulse, ci-après « le Sous-Traitant ».

---

### Article 1 — Objet et cadre

1.1. Le présent accord définit les conditions dans lesquelles le Sous-Traitant traite des données à caractère personnel pour le compte du Responsable de Traitement, dans le cadre de l'utilisation de la Plateforme.

1.2. Le présent accord s'applique automatiquement dès l'acceptation des CGU (case à cocher à l'inscription). Il n'a pas vocation à être signé séparément.

### Article 2 — Description du traitement

2.1. **Nature et finalité** : hébergement technique et synchronisation des données saisies par le Responsable de Traitement dans la Plateforme (fiches prospects, bilans quotidiens, comptes rendus de visite, ventes, rendez-vous), afin d'assurer le fonctionnement du service d'organisation personnelle.

2.2. **Catégories de données** : données d'identification et de contact des prospects (nom, prénom, téléphone, email, adresse), données de contexte de prospection (origine, notes, statut), données d'activité de l'Utilisateur (bilans, résultats, jalons).

2.3. **Personnes concernées** : les prospects, vendeurs, acquéreurs et apporteurs d'affaires saisis par l'Utilisateur.

2.4. **Durée** : la durée d'utilisation de la Plateforme, sous réserve de la purge automatique des fiches prospects inactives au-delà de 90 jours sans interaction (article 3 des CGU).

### Article 3 — Obligations du Sous-Traitant

Le Sous-Traitant s'engage à :

3.1. Traiter les données **uniquement sur instruction** du Responsable de Traitement (l'utilisation de la Plateforme vaut instruction), et jamais à ses propres fins (aucune exploitation, revente, ou analyse commerciale).

3.2. Garantir la **confidentialité** : les données ne sont accessibles à aucun tiers non autorisé.

3.3. Mettre en œuvre des **mesures techniques appropriées** : hébergement Cloudflare (centres de données UE lorsque disponible), authentification par jeton signé (JWT HMAC-SHA256), hashage des mots de passe (bcrypt), communications chiffrées (HTTPS/TLS), isolation des données par compte utilisateur.

3.4. **Sous-traitance ultérieure** : le Responsable de Traitement autorise le recours à Cloudflare, Inc. (infrastructure Workers + D1) comme sous-traitant ultérieur d'hébergement. Tout changement de sous-traitant ultérieur sera signalé dans les CGU.

3.5. **Assistance aux droits** : le Sous-Traitant met à disposition dans la Plateforme les fonctionnalités permettant au Responsable de Traitement de répondre aux demandes des personnes concernées : export des données (export Excel des contacts), rectification (édition des fiches), suppression (suppression d'une fiche, purge automatique à 90 jours, suppression de compte définitive via `DELETE /api/account`).

3.6. **Notification de violation** : le Sous-Traitant notifie le Responsable de Traitement dans les meilleurs délais en cas de violation de données personnelles dont il aurait connaissance.

3.7. **Sortie et réversibilité** : à la suppression du compte, toutes les données sont définitivement effacées de l'appareil et du compte synchronisé. Aucune copie n'est conservée.

### Article 4 — Obligations du Responsable de Traitement

Le Responsable de Traitement s'engage à :

4.1. Ne collecter et saisir dans la Plateforme que des données **licites**, collectées dans un cadre conforme au RGPD et à la réglementation applicable (notamment loi Hoguet, règles de démarchage, Bloctel).

4.2. **Informer** les personnes dont il saisit les données (prospects) de la collecte et de leurs droits.

4.3. **Basculer les données qualifiées** vers l'intranet officiel de son réseau dès qu'un prospect exprime un projet formalisé, et avant l'expiration du délai de conservation de 90 jours.

4.4. Respecter les droits des personnes concernées (accès, rectification, opposition, suppression) en utilisant les fonctionnalités de la Plateforme.

### Article 5 — Localisation et transferts

5.1. Les données sont hébergées sur l'infrastructure Cloudflare. Lorsque les données sont traitées hors de l'Union européenne, Cloudflare applique les clauses contractuelles types de la Commission européenne et les garanties prévues au Chapitre V du RGPD.

### Article 6 — Audit et preuve

6.1. Le Sous-Traitant met à la disposition du Responsable de Traitement les informations nécessaires pour démontrer la conformité du traitement (présente annexe, politique de confidentialité, mesures techniques décrites à l'article 3.3).

---

*Cette annexe fait partie intégrante des CGU d'Immo Pulse. En cochant la case d'acceptation des CGU à l'inscription, l'Utilisateur accepte également le présent accord de traitement des données.*

---

> **Note pour l'éditeur** : ce modèle est rédigé pour être annexé aux CGU. Il est volontairement complet mais lisible. Fais-le relire par un juriste avant mise sur le marché, et complète l'identité exacte de l'Éditeur (raison sociale, SIRET, adresse) aux endroits prévus.
