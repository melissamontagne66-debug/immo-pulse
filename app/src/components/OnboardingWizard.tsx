import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { UserProfile } from '@/types/profile';
import { defaultProfile, calculateTargetsFromCA6Months } from '@/types/profile';
import { getCityPrice, getSuggestedPriceText } from '@/data/cityPrices';
import { formatEuro } from '@/lib/utils';
import { getGoals, plural } from '@/lib/goals';
import { RdvInfoTooltip } from '@/components/RdvInfoTooltip';
import {
  User, MapPin, ArrowRight, Sparkles, TrendingUp, Euro, Home,
  Lightbulb, Check, PlayCircle, Calendar, GraduationCap, HeartHandshake
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
}

type Step = 'language' | 'identity' | 'expérience' | 'sector' | 'goals' | 'confirm';

const STEP_ORDER: Step[] = ['language', 'identity', 'expérience', 'sector', 'goals', 'confirm'];

// Brouillon du wizard stocké dans une clé séparée du profil
// (`iad-coach-profile-{email}`) : App.tsx affiche le wizard tant que le profil
// n'existe pas — écrire un profil partiel ferait sauter le wizard au F5.
const SESSION_KEY = 'iad-coach-session';
const DRAFT_PREFIX = 'immo-pulse-onboarding-draft';

interface OnboardingDraft {
  step: Step;
  profile: Partial<UserProfile>;
  hasMentor: boolean | null;
  onboardingStep: number;
  onboardingDone: boolean;
}

function getSessionInfo(): { email: string; firstName: string; lastName: string } {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const session = JSON.parse(stored);
      return {
        email: session.email || '',
        firstName: session.firstName || '',
        lastName: session.lastName || '',
      };
    }
  } catch { /* ignore */ }
  return { email: '', firstName: '', lastName: '' };
}

function loadDraft(email: string): OnboardingDraft | null {
  if (!email) return null;
  try {
    const stored = localStorage.getItem(`${DRAFT_PREFIX}-${email}`);
    if (stored) {
      const draft = JSON.parse(stored);
      if (draft && draft.onboardingDone === false) return draft;
    }
  } catch { /* ignore */ }
  return null;
}

