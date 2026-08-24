import { useState, useCallback } from 'react';
import type { ChatMessage } from '@/types';
import { searchKnowledge, getDailyTip, aiPersona, knowledgeModules } from '@/data/knowledgeBase';

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const STORAGE_PREFIX = 'iad-coach-chat';

const WELCOME_MESSAGES = [
  "Salut ! Je suis ton coach Immo Pulse. Pose-moi tes questions sur le terrain, les R1/R2, les mandats, la négociation... Je te réponds avec des conseils concrets basés sur les méthodes des tops performers.",
  "Hey ! Bienvenue dans ton coaching. Je connais la méthode sur le bout des doigts. Qu'est-ce qui te préoccupe aujourd'hui ?",
  "Coucou ! Prêt à tout donner aujourd'hui ? Dis-moi où tu en es : terrain, visite, offre, compromis ? Je t'aide à avancer !",
];

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function getWelcomeMessage(): string {
  const greeting = getTimeBasedGreeting();
  const base = WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
  return `${greeting} ! ${base}`;
}

function getStorageKey(userKey: string): string {
  return `${STORAGE_PREFIX}-${userKey}`;
}

function loadMessages(userKey: string): ChatMessage[] {
  try {
    const stored = localStorage.getItem(getStorageKey(userKey));
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [
    {
      id: generateId(),
      role: 'assistant',
      content: getWelcomeMessage(),
      timestamp: Date.now(),
    },
  ];
}

function saveMessages(userKey: string, messages: ChatMessage[]) {
  localStorage.setItem(getStorageKey(userKey), JSON.stringify(messages));
}

// ===== QUESTION CLEANING =====

// Remove the contextual prefix and extract the real question
function extractRealQuestion(raw: string): string {
  const prefixes = [
    "dans le cadre de mon activité de conseiller immobilier :",
    "dans le cadre de mon activité immobilière :",
    "en tant que conseiller immobilier :",
    "pour mon activité immo :",
  ];
  const cleaned = raw.toLowerCase().trim();
  for (const prefix of prefixes) {
    if (cleaned.startsWith(prefix)) {
      return raw.slice(prefix.length).trim();
    }
  }
  return raw;
}

// ===== TOPIC EXTRACTION =====

// Extract meaningful keywords from the question (remove stop words)
function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'en', 'à', 'a', 'au',
    'pour', 'par', 'sur', 'dans', 'ce', 'cet', 'cette', 'ces', 'mon', 'ma', 'mes',
    'ton', 'ta', 'tes', 'son', 'sa', 'ses', 'notre', 'votre', 'leur', 'quoi', 'qui',
    'que', 'comment', 'pourquoi', 'quand', 'où', 'est', 'sont', 'être', 'avoir',
    'faire', 'plus', 'moins', 'très', 'trop', 'peu', 'bien', 'mal', 'oui', 'non',
    'je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'me', 'te', 'se',
    'ne', 'pas', 'pas', 'jamais', 'toujours', 'déjà', 'encore', 'aussi',
    'avec', 'sans', 'sous', 'entre', 'vers', 'chez', 'lors', 'durant', 'pendant',
    'y', 'en', 'lui', 'leur', 'eux', 'elles', 'celui', 'celle', 'ceux', 'celles',
    'tout', 'tous', 'toute', 'toutes', 'autre', 'autres', 'même', 'mêmes',
    'quel', 'quels', 'quelle', 'quelles', 'mon', 'ma', 'mes', 'de', 'du', 'des',
    'l', 'd', 's', 'n', 't', 'j', 'm', 'c', 'ça', 'voila', 'voilà', 'bonjour',
    'salut', 'coucou', 'merci', 'svp', "s'il", 'plait', 'plait', 'stp',
  ]);

  return text
    .toLowerCase()
    .replace(/[.,;:!?()[\]{}"'\-–—/]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
}

// ===== SEMANTIC MATCHING =====

// Score how well a module matches the query keywords
function scoreModule(module: typeof knowledgeModules[0], keywords: string[]): number {
  let score = 0;

  for (const kw of keywords) {
    // Title match = highest weight
    if (module.title.toLowerCase().includes(kw)) score += 10;
    // Content match = medium weight
    if (module.content.toLowerCase().includes(kw)) score += 5;
    // Key points match = high weight
    module.keyPoints.forEach(kp => {
      if (kp.toLowerCase().includes(kw)) score += 8;
    });
    // Category match
    if (module.category.toLowerCase().includes(kw)) score += 7;
    // Script match
    module.scripts?.forEach(s => {
      if (s.toLowerCase().includes(kw)) score += 4;
    });
  }

  return score;
}

// ===== RESPONSE BUILDING =====

function buildResponseFromModule(module: typeof knowledgeModules[0], question: string): string {
  const keywords = extractKeywords(question);
  const questionLower = question.toLowerCase();

  // Score each key point by relevance to the question
  const scoredPoints = module.keyPoints.map(kp => {
    let score = 0;
    const kpLower = kp.toLowerCase();
    for (const kw of keywords) {
      if (kpLower.includes(kw)) score += 5;
    }
    // Boost if the question directly asks about this
    if (questionLower.includes(kpLower.split(' ').slice(0, 3).join(' '))) score += 10;
    return { text: kp, score };
  }).sort((a, b) => b.score - a.score);

  // Also score content lines for relevance
  const contentLines = module.content.split(/[.\n]/).map(l => l.trim()).filter(l => l.length > 15);
  const scoredLines = contentLines.map(line => {
    let score = 0;
    const lineLower = line.toLowerCase();
    for (const kw of keywords) {
      if (lineLower.includes(kw)) score += 3;
    }
    return { text: line, score };
  }).sort((a, b) => b.score - a.score);

  // Get the most relevant content (mix of key points and content lines)
  const topPoints = scoredPoints.filter(p => p.score > 0).slice(0, 3).map(p => p.text);
  const topLines = scoredLines.filter(l => l.score > 0).slice(0, 2).map(l => l.text);
  
  // Build response that directly addresses the question
  const intro = `Pour répondre à ta question sur **${question.slice(0, 50)}${question.length > 50 ? '...' : ''}**, voici ce que tu dois savoir sur **${module.title}** :`;

  // Build body from most relevant points
  const parts: string[] = [];
  
  // Add relevant content lines first (they give context)
  topLines.forEach(line => parts.push(line));
  
  // Add key points as actionable advice
  topPoints.forEach((point, idx) => {
    const prefix = idx === 0 ? '**Le point clé :**' : idx === 1 ? '**À retenir aussi :**' : '**En pratique :**';
    parts.push(`${prefix} ${point}`);
  });

  // If we don't have enough relevant content, add generic points
  if (parts.length < 2) {
    module.keyPoints.slice(0, 2).forEach(p => parts.push(p));
  }

  // Add a concrete script if available and relevant
  const relevantScript = module.scripts?.find(s => {
    const sLower = s.toLowerCase();
    return keywords.some(kw => sLower.includes(kw));
  });

  let scriptSection = '';
  if (relevantScript) {
    scriptSection = `\n\n**💬 Pour tes échanges, voici une phrase type :**\n*"${relevantScript}"*`;
  }

  // Closing that references the question
  const closing = `\n\nCela répond à ta question ? Si tu as une situation plus spécifique à gérer, dis-moi tout !`;

  return `${intro}\n\n${parts.join('\n\n')}${scriptSection}${closing}`;
}

// ===== MAIN RESPONSE FUNCTION =====

function findBestResponse(rawMessage: string): string {
  // 1. Extract the real question (strip prefix)
  const question = extractRealQuestion(rawMessage);
  const msg = question.toLowerCase();

  // 2. Greetings
  if (msg.match(/\b(bonjour|salut|coucou|hey|hello|bonsoir|bonne nuit)\b/)) {
    return getWelcomeMessage();
  }
  if (msg.match(/\b(merci|thank|thanks|cool|top|super|génial|parfait)\b/)) {
    return "Avec plaisir ! C'est mon rôle de t'aider. N'hésite pas si tu as d'autres questions ! 💪";
  }

  // 3. Direct keyword routing for common topics
  if (msg.match(/\b(prix\s+trop\s+(haut|élevé)|baisser\s+(le\s+)?prix|prix\s+du\s+marché|scénario\s+test|ajustement\s+prix|travail\s+(du\s+)?prix)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'travail-prix');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(r1\b|premier\s+rendez|1er\s+rdv|premier\s+contact|estimation\s+gratuite|visite\s+vendeur|préparation\s+r1|mètre\s+laser|questions\s+ouvertes|clôture\s+r1)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'r1-préparation');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(r2\b|avis\s+de\s+valeur|2eme\s+rdv|deuxième\s+rendez|prix\s+de\s+vente|scénario|fixer\s+(le\s+)?prix|3\s+scénarios|preuve\s+irr|silence)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'r2-stratégie');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(mandat\s+exclusif|mandat\s+simple|mandat\s+succès|clause\s+de\s+confiance|hoguet|contrat\s+mandat|argument\s+mandat|signer\s+(un\s+)?mandat)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'mandats');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(leboncoin\b|pap\b|appel\s+(téléphon|prospect)|phoning|téléphone|pige|prospect|loi\s+des\s+nombres|canvass|terrain|picking|toquer|porte\s+à\s+porte|voisin|commerçant|flyer|panneau)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'loi-des-nombres');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(offre\s+d'achat|contre-offre|négoci|psychologie|présenter\s+(une\s+)?offre|silence|ascenseur\s+émotionnel)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'offre-achat');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(objection|hésite|refus|concurrence|commission\s+trop\s+chère|répondre\s+à|désamorcer|cependant)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'objections');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(notaire|compromis|acte|dossier\s+notaire|sr[uo]|délai\s+rétract|dépôt\s+garantie|kit\s+notaire)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'notaire');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(visite\s+qualif|découverte\s+acquéreur|qualifier|flux|fomo|bon\s+de\s+visite|débrief|80.20|faire\s+croiser)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'visite-technique');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(photo|annonce|mise\s+en\s+ligne|mise\s+en\s+valeur|home\s+staging|rédaction\s+annonce|titre\s+annonce|72h)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'mise-en-ligne');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(assurance|confiance|certitude|posture|mindset|transfert\s+de\s+certitude|détachement)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'assurance');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(garantie\s+30|30\s+jours|g30|remboursement\s+honoraires)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'garantie-30j');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(motivation|décourag|difficile|dur|galère|abandon|stress|peur|courage|difficult|fatigue)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'loi-des-nombres');
    const tips = mod ? mod.keyPoints.slice(0, 3) : [];
    return `Je comprends, il y a des moments où c'est vraiment dur. Mais sache que chaque conseiller qui a réussi a traversé ces phases. ${tips.length > 0 ? tips[0] : 'Le secret, c\'est la régularité.'} ${tips.length > 1 ? tips[1] : ''}

Ce qui compte aujourd'hui, c'est de faire un pas, même petit. Ne te fixe pas des objectifs énormes qui te découragent avant de commencer. Contente-toi d'avancer un peu, chaque jour. Les résultats viennent toujours à ceux qui persistent avec méthode.

**Mon conseil concret pour tout de suite :** prends 2 minutes pour toi, respire profondément, puis lance-toi dans 5 conversations avec des habitants du secteur. Juste 5. Pas 50. Tu verras, après ces 5 échanges, l'énergie revient. On y va ensemble. 💪`;
  }

  if (msg.match(/\b(temps|planning|priorité|organisation|routine|planif|time\s+blocking|batching|matrice|eisenhower)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'gestion-temps');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(photo\s+pro|google\s+my\s+business|gmb|avis\s+client|réseau\s+social|facebook|instagram|linkedin|contenu\s+jour|canva)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'réseau-social');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(vente\s+en\s+cascade|acquéreur\s+vendeur|chaine|devenir\s+vendeur|coordination\s+notaire)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'vente-cascade');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(diagnostics?|dpe|plomb|amiante|termite|loi\s+carrez|passoire\s+thermique|ddt)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'diagnostics');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(intercabinet|inter-agence|collaboration|partage\s+honoraires|mandataire)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'intercabinet');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(dossier\s+mandat|pièce|titre\s+propriété|copropriété|pv\s+ag|récolter|organiser)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'dossier-mandat');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(lpsi|présentation\s+services|synergie|réseau|diffusion|portail|valorisation|photos)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'lpsi');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(compromis|condition\s+suspensive|délai\s+sr[uo]|relever\s+compteur|acte\s+authentique|lecture\s+compromis)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'compromis');
    if (mod) return buildResponseFromModule(mod, question);
  }

  // Routes supplémentaires pour plus de pertinence
  if (msg.match(/\b(apporteur|rémunération\s+apporteur|panneau\s+estimation|recommandation|6%|commission\s+apporteur)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'loi-des-nombres');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(retour\s+visite|compte\s+rendu|feedback|vendeur\s+informer|message\s+type|visite\s+faite)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'visite-technique');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(crm|fichier|contact|enregistrer|suivi|relance|j\+3|j\+7|j\+15)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'loi-des-nombres');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(ancien\s+client|client\s+passé|relance\s+ancien|fichier\s+ancien|recommandation|cooptation)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'loi-des-nombres');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(réseau\s+social|facebook|instagram|linkedin|publication|post|visibilité|contenu)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'réseau-social');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(suivi\s+vendeur|rdv\s+suivi|bilan\s+vendeur|ajustement\s+prix|concurrence|stats\s+annonce)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'travail-prix');
    if (mod) return buildResponseFromModule(mod, question);
  }

  if (msg.match(/\b(débutant|débuter|commencer|premier\s+pas|nouveau|formation|apprendre)\b/)) {
    const mod = knowledgeModules.find(m => m.id === 'loi-des-nombres');
    if (mod) return buildResponseFromModule(mod, question);
  }

  // 4. Semantic search fallback — use keyword scoring against all modules
  const keywords = extractKeywords(question);
  if (keywords.length > 0) {
    const scored = knowledgeModules
      .map(m => ({ module: m, score: scoreModule(m, keywords) }))
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score);

    if (scored.length > 0 && scored[0].score >= 10) {
      return buildResponseFromModule(scored[0].module, question);
    }
  }

  // 5. Last resort — search knowledge with the original searchKnowledge function
  const relevantModules = searchKnowledge(question);
  if (relevantModules.length > 0) {
    return buildResponseFromModule(relevantModules[0], question);
  }

  // 6. True fallback — acknowledge we don't know but suggest topics
  const tip = getDailyTip(Math.floor(Math.random() * 10));
  return `Pour bien te répondre sur **"${question.slice(0, 60)}${question.length > 60 ? '...' : ''}"**, peux-tu reformuler avec plus de détails ?

En attendant, voici un conseil utile :

**💡 ${tip.text}**

Je peux t'aider sur ces sujets : **Prospection** · **R1 & R2** · **Mandats** · **Visites** · **Négociation** · **Offres** · **Notaire** · **Gestion du temps** · **Objections** · **Diagnostics**

Pose-moi une question précise sur l'un de ces sujets !`;
}

export function useChat(userKey: string) {
  const [messages, setMessages] = useState<ChatMessage[]>(() => loadMessages(userKey));
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages(prev => {
      const updated = [...prev, userMsg];
      saveMessages(userKey, updated);
      return updated;
    });
    setIsTyping(true);

    const delay = 600 + Math.random() * 800;
    setTimeout(() => {
      const response = findBestResponse(content);
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };
      setMessages(prev => {
        const updated = [...prev, assistantMsg];
        saveMessages(userKey, updated);
        return updated;
      });
      setIsTyping(false);
    }, delay);
  }, [userKey]);

  const clearChat = useCallback(() => {
    const fresh: ChatMessage[] = [
      {
        id: generateId(),
        role: 'assistant',
        content: getWelcomeMessage(),
        timestamp: Date.now(),
      },
    ];
    setMessages(fresh);
    saveMessages(userKey, fresh);
  }, [userKey]);

  return {
    messages,
    isTyping,
    sendMessage,
    clearChat,
    persona: aiPersona,
  };
}
