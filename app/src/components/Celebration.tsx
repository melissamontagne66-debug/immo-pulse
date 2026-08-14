import { useEffect, useMemo, useState } from 'react';

// ============================================
// Célébration générique (MOD-21) — dérivée de SaleCelebration (MOD-12).
// Confettis emoji en CSS pur, aucune dépendance.
// Respecte prefers-reduced-motion : version sobre (fondu + message).
// ============================================

interface CelebrationProps {
  show: boolean;
  /** Message principal, ex. « 🎉 Bilan enregistré ! » */
  message: string;
  /** Ligne secondaire optionnelle (récap, série, palier…) */
  submessage?: string;
  /** Nombre de particules (défaut 32 ; ~18 pour une micro-célébration) */
  particleCount?: number;
  /** Durée avant fermeture auto (défaut 4000 ms) */
  autoCloseMs?: number;
  /** 'modal' : carte centrée + overlay ; 'burst' : confettis seuls, non bloquant (le message passe par un toast) */
  variant?: 'modal' | 'burst';
  onClose: () => void;
}

const CONFETTI_EMOJIS = ['🎉', '🎊', '💰', '✨', '🏡', '🔑'];

export function Celebration({ show, message, submessage, particleCount = 32, autoCloseMs = 4000, variant = 'modal', onClose }: CelebrationProps) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', listener);
    return () => mq.removeEventListener('change', listener);
  }, []);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(timer);
  }, [show, autoCloseMs, onClose]);

  const particles = useMemo(() => {
    if (!show || reducedMotion) return [];
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
      left: Math.random() * 100,
      delay: Math.random() * 0.8,
      duration: 2.2 + Math.random() * 1.5,
      size: 1.2 + Math.random() * 1.3,
    }));
  }, [show, reducedMotion, particleCount]);

  if (!show) return null;

  if (variant === 'burst') {
    // Micro-célébration non bloquante : confettis seuls, sans overlay ni carte.
    return (
      <div className="fixed inset-0 z-50 pointer-events-none" role="status" aria-live="polite" aria-label={message}>
        {!reducedMotion && (
          <style>{`
            @keyframes celebration-confetti-fall {
              0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
              100% { transform: translateY(105vh) rotate(360deg); opacity: 0.6; }
            }
          `}</style>
        )}
        {particles.map(p => (
          <span
            key={p.id}
            aria-hidden="true"
            className="absolute top-0"
            style={{
              left: `${p.left}%`,
              fontSize: `${p.size}rem`,
              animation: `celebration-confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
              opacity: 0,
            }}
          >
            {p.emoji}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
      role="status"
      aria-live="polite"
    >
      {!reducedMotion && (
        <style>{`
          @keyframes celebration-confetti-fall {
            0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
            100% { transform: translateY(105vh) rotate(360deg); opacity: 0.6; }
          }
          @keyframes celebration-pop {
            0% { transform: scale(0.6); opacity: 0; }
            60% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes celebration-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      )}
      {particles.map(p => (
        <span
          key={p.id}
          aria-hidden="true"
          className="pointer-events-none absolute top-0"
          style={{
            left: `${p.left}%`,
            fontSize: `${p.size}rem`,
            animation: `celebration-confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
            opacity: 0,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <div
        className="relative bg-white rounded-2xl shadow-2xl px-8 py-6 max-w-sm text-center mx-4"
        style={{ animation: reducedMotion ? 'celebration-fade 0.2s ease-out' : 'celebration-pop 0.4s ease-out' }}
      >
        <p className="text-lg font-bold text-gray-900">{message}</p>
        {submessage && <p className="text-sm text-gray-600 mt-2 whitespace-pre-line">{submessage}</p>}
        <p className="text-sm text-gray-500 mt-2">Touche pour fermer</p>
      </div>
    </div>
  );
}