function saveDraft(email: string, draft: OnboardingDraft) {
  if (!email) return;
  try {
    localStorage.setItem(`${DRAFT_PREFIX}-${email}`, JSON.stringify(draft));
  } catch { /* ignore */ }
}

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
  const [sessionInfo] = useState(getSessionInfo);
  const [draft] = useState<OnboardingDraft | null>(() => loadDraft(sessionInfo.email));
  const [step, setStep] = useState<Step>(draft?.step ?? 'language');
  const [profile, setProfile] = useState<UserProfile>({
    ...defaultProfile,
    ...(draft?.profile || {}),
    // Pré-remplit prénom/nom avec les valeurs du compte (saisies à l'inscription)
    firstName: draft?.profile?.firstName ?? sessionInfo.firstName,
    lastName: draft?.profile?.lastName ?? sessionInfo.lastName,
    startDate: new Date().toISOString().split('T')[0],
  });
  // Question parrain/collaborateur : aucune réponse pré-sélectionnée
  const [hasMentor, setHasMentor] = useState<boolean | null>(draft?.hasMentor ?? null);

  const update = (field: keyof UserProfile, value: any) => {
    setProfile(prêv => ({ ...prêv, [field]: value }));
  };

  // Persiste le brouillon à chaque validation d'étape (reprise au F5)
  const persistDraft = (next: Step, done = false) => {
    saveDraft(sessionInfo.email, {
      step: next,
      profile,
      hasMentor,
      onboardingStep: STEP_ORDER.indexOf(next) + 1,
      onboardingDone: done,
    });
  };

  const isStepValid = () => {
    switch (step) {
      case 'language': return !!profile.language;
      case 'identity': return profile.firstName.trim() && profile.lastName.trim() && profile.city.trim();
      case 'expérience': return !!profile.expérienceLevel && hasMentor !== null;
      case 'sector': return profile.averagePrice > 0;
      case 'goals': return profile.ca6MonthsTarget > 0;
      case 'confirm': return true;
    }
  };

  const nextStep = () => {
    if (step === 'language') { persistDraft('identity'); setStep('identity'); }
    else if (step === 'identity') { persistDraft('expérience'); setStep('expérience'); }
    else if (step === 'expérience') { persistDraft('sector'); setStep('sector'); }
    else if (step === 'sector') { persistDraft('goals'); setStep('goals'); }
    else if (step === 'goals') { persistDraft('confirm'); setStep('confirm'); }
    else {
      const COMMISSION = 5;
      const targets = calculateTargetsFromCA6Months(
        profile.ca6MonthsTarget,
        COMMISSION,
        profile.averagePrice,
        profile.expérienceLevel,
        1
      );
      const finalProfile: UserProfile = {
        ...profile,
        hasMentor: hasMentor ?? false,
        commissionsPct: COMMISSION,
        currentMonthGoal: {
          ...profile.currentMonthGoal,
          ...targets,
          caTarget: Math.round(profile.ca6MonthsTarget * (profile.expérienceLevel === 'débutant' ? 0.10 : 0.16)),
          commissionsPct: COMMISSION,
          averagePrice: profile.averagePrice,
        },
      };
      // onboardingDone: true → le brouillon n'est plus jamais restauré
      persistDraft('confirm', true);
      onComplete(finalProfile);
    }
  };

  const prêvStep = () => {
    const back: Step | null =
      step === 'identity' ? 'language'
      : step === 'expérience' ? 'identity'
      : step === 'sector' ? 'expérience'
      : step === 'goals' ? 'sector'
      : step === 'confirm' ? 'goals'
      : null;
    if (back) { persistDraft(back); setStep(back); }
  };

  const stepLabels: Record<Step, { title: string; subtitle: string }> = {
    language: { title: profile.language === 'es' ? '¿Qué idioma prefieres?' : 'Quelle langue souhaites-tu ?', subtitle: profile.language === 'es' ? 'Puedes cambiarlo más tarde desde el panel de control.' : 'Tu pourras la changer plus tard depuis le tableau de bord.' },
    identity: { title: profile.language === 'es' ? '¿Quién eres?' : 'Qui es-tu ?', subtitle: profile.language === 'es' ? 'Empecemos por conocernos' : 'Commençons par faire connaissance' },
    expérience: { title: profile.language === 'es' ? 'Tu trayectoria' : 'Ton parcours', subtitle: profile.language === 'es' ? 'Para personalizar tu acompañamiento' : 'Pour personnaliser ton accompagnement' },
    sector: { title: profile.language === 'es' ? 'Tu sector' : 'Ton secteur', subtitle: profile.language === 'es' ? '¿Dónde vas a ejercer?' : 'Où vas-tu exercer ?' },
    goals: { title: profile.language === 'es' ? 'Tus objetivos para los próximos 6 meses' : 'Tes objectifs sur les 6 prochains mois', subtitle: profile.language === 'es' ? 'Un objetivo que te guíe, no una presión' : 'Un cap qui te guide, pas une pression' },
    confirm: { title: profile.language === 'es' ? '¡Vamos allá!' : "C'est parti !", subtitle: profile.language === 'es' ? 'Aquí están tus objetivos de hoy' : 'Voilà tes objectifs du jour' },
  };

  const isEs = profile.language === 'es';

  // Estimation du prix moyen pour la ville + type de secteur choisis
  const estimatedPrice = profile.city.trim()
    ? Math.round(getCityPrice(profile.city, (profile.sectorType || 'centre-ville') as any, isEs ? 'spain' : 'france') * 75 / 10000) * 10000
    : null;

  // Pré-remplit le prix moyen avec l'estimation tant que la valeur est
  // restée au défaut (250 000 €) — toute saisie manuelle est conservée.
  useEffect(() => {
    if (!estimatedPrice) return;
    setProfile(prêv => prêv.averagePrice === defaultProfile.averagePrice
      ? { ...prêv, averagePrice: estimatedPrice }
      : prêv);
  }, [estimatedPrice]);

  const expérienceOptions = [
    { id: 'débutant' as const, label: isEs ? 'Empiezo' : 'Je débute', icon: '🌱', desc: isEs ? 'Primeros pasos en inmobiliaria' : 'Premiers pas dans l\'immobilier' },
    { id: 'quelques-semaines' as const, label: isEs ? 'Unas semanas' : 'Quelques semaines', icon: '🌿', desc: isEs ? 'He empezado a aprender' : 'J\'ai commencé à apprendre' },
    { id: 'quelques-mois' as const, label: isEs ? 'Unos meses' : 'Quelques mois', icon: '🌳', desc: isEs ? 'Ya tengo experiencia' : 'J\'ai déjà de l\'expérience' },
    { id: 'confirmé' as const, label: isEs ? 'Confirmado' : 'Confirmé', icon: '🏆', desc: isEs ? 'Quiero optimizar mis resultados' : 'Je veux optimiser mes résultats' },
  ];

  const sectorOptions = [
    { id: 'centre-ville', label: isEs ? 'Centro-ciudad' : 'Centre-ville' },
    { id: 'peripherie', label: isEs ? 'Periferia' : 'Périphérie' },
    { id: 'rural', label: 'Rural' },
    { id: 'luxe', label: isEs ? 'Lujo / Premium' : 'Luxe / Premium' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Immo Pulse</h1>
          <p className="text-gray-500 mt-1">{profile.language === 'es' ? 'Tu acompañamiento personalizado' : 'Ton accompagnement quotidien'}</p>
        </div>

        <div className="flex gap-2 mb-6">
          {(['identity', 'expérience', 'sector', 'goals', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className={`flex-1 h-2 rounded-full ${(['identity', 'expérience', 'sector', 'goals', 'confirm'].indexOf(step) >= i ? 'bg-red-500' : 'bg-gray-200')}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
            <h2 className="text-lg font-bold text-white">{stepLabels[step].title}</h2>
            <p className="text-red-100 text-sm">{stepLabels[step].subtitle}</p>
          </div>

          <div className="p-6">
            {/* STEP 0: LANGUAGE */}
            {step === 'language' && (
              <div className="space-y-4">
                <Label className="text-center block text-lg font-medium text-gray-800 mb-4">
                  {profile.language === 'es' ? '¿Qué idioma prefieres usar?' : 'Quelle langue souhaites-tu utiliser ?'}
                </Label>
                <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                  <button
                    onClick={() => update('language', 'fr')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      profile.language === 'fr'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                        : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">🇫🇷</span>
                    <span className="font-semibold">Français</span>
                  </button>
                  <button
                    onClick={() => update('language', 'es')}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      profile.language === 'es'
                        ? 'border-red-500 bg-red-50 text-red-700 shadow-md'
                        : 'border-gray-200 hover:border-red-300 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">🇪🇸</span>
                    <span className="font-semibold">Español</span>
                  </button>
                </div>
              </div>
            )}

            {/* STEP 1: IDENTITY */}
            {step === 'identity' && (
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {profile.language === 'es' ? 'Nombre' : 'Prénom'}</Label>
                  <Input value={profile.firstName} onChange={e => update('firstName', e.target.value)} placeholder={profile.language === 'es' ? 'Tu nombre' : 'Ton prénom'} className="mt-1" />
                </div>
                <div>
                  <Label>{profile.language === 'es' ? 'Apellido' : 'Nom'}</Label>
                  <Input value={profile.lastName} onChange={e => update('lastName', e.target.value)} placeholder={profile.language === 'es' ? 'Tu apellido' : 'Ton nom'} className="mt-1" />
                </div>
                <div>
                  <Label className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {profile.language === 'es' ? 'Ciudad de actividad' : "Ville d'activité"}</Label>
                  <Input value={profile.city} onChange={e => update('city', e.target.value)} placeholder={profile.language === 'es' ? 'Ej: Madrid, Barcelona...' : 'Ex: Lyon, Bordeaux...'} className="mt-1" />
                </div>
              </div>
            )}

            {/* STEP 2: EXPERIENCE */}
            {step === 'expérience' && (
              <div className="space-y-5">
                <div>
                  <Label className="flex items-center gap-2 mb-3"><Calendar className="w-4 h-4 text-gray-400" /> {isEs ? '¿Desde cuándo empezaste?' : 'Quand as-tu démarré ?'}</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {expérienceOptions.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => update('expérienceLevel', opt.id)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          profile.expérienceLevel === opt.id
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        <span className="text-lg block mb-1">{opt.icon}</span>
                        {opt.label}
                        <span className="block text-xs font-normal mt-0.5 text-gray-400">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {isEs ? 'Tu red (iad, SAFTI, otra…)' : 'Ton réseau (iad, SAFTI, autre…)'}</Label>
                  <Input
                    value={profile.réseau ?? ''}
                    onChange={e => update('réseau', e.target.value)}
                    placeholder={isEs ? 'Opcional — ej. iad' : 'Optionnel — ex. iad'}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-400 mt-1.5">
                    {isEs
                      ? 'Se usará para personalizar los textos (« tu red », « tu herramienta interna »).'
                      : 'Il servira à personnaliser les textes (« ton réseau », « ton outil interne »).'}
                  </p>
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3"><PlayCircle className="w-4 h-4 text-gray-400" /> {isEs ? '¿Has visto todos los vídeos de la red?' : `As-tu vu toutes les vidéos ${profile.réseau?.trim() ? `de ${profile.réseau.trim()}` : 'du réseau'} ?`}</Label>
                  <div className="flex gap-2">
                    {[
                      { val: true, label: isEs ? 'Sí, todos' : 'Oui, toutes', color: 'green' },
                      { val: false, label: isEs ? 'Aún no' : 'Pas encore', color: 'gray' },
                    ].map(opt => (
                      <button
                        key={String(opt.val)}
                        onClick={() => update('watchedNetworkVideos', opt.val)}
                        className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                          profile.watchedNetworkVideos === opt.val
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {/* Message si vidéos non vues */}
                  {profile.watchedNetworkVideos === false && (
                    <div className="mt-3 bg-blue-50 rounded-lg p-3 border border-blue-200">
                      <p className="text-sm text-blue-800">
                        {isEs ? (
                          <><strong>¡Estos vídeos son tus aliados para empezar con serenidad!</strong> Te preparan para firmar tus primeros mandatos: míralos en prioridad. Y antes de cualquier firma, verifica que has recibido tu certificado de habilitación de tu red (ley Hoguet): sin él, no puedes firmar ningún mandato. Es el documento que te protege, a ti y a tus clientes.</>
                        ) : (
                          <><strong>Ces vidéos sont tes alliées pour démarrer sereinement !</strong> Elles te préparent à signer tes premiers mandats : regarde-les en priorité. Et avant toute signature, vérifie que tu as bien reçu ton attestation d'habilitation de la part de ton réseau (loi Hoguet) : sans elle, tu ne peux pas signer de mandat. C'est elle qui te protège, toi et tes clients.</>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3"><GraduationCap className="w-4 h-4 text-gray-400" /> {isEs ? '¿Has seguido las formaciones de terreno?' : 'As-tu suivi les formations terrain ?'}</Label>
                  <div className="flex gap-2">
                    {[
                      { val: true, label: isEs ? 'Sí' : 'Oui' },
                      { val: false, label: isEs ? 'Aún no' : 'Pas encore' },
                    ].map(opt => (
                      <button
                        key={String(opt.val)}
                        onClick={() => update('watchedTerrainVideos', opt.val)}
                        className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                          profile.watchedTerrainVideos === opt.val
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  {profile.watchedTerrainVideos === false && (
                    <div className="mt-3 bg-green-50 rounded-lg p-3 border border-green-200">
                      <p className="text-sm text-green-800">
                        {isEs ? (
                          <><strong>¡Buena noticia, vas a ganar un tiempo precioso!</strong> Estas formaciones de terreno te revelan el método y las estrategias de los asesores performantes para ser eficaz desde tus primeros pasos. Un verdadero acelerador para conseguir rápidamente tus primeros mandatos y ventas.</>
                        ) : (
                          <><strong>Bonne nouvelle, tu vas gagner un temps précieux !</strong> Ces formations terrain te révèlent la méthode et les stratégies des conseillers performants pour être efficace dès tes premiers pas. Un vrai accélérateur pour décrocher rapidement tes premiers mandats et ventes.</>
                        )}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="flex items-center gap-2 mb-3"><HeartHandshake className="w-4 h-4 text-gray-400" /> {isEs ? '¿Tienes una persona con quien colaborar (padrino, mentor, compañero)?' : 'As-tu une personne avec qui collaborer (parrain, mentor, partenaire) ?'}</Label>
                  <div className="flex gap-2">
                    {[
                      { val: true, label: isEs ? 'Sí' : 'Oui' },
                      { val: false, label: isEs ? 'Aún no' : 'Pas encore' },
                    ].map(opt => (
                      <button
                        key={String(opt.val)}
                        onClick={() => setHasMentor(opt.val)}
                        className={`flex-1 p-3 rounded-lg border text-sm font-medium transition-all ${
                          hasMentor === opt.val
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {(profile.expérienceLevel === 'débutant' || profile.expérienceLevel === 'quelques-semaines') && (
                  <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-green-800">
                      {isEs ? (
                        <>💚 <strong>¡Sin estrés!</strong> Si empiezas, tu primer mes está dedicado a aprender el método y tomar tus referencias. Tu objetivo de CA es un faro que te ayuda a visualizar tu futuro éxito — no una presión para mañana. Vamos despacio pero seguro.</>
                      ) : (
                        <>💚 <strong>Pas de stress !</strong> Si tu débutes, ton premier mois est consacré à apprendre la méthode et prendre tes repères. Ton objectif de CA est un cap qui t'aide à visualiser ton futur succès — pas une pression pour demain. On y va doucement mais sûrement.</>
                      )}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: SECTOR */}
            {step === 'sector' && (
              <div className="space-y-4">
                <div>
                  <Label className="flex items-center gap-2"><Home className="w-4 h-4 text-gray-400" /> {isEs ? 'Tipo de sector' : 'Type de secteur'}</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {sectorOptions.map(sector => (
                      <button
                        key={sector.id}
                        onClick={() => {
                          update('sectorType', sector.id);
                          if (profile.city.trim()) {
                            const suggested = getCityPrice(profile.city, sector.id as any, isEs ? 'spain' : 'france');
                            const avgSize = 75;
                            update('averagePrice', Math.round(suggested * avgSize / 10000) * 10000);
                          }
                        }}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          profile.sectorType === sector.id
                            ? 'border-red-500 bg-red-50 text-red-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }`}
                      >
                        {sector.label}
                      </button>
                    ))}
                  </div>
                </div>

                {profile.city.trim() && profile.sectorType && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-800">{isEs ? 'Estimación para' : 'Estimation pour'} {profile.city}</p>
                        <p className="text-sm text-blue-700 mt-1">{getSuggestedPriceText(profile.city, profile.sectorType as any, isEs ? 'spain' : 'france', isEs ? 'es' : 'fr')}</p>
                        {estimatedPrice !== null && (
                          <p className="text-sm text-blue-700 mt-1">
                            {isEs
                              ? `Horquilla orientativa : ${formatEuro(Math.round(estimatedPrice * 0.85 / 10000) * 10000)} – ${formatEuro(Math.round(estimatedPrice * 1.15 / 10000) * 10000)}.`
                              : `Fourchette indicative : ${formatEuro(Math.round(estimatedPrice * 0.85 / 10000) * 10000)} – ${formatEuro(Math.round(estimatedPrice * 1.15 / 10000) * 10000)}.`}
                          </p>
                        )}
                        {/* 5.6 — cadrage honnête de l'estimation */}
                        <p className="text-xs text-blue-500 mt-1">
                          {isEs
                            ? `Estimación indicativa, fuente: medias de mercado ${new Date().getFullYear()} — a afinar con tus comparables locales.`
                            : `Estimation indicative, source : moyennes de marché ${new Date().getFullYear()} — à affiner avec tes comparables locaux.`}
                        </p>
                        {estimatedPrice !== null && profile.averagePrice !== estimatedPrice && (
                          <button
                            onClick={() => update('averagePrice', estimatedPrice)}
                            className="mt-2 flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Check className="w-3 h-3" /> {isEs ? 'Usar esta estimación' : 'Utiliser cette estimation'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="flex items-center gap-2"><Euro className="w-4 h-4 text-gray-400" /> {isEs ? 'Precio medio de tus bienes (€)' : 'Prix moyen de tes biens (€)'}</Label>
                  <Input type="number" value={profile.averagePrice || ''} onChange={e => update('averagePrice', Number(e.target.value))} placeholder="Ex: 250000" className="mt-1" />
                  <p className="text-xs text-gray-400 mt-1.5">{isEs ? 'Puedes quedarte con la estimación de arriba o ajustar según tu experiencia.' : "Tu peux garder l'estimation ci-dessus ou ajuster selon ton expérience."}</p>
                </div>
              </div>
            )}

            {/* STEP 4: GOALS */}
            {step === 'goals' && (
              <div className="space-y-6">
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-sm text-amber-800">
                    💡 <strong>{isEs ? 'Pequeño recordatorio bienintencionado:' : 'Petit rappel bienveillant :'}</strong>{' '}
                    {profile.expérienceLevel === 'débutant'
                      ? (isEs ? "Empiezas, es normal no saber exactamente hacia dónde vas. Este CA para los próximos 6 meses es una dirección, no una obligación. Tu primer mes es para aprender — los resultados vendrán naturalmente después." : "Tu débutes, c'est normal de ne pas savoir exactement où tu vas. Ce CA sur les 6 prochains mois est une direction, pas une obligation. Ton premier mois est pour apprendre — les résultats viendront naturellement ensuite.")
                      : (isEs ? "Este CA para los próximos 6 meses es un faro que te guía. Sin presión, ajustamos juntos cada mes según tus resultados." : "Ce CA sur les 6 prochains mois est un cap qui te guide. Pas de pression, on ajuste ensemble chaque mois selon tes résultats.")}
                  </p>
                </div>

                {/* Message Mois 2 affiché seulement si débutant/progression ET vidéos non vues */}
                {(profile.expérienceLevel === 'débutant' || profile.expérienceLevel === 'quelques-semaines') && !profile.watchedNetworkVideos && (
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-blue-800">
                      📅 <strong>{isEs ? '¿Cuándo uso Immo Pulse?' : "Quand est-ce que j'utilise Immo Pulse ?"}</strong><br />
                      {isEs
                        ? <>Esta herramienta te acompaña a partir del <strong>Mes 2 de tu integración</strong>, para apoyarte en el terreno. El Mes 1, es para seguir las formaciones de la red y aprender el método. ¡A partir del Mes 2, pasamos a la acción con Immo Pulse!</>
                        : <>Cet outil t'accompagne à partir du <strong>Mois 2 de ton intégration</strong>, pour te soutenir sur le terrain. Le Mois 1, c'est pour suivre les formations du réseau et apprendre la méthode. À partir du Mois 2, on passe à l'action avec Immo Pulse !</>}
                    </p>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-red-500" /> {isEs ? 'CA objetivo (€)' : 'CA visé (€)'}</Label>
                    <span className="text-lg font-bold text-red-600">{formatEuro(profile.ca6MonthsTarget)}</span>
                  </div>
                  <Slider value={[profile.ca6MonthsTarget]} onValueChange={v => update('ca6MonthsTarget', v[0])} min={30000} max={300000} step={5000} />
                  <div className="flex justify-between text-xs text-gray-400 mt-1"><span>{formatEuro(30000)}</span><span>{formatEuro(150000)}</span><span>{formatEuro(300000)}</span></div>
                </div>


              </div>
            )}

            {/* STEP 5: CONFIRM */}
            {step === 'confirm' && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <p className="text-gray-700">
                    {profile.expérienceLevel === 'débutant' ? (
                      <>
                        {isEs ? <>Perfecto <strong>{profile.firstName}</strong>! Tus objetivos están calibrados para un principiante — despacio pero seguro. Cada día cuenta.</> : <>Parfait <strong>{profile.firstName}</strong> ! Tes objectifs sont calibrés pour un débutant — doucement mais sûrement. Chaque jour compte.</>}
                      </>
                    ) : (
                      <>
                        {isEs ? <>Perfecto <strong>{profile.firstName}</strong>! Aquí están tus objetivos del día para empezar tu progresión.</> : <>Parfait <strong>{profile.firstName}</strong> ! Voilà tes objectifs du jour pour commencer ta progression.</>}
                      </>
                    )}
                  </p>
                </div>

                {(() => {
                  // Mêmes chiffres que le dashboard — source unique : src/lib/goals.ts (MOD-19).
                  // currentMonthGoal n'est appliqué au profil qu'au « C'est parti » : on le
                  // simule ici avec le même calcul (calculateTargetsFromCA6Months, commission 5 %).
                  const t = calculateTargetsFromCA6Months(profile.ca6MonthsTarget, 5, profile.averagePrice, profile.expérienceLevel, 1);
                  const goals = getGoals({ ...profile, currentMonthGoal: { ...profile.currentMonthGoal, ...t } }, 1, []);
                  return (
                    <>
                      <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200">
                        <p className="text-xs text-red-600 font-medium uppercase tracking-wide">{isEs ? 'TUS OBJETIVOS HOY' : 'TES OBJECTIFS AUJOURD\'HUI'}</p>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          {goals.dailyGoals.map(g => (
                            <div key={g.key} className="text-center">
                              <p className="text-2xl font-bold text-red-700">{g.target}</p>
                              <p className="text-xs text-red-600 flex items-center justify-center gap-1">
                                {g.label}
                                {(g.key === 'r1' || g.key === 'r2') && <RdvInfoTooltip type={g.key} isEs={isEs} />}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-purple-50 rounded-xl p-4 text-center">
                        <p className="text-2xl font-bold text-purple-700">{goals.monthlyMandats}</p>
                        <p className="text-xs text-purple-600">
                          {isEs
                            ? `${plural(goals.monthlyMandats, 'mandato')} este mes`
                            : `${plural(goals.monthlyMandats, 'mandat')} ce mois`}
                        </p>
                      </div>
                    </>
                  );
                })()}

                <p className="text-xs text-gray-500 text-center">
                  {profile.expérienceLevel === 'débutant'
                    ? (isEs ? 'Empezamos despacio — tu objetivo principal este mes es asimilar bien el método. ¡Los resultados seguirán naturalmente!' : 'On commence doucement — ton objectif principal ce mois-ci est de bien assimiler la méthode. Les résultats suivront naturellement !')
                    : (isEs ? 'Estos objetivos se reajustarán cada mes según tus resultados.' : 'Ces objectifs seront réajustés chaque mois selon tes résultats.')}
                </p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              {step !== 'identity' && (
                <Button variant="outline" onClick={prêvStep} className="flex-1">{isEs ? 'Atrás' : 'Retour'}</Button>
              )}
              <Button onClick={nextStep} disabled={!isStepValid()} className="flex-1 bg-red-600 hover:bg-red-700">
                {step === 'confirm' ? (<>{isEs ? '¡Vamos allá!' : "C'est parti !"} <Sparkles className="w-4 h-4 ml-2" /></>) : (<>{isEs ? 'Continuar' : 'Continuer'} <ArrowRight className="w-4 h-4 ml-2" /></>)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
