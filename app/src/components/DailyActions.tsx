import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { DebriefEntry } from '@/types';
import type { NextDayPlan } from '@/types';
import type { UserProfile } from '@/types/profile';
import {
  CheckCircle2, Circle, ClipboardCheck,
  Database, ChevronLeft, ChevronRight, Bell,
  ChevronDown, ChevronUp, Lightbulb, Minus, Plus, Pencil
} from 'lucide-react';
import { getProspectionActionForDay, getProspectionCategoryInfo } from '@/data/prospectionActions';
import { DailyMorningAction } from '@/components/DailyMorningAction';
import type { DailyResults } from '@/types';
import { useDailyCounters, useActionNotes, type CounterKey } from '@/hooks/useDailyCounters';
import { toLocalDateKey } from '@/lib/utils';
import { getGoals, plural } from '@/lib/goals';
import { MarkdownText } from '@/components/MarkdownText';
import { Celebration } from '@/components/Celebration';
import { toast } from 'sonner';
import { shouldPromptForPush, snoozePushPrompt, subscribeToPush, isPushDenied } from '@/lib/push';

interface DailyActionsProps {
  currentDay: number;
  completedDays: string[];
    profile: UserProfile;
  // Conservée pour compat avec App.tsx — les objectifs sont lus depuis @/lib/goals (MOD-19)
  dailyTargets: { calls: number; contactsPhysiques: number; rdvR1: number; rdvR2: number; mandats: number; visites: number };
  dailyResults: DailyResults[];
  onCompleteDay: (dayId: string) => void;
  onUncompleteDay: (dayId: string) => void;
  onAddDebrief: (debrief: DebriefEntry) => void;
  onDayChange: (day: number) => void;
  onOpenCheckup: () => void;
  onNavigate?: (tab: string) => void;
  userEmail?: string;
  onCreateContact?: (contexte: string) => void;
  // MOD-35 — plan du jour issu du bilan de la veille (tâches reportées, badge « Reporté d'hier »)
  nextDayPlan?: NextDayPlan;
}

// Idées de contenu réseaux sociaux — une par jour, cycle de 30 idées
function getSocialContent(day: number, isEs: boolean): string {
  // Cycle de 5 jours : chaque jour un pilier différent
  const dayOfWeek = ((day - 1) % 5);
  const pillarsFr = [
    {
      title: '🌟 NOTORIÉTÉ & VISIBILITÉ',
      desc: 'Objectif : te faire connaître auprès d\'un nouveau public. Quand tu partages qui tu es et ce que tu fais, tu crées des opportunités sans même le savoir. Chaque vue = une porte potentielle.',
      ideas: [
        'Présente-toi : Qui es-tu, quel secteur tu couvres, et pourquoi tu aimes ce métier.',
        'Le chiffre du mois : "Le prix moyen au m² sur [secteur] est de XXX€". Infographie Canva.',
        'Le quartier : 3 infos que seuls les locaux connaissent. Tags les commerçants.',
        'FAQ : "Combien de temps ça prend pour vendre sur [secteur] ?"',
        'FAQ : "À quel prix vendre mon bien ?" — la méthode des comparables en 3 points.',
        'Vue aérienne de ton secteur. Impact visuel fort.',
        'Top 3 : "Les 3 rues les plus recherchées sur [secteur]".',
      ],
    },
    {
      title: '💙 RECONNAISSANCE & GRATITUDE',
      desc: 'Objectif : remercier ta communauté, un client ou un partenaire. La gratitude attire la gratitude. Un client remercié te recommande à 3 personnes. C\'est le pilier le plus sous-estimé.',
      ideas: [
        'Merci public à un client ou apporteur qui t\'a fait confiance.',
        'Célèbre un cap : abonnés, anniversaire d\'agence, première vente.',
        'Mets en avant un collaborateur et remercie-le.',
        'Partage un témoignage client — même court.',
        '"Sans vous, rien de tout ça n\'existerait. Merci pour votre confiance."',
        'Photo avec un client satisfait (avec son accord).',
        '"Grâce à [prénom], j\'ai pu accompagner une nouvelle famille."',
      ],
    },
    {
      title: '🎓 PARTAGE DE VALEUR',
      desc: 'Objectif : éduquer et aider ton audience. Positionne ton expertise. Quand tu donnes de la valeur gratuitement, les gens te font confiance pour la suite. C\'est le pilier qui construit ta crédibilité.',
      ideas: [
        'Astuce déco : 3 conseils pour valoriser son bien avant une vente.',
        'Tutoriel : "5 erreurs à éviter quand on vend son bien".',
        'Étude de cas : "Comment j\'ai vendu ce bien en 15 jours sur [secteur]".',
        'Infographie : Les étapes de la vente immobilière en 5 étapes.',
        'Comparatif : "Prix au m² centre-ville vs périphérie sur [secteur]".',
        'Vidéo courte : 60 sec où tu expliques un concept clé du marché.',
        '"Appartement ou maison : qu\'est-ce qui se vend le mieux sur [secteur] ?"',
      ],
    },
    {
      title: '🎯 VENTE & RECRUTEMENT',
      desc: 'Objectif : convertir ton audience. Appel à l\'action direct. C\'est le moment de proposer tes services, montrer tes biens et tes acheteurs. Ne soit pas timide — les gens attendent ton offre.',
      ideas: [
        'Bien en exclusivité : "Nouveau bien sur [secteur] — DM pour plus d\'infos".',
        'Recherche acquéreur : "J\'ai un acquéreur très motivé pour [type] sur [secteur]. Vous connaissez quelqu\'un ?"',
        'Estimation offerte : "3 créneaux dispo ce week-end sur [secteur]."',
        '"Vous pensez vendre en 2026 ? Faisons le point ensemble, c\'est gratuit."',
        '"Qui connaissez-vous qui veut connaître la valeur de son bien ?"',
        'Concours : "Gagnez une estimation patrimoniale offerte". Tirage au sort.',
        'Visite virtuelle : mini-tour vidéo d\'un bien en portefeuille.',
      ],
    },
    {
      title: '❤️ POST PERSONNEL',
      desc: 'Objectif : humaniser ta marque. Montre l\'homme ou la femme derrière le conseiller. Les gens achètent chez des gens qu\'ils aiment et en qui ils ont confiance. Sois toi-même.',
      ideas: [
        'Coulisses : "7h du matin, je prépare ma tournée de terrain."',
        'Anecdote : "Aujourd\'hui, une porte m\'a ouvert avec un sourire..."',
        'Pourquoi ce métier ? "Je suis devenu conseiller immobilier parce que..."',
        'Photo de toi au terrain : "11h, rue [X], je toque aux portes".',
        'Un échec formatif : "Mon premier R1 n\'a pas donné de mandat. Voici ce que j\'ai appris."',
        'Story : Une journée avec toi en 5 stories.',
        'Live : 10 min pour répondre aux questions sur le marché.',
      ],
    },
  ];
  const pillarsEs = [
    {
      title: '🌟 NOTORIEDAD Y VISIBILIDAD',
      desc: 'Objetivo: darte a conocer ante un nuevo público. Cuando compartes quién eres y qué haces, creas oportunidades sin saberlo. Cada vista = una puerta potencial.',
      ideas: [
        'Preséntate: quién eres, qué sector cubres y por qué te gusta este trabajo.',
        'La cifra del mes: precio medio por m² en [sector]. Infografía Canva.',
        'El barrio: 3 datos que solo los locales conocen.',
        'FAQ: cuánto tarda en venderse un bien en [sector].',
      ],
    },
    {
      title: '💙 RECONOCIMIENTO Y GRATITUD',
      desc: 'Objetivo: agradecer a tu comunidad, un cliente o un colaborador. La gratitud atrae gratitud. Un cliente agradecido te recomienda a 3 personas.',
      ideas: [
        'Gracias público a un cliente o colaborador.',
        'Celebra un hito: seguidores, aniversario de agencia, primera venta.',
        'Destaca a un colaborador y agradécele.',
        'Comparte un testimonio de cliente.',
      ],
    },
    {
      title: '🎓 COMPARTIR VALOR',
      desc: 'Objetivo: educar y ayudar a tu audiencia. Posiciona tu experiencia. Cuando das valor gratis, la gente confía en ti para lo que viene después.',
      ideas: [
        'Truco deco: 3 consejos para valorizar su bien antes de una venta.',
        'Tutorial: 5 errores que evitar al vender tu bien.',
        'Caso de estudio: cómo vendí este bien en 15 días en [sector].',
        'Infografía: las etapas de la venta inmobiliaria en 5 pasos.',
      ],
    },
    {
      title: '🎯 VENTA Y CAPTACIÓN',
      desc: 'Objetivo: convertir a tu audiencia. Llamada a la acción directa. Es el momento de proponer tus servicios y mostrar tus bienes y compradores.',
      ideas: [
        'Bien en exclusiva: "Nuevo bien en [sector] — DM para más info".',
        'Búsqueda comprador: tengo un comprador muy motivado en [sector].',
        'Estimación ofrecida: 3 citas disponibles este fin de semana.',
        'Concurso: gana una estimación patrimonial ofrecida.',
      ],
    },
    {
      title: '❤️ POST PERSONAL',
      desc: 'Objetivo: humanizar tu marca. Muestra a la persona detrás del asesor. La gente compra a gente que le gusta y en quien confía. Sé tú mismo.',
      ideas: [
        'Tras bastidores: 7 de la mañana, preparo mi ronda de terreno.',
        'Anécdota del día: una puerta me abrió con una sonrisa...',
        '¿Por qué este trabajo? Tu historia sincera.',
        'Foto tuyo en el terreno: 11h, calle [X], toco a puertas.',
      ],
    },
  ];
  const pillars = isEs ? pillarsEs : pillarsFr;
  const p = pillars[dayOfWeek];
  const cycle = Math.floor((day - 1) / 5);
  const idea = p.ideas[cycle % p.ideas.length];
  return `${p.title}

${p.desc}

💡 Idée du jour : ${idea}

📱 Format suggéré : ${dayOfWeek === 0 || dayOfWeek === 1 ? 'Vidéo courte, carrousel explicatif ou photo + texte' : dayOfWeek === 2 ? 'Article, infographie ou vidéo éducative' : dayOfWeek === 3 ? 'Visuel promotionnel avec CTA' : 'Photo spontanée, story ou vidéo face caméra'}

🎯 Rappel : 1 post par jour minimum. La constance bat la perfection.`;
}

