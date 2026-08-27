import { useState } from 'react';
import type { ReactNode } from 'react';
import { cn, formatEuro } from '@/lib/utils';
import type { UserProfile } from '@/types/profile';
import { Flame, Target, ExternalLink, LogOut, User, Menu, X, ClipboardCheck, Bell, Puzzle } from 'lucide-react';
import { isPushConfigured, isPushDenied, loadPushState, setPushReminderEnabled } from '@/lib/push';
import { apiDeleteAccount, isCloudEnabled } from '@/services/api';
import { CGU_REMINDER_FR, CGU_REMINDER_ES } from '@/data/cgu';

// Extension Chrome Bridge CRM — zip hébergé par l'app en attendant la
// publication sur le Chrome Web Store (le lien déclenche le téléchargement ;
// à remplacer par l'URL du store dès publication).
const BRIDGE_CRM_EXTENSION_URL = './bridge-crm-immopulse.zip';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentDay: number;
  /** MOD-31 : niveau de carrière affiché dans le footer (ex. « 🌿 Confirmé »). */
  niveauLabel?: string;
  streak: number;
  profile: UserProfile;
  onSetMonthlyGoal: () => void;
  onLogout: () => void;
  onOpenCheckup?: () => void;
  userEmail?: string;
  hasNotification?: boolean;
  onLanguageChange?: (lang: 'fr' | 'es') => void;
}

const getTabs = (lang: 'fr' | 'es') => [
  { id: 'dashboard', label: lang === 'es' ? 'Objetivos' : 'Objectifs du jour', icon: '🎯' },
  { id: 'parcours', label: lang === 'es' ? 'Mi recorrido' : 'Mon parcours', icon: '🏆' },
  { id: 'today', label: lang === 'es' ? 'Hoy' : "Aujourd'hui", icon: '✅' },
  { id: 'report', label: lang === 'es' ? 'Informe' : 'Compte rendu', icon: '📝' },
  { id: 'commission', label: lang === 'es' ? 'Comisión' : 'Commission', icon: '💰' },
  { id: 'contacts', label: lang === 'es' ? 'Contactos' : 'Contacts', icon: '👥' },
  { id: 'history', label: lang === 'es' ? 'Historial' : 'Historique', icon: '📊' },
];

