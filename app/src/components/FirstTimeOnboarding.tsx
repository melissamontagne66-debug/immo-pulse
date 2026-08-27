import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Target, ClipboardCheck, Flame, Users, FileText, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

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
    icon: Target,
    color: 'text-red-600',
    bg: 'bg-red-50',
    title: isEs ? 'Cada mañana: mi plan' : 'Chaque matin : mon plan',
    description: isEs
      ? 'Abra la app y encuentre sus objetivos y sus acciones del día en « Objetivos » y « Hoy », adaptados a su nivel y a sus resultados.'
      : 'Ouvre l\'app et retrouve tes objectifs et tes actions du jour dans « Objectifs » et « Aujourd\'hui », adaptés à ton niveau et à tes résultats.',
  },
  {
    icon: ClipboardCheck,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: isEs ? 'Marque a lo largo del día' : 'Coche au fil de la journée',
    description: isEs
      ? 'En « Hoy », marque cada acción en cuanto la complete. Un toque basta — sin formularios de más.'
      : 'Dans « Aujourd\'hui », coche chaque action dès qu\'elle est faite. Un tap suffit — pas de formulaire en plus.',
  },
  {
    icon: Flame,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    title: isEs ? 'Cada noche: mi balance — el ritual clave' : 'Chaque soir : mon bilan — le rituel clé',
    description: isEs
      ? 'Tómese 2 minutos para hacer su balance del día. Es él quien lo cambia todo : permite al algoritmo adaptarse a su evolución, a su ritmo y a sus necesidades, para proponerle nuevas ideas y acciones cada día — cada vez más pertinentes para usted.'
      : 'Prends 2 minutes pour faire ton bilan du jour. C\'est lui qui change tout : il permet à l\'algorithme de s\'adapter à ton évolution, à ton rythme et à tes besoins, pour te proposer de nouvelles idées et actions chaque jour — de plus en plus pertinentes pour toi.',
  },
  {
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: isEs ? 'Mis contactos y mis llamadas de seguimiento' : 'Mes contacts et mes relances',
    description: isEs
      ? 'Registre cada prospecto en « Contactos » : la app le dice a quién llamar y cuándo, y le avisa antes de que un contacto se enfríe.'
      : 'Enregistre chaque prospect dans « Contacts » : l\'app te dit qui relancer et quand, et t\'alerte avant qu\'un contact ne refroidisse.',
  },
  {
    icon: FileText,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    title: isEs ? 'Visitas y comisión' : 'Visites et commission',
    description: isEs
      ? 'Después de cada visita, la app redacta el mensaje para el vendedor. Y en « Comisión », calcule su remuneración neta en 30 segundos.'
      : 'Après chaque visite, l\'app rédige le message pour le vendeur. Et dans « Commission », calcule ta rémunération nette en 30 secondes.',
  },
  {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    title: isEs ? 'Eso es todo' : 'C\'est tout',
    description: isEs
      ? 'Plan por la mañana, acciones marcadas, balance por la noche. La constancia hace el resto — y la app se adapta a usted día tras día.'
      : 'Plan le matin, actions cochées, bilan le soir. La constance fait le reste — et l\'app s\'adapte à toi jour après jour.',
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
