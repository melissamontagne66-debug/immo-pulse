# Activer les notifications push (Firebase Cloud Messaging)

Guide pas à pas pour brancher les notifications push d'Immo Pulse (rappel du
bilan à 18 h, etc.). Tout le code est déjà en place — il ne manque que la
configuration d'un compte Firebase (gratuit, aucune carte demandée).

Temps estimé : 20 minutes.

## 1. Créer le projet Firebase

1. Ouvre https://console.firebase.google.com et connecte-toi avec un compte Google.
2. « Ajouter un projet » → nom : `immo-pulse` → désactive Google Analytics
   (inutile ici) → « Créer le projet ».

## 2. Créer l'app Web et récupérer les clés

1. Sur la page d'accueil du projet, clique sur l'icône **`</>`** (Web) pour
   ajouter une application web.
2. Nom : `Immo Pulse Web` → « Enregistrer l'application ».
3. Firebase affiche un bloc `const firebaseConfig = { ... }`. Garde cette page
   ouverte : tu vas copier les valeurs.

## 3. Clé Web Push (VAPID)

1. Roue crantée ⚙️ en haut à gauche → « Paramètres du projet » → onglet
   « Cloud Messaging ».
2. Section « Certificats Web Push » → « Générer une paire de clés ».
3. Copie la clé publique générée (longue chaîne) — ce sera `VITE_FIREBASE_VAPID_KEY`.

## 4. Compte de service (pour le worker qui ENVOIE les notifications)

1. Toujours dans « Paramètres du projet » → onglet « Comptes de service ».
2. « Générer une nouvelle clé privée » → un fichier JSON est téléchargé.
3. Dans un terminal :
   ```bash
   cd immo-pulse-api
   npx wrangler secret put FCM_SERVICE_ACCOUNT
   ```
   puis colle **l'intégralité du contenu du fichier JSON** quand demandé.

## 5. Renseigner les clés côté application

### a) `app/public/firebase-messaging-sw.js`

Remplace les valeurs vides par celles de l'étape 2 (ce sont des clés web
publiques par nature — elles sont visibles côté client chez toutes les apps) :

```js
const firebaseConfig = {
  apiKey: 'AIza…',
  authDomain: 'immo-pulse.firebaseapp.com',
  projectId: 'immo-pulse',
  storageBucket: 'immo-pulse.appspot.com',
  messagingSenderId: '1234567890',
  appId: '1:1234567890:web:abc123',
};
```

### b) Variables de build Cloudflare Pages

Dashboard Cloudflare → Pages → projet `immo-pulse` → « Settings » →
« Environment variables » → pour **Production**, ajoute :

| Nom | Valeur |
| --- | --- |
| `VITE_FIREBASE_API_KEY` | apiKey (étape 2) |
| `VITE_FIREBASE_AUTH_DOMAIN` | authDomain |
| `VITE_FIREBASE_PROJECT_ID` | projectId |
| `VITE_FIREBASE_STORAGE_BUCKET` | storageBucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | messagingSenderId |
| `VITE_FIREBASE_APP_ID` | appId |
| `VITE_FIREBASE_VAPID_KEY` | clé Web Push (étape 3) |

Puis relance un déploiement (Pages → « Deployments » → « Retry deployment »,
ou pousse un commit).

## 6. Vérifier que ça marche

1. Ouvre l'app (jour ≥ 2), onglet « Aujourd'hui » → la carte « 🔔 Un rappel à
   18 h… » apparaît → « Activer les rappels » → accepte la permission.
2. Ou règle « Rappel du bilan à 18 h » dans la barre latérale.
3. Le soir à 18 h, si le bilan du jour n'est pas rempli, la notification
   « 📝 Ton bilan t'attend » arrive — même app fermée (PWA installée sur
   l'écran d'accueil, Android ; iPhone ≥ iOS 16.4).

Si rien n'arrive : vérifier que la permission navigateur n'est pas bloquée
(réglages du site), que les variables Pages sont bien en « Production », et
que le secret `FCM_SERVICE_ACCOUNT` est bien posé (`npx wrangler secret list`).
