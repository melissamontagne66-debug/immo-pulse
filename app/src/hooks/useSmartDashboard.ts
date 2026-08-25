import { useMemo } from 'react';
import type { DailyResults } from '@/types';
import type { UserProfile } from '@/types/profile';
import { getPlanificationAdaptative } from '@/lib/planificationAdaptative';
import { toLocalDateKey } from '@/lib/utils';

export type InsightType = 'encouragement' | 'conseil' | 'alerte' | 'admin' | 'picking' | 'défi' | 'suivi';

export interface DailyInsight {
  id: string;
  type: InsightType;
  title: string;
  message: string;
  emoji: string;
  priority: number; // 1 = highest
}

// Pense-bête admin / tracfin qui tournent
const adminReminders: string[] = [
  "As-tu mis à jour ton CRM aujourd'hui ? Chaque contact doit être noté avec sa date de relance.",
  "Pense à scanner tes notes de frais et les classer dans ton dossier de gestion. Ton comptable te remerciera.",
  "As-tu enregistré tes kilomètres du jour ? Aller au contact des habitants et les visites = des kilomètres déductibles.",
  "Relance tes contacts de J+7 aujourd'hui. Le fichier mort = de l'argent qui dort.",
  "Vérifie que tes panneaux 'Estimation offerte' sont toujours bien en place chez tes apporteurs.",
  "As-tu posté un contenu sur tes réseaux sociaux aujourd'hui ? Un post = une visibilité gratuite.",
  "Pense à mettre à jour ta fiche Google Business Profile avec les nouveaux avis clients.",
  "As-tu relu tes offres en cours ? Un acheteur chaud peut se cacher dans ton fichier.",
  "Vérifie que tes diagnostics pour les mandats en cours sont à jour.",
  "Ton compte pro est-il à jour ? Photos, bio, coordonnées — tout doit être pro.",
];

// Défis qui tournent
const dailyChallenges: string[] = [
  "Aujourd'hui, toque à 3 portes de plus que hier. Chaque porte = une opportunité.",
  "Fais une estimation offerte en marchant. Toque, présente-toi, évalue en 5 minutes.",
  "Pose un panneau 'Estimation offerte' chez un particulier enregistré en apporteur d'affaires.",
  "Relance 5 contacts de ton fichier que tu n'as pas appelés depuis plus de 15 jours.",
  "Enregistre 2 nouveaux apporteurs d'affaires aujourd'hui. Ami, voisin, connaissance, ancien client... Tes scripts sont dans tes mémos de formation.",
  "Fais un post LinkedIn ou Facebook sur une vente récente. La preuve sociale attire les mandats.",
  "Aujourd'hui, ne donne aucun prix au téléphone. Force le RDV. 'Le prix, c'est l'objectif de notre rencontre.'",
  "Appelle 3 anciens clients pour leur demander s'ils connaissent quelqu'un qui veut vendre.",
];

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) % 1;
  return x < 0 ? -x : x;
}