export function DailyActions({
  currentDay,
  completedDays,
  profile,
  dailyResults,
  onCompleteDay,
  onUncompleteDay,
  onDayChange,
  onOpenCheckup,
  onNavigate,
  userEmail,
  onCreateContact,
  nextDayPlan,
}: DailyActionsProps) {
  const isAdmin = userEmail === 'melissa.montagne66@gmail.com';

  // Objectifs & liste d'actions du jour — source unique : src/lib/goals.ts (MOD-19).
  // La même liste (ids, conditions, ordre) sert à la vérification du bilan du soir.
  const goals = getGoals(profile, currentDay, dailyResults);
  const targets = goals.dailyTargets;

  // Dialog for prospection results
  const [showResultDialog, setShowResultDialog] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState('');
  const [panneauxCount, setPanneauxCount] = useState('');

  // Expandable tips state
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});

  // MOD-21 : micro-célébration (burst de confettis) à la coche d'une action
  const [checkCelebration, setCheckCelebration] = useState(false);

  // MOD-29 : carte douce de proposition des rappels push (jour ≥ 2)
  const [showPushPrompt, setShowPushPrompt] = useState(false);

  // Check if today's checkup was done
  const todayStr = toLocalDateKey(new Date());
  const todayCheckupDone = dailyResults.some(r => r.date === todayStr);

  // Heure locale rafraîchie chaque minute — la bannière « bilan en attente »
  // n'apparaît qu'à partir de 17 h (variante « série » après 21 h).
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);
  const currentHour = now.getHours();

  // Série de bilans consécutifs (en remontant depuis hier si celui du jour
  // n'est pas encore fait) — utilisée par la variante après 21 h.
  const bilanStreak = useMemo(() => {
    const dates = new Set(dailyResults.map(r => r.date));
    const d = new Date();
    if (!dates.has(toLocalDateKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (dates.has(toLocalDateKey(d))) {
      n++;
      d.setDate(d.getDate() - 1);
    }
    return n;
  }, [dailyResults]);

  // Compteurs d'objectifs du jour (partagés avec Dashboard et le bilan du soir)
  const { counters, increment } = useDailyCounters();
  // Notes de résultats par action (persistées)
  const { notes, setNote } = useActionNotes();

  // Build the list of daily actions
  const action = getProspectionActionForDay(currentDay, profile.expérienceLevel, profile.language);
  const catInfo = getProspectionCategoryInfo(action.category, profile.language);

  // Descriptions rotatives pour varier les explications jour après jour
  // La rotation se fait par semaine : semaine 1 = rot 0, semaine 2 = rot 1, semaine 3 = rot 2, puis recommence
  const rot = ((Math.ceil(currentDay / 7) - 1) % 3);

  const isEs = profile.language === 'es';

  const adminDesc = isEs ? [
    `Tu bloque admin diario:
→ Registrar tus búsquedas de compradores en el CRM
→ Hacer las búsquedas para tus clientes en curso
→ Llamar a tus colegas para bienes en inter-agencia
→ Hacer el seguimiento administrativo de tus ofertas o mandatos firmados
→ Reintentos notariales, actualizaciones de mandatos, emails urgentes`,
    `Bloques administrativos del día:
→ Actualiza tu CRM: nuevos contactos, reintentos, notas de seguimiento
→ Prepara tus dossieres para las citas de mañana
→ Llama a tus colegas para bienes en inter-agencia
→ Haz el seguimiento administrativo de tus mandatos firmados esta semana
→ Verifica tus emails urgentes y responde a los notarios`,
    `Admin diario — no descuides esta parte:
→ Reintenta tus contactos J+7 y J+15 desde el CRM
→ Registra tus kilómetros y notas de gastos del día
→ Haz las búsquedas de compradores para tus clientes activos
→ Prepara los documentos para tus próximos compromisos
→ Actualiza los estados de tus mandatos en línea`,
  ] : [
    `Ton bloc admin quotidien :
→ Enregistrer tes recherches acquéreurs dans le CRM
→ Faire les recherches pour tes clients en cours
→ Appeler tes confrères pour des biens en inter-cabinet
→ Faire le suivi administratif de tes offres ou mandats signés
→ Relances notariales, mises à jour des mandats, emails urgents`,
    `Blocs administratifs du jour :
→ Mets à jour ton CRM : nouveaux contacts, relances, notes de suivi
→ Prépare tes dossiers pour les RDV de demain
→ Appelle tes confrères pour des biens en inter-cabinet
→ Fais le suivi administratif de tes mandats signés cette semaine
→ Vérifie tes emails urgents et réponds aux notaires`,
    `Admin quotidien — ne néglige pas cette partie :
→ Relance tes contacts J+7 et J+15 depuis le CRM
→ Enregistre tes kilomètres et notes de frais du jour
→ Fais les recherches acquéreurs pour tes clients actifs
→ Prépare les documents pour tes prochains compromis
→ Mets à jour les statuts de tes mandats en ligne`,
  ];

  // R1 — Description courte + contenu détaillé pour l'accordéon
  const r1Desc = isEs
    ? `Cita de descubrimiento vendedor. Objetivo: comprender el proyecto, cualificar el bien, fijar el R2. NUNCA des el precio en el R1. Escucha 80%, habla 20%. Deja que el vendedor se confíe.`
    : `Rendez-vous de découverte vendeur. Objectif : comprendre le projet, qualifier le bien, fixer le R2. Ne donne JAMAIS le prix au R1. Écoute 80 %, parle 20 %. Laisse le vendeur se confier.`;
  const r1Tip = isEs
    ? `**Bueno saber para tu R1:**
→ Antes de llegar, prepárate: búsqueda de comparables, conocimiento del sector, preguntas abiertas listas
→ Durante el R1: escucha, anota, mide con tu metro láser
→ Tu misión: hacer las preguntas correctas y FIJAR el R2 antes de irte
→ Usa la regla de las 2 opciones: "¿Miércoles 18h o jueves 14h?" — nunca "¿Cuándo estáis disponibles?"
→ Al salir: toca 5 puertas alrededor con la pregunta mágica: "¿Quién conocéis en vuestro entorno que desee vender o simplemente tener una opinión precisa sobre el valor de su bien?"`
    : `**Bon à savoir pour ton R1 :**
→ Avant d'arriver, prépare-toi : recherche des comparables, connaissance du secteur, questions ouvertes prêtes
→ Pendant le R1 : écoute, note, mesure avec ton mètre laser
→ Ta mission : poser les bonnes questions et FIXER le R2 avant de partir
→ Utilise la règle des 2 options : "Mercredi 18h ou jeudi 14h ?" — jamais "Quand êtes-vous disponible ?"
→ En sortant : toque 5 portes autour avec la question magique : "Qui connaissez-vous dans votre entourage qui souhaite vendre ou simplement avoir un avis précis sur la valeur de son bien ?"`;

  // R2 — Description courte + contenu détaillé pour l'accordéon
  const r2Desc = isEs
    ? `Cita de firma de mandato. Es el momento de la verdad.`
    : `Rendez-vous de signature mandat. C'est le moment de vérité.`;
  const r2Tip = isEs
    ? `**Bueno saber para tu R2 — Orden de presentación:**
1. **Tus servicios** (acompañamiento, visibilidad, negociación) — PRESENTA Y VALIDA TUS SERVICIOS EN PRIMER LUGAR
2. **Cláusula de Confianza + Garantía 30 días** — demuestra tu diferencia
3. **Los 3 escenarios + predicción del mandato "preferido"** — guía al vendedor
4. **Presentación del avalúo** — deja que el propietario se posicione sobre la horquilla de precios coherente respecto a los bienes vendidos, en venta e invendidos
5. **Tratamiento de las preguntas / objeciones** — estate listo para responder
6. **Petición de los documentos de identidad** para rellenar todo el dossier

⚡ Después del precio: silencio completo. El primero que habla ha perdido.
⚡ Objetivo: firmar el mandato en exclusividad o mandato simple.`
    : `**Bon à savoir pour ton R2 — Ordre de présentation :**
1. **Tes services** (accompagnement, visibilité, négociation) — PRÉSENTE ET VALIDE TES SERVICES EN PREMIERS
2. **Clause de Confiance + Garantie 30 jours** — prouve ta différence
3. **Les 3 scénarios + prédécision du mandat "préféré"** — guide le vendeur
4. **Présentation de l'avis de valeur** — laisse le propriétaire se positionner sur la fourchette de prix cohérente par rapport aux biens vendus, en vente et invendus
5. **Traitement des questions / objections** — sois prêt à répondre
6. **Demande des pièces d'identité** pour remplir tout le dossier

⚡ Après le prix : silence complet. Le premier qui parle a perdu.
⚡ Objectif : signer le mandat en exclusivité ou mandat simple.`;

  // Retours — Description courte + contenu détaillé pour l'accordéon
  const retoursDesc = isEs
    ? `Después de cada visita, haz un mensaje de voz WhatsApp a tu vendedor y dobla con un email para guardar una huella escrita. Es el retorno en caliente el que marca la diferencia.`
    : `Après chaque visite, fais un message vocal WhatsApp à ton vendeur et double d'un email pour garder une trace écrite. C'est le retour à chaud qui fait la différence.`;
  const retoursTip = isEs
    ? `**Bueno saber para tus retornos:**
→ Envía el mensaje de voz WhatsApp en la hora siguiente a cada visita
→ En tu mensaje, menciona SIEMPRE un punto positivo incluso si el retorno es negativo
→ Anota los feedbacks de visita (precio, obras, emplazamiento) en la parte informe para tu cita de seguimiento
→ Incluso si es negativo, díselo con tacto — un vendedor informado = un vendedor que te confía
→ Usa el redactor de informes para generar el mensaje tipo en un clic
→ Si no tienes visita hoy, marca directamente`
    : `**Bon à savoir pour tes retours :**
→ Envoie le vocal WhatsApp dans l'heure qui suit chaque visite
→ Dans ton message, mentionne TOUJOURS un point positif même si le retour est négatif
→ Note les feedbacks de visite (prix, travaux, emplacement) dans la partie compte rendu pour ton RDV de suivi
→ Même si c'est négatif, dis-le avec tact — un vendeur informé = un vendeur qui te fait confiance
→ Utilise le rédacteur de compte rendu pour générer le message type en un clic
→ Si tu n'as pas de visite aujourd'hui, coche directement`;

  const apporteursDesc = isEs ? [
    `Cada día, registra al menos 2 nuevos colaboradores de negocios oficiales. Son particulares (amigos, vecinos, conocidos, antiguos clientes) pero también comerciantes y profesionales del sector (panadero, peluquero, florista, cocinero, chatarrero, farmacéutico...) que registras en recomendación.

Para cada llamada recibida sobre un panel, pregunta sistemáticamente: "¿En qué panel habéis visto mi número?" Luego registra esta recomendación a tu colaborador para que sea remunerado en cuanto se haga la venta. Cuántos más colaboradores tengas, más gira tu negocio sin esfuerzo.`,
    `Tu red de colaboradores es tu activo número 1. Hoy, encuentra 2 nuevos colaboradores: un particular (vecino, amigo, antiguo cliente) y un profesional (comerciante, artesano). Regístralos en recomendación oficial.

No olvides: a cada llamada entrante, pregunta "¿En qué panel habéis visto mi número?" para trackear las recomendaciones y remunerar a tus colaboradores.`,
    `Construye tu imperio de colaboradores hoy. Objetivo: 2 nuevos contactos registrados en tu CRM como colaboradores de negocios. Piensa también en los colaboradores inactivos: reinténtalos, verifica que sus paneles sean bien visibles.

Recuerda: cada llamada entrante = pregunta sistemática sobre el panel de origen. Es así como tus colaboradores son remunerados a cada venta.`,
  ] : [
    `Chaque jour, enregistre au moins 2 nouveaux apporteurs d'affaires officiels. Ce sont des particuliers (amis, voisins, connaissances, anciens clients) mais aussi des commerçants et professionnels du secteur (boulanger, coiffeur, fleuriste, cuisiniste, brocanteur, pharmacien...) que tu enregistres en recommandation.

Pour chaque appel reçu sur un panneau, demande systématiquement : "Sur quel panneau avez-vous eu mon numéro ?" Puis enregistre cette recommandation à ton apporteur d'affaires pour qu'il soit rémunéré dès que la vente se fait. Plus tu as d'apporteurs, plus ton business tourne sans effort.`,
    `Ton réseau d'apporteurs est ton actif numéro 1. Aujourd'hui, trouve 2 nouveaux apporteurs : un particulier (voisin, ami, ancien client) et un professionnel (commerçant, artisan). Enregistre-les en recommandation officielle.

N'oublie pas : à chaque appel entrant, demande "Sur quel panneau avez-vous eu mon numéro ?" pour tracker les recommandations et rémunérer tes apporteurs.`,
    `Construis ton empire d'apporteurs aujourd'hui. Objectif : 2 nouveaux contacts enregistrés dans ton CRM en tant qu'apporteurs d'affaires. Pense aussi aux apporteurs inactifs : relance-les, vérifie que leurs panneaux sont bien visibles.

Rappelle-toi : chaque appel entrant = question systématique sur le panneau d'origine. C'est comme ça que tes apporteurs sont rémunérés à chaque vente.`,
  ];

  // Textes longs rattachés à chaque action du plan partagé (src/lib/goals.ts)
  const dailyTasks: any[] = goals.dailyActions
    .filter(def => def.type !== 'crm') // la carte CRM est rendue séparément plus bas
    .map(def => {
      switch (def.type) {
        case 'prospection':
          return {
            ...def,
            // Un seul « défi du jour » : si l'action de prospection s'intitule
            // « Ton défi du jour » (J1), on l'affiche « Action recommandée » (MOD-19)
            title: /défi du jour/i.test(action.title)
              ? action.title.replace(/^(Ton )?défi du jour/i, isEs ? 'Acción recomendada' : 'Action recommandée')
              : action.title,
            description: action.description,
            script: action.script,
            objectif: action.objectif,
            duree: action.duree,
            catColor: catInfo.color,
            catLabel: catInfo.label,
            catIcon: catInfo.icon,
          };
        case 'admin':
          return {
            ...def,
            title: isEs ? 'Tareas administrativas' : 'Tâches administratives',
            description: adminDesc[rot],
          };
        case 'r1':
          return {
            ...def,
            title: isEs ? `Hacer ${plural(targets.rdvR1, 'R1')}` : `Effectuer ${plural(targets.rdvR1, 'R1')}`,
            description: r1Desc,
            tipContent: r1Tip,
          };
        case 'r2':
          return {
            ...def,
            title: isEs ? `Hacer ${plural(targets.rdvR2, 'R2')}` : `Effectuer ${plural(targets.rdvR2, 'R2')}`,
            description: r2Desc,
            tipContent: r2Tip,
          };
        case 'retours':
          return {
            ...def,
            title: isEs ? 'Hacer los retornos de visitas' : 'Faire les retours de visites',
            description: retoursDesc,
            tipContent: retoursTip,
          };
        case 'défi':
          // MOD-23 — Une seule carte défi dans l'app : celle du tableau de bord
          // (pool de 12 défis, src/data/defis.ts). Ici, simple renvoi sobre.
          return {
            ...def,
            title: isEs ? '🏆 Reto del día' : '🏆 Défi du jour',
            description: isEs
              ? 'Tu reto del día te espera en el panel de control.'
              : 'Ton défi du jour t\'attend sur le tableau de bord.',
          };
        case 'apporteurs':
          return {
            ...def,
            title: isEs ? 'Registrar 2 nuevos colaboradores de negocios' : 'Enregistrer 2 nouveaux apporteurs d\'affaires',
            description: apporteursDesc[rot],
          };
        case 'plateformes':
          return {
            ...def,
            title: isEs ? 'Contactar los nuevos bienes en las plataformas inmo' : 'Contacter les nouveaux biens sur les plateformes immo',
            description: isEs
              ? 'Tómate 15 a 30 min para escanear Idealista, Fotocasa, Milanuncios y las otras plataformas — ya sea cada mañana durante tu café o cada noche al cerrar la jornada. Cuando veas un nuevo bien en tu sector, envía un mensaje al propietario.\n\nTu estrategia: crea un mensaje tipo que personalices para cada bien. Habla de tu búsqueda comprador — muestra que tienes un VERDADERO comprador serio para quien este bien podría encajar. Un mensaje humano, no comercial.\n\nEjemplo: "Hola, soy asesor inmobiliario en [sector]. Trabajo actualmente con un comprador muy motivado que busca exactamente este tipo de bien. ¿Estaríais abiertos a un intercambio para ver si vuestro bien corresponde a su búsqueda? También puedo aportaros una estimación ofrecida del valor de vuestro patrimonio."\n\nCada mensaje = un potencial mandato.'
              : 'Prends 15 à 30 min pour scanner Leboncoin, PAP, SeLoger et les autres plateformes — soit chaque matin lors de ton café, soit chaque soir en clôturant la journée. Quand tu vois un nouveau bien sur ton secteur, envoie un message au propriétaire.\n\nTa stratégie : crée un message type que tu personnalises pour chaque bien. Parle de ta recherche acquéreur — montre que tu as un VÉRITABLE acheteur sérieux pour qui ce bien pourrait matcher. Un message humain, pas commercial.\n\nExemple : "Bonjour, je suis conseiller immobilier sur [secteur]. Je travaille actuellement avec un acquéreur très motivé qui cherche exactement ce type de bien. Seriez-vous ouvert à un échange pour voir si votre bien correspond à sa recherche ? Je peux aussi vous apporter une estimation offerte de la valeur de votre patrimoine."\n\nChaque message = un potentiel mandat.',
          };
        case 'primo':
          return {
            ...def,
            title: profile.expérienceLevel === 'confirmé'
              ? (isEs ? 'Reintentar tus antiguos clientes vendedores y compradores' : 'Relancer tes anciens clients vendeurs et acheteurs')
              : (isEs ? 'Llamar a tu lista primo — Anuncia tu nuevo trabajo' : 'Appeler ta primo liste — Annonce ton nouveau métier'),
            description: profile.expérienceLevel === 'confirmé'
              ? (isEs
                ? 'Como agente confirmado, tu lista primo son tus ANTIGUOS CLIENTES — vendedores y compradores. Llámales hoy: "Hola, soy [Tu nombre], pasaba para tener noticias tuyas. ¿Tu instalación va bien?" Escucha, luego pregunta: "A propósito, he cambiado de agencia / de red — ¿conoces a alguien alrededor de ti que esté pensando en vender o buscar un bien o que simplemente quiera conocer el valor de su patrimonio?" Cada antiguo cliente satisfecho = 2 a 3 recomendaciones naturales.'
                : 'En tant qu\'agent confirmé, ta primo liste c\'est tes ANCIENS CLIENTS — vendeurs et acheteurs. Appelle-les aujourd\'hui : "Bonjour, c\'est [Ton prénom], je repassais vers vous pour prendre de vos nouvelles. Votre installation se passe bien ?" Écoute, puis demande : "Au fait, j\'ai changé d\'agence / de réseau — qui est-ce que tu connais autour de toi qui envisage de vendre ou de chercher un bien ou qui souhaite simplement connaître la valeur de son patrimoine ?" Chaque ancien client satisfait = 2 à 3 recommandations naturelles.')
              : (isEs
                ? '¿Empiezas? Tu fuerza es tu lista primo — tus cercanos, amigos, colegas, antiguos clientes de tu trabajo anterior. Hoy, llama a 5. Tu script: "Tengo una buena noticia, ¿puedes hacerme un favor?" — una vez que dicen "sí": "Me he formado en inmobiliaria y me lanzo en el sector, acompañado y formado. ¿Sabes quién alrededor de ti podría necesitar o querer conocer el valor de su bien inmobiliario? Es la base de mi profesión — bien informar a los propietarios sobre el valor de su patrimonio. Lo piden regularmente el notario, los seguros, o simplemente para saber lo que tenemos en las manos para avanzar en nuestros proyectos futuros."'
                : 'Tu débutes ? Ta force, c\'est ta primo liste — tes proches, amis, collègues, anciens clients de ton précédent métier. Aujourd\'hui, appelle-en 5. Ton script : "J\'ai une bonne nouvelle, est-ce que tu peux me rendre un service ?" — une fois qu\'ils disent "oui" : "Je me suis formé à l\'immobilier et je me lance dans le domaine, accompagné et formé. Tu sais qui autour de toi pourrait avoir besoin ou envie de connaître la valeur de son bien immobilier ? C\'est la base de mon métier — bien renseigner les propriétaires sur la valeur de leur patrimoine. C\'est régulièrement demandé par le notaire, les assurances, ou simplement pour savoir ce qu\'on a dans les mains pour avancer dans nos projets futurs."'),
          };
        case 'mandat-proactif':
          return {
            ...def,
            title: isEs ? '🚀 Acciones proactivas sobre tu nuevo mandato' : '🚀 Actions proactives sur ton nouveau mandat',
            description: isEs
              ? 'Has firmado un mandato recientemente — ¡bravo! Ahora, hay que actuar RÁPIDAMENTE para dar la máxima visibilidad a este bien.\n\n**Acciones a hacer hoy mismo:**\n→ Fotos profesionales en 72h (calidad = visitas)\n→ Puesta en línea en todos los portales inmobiliarios\n→ Post en tus redes sociales (Facebook, Instagram, LinkedIn)\n→ Recogida de todos los documentos para un dossier completo (diagnósticos, título de propiedad, copia de los planos, último IBI, reglamento de propiedad horizontal si es piso)\n→ Previene a tus colaboradores de negocios que hay un nuevo bien disponible\n→ Envía el bien a tu base de compradores registrados\n→ Programa la cita de seguimiento vendedor en 2 semanas\n\nCada día de retraso = un día de venta en menos.'
              : 'Tu as signé un mandat récemment — bravo ! Maintenant, il faut agir RAPIDEMENT pour donner le maximum de visibilité à ce bien.\n\n**Actions à faire dès aujourd\'hui :**\n→ Photos professionnelles sous 72h (qualité = visites)\n→ Mise en ligne sur tous les portails immobiliers\n→ Post sur tes réseaux sociaux (Facebook, Instagram, LinkedIn)\n→ Collecte de tous les documents pour un dossier complet (diagnostics, titre de propriété, copie des plans, dernier taxe foncière, règlement de copropriété si appartement)\n→ Préviens tes apporteurs d\'affaires qu\'un nouveau bien est disponible\n→ Envoie le bien à ta base d\'acquéreurs enregistrés\n→ Programme le RDV de suivi vendeur dans 2 semaines\n\nChaque jour de retard = un jour de vente en moins.',
          };
        case 'inter-cabinets':
          return {
            ...def,
            title: isEs ? '🔄 Inter-agencias — Desbloquear tus bienes invendidos' : '🔄 Inter-cabinets — Débloquer tes biens invendus',
            description: isEs
              ? 'Hoy: solicita las inter-agencias para ir a buscar visitas sobre los bienes en los que no logras bajar el precio.\n\n**Tu método:**\n1. Haz tu búsqueda en los sitios de anuncios con los mismos criterios objetivos que tu bien\n2. Amplía tu búsqueda a 5km\n3. Encuentra los bienes por debajo del precio del tuyo\n4. Envía un mensaje a los colegas: "Hola, tengo un bien similar al vuestro en [sector]. Tengo compradores serios que han visitado vuestro bien o uno similar. El propietario está abierto a ofertas razonables pero no quiere bajar el precio público. ¿Estaríais abiertos a un inter-agencia? 50/50 si venta."\n5. Espera que los colegas te devuelvan la llamada\n6. Programa las visitas\n\nLa inter-agencia desbloquea las situaciones bloqueadas y te ayuda a trabajar el precio.'
              : 'Aujourd\'hui : sollicite les inter-cabinets pour aller chercher des visites sur les biens sur lesquels tu n\'arrives pas à baisser le prix.\n\n**Ta méthode :**\n1. Fais ta recherche sur les sites d\'annonces avec les mêmes critères objectifs que ton bien\n2. Élargis ta recherche à 5km\n3. Trouve les biens en dessous du prix de ton bien\n4. Envoie un message aux confrères : "Bonjour, j\'ai un bien similaire au vôtre sur [secteur]. J\'ai des acquéreurs sérieux qui ont visité votre bien ou un similaire. Le propriétaire est ouvert aux offres raisonnables mais ne veut pas baisser le prix public. Seriez-vous ouvert à un inter-cabinet ? 50/50 si vente."\n5. Attends que les confrères te rappellent\n6. Programme les visites\n\nL\'inter-cabinet débloque les situations bloquées et t\'aide à travailler le prix.',
          };
        case 'gmb':
          return {
            ...def,
            title: isEs ? '🌐 Google My Business — Sé el referente de tu sector' : '🌐 Google My Business — Sois LE référent de ton secteur',
            description: isEs
              ? '¡Pon en marcha tu ficha Google My Business hoy! Es TU vitrina digital : cuando alguien busca "agente inmobiliario [tu ciudad]", debes aparecer en primer lugar.\n\n**Acciones de hoy:**\n→ Crea o completa tu ficha Google My Business\n→ Añade fotos profesionales de ti y de tu sector\n→ Redacta una descripción clara con tus palabras clave\n→ Pide 3 reseñas a tus primeros contactos (familia, amigos, antiguos clientes)\n\n💡 **Argumento motivador:** Cada euro que inviertes en tu GMB te ahorra cientos en publicidad pagada. Un buen GMB = 3-5 llamadas calientes por semana sin gastar un céntimo. Tu competencia duerme sur ce canal — aprovecha. Si necesitas ayuda, mira el vídeo de formación del tema.'
              : 'Mets en route ta fiche Google My Business aujourd\'hui ! C\'est TA vitrine digitale : quand quelqu\'un cherche "conseiller immobilier [ta ville]", tu dois apparaître en premier.\n\n**Actions du jour :**\n→ Crée ou complète ta fiche Google My Business\n→ Ajoute des photos professionnelles de toi et de ton secteur\n→ Rédige une description claire avec tes mots-clés\n→ Demande 3 avis à tes premiers contacts (famille, amis, anciens clients)\n\n💡 **Argument motivant :** Chaque euro que tu investis dans ton GMB t\'économise des centaines en pub payante. Un bon GMB = 3-5 appels chauds par semaine sans dépenser un centime. Ta concurrence dort sur ce canal — profites-en. Si tu as besoin d\'aide, revois la vidéo de formation sur le sujet.',
          };
        case 'social':
          return {
            ...def,
            title: isEs ? '📱 Contenido redes sociales — Idea del día' : '📱 Réseaux sociaux — Idée du jour',
            description: getSocialContent(currentDay, isEs),
          };
        default:
          return def;
      }
    })
    // catIcon par défaut = icône du plan (la prospection fournit la sienne via catInfo)
    .map(task => ({ catIcon: task.icon, ...task }));

  // Build task list: all daily tasks
  const allTasks: typeof dailyTasks = [...dailyTasks];

  const crmId = 'daily-crm-update';

  const completedCount = goals.dailyActions.filter(t => completedDays.includes(t.id)).length;
  const totalCount = goals.dailyActions.length; // CRM inclus (dernière action du jour)
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Métadonnées d'affichage des compteurs rapides sur les cartes action — depuis goals.ts
  const counterMeta = Object.fromEntries(
    goals.dailyGoals.map(g => [g.key, { label: g.label, target: g.target }])
  ) as Record<CounterKey, { label: string; target: number }>;

  const handleToggle = (taskId: string, isDone: boolean) => {
    // Cochage direct en 1 tap — la modale de résultat reste disponible
    // via le bouton « ✏️ Noter un résultat » mais n'est plus obligatoire.
    if (isDone) {
      onUncompleteDay(taskId);
    } else {
      onCompleteDay(taskId);
      // MOD-21 : micro-célébration à la coche (confettis discrets + toast de progression)
      const total = goals.dailyActions.length;
      const done = goals.dailyActions.filter(t => completedDays.includes(t.id)).length + 1; // +1 : celle-ci
      const remaining = total - done;
      setCheckCelebration(true);
      const encouragements = [
        remaining > 0
          ? `✅ ${done}/${total} — encore ${plural(remaining, 'action')} pour une journée parfaite !`
          : `✅ ${done}/${total} — journée parfaite ! 🌟`,
        `Bien joué ${profile.firstName}, tu avances.`,
      ];
      toast.success(encouragements[Math.floor(Math.random() * encouragements.length)], { duration: 3000 });
      // MOD-29 : proposition douce des rappels push au moment de satisfaction
      // (jour ≥ 2, jamais au 1er lancement, une seule carte non bloquante).
      if (shouldPromptForPush(userEmail ?? '', currentDay)) {
        setShowPushPrompt(true);
      }
    }
  };

  const handleActivatePush = async () => {
    setShowPushPrompt(false);
    const ok = await subscribeToPush(userEmail ?? '');
    if (ok) {
      toast.success('🔔 Rappels activés ! On te préviendra à 18 h si ton bilan n\'est pas fait.');
    } else if (!isPushDenied()) {
      toast.info('Pas de souci — tu peux activer les rappels plus tard depuis les réglages.');
    }
  };

  const handleSnoozePush = () => {
    snoozePushPrompt(userEmail ?? '');
    setShowPushPrompt(false);
  };

  const openResultDialog = (taskId: string) => {
    setPendingActionId(taskId);
    setActionResult(notes[taskId] ?? '');
    setShowResultDialog(true);
  };

  const confirmResult = () => {
    if (!actionResult.trim()) return;
    if (pendingActionId) {
      if (!completedDays.includes(pendingActionId)) onCompleteDay(pendingActionId);
      setNote(pendingActionId, actionResult);
    }
    setShowResultDialog(false);
    setPendingActionId(null);
    setActionResult('');
    setPanneauxCount('');
  };

  const toggleTip = (taskId: string) => {
    setExpandedTips(prev => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  return (
    <div className="space-y-5">
      {/* MOD-29 : proposition douce des rappels push — carte non bloquante,
          affichée après une action cochée (jour ≥ 2), jamais au 1er lancement */}
      {showPushPrompt && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4 flex items-start gap-3">
            <Bell className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-800">
                {isEs ? '🔔 ¿Un recordatorio a las 18 h para no olvidar tu balance?' : '🔔 Un rappel à 18 h pour ne jamais oublier ton bilan ?'}
              </p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={handleActivatePush} className="bg-blue-600 hover:bg-blue-700 text-xs">
                  {isEs ? 'Activar los recordatorios' : 'Activer les rappels'}
                </Button>
                <Button size="sm" variant="outline" onClick={handleSnoozePush} className="text-xs">
                  {isEs ? 'Más tarde' : 'Plus tard'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bannière bilan en attente — uniquement à partir de 17 h, ton orange discret */}
      {!todayCheckupDone && currentHour >= 17 && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                {currentHour >= 21 ? (
                  <p className="text-sm font-semibold text-orange-800">
                    {isEs
                      ? `¡Última recta para mantener tu racha de ${plural(bilanStreak, 'día')}!`
                      : `Dernière ligne droite pour garder ta série de ${plural(bilanStreak, 'jour')} !`}
                  </p>
                ) : (
                  <>
                    <p className="text-sm font-semibold text-orange-800">
                      {isEs ? 'Tu balance del día te espera — 3 minutos para cerrar tu jornada' : "Ton bilan du jour t'attend — 3 minutes pour clôturer ta journée"}
                    </p>
                    <p className="text-xs text-orange-600 mt-1">
                      {isEs ? 'Anota tus resultados y mantén tu racha 🔥' : 'Note tes résultats et garde ta série 🔥'}
                    </p>
                    {/* MOD-22.5 : compte à rebours jusqu'à minuit pour garder la série */}
                    <p className="text-xs text-orange-500 mt-1">
                      {isEs
                        ? `Quedan ${23 - currentHour} h para mantener tu racha`
                        : `Plus que ${plural(23 - currentHour, 'heure')} pour garder ta série`}
                    </p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA Bilan */}
      <div className="flex gap-3">
        <Button onClick={onOpenCheckup} className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-3 h-auto text-sm font-semibold">
          <ClipboardCheck className="w-4 h-4" />
          {isEs ? 'Balance de mi día' : 'Bilan de ma journée'}
        </Button>
      </div>

      {/* Header — jour seulement, pas de titres descriptifs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => onDayChange(Math.max(1, currentDay - 1))} className="p-2 rounded-lg hover:bg-gray-100 transition-colors" disabled={currentDay <= 1}>
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{isEs ? 'Día' : 'Jour'} {currentDay}</h2>
          </div>
          <button
            onClick={() => {
              if (isAdmin || todayCheckupDone) {
                onDayChange(currentDay + 1);
              } else {
                onOpenCheckup();
              }
            }}
            className={`p-2 rounded-lg transition-colors ${isAdmin || todayCheckupDone ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}`}
            title={isAdmin || todayCheckupDone ? (isEs ? 'Día siguiente' : 'Jour suivant') : (isEs ? 'Haz primero tu balance para avanzar' : 'Fais d\'abord ton bilan pour avancer')}
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-900">{progressPct}% {isEs ? 'completado' : 'complété'}</p>
          <p className="text-xs text-gray-500">{completedCount} / {totalCount} {isEs ? 'acciones' : 'actions'}</p>
        </div>
      </div>

      {/* Action du jour — message du coach */}
      <DailyMorningAction currentDay={currentDay} profile={profile} dailyTargets={targets} dailyResults={dailyResults} />

      {/* Liste des actions du jour */}
      <div className="space-y-3">
        {/* MOD-35 : tâches reportées de la veille — EN TÊTE de liste, badge « Reporté d'hier » */}
        {nextDayPlan && nextDayPlan.actions.length > 0 && (
          <Card className="border-2 border-orange-200 bg-orange-50/50">
            <CardContent className="p-4">
              <p className="text-sm font-semibold text-orange-800 mb-2">
                {isEs ? '📋 Aplazado de ayer — en prioridad hoy' : '📋 Reporté d\'hier — en priorité aujourd\'hui'}
              </p>
              <div className="space-y-2">
                {nextDayPlan.actions.map((task, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ClipboardCheck className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-700 flex-1">{task.replace(/^\[Reporté\]\s*/, '')}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-orange-100 text-orange-700 border border-orange-200 flex-shrink-0">
                      {isEs ? 'Aplazado de ayer' : 'Reporté d\'hier'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        {allTasks.map(task => {
          const isDone = completedDays.includes(task.id);
          const isExpanded = expandedTips[task.id];
          const note = notes[task.id] as string | undefined;
          return (
            <Card key={task.id} className={`border-2 ${isDone ? 'bg-green-50/50 border-green-200' : 'border-gray-200'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleToggle(task.id, isDone)}
                    className="mt-0.5 flex-shrink-0"
                  >
                    {isDone
                      ? <CheckCircle2 className="w-6 h-6 text-green-500" />
                      : <Circle className="w-6 h-6 text-gray-300 hover:text-gray-400" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${task.catColor}`}>
                        {task.catIcon} {task.catLabel}
                      </span>
                    </div>
                    <p className={`text-sm font-semibold ${isDone ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </p>
                    {/* Note de résultat persistée — éditable au tap */}
                    {isDone && note && (
                      <button
                        onClick={() => openResultDialog(task.id)}
                        className="mt-1 flex items-center gap-1 text-xs text-green-700 hover:text-green-800 text-left"
                      >
                        <Pencil className="w-3 h-3 flex-shrink-0" />
                        ✓ {isEs ? 'Hecho' : 'Fait'} — {note.length > 80 ? `${note.slice(0, 80)}…` : note}
                      </button>
                    )}
                    {/* Création rapide d'une fiche contact à partir de la note */}
                    {isDone && note && onCreateContact && (
                      <button
                        onClick={() => onCreateContact(note)}
                        className="mt-2 px-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        ➕ Créer la fiche contact
                      </button>
                    )}
                    <p className="text-xs text-gray-600 mt-1 leading-relaxed"><MarkdownText text={task.description} /></p>
                    {task.script && (
                      <div className="mt-2 bg-white/60 rounded-lg p-2.5 border border-gray-200">
                        <p className="text-xs text-gray-500 italic"><MarkdownText text={task.script} /></p>
                      </div>
                    )}
                    {task.objectif && (
                      <p className="text-xs font-medium text-gray-500 mt-2">{task.objectif}</p>
                    )}
                    {/* Bon à savoir — expandable tip for R1, R2, Retours */}
                    {task.hasTip && (
                      <div className="mt-2">
                        <button
                          onClick={() => toggleTip(task.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800 transition-colors"
                        >
                          <Lightbulb className="w-3.5 h-3.5" />
                          {task.tipTitle}
                          {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        </button>
                        {isExpanded && (
                          <div className="mt-2 bg-amber-50 rounded-lg p-3 border border-amber-200 text-xs text-amber-800 leading-relaxed">
                            <MarkdownText text={task.tipContent || task.description} />
                          </div>
                        )}
                      </div>
                    )}
                    {/* CTA vers compte rendus de visites pour la tâche retours */}
                    {task.type === 'retours' && onNavigate && (
                      <button
                        onClick={() => onNavigate('report')}
                        className="mt-2 flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        {isEs ? 'Redactar los informes de visitas' : 'Rédiger les compte rendus de visites'}
                      </button>
                    )}
                    {task.askResult && !note && (
                      <button
                        onClick={() => openResultDialog(task.id)}
                        className="mt-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        {isEs ? '✏️ Anotar un resultado' : '✏️ Noter un résultat'}
                      </button>
                    )}
                    {/* Compteurs rapides (tap = +1) — partagés avec le Dashboard et le bilan */}
                    {task.counterKeys && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {(task.counterKeys as CounterKey[]).map(k => (
                          <div key={k} className="flex items-center gap-1.5 bg-white/80 border border-gray-200 rounded-full px-2 py-1">
                            <span className="text-xs text-gray-500">{counterMeta[k].label}</span>
                            <button
                              onClick={() => increment(k, -1)}
                              disabled={counters[k] <= 0}
                              aria-label={isEs ? `Quitar 1 ${counterMeta[k].label}` : `Retirer 1 ${counterMeta[k].label}`}
                              className="w-5 h-5 rounded-full border border-gray-300 text-gray-500 flex items-center justify-center hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className={`text-xs font-bold min-w-[2.5rem] text-center ${counters[k] >= counterMeta[k].target ? 'text-green-600' : 'text-gray-900'}`}>
                              {counters[k]}/{counterMeta[k].target}
                            </span>
                            <button
                              onClick={() => increment(k, 1)}
                              aria-label={isEs ? `Añadir 1 ${counterMeta[k].label}` : `Ajouter 1 ${counterMeta[k].label}`}
                              className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* CRM — DERNIERE ACTION */}
      <Card className={`border-2 border-teal-200 ${completedDays.includes(crmId) ? 'bg-green-50/50 border-green-200' : 'bg-teal-50'}`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-teal-600">{isEs ? 'Última acción del día' : 'Dernière action de la journée'}</span>
          </div>
          <div className="flex items-start gap-3">
            <button
              onClick={() => {
                if (completedDays.includes(crmId)) {
                  onUncompleteDay(crmId);
                } else {
                  onCompleteDay(crmId);
                }
              }}
              className="mt-0.5 flex-shrink-0"
            >
              {completedDays.includes(crmId)
                ? <CheckCircle2 className="w-6 h-6 text-green-500" />
                : <Circle className="w-6 h-6 text-teal-400 hover:text-teal-600" />
              }
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Database className="w-4 h-4 text-teal-600" />
                <p className={`text-sm font-semibold ${completedDays.includes(crmId) ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                  {isEs ? 'Actualizar el CRM' : 'Mettre à jour le CRM'}
                </p>
              </div>
              <p className="text-xs text-teal-700">
                {isEs ? 'Anota todos tus contactos del día: nombres, direcciones, números, notas de seguimiento. Reintenta tus contactos de los días anteriores. ¡El dinero está en el archivo!' : "Note tous tes contacts du jour : noms, adresses, numéros, notes de suivi. Relance tes contacts des jours précédents. L'argent est dans le fichier !"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Résultat Dialog (pour prospection seulement) */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" /> {isEs ? '¿Qué resultado has obtenido?' : 'Quel résultat as-tu obtenu ?'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Action : <strong>{allTasks.find(a => a.id === pendingActionId)?.title}</strong>
            </p>
            <Input
              value={actionResult}
              onChange={e => setActionResult(e.target.value)}
              placeholder={isEs ? "Ej: 5 puertas tocadas, 2 citas de estimación..." : "Ex: 5 portes toquées, 2 RDV d'estimation..."}
            />
            {/* Question panneaux pour les jours d'apporteurs */}
            {action?.category === 'apporteurs' && (
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <Label className="text-xs font-semibold text-amber-800">🎯 {isEs ? 'Número de paneles colocados hoy' : 'Nombre de panneaux posés aujourd\'hui'}</Label>
                <Input
                  type="number"
                  min={0}
                  value={panneauxCount}
                  onChange={e => setPanneauxCount(e.target.value)}
                  placeholder="Ex: 3"
                  className="mt-1"
                />
              </div>
            )}
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-blue-700">
                💡 <strong>{isEs ? 'Consejo' : 'Conseil'} :</strong> {isEs ? 'Anotar tus resultados te permite seguir tu progresión y mejorar cada día.' : 'Noter tes résultats te permet de suivre ta progression et de t\'améliorer chaque jour.'}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => { setShowResultDialog(false); setPendingActionId(null); }}
                className="flex-1"
              >
                {isEs ? 'Cancelar' : 'Annuler'}
              </Button>
              <Button
                onClick={confirmResult}
                disabled={!actionResult.trim() || (action?.category === 'apporteurs' && !panneauxCount.trim())}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                {isEs ? 'Validar' : 'Valider'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* MOD-21 : burst de confettis à la coche d'une action */}
      <Celebration
        show={checkCelebration}
        variant="burst"
        particleCount={18}
        autoCloseMs={1800}
        message=""
        onClose={() => setCheckCelebration(false)}
      />
    </div>
  );
}
