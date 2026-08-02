# Stockage & Deploiement avec Cloudflare

## Comment ca marche actuellement (gratuit, local)

Chaque conseiller se connecte avec son email/mot de passe. Toutes ses donnees sont stockees dans le **localStorage** de SON navigateur, isolees par son email :

| Donnee | Cle de stockage | Exemple |
|---|---|---|
| Compte | `iad-coach-accounts` | melissa.montagne66@gmail.com |
| Session | `iad-coach-session` | melissa.montagne66@gmail.com |
| Profil | `iad-coach-profile-{email}` | Objectifs, ville, experience... |
| Progression | `iad-coach-progress-{email}` | Jours completes, bilans... |
| Chat | `iad-coach-chat-{email}` | Historique conversations |
| Visites | `immo-pulse-visits-{email}` | Comptes rendus de visite |

**Avantages :** 100% gratuit, immediat, prive (donnees sur l'appareil du conseiller).
**Limites :** Si le conseiller change d'ordinateur ou efface son navigateur, il perd ses donnees.

---

## Migration vers Cloudflare (pour conserver les donnees)

Cloudflare offre des services gratuits parfaits pour ce cas :

### 1. Cloudflare Workers (backend serverless) — GRATUIT
- 100 000 requetes/jour gratuit
- Tu peux creer une API simple pour : login, stocker/recuperer les donnees
- Le conseiller retrouve SES donnees sur n'importe quel appareil

### 2. Cloudflare D1 (base de donnees SQL) — GRATUIT
- 500 000 lignes/jour gratuit
- 5 GB de stockage gratuit
- Parfait pour stocker les profils, bilans, visites de tous les conseillers

### 3. Cloudflare Pages (hebergement frontend) — GRATUIT
- Heberge le frontend React (remplace Netlify)
- Bande passante illimitee
- Deploye automatiquement depuis GitHub

### 4. Cloudflare KV (stockage cle-valeur) — GRATUIT
- 100 000 lectures/jour gratuit
- Ideal pour stocker les messages du coach, les reponses IA

---

## Architecture avec Cloudflare

```
Conseiller (tel/ordi)
    |
    v
React App (Cloudflare Pages)
    |
    +---> API Login (Cloudflare Worker)
    |     +---> Verifie dans D1 (UserAccount)
    |
    +---> API Profil (Cloudflare Worker)
    |     +---> Lit/Ecrit dans D1 (UserProfile)
    |
    +---> API Bilans (Cloudflare Worker)
    |     +---> Lit/Ecrit dans D1 (DailyResults)
    |
    +---> API Visites (Cloudflare Worker)
    |     +---> Lit/Ecrit dans D1 (VisitReport)
    |
    +---> API Coach IA (Cloudflare Worker)
          +---> Appelle OpenAI GPT-4o-mini (~0.002€/message)
```

---

## Cout reel avec Cloudflare

| Service | Cout |
|---|---|
| Cloudflare Workers | 0€ (100k req/jour) |
| Cloudflare D1 | 0€ (5 GB) |
| Cloudflare Pages | 0€ (illimite) |
| OpenAI GPT-4o-mini | ~5-10€/mois pour 10 conseillers |
| **TOTAL** | **~5-10€/mois** |

---

## Mise en oeuvre (etapes)

1. **Creer un compte Cloudflare** (gratuit)
2. **Installer Wrangler CLI** : `npm install -g wrangler`
3. **Creer la base D1** : `wrangler d1 create immo-pulse-db`
4. **Deployer les Workers API** (login, profil, bilans, visites)
5. **Deployer le frontend** sur Cloudflare Pages
6. **Optionnel :** Connecter OpenAI pour le Coach IA intelligent

Tu veux que j'implemente le backend Cloudflare ? C'est environ 3-4h de travail supplementaire.
