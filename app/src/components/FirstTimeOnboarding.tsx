import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Calendar, TrendingUp, HomeIcon, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

interface FirstTimeOnboardingProps {
  onComplete: () => void;
}

// Langue lue depuis le profil local (iad-coach-profile-{email}) via la session
// (iad-coach-session) — ce composant ne reçoit pas le profil en props.
function readIsEs(): boolean {
  try {
    const sessionRaw = localStorage.getItem('iad-coach-session');
    const session = sessionRaw ? JSON.parse(sessionRaw) : null;
    const email = session?.email;
    if (!email) return false;
    const profileRaw = localStorage.getItem(`iad-coach-profile-${email}`);
    const profile = profileRaw ? JSON.parse(profileRaw) : null;
    return profile?.language === 'es';
  } catch {
    return false;
  }
}

const getSteps = (isEs: boolean) => [
  {
    icon: Home,
    color: 'text-red-600',
    bg: 'bg-red-50',
    title: isEs ? 'Cada mañana: su plan' : 'Chaque matin : ton plan',
    description: isEs
      ? 'Abra la app y encuentre sus objetivos y sus acciones del día, adaptados a su nivel y a sus resultados.'
      : 'Ouvre l\'app et retrouve tes objectifs et tes actions du jour, adaptés à ton niveau et à tes résultats.',
  },
  {
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: isEs ? 'Marque a lo largo del día' : 'Coche au fil de la journée',
    description: isEs
      ? 'En « Hoy », marque cada acción en cuanto la complete. Un toque basta — sin formularios de más.'
      : 'Dans « Aujourd\'hui », coche chaque action dès qu\'elle est faite. Un tap suffit — pas de formulaire en plus.',
  },
  {
    icon: TrendingUp,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    title: isEs ? 'Cada noche: su balance (lo esencial)' : 'Chaque soir : ton bilan (l\'essentiel)',
    description: isEs
      ? 'Haga su balance al final del día: es lo que permite a la app proponerle nuevas acciones cada día y evolucionar según sus resultados anteriores.'
      : 'Fais ton bilan en fin de journée : c\'est ce qui permet à l\'app de te proposer de nouvelles choses chaque jour et d\'évoluer en fonction de tes résultats précédents.',
  },
  {
    icon: HomeIcon,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: isEs ? 'Visitas, contactos, comisión' : 'Visites, contacts, commission',
    description: isEs
      ? 'Registre sus visitas (la app redacta el mensaje para el vendedor), guarde sus contactos, calcule su comisión neta.'
      : 'Enregistre tes visites (l\'app rédige le message pour le vendeur), garde tes contacts, calcule ta commission nette.',
  },
  {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    title: isEs ? 'Eso es todo' : 'C\'est tout',
    description: isEs
      ? 'Plan por la mañana, acciones marcadas, balance por la noche. La constancia hace el resto.'
      : 'Plan le matin, actions cochées, bilan le soir. La constance fait le reste.',
  },
];

export function FirstTimeOnboarding({ onComplete }: FirstTimeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const isEs = readIsEs();
  const steps = getSteps(isEs);

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardContent className="p-8 text-center space-y-6">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  i === currentStep ? 'bg-red-600 w-6' : i < currentStep ? 'bg-red-300' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className={`${step.bg} w-20 h-20 rounded-full flex items-center justify-center mx-auto`}>
            <Icon className={`w-10 h-10 ${step.color}`} />
          </div>

          {/* Text */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          {/* Button */}
          <div className="flex items-center gap-2">
            {currentStep > 0 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="py-3"
                aria-label={isEs ? 'Volver' : 'Retour'}
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={next}
              className="flex-1 bg-red-600 hover:bg-red-700 py-3 text-base"
            >
              {currentStep < steps.length - 1 ? (
                <>{isEs ? 'Siguiente' : 'Suivant'} <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>{isEs ? '¡Empezamos!' : "C'est parti !"} <CheckCircle className="w-4 h-4 ml-2" /></>
              )}
            </Button>
          </div>

          {/* Skip */}
          {currentStep < steps.length - 1 && (
            <button onClick={onComplete} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              {isEs ? 'Saltar el tutorial' : 'Passer le tutoriel'}
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
