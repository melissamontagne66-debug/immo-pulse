# Plan de deploiement gratuit - Immo Pulse pour ton equipe

## Option 1 : 100% GRATUIT (Recommande pour commencer)

**Stack :** Frontend React + localStorage + IA keyword-based (ce qu'on a maintenant)

**Couts :** 0€

**Comment faire :**
1. Le build est deja pret dans le dossier `dist/`
2. Heberge sur **Netlify** ou **Vercel** (gratuit) :
   ```bash
   # Installer Netlify CLI
   npm install -g netlify-cli
   
   # Deployer
   netlify deploy --prod --dir=dist
   ```
3. Partage le lien a ton equipe

**Avantages :**
- 0€/mois
- Chaque conseiller a son compte securise
- Donnees persistantes (localStorage)
- IA complete sans API externe

**Limites :**
- Donnees stockees localement (si le conseiller change d'ordi, il perd ses donnees)
- Pas de partage de donnees entre conseillers
- Pas d'IA "vraie" (reponses pre-ecrites)

---

## Option 2 : Gratuit avec IA "vraie" (GPT)

**Stack :** Frontend + Backend serverless + OpenAI API

**Couts :** ~5-20€/mois pour l'API OpenAI (selon l'usage)

**Architecture :**
```
Frontend (Vercel/Netlify gratuit)
    |
    v
API Route serverless (Vercel Functions ou Netlify Functions - gratuit)
    |
    v
OpenAI API (pay-per-use, ~0.002€ par message)
```

**Comment faire :**
1. **Backend** : Creer une API simple avec Vercel Functions (serverless, gratuit)
2. **IA** : Utiliser l'API OpenAI GPT-4o-mini (~0.15€/million de tokens = quasi gratuit pour une equipe)
3. **Securite** : Cle API stockee cote serveur (jamais exposee au client)

**Exemple d'API Vercel Function (api/chat.js) :**
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Tu es un coach immobilier expert. Tu aides des conseillers debutants a reussir leurs 6 premiers mois. Tu connais par coeur : prospection, R1, R2, mandats, visites, negociation, notaire, gestion du temps. Tu reponds toujours en francais, de maniere concrete et actionable. Tu donnes des scripts, des chiffres, des ratios. Ton ton est encourageant mais direct.`;

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { messages } = req.body;
  
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages
    ],
    temperature: 0.7,
  });
  
  res.json({ response: completion.choices[0].message.content });
}
```

**Couts reels pour une equipe de 10 conseillers :**
- ~500 messages/jour total = ~5€/mois
- Vercel (hobby) = 0€
- Netlify = 0€
- **Total : 5-10€/mois**

---

## Option 3 : Gratuit avec IA gratuite (sans OpenAI)

**Stack :** Frontend + Backend + Mistral AI (gratuit tier)

**Couts :** 0€

**API gratuites disponibles :**
1. **Mistral AI** (free tier) : 1 requete/seconde gratuit
2. **Groq** : Ultra rapide, free tier genereux
3. **Hugging Face Inference API** : Gratuit (rate limited)

**Inconvenient :** Moins fiable, rate limits, peut necessiter une carte bancaire quand meme pour l'inscription.

---

## Option 4 : 100% gratuit + IA locale (avance)

**Stack :** Frontend + Backend + Ollama (modele local)

**Couts :** 0€ (mais necessite un serveur)

**Comment :**
1. Installer Ollama sur un PC/serveur
2. Telecharger un modele comme `llama3.1` ou `mistral`
3. Exposer l'API via ngrok ou un tunnel
4. L'API est 100% gratuite et privee

**Inconvenient :** Necessite un PC allume en permanence ou un serveur.

---

## RECOMMANDATION

**Phase 1 (maintenant) :** Option 1 (ce qu'on a) - 0€, ca fonctionne deja
**Phase 2 (quand tu veux) :** Option 2 - Ajouter un backend Vercel + OpenAI pour ~10€/mois

Le passage de la Phase 1 a la Phase 2 est tres simple :
- On garde exactement le meme frontend
- On ajoute juste un appel API pour le chat
- Le reste reste identique

---

## Securite - Limiter l'acces a ton equipe

**Methode 1 :** Mot de passe global
- Ajouter un champ "code equipe" a l'inscription
- Seuls les conseillers avec le code peuvent creer un compte

**Methode 2 :** Email autorise
- Liste blanche d'emails autorises
- Seuls les emails de ton equipe peuvent s'inscrire

**Methode 3 :** Lien prive
- Ne partage le lien que dans ton groupe WhatsApp/equipe
- Pas indexe sur Google (deja le cas avec Netlify/Vercel)

---

## Prochaines etapes si tu veux ajouter une IA "vraie"

Dis-moi si tu veux passer a l'Option 2, je peux :
1. Creer le backend API avec Vercel Functions
2. Connecter OpenAI GPT-4o-mini
3. Ajouter un systeme de "code equipe" pour securiser l'acces
4. Documenter les couts reels

C'est environ 2-3h de travail supplementaires.
