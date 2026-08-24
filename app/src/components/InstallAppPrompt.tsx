import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, X, Share, PlusSquare } from 'lucide-react';

// ============================================
// Proposition d'ajout à l'écran d'accueil (PWA).
// - Chrome/Android : événement beforeinstallprompt → bouton d'installation natif.
// - iOS Safari : pas d'événement → on affiche les instructions manuelles
//   (Partager → « Sur l'écran d'accueil »).
// Affichée une fois, « Plus tard » la masque pour 7 jours, « Ne plus afficher »
// est définitif. Jamais affichée si l'app est déjà installée (standalone).
// ============================================

const STORAGE_KEY = 'immo-pulse-install-prompt';

interface PromptState {
  dismissedAt: string | null;   // « Plus tard » → redemander après 7 jours
  neverShow: boolean;           // « Ne plus afficher » → définitif
}

function loadState(): PromptState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { dismissedAt: null, neverShow: false, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return { dismissedAt: null, neverShow: false };
}

function saveState(state: PromptState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

// Événement beforeinstallprompt (non standard, Chrome/Android uniquement).
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as Navigator & { standalone?: boolean }).standalone === true; // iOS
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

export function InstallAppPrompt() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosSteps, setShowIosSteps] = useState(false);
  const isEs = (() => {
    try {
      const session = localStorage.getItem('iad-coach-session');
      const email = session ? JSON.parse(session)?.email : null;
      if (!email) return false;
      const profile = localStorage.getItem(`iad-coach-profile-${email}`);
      return profile ? JSON.parse(profile)?.language === 'es' : false;
    } catch {
      return false;
    }
  })();

  useEffect(() => {
    if (isStandalone()) return;
    const state = loadState();
    if (state.neverShow) return;
    if (state.dismissedAt) {
      const dismissed = new Date(state.dismissedAt);
      const nextShow = new Date(dismissed);
      nextShow.setDate(nextShow.getDate() + 7);
      if (nextShow > new Date()) return;
    }

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // iOS : pas de beforeinstallprompt → on montre la carte avec instructions
    if (isIos()) {
      const timer = setTimeout(() => setVisible(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  }, []);

  if (!visible) return null;

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setVisible(false);
      saveState({ dismissedAt: null, neverShow: true });
    } else if (isIos()) {
      setShowIosSteps(true);
    }
  };

  const handleLater = () => {
    saveState({ dismissedAt: new Date().toISOString(), neverShow: false });
    setVisible(false);
  };

  const handleNever = () => {
    saveState({ dismissedAt: null, neverShow: true });
    setVisible(false);
  };

  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Download className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              {isEs ? '📲 Añade Immo Pulse a tu pantalla de inicio' : '📲 Ajoute Immo Pulse à ton écran d\'accueil'}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {isEs
                ? 'Úsala como una app: un toque y estás dentro.'
                : 'Utilise-la comme une app : un tap et tu es dedans.'}
            </p>

            {/* Instructions iOS */}
            {showIosSteps && (
              <div className="mt-2 bg-white/70 rounded-lg p-3 border border-red-100 space-y-1.5">
                <p className="text-xs text-gray-700 flex items-center gap-1.5">
                  1. {isEs ? 'Pulsa' : 'Appuie sur'} <Share className="w-3.5 h-3.5 text-blue-600" /> {isEs ? '(Compartir)' : '(Partager)'}
                </p>
                <p className="text-xs text-gray-700 flex items-center gap-1.5">
                  2. {isEs ? 'Elige' : 'Choisis'} <PlusSquare className="w-3.5 h-3.5 text-gray-600" /> {isEs ? '« Añadir a pantalla de inicio »' : '« Sur l\'écran d\'accueil »'}
                </p>
              </div>
            )}

            <div className="flex gap-2 mt-3 flex-wrap">
              <Button size="sm" onClick={handleInstall} className="bg-red-600 hover:bg-red-700 text-xs">
                {isEs ? 'Añadir ahora' : 'Ajouter maintenant'}
              </Button>
              <Button size="sm" variant="outline" onClick={handleLater} className="text-xs">
                {isEs ? 'Más tarde' : 'Plus tard'}
              </Button>
              <button onClick={handleNever} className="text-xs text-gray-400 hover:text-gray-600 px-1">
                {isEs ? 'No mostrar más' : 'Ne plus afficher'}
              </button>
            </div>
          </div>
          <button onClick={handleLater} aria-label={isEs ? 'Cerrar' : 'Fermer'} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
