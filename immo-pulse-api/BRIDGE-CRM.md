# Bridge CRM — Spec pour le développement de l'extension Chrome

Document à transmettre au développeur de l'extension. L'endpoint est en
production et testé.

## Base URL

```
https://immo-pulse-api.melissa-montagne66.workers.dev
```

Toujours ce domaine (le Worker). `immo-pulse.pages.dev` est le front
statique — il ne répond à aucune API.

## Authentification

Deux options (le même JWT dans les deux cas) :

1. **Cookie de session (recommandé pour l'extension)**
   - `POST /api/auth/login` avec `Content-Type: application/json`,
     body `{"email": "...", "password": "..."}` et
     `credentials: 'include'` côté fetch.
   - La réponse pose `Set-Cookie: session=<jwt>; HttpOnly; Secure;
     SameSite=None; Path=/; Max-Age=30j`.
   - Les appels suivants envoient le cookie automatiquement
     (`credentials: 'include'`).
2. **Bearer** : le même login renvoie aussi `{"success": true,
   "token": "<jwt>", "user": {...}}` — l'extension peut stocker le token
   et l'envoyer en header `Authorization: Bearer <jwt>`.

CORS : toute origine `chrome-extension://*` est acceptée,
`Access-Control-Allow-Credentials: true`.

## Récupération des prospects

```
GET /api/bridge/prospects?since=YYYY-MM-DD&offset=N
```

- Sans paramètre : sync complète (100 prospects max, les plus récemment
  modifiés d'abord).
- `since` : sync incrémentale — uniquement les fiches modifiées depuis
  cette date. Format invalide = ignoré (sync complète), jamais d'erreur
  400 pour ça.
- `offset` : pagination par pages de 100 (offset 0, 100, 200…).
  Continuer tant qu'une page renvoie 100 entrées.
- Réponse : tableau JSON. En sync incrémentale (`since` présent), le
  tableau peut contenir des **tombstones** `{ "id": "...", "deleted": true }`
  → supprimer la fiche correspondante dans le CRM.

### Format d'un prospect

```json
{
  "id": "contact-1724…",
  "firstname": "Marie",
  "lastname": "Dupont",
  "phone": "+33612345678",
  "birthdate": "17/05/1990",
  "email": "marie@example.com",
  "address": "24 rue de la République, 69006 Lyon",
  "notes": "Texte libre — une ligne « date: note » par interaction",
  "created_at": "2026-08-12 09:41:03",
  "updated_at": "2026-08-25 18:02:11"
}
```

- `phone` est normalisé au format international FR (+33…).
- `birthdate` au format `JJ/MM/AAAA` ; omis si inconnu/invalide.
- `email`, `address`, `notes` omis quand vides.
- `created_at` / `updated_at` toujours présents (horodatage UTC de la base,
  `YYYY-MM-DD HH:MM:SS`) — `updated_at` suit chaque modification et sert
  aussi de référence pour `?since=`.
- Legacy : si `firstname` est vide, tout le nom est dans `lastname`.
- `civility` et `job` ne sont pas fournis (pas de donnée côté app) — à
  tolérer côté CRM.

## À savoir

- **Suppressions totales** : un prospect supprimé dans l'app (par le
  conseiller ou par la purge RGPD des 90 jours) est effacé physiquement,
  sans tombstone. Les entrées `{ "id": "...", "deleted": true }` ne
  concernent que d'éventuelles lignes supprimées avant cette règle — le
  CRM doit quand même les traiter si elles apparaissent.
- Erreurs : `401 {"error": "Non autorisé."}` si le token/cookie est
  absent ou expiré → redemander un login.
- Le cookie session dure 30 jours ; prévoir un écran de reconnexion.