export function useSmartDashboard(
  dailyRésultats: DailyResults[],
  profile: UserProfile,
  currentDay: number,
  streak: number,
) {
  return useMemo(() => {
    const insights: DailyInsight[] = [];
    const seed = currentDay * 137 + (dailyRésultats.length * 31);

    // === 1. ANALYSE DE LA VEILLE ===
    // « Hier » = la veille réelle, pas le bilan le plus récent : si le bilan
    // du jour est déjà validé, dailyRésultats[0] est aujourd'hui et les
    // insights « Hier tu as fait X » décriraient le jour même.
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const yesterdayKey = toLocalDateKey(d);
    const yesterdayIdx = dailyRésultats.findIndex(r => r.date === yesterdayKey);
    const yesterday = yesterdayIdx >= 0 ? dailyRésultats[yesterdayIdx] : undefined;
    // Tableau trié par date décroissante : l'entrée qui suit = avant-hier.
    const dayBefore = yesterdayIdx >= 0 ? dailyRésultats[yesterdayIdx + 1] : undefined;

    if (yesterday) {
      const totalRdv = yesterday.rdvR1Done + yesterday.rdvR2Done;

      // Si beaucoup d'appels mais peu de RDV
      if (yesterday.callsMade >= 15 && totalRdv === 0) {
        insights.push({
          id: 'alert-calls-no-rdv',
          type: 'alerte',
          title: 'Beaucoup d\'appels, peu de RDV',
          message: `Hier tu as fait ${yesterday.callsMade} appels mais 0 RDV. Essaie d'affiner ton script d'ouverture. La clé : ne JAMAIS donner de prix au téléphone. Force le RDV physique. "Je préfère vous montrer le bien, c'est plus parlant."`,
          emoji: '⚡',
          priority: 1,
        });
      }

      // Si RDV R2 fait
      if (yesterday.rdvR2Done > 0) {
        insights.push({
          id: 'r2-done',
          type: 'encouragement',
          title: 'R2 effectué !',
          message: `Bravo pour ton R2 d'hier ! ${yesterday.rdvR2Done} rendez-vous de qualité. N'oublie pas : la règle du silence après le prix, et fixe la date de signature dans la foulée.`,
          emoji: '🎯',
          priority: 2,
        });
      }

      // Si mandat signé
      if (yesterday.mandatsSigned > 0) {
        insights.push({
          id: 'mandat-signed',
          type: 'encouragement',
          title: 'Mandat signé !',
          message: yesterday.mandatsSigned >= 1
            ? `Félicitations pour ton mandat d'hier ! 🎉 Maintenant : photos pro sous 72h, mise en ligne rapide, et communique sur tes réseaux. Un mandat bien lancé = une vente rapide.`
            : `Félicitations pour tes ${yesterday.mandatsSigned} mandats d'hier ! 🎉`,
          emoji: '🎉',
          priority: 1,
        });
      }

      // MOD-35 — messages adaptatifs du lendemain (règles déterministes, module
      // src/lib/planificationAdaptative.ts). La règle « 0 conversation hier »
      // remplace l'ancienne alerte « ⏰ Pas d'appels hier » par un message
      // d'encouragement (« 📞 On remet le compteur en route aujourd'hui »).
      getPlanificationAdaptative(yesterday).forEach(a => {
        insights.push({
          id: a.id,
          type: 'alerte',
          title: a.title,
          message: a.message,
          emoji: a.emoji,
          priority: 1,
        });
      });

      // Si contacts physiques = 0
      if (yesterday.contactsApproached === 0) {
        insights.push({
          id: 'no-picking',
          type: 'conseil',
          title: 'Le terrain t\'attend',
          message: `Tu n'es pas allé au contact des habitants hier. Ta mission aujourd'hui : informer les propriétaires de ton secteur. Sélectionne 3 biens, toque au bien avec une recherche acquéreur, puis aux 10 voisins avec une estimation patrimoniale offerte. Chaque contact enregistré dans ton réseau d'apporteurs est un futur partenaire d'affaires.`,
          emoji: '🚪',
          priority: 2,
        });
      }

      // Si bonne humeur
      if (yesterday.mood >= 4) {
        insights.push({
          id: 'good-mood',
          type: 'encouragement',
          title: 'Tu es en forme !',
          message: `Hier tu étais en super forme (${yesterday.mood}/5). Cette énergie est contagieuse — utilise-la aujourd'hui pour faire un RDV supplémentaire ou toquer à une porte de plus.`,
          emoji: '🔥',
          priority: 3,
        });
      }

      // Si mauvaise humeur
      if (yesterday.mood <= 2) {
        insights.push({
          id: 'bad-mood',
          type: 'encouragement',
          title: 'Hier c\'était dur',
          message: `Hier tu as eu une journée difficile. C'est normal, ça fait partie du métier. Aujourd'hui, commence par une petite victoire : un seul appel, une seule porte toquée. Le reste suivra.`,
          emoji: '💪',
          priority: 1,
        });
      }

      // Si visites faites
      if (yesterday.visitesDone > 0) {
        insights.push({
          id: 'visites-done',
          type: 'conseil',
          title: 'Visites effectuées',
          message: `Tu as fait ${yesterday.visitesDone} visite(s) hier. As-tu envoyé un SMS ou un vocal WhatsApp à chaque acquéreur dans l'heure qui a suivi ? Utilise le rédacteur de compte rendu pour ça.`,
          emoji: '🏠',
          priority: 2,
        });
      }

      // Tendance sur 2 jours
      if (dayBefore) {
        const totalYesterday = yesterday.callsMade + yesterday.rdvR1Done + yesterday.rdvR2Done;
        const totalDayBefore = dayBefore.callsMade + dayBefore.rdvR1Done + dayBefore.rdvR2Done;

        if (totalYesterday > totalDayBefore * 1.3) {
          insights.push({
            id: 'progression',
            type: 'encouragement',
            title: 'Tu progresses !',
            message: `Ta productivité est en hausse : hier tu as fait plus qu'avant-hier. Garde ce rythme, c'est exactement comme ça que les meilleurs construisent leurs résultats.`,
            emoji: '📈',
            priority: 3,
          });
        }
      }
    }

    // === 2. CONSEILS PICKING DYNAMIQUES ===
    const pickingMessages = [
      {
        title: 'Aller au contact du jour',
        message: `Sélectionne 3 biens en vente sur ton outil interne, note l'adresse et les caractéristiques principales sur ton outil interne. Toque en présentant une recherche acquéreur ciblée — tu arrives avec un acheteur en main, pas en démarchage. Puis toque aux 10 portes voisines. Tes scripts et mémos de formation sont à ta disposition.`,
        emoji: '🏠',
      },
      {
        title: 'Deviens l\'expert du quartier',
        message: `Ta mission : informer chaque propriétaire de ton secteur. Choisis une rue, toque à 10 portes avec une recherche acquéreur ciblée et une estimation patrimoniale offerte. Même sans projet, enregistre-les dans ton réseau d'apporteurs — ils t'ont vu en action, ils connaissent ta méthode et ton sérieux, ils deviendront tes meilleurs apporteurs d'affaires.`,
        emoji: '📍',
      },
      {
        title: 'Aller au contact — Apporteur',
        message: `Quand tu toques à une porte et que le proprio n'est pas intéressé, demande : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?" Enregistre-le comme apporteur d'affaires officiel. Un bon apporteur = 2-3 mandats par an.`,
        emoji: '🤝',
      },
      {
        title: 'Aller au contact + Estimation offerte',
        message: `Tes scripts et mémos de formation sont à ta disposition pour tes échanges en porte à porte. L'essentiel : tu arrives avec une recherche acquéreur ciblée sur ton secteur — ce n'est pas du démarchage, tu apportes de la valeur.`,
        emoji: '📋',
      },
      {
        title: 'Le voisinage vend',
        message: `Quand un bien se vend dans une rue, les 10 maisons autour deviennent plus intéressées. Va toquer et dis : "Je viens de vendre le [N°] dans votre rue. J'ai des acheteurs frustrés. Vous connaissez quelqu'un qui vendrait ?"`,
        emoji: '💡',
      },
    ];

    const pickingIdx = Math.floor(seededRandom(seed) * pickingMessages.length);
    insights.push({
      id: `picking-${pickingIdx}`,
      type: 'picking',
      ...pickingMessages[pickingIdx],
      priority: 2,
    });

    // === 3. PENSE-BÊTE ADMIN ===
    const adminIdx = Math.floor(seededRandom(seed + 50) * adminReminders.length);
    insights.push({
      id: `admin-${adminIdx}`,
      type: 'admin',
      title: 'Pense-bête',
      message: adminReminders[adminIdx],
      emoji: '📎',
      priority: 4,
    });

    // === 4. SUIVI DES MANDATS ===
    // Détecte les mandats signés et ajoute des rappels de suivi
    const mandatDates = dailyRésultats
      .filter(r => r.mandatsSigned > 0)
      .map(r => ({ date: r.date, count: r.mandatsSigned }));
    
    const today = new Date();
    
    mandatDates.forEach(m => {
      const mandatDate = new Date(m.date);
      const daysSince = Math.floor((today.getTime() - mandatDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // Suivi vendeur : premier RDV à 14 jours, puis tous les 14 jours
      const cycleDay = daysSince % 14; // 0-13 dans le cycle de 14 jours
      const cycleNumber = Math.floor(daysSince / 14); // 0 = première quinzaine, 1 = deuxième, etc.
      
      // Jours 11-13 de chaque cycle : programmer le RDV de suivi
      if (cycleDay >= 11 && cycleDay <= 13 && daysSince >= 11) {
        const rdvNumber = cycleNumber + 1;
        insights.push({
          id: `suivi-programmer-${m.date}-${cycleNumber}`,
          type: 'suivi',
          title: `📅 Programme ton ${rdvNumber}${rdvNumber === 1 ? 'er' : 'ème'} RDV de suivi`,
          message: `Tu as signé un mandat il y a ${daysSince} jours. Dans ${14 - cycleDay} jours, ce sera le moment de faire ton ${rdvNumber}${rdvNumber === 1 ? 'er' : 'ème'} RDV de suivi avec le vendeur. Programme-le dès maintenant dans ton agenda ! Privilégie la rencontre physique, sinon fais un vocal ou un appel. Au RDV de suivi : remets à jour l'estimation, analyses la concurrence (biens en vente sur le secteur), regardes les stats de ton annonce (appels, visites), et si les retours disent que le prix est trop haut, proposes un ajustement.`,
          emoji: '📅',
          priority: 1,
        });
      }
      
      // Jours 0-10 de chaque cycle après le premier : RDV de suivi dû
      if (cycleDay >= 0 && cycleDay <= 10 && daysSince >= 14) {
        const rdvNumber = cycleNumber;
        const suiviLabel = rdvNumber === 1 ? 'premier' : rdvNumber === 2 ? 'deuxième' : rdvNumber === 3 ? 'troisième' : `${rdvNumber}ème`;
        insights.push({
          id: `suivi-rdv-${m.date}-${cycleNumber}`,
          type: 'suivi',
          title: `🔴 ${suiviLabel.charAt(0).toUpperCase() + suiviLabel.slice(1)} RDV de suivi à faire`,
          message: `Tu as signé un mandat il y a ${daysSince} jours — ton ${suiviLabel} RDV de suivi est maintenant dû ! Contacte le vendeur pour fixer un créneau. Privilégie la rencontre physique. Au RDV : remets à jour l'estimation, analyses la concurrence, regardes les stats (appels, visites, retours). Si les visiteurs parlent d'un prix trop haut, il faut travailler le prix. Les vendeurs non suivis régulièrement perdent confiance. Puis enchaîne avec le terrain post-RDV (5 portes voisines).`,
          emoji: '🔴',
          priority: 1,
        });
      }
    });

    // === 5. DÉFI DU JOUR ===
    const défiIdx = Math.floor(seededRandom(seed + 100) * dailyChallenges.length);
    insights.push({
      id: `défi-${défiIdx}`,
      type: 'défi',
      title: 'Défi du jour',
      message: dailyChallenges[défiIdx],
      emoji: '⚡',
      priority: 3,
    });

    // === 5. ENCOURAGEMENT SÉRIE ===
    if (streak >= 3) {
      insights.push({
        id: 'streak',
        type: 'encouragement',
        title: `Série de ${streak} jours !`,
        message: streak >= 7
          ? `7 jours consécutifs ! 🔥 Tu es en mode machine. Les résultats ne mentent pas : la constance crée le succès. Continue !`
          : `${streak} jours de suite ! Chaque jour compte. Tu construis un habitus de travail qui te mènera loin.`,
        emoji: '🔥',
        priority: 2,
      });
    }

    // === 6. MESSAGE DÉBUTANT ===
    if (profile.expérienceLevel === 'débutant' && dailyRésultats.length <= 3) {
      insights.push({
        id: 'débutant-welcome',
        type: 'encouragement',
        title: 'Bienvenue dans l\'aventure !',
        message: `Tu débutes, c'est tout à fait normal de ne pas tout maîtriser. Ton objectif ce mois-ci : apprendre la méthode. Un appel par jour, une porte toquée par jour, et tu progresses. Les mandats arriveront au mois 2-3.`,
        emoji: '🌱',
        priority: 1,
      });
    }

    // Trier par priorité
    insights.sort((a, b) => a.priority - b.priority);

    return { insights };
  }, [dailyRésultats, profile, currentDay, streak]);
}
