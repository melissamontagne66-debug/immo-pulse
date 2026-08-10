// Système de traduction Immo Pulse — FR / ES
// Tous les textes affichés à l'utilisateur passent par ce fichier

export type Lang = 'fr' | 'es';

export const translations = {
  fr: {
    // Login
    loginTitle: 'Immo Pulse',
    loginSubtitle: 'Ton coach immobilier au quotidien',
    loginEmail: 'Email',
    loginPassword: 'Mot de passe',
    loginButton: 'Se connecter',
    loginCreateAccount: 'Créer un compte',
    loginFirstName: 'Prénom',
    loginLastName: 'Nom',
    loginConfirmPassword: 'Confirmer le mot de passe',
    loginExperience: 'Niveau d\'expérience',
    loginBeginner: 'Débutant',
    loginCreateButton: 'Créer mon compte',
    loginBack: 'Retour',

    // Onboarding
    onboardingWelcome: 'Bienvenue !',
    onboardingIdentity: 'Qui es-tu ?',
    onboardingExpérience: 'Ton parcours',
    onboardingSector: 'Ton secteur',
    onboardingGoals: 'Tes objectifs',
    onboardingConfirm: 'Confirmation',
    onboardingFirstName: 'Prénom',
    onboardingLastName: 'Nom',
    onboardingCity: 'Ville',
    onboardingPhone: 'Téléphone',
    onboardingNext: 'Suivant',
    onboardingBack: 'Retour',
    onboardingFinish: 'C\'est parti !',

    // Langue
    languageQuestion: 'Quelle langue souhaites-tu utiliser ?',
    languageFr: 'Français',
    languageEs: 'Español',
    languageSelector: 'Langue',

    // Dashboard
    dashboardTitle: 'Tableau de bord',
    dashboardWelcome: 'Bon retour',
    dashboardDay: 'Jour',
    dashboardStreak: 'Série',
    dashboardCompletion: 'Complété',
    dashboardTodayAction: 'Action du jour',
    dashboardSeeAll: 'Voir tout',
    dashboardNoData: 'Pas encore de données',
    dashboardAddVisit: 'Ajouter une visite',
    dashboardWriteReport: 'Rédiger un compte rendu',
    dashboardCalculator: 'Simulateur de commissions',
    dashboardChat: 'Coach immo IA',
    dashboardHistory: 'Historique',
    dashboardSettings: 'Paramètres',
    dashboardLogout: 'Déconnexion',

    // Tabs
    tabDashboard: 'Objectifs',
    tabToday: 'Aujourd\'hui',
    tabVisits: 'Visites',
    tabCommission: 'Commission',
    tabChat: 'Coach IA',
    tabSettings: 'Paramètres',

    // Prospection créneaux
    prospectionTerrainSlot: 'Prospection terrain (porte à porte) : 11h-13h ou 17h-19h',
    prospectionPIGESlot: 'PIGE Légale (envoi de messages) : 7h-8h30',
    prospectionDailyBlock: '2h de prospection quotidiennes (lundi-vendredi) : terrain + PIGE + réseaux sociaux',
    prospectionAgendaReminder: '🗓 Bloque 2h de prospection dans ton agenda chaque jour (lundi-vendredi) : terrain porte-à-porte (11h-13h ou 17h-19h) + PIGE Légale (7h-8h30, 30 min) + réseaux sociaux. Chaque jour ouvré, au créneau de ton choix (11 h – 13 h 30 ou 17 h – 19 h).',

    // Daily actions
    dailyAdminTitle: 'Tâches administratives',
    dailyR1Title: 'R1 — Rendez-vous de découverte',
    dailyR2Title: 'R2 — Rendez-vous de signature',
    dailyReturnsTitle: 'Retours de visites',
    dailyDéfiTitle: 'Défi du jour',
    dailyApporteursTitle: 'Apporteurs d\'affaires',
    dailyPlateformesTitle: 'Plateformes immobilières',
    dailyCRMTitle: 'Mettre à jour le CRM',
    dailyPrimoTitle: 'Primo liste',
    dailyMandatTitle: 'Actions proactives mandat',
    dailyInterCabinetsTitle: 'Inter-cabinets',
    dailyCheckupTitle: 'Bilan de ma journée',

    // Tips
    tipR1Title: 'Bon à savoir pour ton R1',
    tipR2Title: 'Bon à savoir pour ton R2',
    tipReturnsTitle: 'Bon à savoir pour tes retours',

    // Commission
    commissionTitle: 'Simulateur de commissions',
    commissionSalePrice: 'Prix de vente',
    commissionPct: 'Taux de commission',
    commissionHonoraires: 'Honoraires TTC',
    commissionPallier: 'Palier de commission',
    commissionOtherCosts: 'Autres frais',
    commissionTotal: 'Total honoraires',
    commissionNet: 'Net après charges',
    commissionNote: 'Les charges sociales sont estimées à ~45% pour un statut indépendant.',
    commissionSpainNote: 'Les charges sociales sont estimées à ~45% pour un statut autónomo en Espagne.',

    // Visit report
    visitReportTitle: 'Compte rendu de visite',
    visitPropertyAddress: 'Adresse du bien',
    visitPros: 'Points positifs',
    visitCons: 'Points à améliorer',
    visitPriceFeedback: 'Retour sur le prix',
    visitWorkNeeded: 'Travaux nécessaires',
    visitLocation: 'Emplacement',
    visitGeneralFeedback: 'Commentaire général',
    visitGenerate: 'Générer le message',
    visitCopy: 'Copier',
    visitSend: 'Envoyer',

    // Common
    save: 'Enregistrer',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    close: 'Fermer',
    yes: 'Oui',
    no: 'Non',
    optional: 'Optionnel',
    required: 'Obligatoire',
    loading: 'Chargement...',
    error: 'Erreur',
    success: 'Succès',
    warning: 'Attention',
    info: 'Info',
  },

  es: {
    // Login
    loginTitle: 'Immo Pulse',
    loginSubtitle: 'Tu coach inmobiliario diario',
    loginEmail: 'Email',
    loginPassword: 'Contraseña',
    loginButton: 'Iniciar sesión',
    loginCreateAccount: 'Crear cuenta',
    loginFirstName: 'Nombre',
    loginLastName: 'Apellido',
    loginConfirmPassword: 'Confirmar contraseña',
    loginExperience: 'Nivel de experiencia',
    loginBeginner: 'Principiante',
    loginCreateButton: 'Crear mi cuenta',
    loginBack: 'Volver',

    // Onboarding
    onboardingWelcome: '¡Bienvenido!',
    onboardingIdentity: '¿Quién eres?',
    onboardingExpérience: 'Tu trayectoria',
    onboardingSector: 'Tu sector',
    onboardingGoals: 'Tus objetivos',
    onboardingConfirm: 'Confirmación',
    onboardingFirstName: 'Nombre',
    onboardingLastName: 'Apellido',
    onboardingCity: 'Ciudad',
    onboardingPhone: 'Teléfono',
    onboardingNext: 'Siguiente',
    onboardingBack: 'Atrás',
    onboardingFinish: '¡Vamos allá!',

    // Langue
    languageQuestion: '¿Qué idioma quieres utilizar?',
    languageFr: 'Français',
    languageEs: 'Español',
    languageSelector: 'Idioma',

    // Dashboard
    dashboardTitle: 'Panel de control',
    dashboardWelcome: 'Bienvenido de nuevo',
    dashboardDay: 'Día',
    dashboardStreak: 'Racha',
    dashboardCompletion: 'Completado',
    dashboardTodayAction: 'Acción del día',
    dashboardSeeAll: 'Ver todo',
    dashboardNoData: 'Aún no hay datos',
    dashboardAddVisit: 'Añadir visita',
    dashboardWriteReport: 'Redactar informe',
    dashboardCalculator: 'Simulador de comisiones',
    dashboardChat: 'Coach inmobiliario IA',
    dashboardHistory: 'Historial',
    dashboardSettings: 'Configuración',
    dashboardLogout: 'Cerrar sesión',

    // Tabs
    tabDashboard: 'Objetivos',
    tabToday: 'Hoy',
    tabVisits: 'Visitas',
    tabCommission: 'Comisión',
    tabChat: 'Coach IA',
    tabSettings: 'Ajustes',

    // Prospection créneaux
    prospectionTerrainSlot: 'Prospección terreno (puerta a puerta): 11h-13h o 17h-19h',
    prospectionPIGESlot: 'PIGE Legal (envío de mensajes): 7h-8h30',
    prospectionDailyBlock: '2h de prospección diarias (lunes-viernes): terreno + PIGE + redes sociales',
    prospectionAgendaReminder: '🗓 Bloquea 2h de prospección en tu agenda cada día (lunes-viernes): terreno puerta a puerta (11h-13h o 17h-19h) + PIGE Legal (7h-8h30, 30 min) + redes sociales. Cada día laborable, en la franja de tu elección (11 h – 13 h 30 o 17 h – 19 h).',

    // Daily actions
    dailyAdminTitle: 'Tareas administrativas',
    dailyR1Title: 'R1 — Cita de descubrimiento',
    dailyR2Title: 'R2 — Cita de firma de mandato',
    dailyReturnsTitle: 'Feedback de visitas',
    dailyDéfiTitle: 'Desafío del día',
    dailyApporteursTitle: 'Colaboradores',
    dailyPlateformesTitle: 'Portales inmobiliarios',
    dailyCRMTitle: 'Actualizar el CRM',
    dailyPrimoTitle: 'Lista primo',
    dailyMandatTitle: 'Acciones proactivas mandato',
    dailyInterCabinetsTitle: 'Inter-agencias',
    dailyCheckupTitle: 'Balance de mi día',

    // Tips
    tipR1Title: 'Buen saber para tu R1',
    tipR2Title: 'Buen saber para tu R2',
    tipReturnsTitle: 'Buen saber para tus feedbacks',

    // Commission
    commissionTitle: 'Simulador de comisiones',
    commissionSalePrice: 'Precio de venta',
    commissionPct: 'Tasa de comisión',
    commissionHonoraires: 'Honorarios TTC',
    commissionPallier: 'Tramo de comisión',
    commissionOtherCosts: 'Otros gastos',
    commissionTotal: 'Total honorarios',
    commissionNet: 'Neto después de cargas',
    commissionNote: 'Las cargas sociales se estiman en ~45% para un estatus autónomo.',
    commissionSpainNote: 'Las cargas sociales se estiman en ~45% para un estatus autónomo en España.',

    // Visit report
    visitReportTitle: 'Informe de visita',
    visitPropertyAddress: 'Dirección del inmueble',
    visitPros: 'Puntos positivos',
    visitCons: 'Puntos a mejorar',
    visitPriceFeedback: 'Feedback sobre el precio',
    visitWorkNeeded: 'Obras necesarias',
    visitLocation: 'Ubicación',
    visitGeneralFeedback: 'Comentario general',
    visitGenerate: 'Generar mensaje',
    visitCopy: 'Copiar',
    visitSend: 'Enviar',

    // Common
    save: 'Guardar',
    cancel: 'Cancelar',
    confirm: 'Confirmar',
    close: 'Cerrar',
    yes: 'Sí',
    no: 'No',
    optional: 'Opcional',
    required: 'Obligatorio',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Atención',
    info: 'Info',
  },
} as const;

export type TranslationKey = keyof typeof translations.fr;

// Hook simplifié : utilise la langue du profil
export function t(key: TranslationKey, lang: Lang): string {
  return translations[lang][key] || translations.fr[key];
}
