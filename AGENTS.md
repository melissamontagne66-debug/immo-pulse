# Instructions pour tout agent IA travaillant sur ce repo

Ce fichier s'applique à n'importe quel assistant IA (Claude, Kimi, Codex, etc.)
utilisé pour modifier ce projet. Merci de le lire avant toute modification.

## Contexte du projet

- `app/` — frontend React + Vite + TypeScript, déployé sur Cloudflare Pages.
  Build : `npm run build` (= `tsc -b && vite build`). Lint : `npm run lint`.
- `immo-pulse-api/` — backend Cloudflare Worker (TypeScript) + base D1
  (SQLite), auth JWT maison, endpoints REST (`/api/auth/*`, `/api/sync`,
  `/api/visits`, `/api/contacts`).
- Déploiement **automatique** sur push vers `main` (Cloudflare Pages +
  Workers Builds) — il n'y a pas d'étape de review avant la prod.

## Règle n°1 — Ne jamais résoudre un conflit de merge à l'aveugle

Si tu rencontres un conflit de merge, **ne choisis jamais automatiquement
"favor remote" ou "favor local"** sans lire les deux versions ligne par
ligne. Un correctif important peut se trouver dans la version que tu
écrases sans le savoir. En cas de doute, garde les deux changements
(fusionne-les manuellement) plutôt que d'en supprimer un.

## Zone fragile : `app/src/App.tsx` — section "SAUVEGARDE CLOUD"

Autour de la fonction `flushSync` / `handleLogout` : ce code garantit que
la synchronisation vers D1 se termine **avant** qu'un utilisateur ne soit
déconnecté. Sans ça, toute donnée saisie dans les 500ms précédant une
déconnexion (bilan, profil, visite) est silencieusement perdue — jamais
enregistrée en base, même si elle reste visible en local sur l'appareil
d'origine.

Ce bug a déjà été corrigé une fois, puis réintroduit par erreur lors d'un
merge (`857d319`), puis recorrigé. Si tu modifies cette zone :
- Garde le principe : `onLogout` doit attendre (`await`) la fin d'une sync
  en cours avant d'appeler `logout()`.
- Ne remets pas le délai de debounce à une valeur élevée (3000ms) sans
  raison — 500ms suffit largement, l'état ne change que sur des actions
  ponctuelles (clic), jamais en continu.

## Méthode de travail avant de corriger un bug

Ne propose jamais un correctif avant d'avoir compris la cause réelle.
Corriger un symptôme sans comprendre la cause casse autre chose ailleurs —
c'est exactement ce qui s'est passé avec le bug de persistance ci-dessus.

1. **Reproduis le bug avant de le corriger.** Si tu ne peux pas le
   reproduire de façon fiable, tu n'as pas encore assez d'information —
   n'écris pas de fix "au cas où".
2. **Lis le code réellement exécuté**, pas seulement ce qu'il devrait
   faire. Pour un bug de synchronisation/timing, vérifie l'ordre exact des
   événements (quel `useEffect` se déclenche, dans quel ordre, avec quelles
   dépendances).
3. **Une seule hypothèse à la fois.** Change une chose, revérifie, puis
   seulement ensuite passe à l'étape suivante. Ne mélange pas plusieurs
   correctifs dans un même essai — tu ne sauras pas lequel a marché.
4. **Corrige la cause, pas le symptôme.** Si un correctif rapide fait
   disparaître l'erreur sans que tu puisses expliquer pourquoi le bug
   arrivait, ce n'est pas un correctif, c'est un pansement.
5. **Vérifie après coup, avec des preuves.** Ne dis jamais "c'est corrigé"
   sans avoir rejoué le scénario exact qui déclenchait le bug (build qui
   passe, test qui passe, ou test manuel reproduisant les mêmes conditions
   que le bug initial).

## Code propre

- Ne fais pas de refactoring "pendant que t'es là" — un fix de bug ne doit
  toucher que ce qui est nécessaire au fix. Pas de renommage, pas de
  réorganisation de fichiers, pas d'abstraction nouvelle "pour plus tard"
  dans le même commit.
- Respecte les conventions déjà en place dans le fichier que tu modifies
  (nommage, structure des hooks, style des commentaires) plutôt que d'en
  introduire de nouvelles.
- Pas de commentaire qui décrit ce que fait le code (le code le dit déjà) —
  seulement des commentaires qui expliquent un choix non évident (ex : le
  commentaire sur `flushSync` ci-dessus explique *pourquoi*, pas *quoi*).
- Un commit = un changement logique cohérent, avec un message qui explique
  le *pourquoi*, pas juste le *quoi*.

## Tests

- **`immo-pulse-api/`** — tests unitaires avec `vitest` sur les fonctions
  pures critiques : hashing de mot de passe (`hashPasswordWithSalt`,
  `verifyPassword`, migration legacy → v1), JWT (`createJWT`/`verifyJWT` :
  round-trip, secret invalide, payload trafiqué, token malformé, token
  expiré), CORS (`corsHeaders`, `getFrontendUrl`), `normalizeEmail`.
  Lance-les avec `cd immo-pulse-api && npm test`. Si tu ajoutes ou modifies
  une fonction pure dans `src/index.ts` (surtout tout ce qui touche à
  l'auth), ajoute ou mets à jour le test correspondant dans
  `src/index.test.ts` — exporte la fonction (`export function ...`) si elle
  ne l'est pas déjà, c'est la seule condition pour qu'elle soit testable.
- **`app/`** — aucun test automatisé pour l'instant (React/UI). C'est une
  dette, pas un choix. Le point le plus fragile (`flushSync`/`handleLogout`
  dans `App.tsx`) est un candidat naturel pour un test e2e (prévu plus
  tard, pas encore en place) plutôt qu'un test unitaire, car son
  comportement dépend du timing réel entre plusieurs `useEffect` React.
  En attendant, tout changement touchant à l'auth, à la sync cloud, ou à
  la déconnexion doit être vérifié manuellement : créer un compte →
  remplir un bilan → se déconnecter rapidement → se reconnecter depuis une
  session vide → les données doivent être là.
- N'invente pas des tests qui passent artificiellement (mocks qui ne
  testent rien de réel) juste pour avoir une case verte — un test qui ne
  peut pas échouer ne sert à rien.

## Avant de pousser sur `main`

1. `cd app && npm run build` doit passer sans erreur (et `npm run lint`).
2. `cd immo-pulse-api && npx tsc --noEmit -p .` et `npm test` doivent
   passer sans erreur.
3. Si tu touches à l'auth, au sync, ou à la déconnexion : teste aussi
   manuellement le scénario décrit dans la section Tests ci-dessus (côté
   `app/`, ce n'est pas encore couvert automatiquement).
4. Le déploiement est automatique sur push vers `main` — un push cassé
   part directement en production, il n'y a pas de filet de sécurité.
