import { useEffect, useMemo } from 'react';
import { formatEuro } from '@/lib/utils';

// ============================================
// Célébration légère à l'enregistrement d'une vente (MOD-12)
// Confettis emoji en CSS pur — aucune dépendance.
// MOD-21 la généralisera pour d'autres événements.
// ============================================

interface SaleCelebrationProps {
  show: boolean;
  firstName?: string;
  net: number;
  isSpain?: boolean;
  onClose: () => void;
}

const CONFETTI_EMOJIS = ['🎉', '🎊', '💰', '✨', '🏡', '🔑'];
const CONFETTI_COUNT = 32;
const AUTO_CLOSE_MS = 4000;

export function SaleCelebration({ show, firstName, net, isSpain = false, onClose }: SaleCelebrationProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, AUTO_CLOSE_MS);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  // Positions/délais aléatoires calculés une fois par affichage
  const particles = useMemo(() => {
    if (!show) return [];
    return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 1.5,
      size: 1.2 + Math.random() * 1.3,
    }));
  }, [show]);

  if (!show) return null;

  const message = isSpain
    ? `🎉 ${firstName ? `${firstName}, ` : ''}¡venta registrada! ${formatEuro(net)} neto en tu bolsillo.`
    : `🎉 ${firstName ? `${firstName}, ` : ''}vente enregistrée ! ${formatEuro(net)} net dans ta poche.`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes sale-confetti-fall {
          0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(360deg); opacity: 0.6; }
        }
        @keyframes sale-celebration-pop {
          0% { transform: scale(0.6); opacity: 0; }
          60% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
      {particles.map(p => (
        <span
          key={p.id}
          aria-hidden="true"
          className="pointer-events-none absolute top-0"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animation: `sale-confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <div
        className="relative bg-white rounded-2xl shadow-2xl px-8 py-6 max-w-sm text-center"
        style={{ animation: 'sale-celebration-pop 0.4s ease-out' }}
      >
        <p className="text-lg font-bold text-gray-900">{message}</p>
        <p className="text-sm text-gray-500 mt-2">
          {isSpain ? 'Toca para cerrar' : 'Touche pour fermer'}
        </p>
      </div>
    </div>
  );
}
