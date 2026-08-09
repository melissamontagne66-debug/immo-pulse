import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Calendar, MessageCircle, TrendingUp, HomeIcon, CheckCircle, ArrowRight } from 'lucide-react';

interface FirstTimeOnboardingProps {
  onComplete: () => void;
}

const steps = [
  {
    icon: Home,
    color: 'text-red-600',
    bg: 'bg-red-50',
    title: 'Ton tableau de bord',
    description: 'Ici tu retrouves chaque matin tes objectifs du jour, ton action de prospection, et les conseils adaptés à ton niveau.',
  },
  {
    icon: Calendar,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    title: 'Tes actions du jour',
    description: 'Dans "Aujourd\'hui", tu as ta liste d\'actions à cocher. Un défi chaque jour pour te challenger. Coche-les au fur et à mesure !',
  },
  {
    icon: MessageCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    title: 'Le Coach Immo t’accompagne chaque jour',
    description: 'Retrouve un plan d’action personnalisé chaque matin et un bilan guidé chaque soir : c’est ce suivi quotidien qui te fait progresser.',
  },
  {
    icon: HomeIcon,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    title: 'Comptes rendus de visite',
    description: 'Après chaque visite, enregistre les retours de l\'acheteur. L\'outil génère un message diplomatique pour le vendeur.',
  },
  {
    icon: TrendingUp,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    title: 'Bilan du soir',
    description: 'Chaque soir, fais ton bilan. C\'est CE QUI FAIT LA DIFFÉRENCE entre les bons et les tops. Ça débloque le lendemain !',
  },
];

export function FirstTimeOnboarding({ onComplete }: FirstTimeOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

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
          <Button
            onClick={next}
            className="w-full bg-red-600 hover:bg-red-700 py-3 text-base"
          >
            {currentStep < steps.length - 1 ? (
              <>Suivant <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : (
              <>C'est parti ! <CheckCircle className="w-4 h-4 ml-2" /></>
            )}
          </Button>

          {/* Skip */}
          {currentStep < steps.length - 1 && (
            <button onClick={onComplete} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
              Passer le tutoriel
            </button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