export function Layout({ children, activeTab, onTabChange, currentDay, niveauLabel, streak, profile, onSetMonthlyGoal, onLogout, onOpenCheckup, userEmail, hasNotification, onLanguageChange }: LayoutProps) {
  const tabs = getTabs(profile.language);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // MOD-29 : état du rappel push (réglage sidebar)
  const pushAvailable = isPushConfigured();
  const pushDenied = isPushDenied();
  const [pushReminderOn, setPushReminderOn] = useState(() => loadPushState(userEmail ?? '').reminderEnabled);

  // 5.5 — Suppression de compte (droit à l'oubli) : état de la double confirmation
  const [deleteAccountStep, setDeleteAccountStep] = useState(0);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      if (isCloudEnabled()) {
        await apiDeleteAccount();
      }
    } catch { /* on purge le local quoi qu'il arrive */ }
    // Purge du localStorage limitée au compte supprimé : les données des
    // autres comptes éventuels sur l'appareil sont conservées (persistance
    // par compte — seule la suppression explicite efface, et seulement le sien).
    try {
      const userKey = userEmail ?? '';
      const sharedKeys = ['iad-coach-session', 'immo-pulse-token'];
      const keysToRemove: string[] = [...sharedKeys];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;
        const isAppKey = key.startsWith('iad-coach-') || key.startsWith('immo-pulse-');
        // endsWith et non includes : « a@b.co » ne doit pas matcher la clé de « a@b.com ».
        if (isAppKey && userKey && key.endsWith(`-${userKey}`)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch { /* ignore */ }
    window.location.reload();
  };

  const handleTabClick = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Floating hamburger button — visible on all pages, all scroll positions */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="fixed bottom-6 right-6 z-[60] lg:hidden w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
        aria-label="Ouvrir le menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar - hidden on mobile, shown on desktop */}
      <aside className={cn(
        'fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm',
        'transform transition-transform duration-300 ease-in-out',
        mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
              I
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-tight">Immo Pulse</h1>
              <p className="text-xs text-gray-500">Mon accompagnement quotidien</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-5 py-3 bg-red-50 border-b border-red-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-3.5 h-3.5 text-red-700" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-red-800 truncate">
                {profile.firstName ? `${profile.firstName} ${profile.lastName}` : 'Conseiller'}
              </p>
              {userEmail && (
                <p className="text-xs text-red-500 truncate">{userEmail}</p>
              )}
            </div>
          </div>
          <button
            onClick={onSetMonthlyGoal}
            className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 mt-1.5 underline"
          >
            <Target className="w-3 h-3" />
            CA visé : {formatEuro(profile.ca6MonthsTarget)}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {/* Bilan de la journée — premier raccourci, une seule ligne (mobile inclus) */}
          {onOpenCheckup && (
            <button
              onClick={() => { onOpenCheckup(); setMobileMenuOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all whitespace-nowrap"
            >
              <ClipboardCheck className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Faire le bilan du jour</span>
            </button>
          )}

          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-red-50 text-red-700 shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'today' && (
                <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                  Jour {currentDay}
                </span>
              )}
              {tab.id === 'dashboard' && hasNotification && (
                <span className="ml-auto w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" title="Nouveaux conseils et objectifs !" />
              )}
            </button>
          ))}

          <div className="pt-4 border-t border-gray-100 mt-4">
            <p className="px-4 text-xs text-gray-400 uppercase tracking-wide mb-2">Ressources</p>
            <a
              href="https://methode-immo-simple.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span>📝</span>
              <span>Mes mémos <span className="text-xs text-gray-400">(compte formation requis)</span></span>
              <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
            </a>
            <a
              href="https://simple-methode-immo.systeme.io/school/course/formation/lecture/9562796"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all"
            >
              <span>📚</span>
              <span>Formations <span className="text-xs text-gray-400">(compte formation requis)</span></span>
              <ExternalLink className="w-3 h-3 ml-auto text-gray-400" />
            </a>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <div className="space-y-3">
            {niveauLabel && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{profile.language === 'es' ? 'Nivel' : 'Niveau'} : <strong className="text-gray-700">{niveauLabel}</strong></span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Flame className="w-3 h-3 text-orange-500" />
              <span>Série : <strong className="text-gray-700">{streak} jours</strong></span>
            </div>
            {/* MOD-29 : réglage du rappel push du bilan à 18 h.
                Visible seulement si FCM est configuré pour ce build. */}
            {pushAvailable && (
              <label className="flex items-center justify-between gap-2 text-xs text-gray-500 cursor-pointer select-none">
                <span className="flex items-center gap-2">
                  <Bell className="w-3 h-3 text-blue-500" />
                  {profile.language === 'es' ? 'Recordatorio del balance (18 h)' : 'Rappel du bilan à 18 h'}
                </span>
                <input
                  type="checkbox"
                  checked={pushReminderOn}
                  onChange={async e => {
                    const enabled = e.target.checked;
                    setPushReminderOn(enabled);
                    await setPushReminderEnabled(userEmail ?? '', enabled);
                    setPushReminderOn(loadPushState(userEmail ?? '').reminderEnabled);
                  }}
                  className="accent-red-600"
                />
              </label>
            )}
            {pushAvailable && pushDenied && (
              <p className="text-[11px] text-gray-400">
                {profile.language === 'es'
                  ? 'Notificaciones bloqueadas por el navegador — actívalas en los ajustes del navegador.'
                  : 'Notifications bloquées par le navigateur — réactive-les dans les réglages du navigateur.'}
              </p>
            )}
            {/* Rappel CGU : purge 90 jours + bascule vers l'intranet du réseau */}
            <p className="text-[11px] text-gray-400 leading-relaxed">
              {profile.language === 'es' ? CGU_REMINDER_ES : CGU_REMINDER_FR}
            </p>
            {/* Raccourci vers l'extension Chrome Bridge CRM (récupération des
                prospects dans le CRM du réseau) */}
            <a
              href={BRIDGE_CRM_EXTENSION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-blue-500 hover:text-blue-700 transition-colors"
            >
              <Puzzle className="w-3 h-3 flex-shrink-0" />
              {profile.language === 'es' ? 'Extensión Bridge CRM para Chrome' : 'Extension Bridge CRM pour Chrome'}
              <ExternalLink className="w-2.5 h-2.5 ml-auto flex-shrink-0" />
            </a>
            {/* Sélecteur de langue */}
            <div className="flex items-center justify-center gap-1 mt-2">
              <button
                onClick={() => onLanguageChange?.('fr')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  profile.language === 'fr'
                    ? 'bg-red-100 text-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title="Français"
              >
                🇫🇷 FR
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => onLanguageChange?.('es')}
                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                  profile.language === 'es'
                    ? 'bg-red-100 text-red-700 shadow-sm'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title="Español"
              >
                🇪🇸 ES
              </button>
            </div>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all mt-2"
            >
              <LogOut className="w-3 h-3" />
              {profile.language === 'es' ? 'Cerrar sesión' : 'Se déconnecter'}
            </button>
            {/* 5.5 — Droit à l'oubli : suppression du compte (double confirmation) */}
            <button
              onClick={() => setDeleteAccountStep(1)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-[11px] text-gray-300 hover:text-red-500 transition-all"
            >
              {profile.language === 'es' ? 'Eliminar mi cuenta' : 'Supprimer mon compte'}
            </button>
          </div>
        </div>
      </aside>

      {/* Modale de suppression de compte — double confirmation */}
      {deleteAccountStep > 0 && (
        <div className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
            {deleteAccountStep === 1 ? (
              <>
                <h3 className="text-base font-bold text-gray-900">
                  {profile.language === 'es' ? '¿Eliminar mi cuenta?' : 'Supprimer mon compte ?'}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {profile.language === 'es'
                    ? 'Esta acción elimina definitivamente mi cuenta y todos mis datos: balances, contactos, visitas, ventas. Es irreversible.'
                    : 'Cette action supprime définitivement mon compte et toutes mes données : bilans, contacts, visites, ventes. Elle est irréversible.'}
                </p>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setDeleteAccountStep(0)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                  >
                    {profile.language === 'es' ? 'Cancelar' : 'Annuler'}
                  </button>
                  <button
                    onClick={() => setDeleteAccountStep(2)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium"
                  >
                    {profile.language === 'es' ? 'Continuar' : 'Continuer'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-base font-bold text-red-700">
                  {profile.language === 'es' ? 'Última confirmación' : 'Dernière confirmation'}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {profile.language === 'es'
                    ? 'Confirma la eliminación definitiva. No hay vuelta atrás.'
                    : 'Confirme la suppression définitive. Il n\'y a pas de retour en arrière.'}
                </p>
                <div className="flex gap-3 mt-5">
                  <button
                    onClick={() => setDeleteAccountStep(0)}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium"
                  >
                    {profile.language === 'es' ? 'Cancelar' : 'Annuler'}
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    disabled={deletingAccount}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-sm font-medium disabled:opacity-50"
                  >
                    {deletingAccount
                      ? (profile.language === 'es' ? 'Eliminación…' : 'Suppression…')
                      : (profile.language === 'es' ? 'Eliminar definitivamente' : 'Supprimer définitivement')}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-w-0">
        {/* Mobile header — sans le bouton hamburger (il est flottant maintenant) */}
        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">I</div>
            <span className="font-bold text-gray-900 text-sm">Immo Pulse</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">Jour {currentDay}</span>
            <div className="flex items-center gap-1 text-xs text-orange-600">
              <Flame className="w-3 h-3" />
              <span>{streak}</span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 lg:p-8 pb-24 lg:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
