import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, Lock, ArrowRight, LogIn, UserPlus, Key } from 'lucide-react';
import { apiForgotPassword, apiResetPassword, isApiConfigured } from '@/services/api';
import { CGU_ARTICLES, CGU_VERSION, CGU_DATE, CGU_CHECKBOX_LABEL_FR, CGU_CHECKBOX_LABEL_ES } from '@/data/cgu';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister?: (email: string, password: string, firstName: string, lastName: string, experienceLevel?: string, startDate?: string, cguVersion?: string) => Promise<{ success: boolean; error?: string }>;
}

type Mode = 'login' | 'register' | 'forgot' | 'reset';

function isValidEmail(value: string) {
  return value.trim().length > 0 && value.includes('@');
}

// Langue lue depuis la session (iad-coach-session) puis le profil local
// (iad-coach-profile-{email}) — l'écran de connexion ne reçoit pas le profil.
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

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const isEs = readIsEs();
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showCgu, setShowCgu] = useState(false);
  const [cguAccepted, setCguAccepted] = useState(false);

  const clearMessages = () => {
    setError('');
    setInfo('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password.trim()) {
      setError(isEs ? 'Introduzca su email y su contraseña.' : 'Renseigne ton email et ton mot de passe.');
      return;
    }
    if (!isValidEmail(email)) {
      setError(isEs ? 'Introduzca una dirección de email válida.' : 'Saisis une adresse email valide.');
      return;
    }
    setLoading(true);
    const result = await onLogin(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || (isEs ? 'Error al iniciar sesión.' : 'Erreur de connexion.'));
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      setError(isEs ? 'Rellene todos los campos.' : 'Renseigne tous les champs.');
      return;
    }
    if (!isValidEmail(email)) {
      setError(isEs ? 'Introduzca una dirección de email válida.' : 'Saisis une adresse email valide.');
      return;
    }
    if (password.length < 6) {
      setError(isEs ? 'La contraseña debe contener al menos 6 caracteres.' : 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!cguAccepted) {
      setError(isEs ? 'Debe aceptar las CGU para crear su cuenta.' : 'Tu dois accepter les CGU pour créer ton compte.');
      return;
    }
    if (!onRegister) {
      setError(isEs ? 'El registro no está disponible.' : 'L\'inscription n\'est pas disponible.');
      return;
    }
    setLoading(true);
    const result = await onRegister(email.trim(), password, firstName.trim(), lastName.trim(), undefined, undefined, CGU_VERSION);
    setLoading(false);
    if (result.success) {
      // Article 8 des CGU : la date et la version de l'acceptation sont enregistrées.
      try {
        localStorage.setItem(`iad-coach-cgu-${email.trim().toLowerCase()}`, JSON.stringify({
          version: CGU_VERSION,
          acceptedAt: new Date().toISOString(),
        }));
      } catch { /* ignore */ }
    }
    if (!result.success) {
      setError(result.error || (isEs ? 'Error durante el registro.' : 'Erreur lors de l\'inscription.'));
    }
  };

  useEffect(() => {
    const token = new URL(window.location.href).searchParams.get('reset')?.trim() || '';
    if (token.length > 0) {
      clearMessages();
      setResetToken(token);
      setMode('reset');
    }
  }, []);

  const handleForgotPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!isValidEmail(resetEmail)) {
      setError(isEs ? 'Introduzca una dirección de email válida.' : 'Saisis une adresse email valide.');
      return;
    }
    if (!isApiConfigured()) {
      setError(isEs ? 'El restablecimiento no está disponible en modo local.' : 'La réinitialisation n’est pas disponible en mode local.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiForgotPassword(resetEmail.trim());
      setLoading(false);
      setInfo(data.message || (isEs ? 'Si existe una cuenta con este email, se acaba de enviar un enlace de restablecimiento.' : 'Si un compte existe avec cet email, un lien de réinitialisation vient d\'être envoyé.'));
    } catch {
      setLoading(false);
      setError(isEs ? 'No se puede solicitar el restablecimiento en este momento.' : 'Impossible de demander la réinitialisation pour le moment.');
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!resetToken.trim()) {
      setError(isEs ? 'El enlace de restablecimiento no es válido.' : 'Le lien de réinitialisation est invalide.');
      return;
    }
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError(isEs ? 'Rellene todos los campos.' : 'Renseigne tous les champs.');
      return;
    }
    if (newPassword.length < 6) {
      setError(isEs ? 'La contraseña debe contener al menos 6 caracteres.' : 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError(isEs ? 'Las contraseñas no coinciden.' : 'Les mots de passe ne correspondent pas.');
      return;
    }
    if (!isApiConfigured()) {
      setError(isEs ? 'El restablecimiento no está disponible en modo local.' : 'La réinitialisation n’est pas disponible en mode local.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiResetPassword(resetToken.trim(), newPassword);
      setLoading(false);
      if (data.success) {
        setInfo(isEs ? 'Su contraseña se ha actualizado. Ya puede iniciar sesión.' : 'Ton mot de passe a été mis à jour. Tu peux te connecter.');
        setMode('login');
        setPassword('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        const url = new URL(window.location.href);
        url.searchParams.delete('reset');
        window.history.replaceState({}, '', url.toString());
      } else {
        setError(data.error || (isEs ? 'El restablecimiento ha fallado.' : 'La réinitialisation a échoué.'));
      }
    } catch {
      setLoading(false);
      setError(isEs ? 'No se puede restablecer la contraseña en este momento.' : 'Impossible de réinitialiser le mot de passe pour le moment.');
    }
  };

  const switchMode = (nextMode: Mode) => {
    clearMessages();
    setMode(nextMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Immo Pulse</h1>
          <p className="text-gray-500 mt-1">{isEs ? 'Su acompañamiento diario' : 'Ton accompagnement quotidien'}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            {mode === 'login' ? (
              <><LogIn className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">{isEs ? 'Iniciar sesión' : 'Connexion'}</h2></>
            ) : mode === 'register' ? (
              <><UserPlus className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">{isEs ? 'Registro' : 'Inscription'}</h2></>
            ) : mode === 'forgot' ? (
              <><Key className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">{isEs ? 'Contraseña olvidada' : 'Mot de passe oublié'}</h2></>
            ) : (
              <><Key className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">{isEs ? 'Restablecer la contraseña' : 'Réinitialiser le mot de passe'}</h2></>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          {info && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-green-700">{info}</p>
            </div>
          )}

          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4" noValidate>
              <div>
                <Label className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4 text-gray-400" /> Email
                </Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={isEs ? 'su@email.com' : 'ton@email.com'} className="mt-1" required />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700">
                  <Lock className="w-4 h-4 text-gray-400" /> {isEs ? 'Contraseña' : 'Mot de passe'}
                </Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isEs ? 'Su contraseña' : 'Ton mot de passe'} className="mt-1" required />
              </div>
              <div className="text-right">
                <button type="button" onClick={() => switchMode('forgot')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  {isEs ? '¿Ha olvidado su contraseña?' : 'Mot de passe oublié ?'}
                </button>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? (isEs ? 'Conectando...' : 'Connexion...') : <>{isEs ? 'Iniciar sesión' : 'Se connecter'} <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-700">{isEs ? 'Nombre' : 'Prénom'}</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder={isEs ? 'Nombre' : 'Prénom'} className="mt-1" required />
                </div>
                <div>
                  <Label className="text-gray-700">{isEs ? 'Apellidos' : 'Nom'}</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder={isEs ? 'Apellidos' : 'Nom'} className="mt-1" required />
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder={isEs ? 'su@email.com' : 'ton@email.com'} className="mt-1" required />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Lock className="w-4 h-4 text-gray-400" /> {isEs ? 'Contraseña' : 'Mot de passe'}</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder={isEs ? 'Mínimo 6 caracteres' : '6 caractères minimum'} className="mt-1" required />
              </div>
              {/* Acceptation CGU — obligatoire (article 8 des CGU) */}
              <label className="flex items-start gap-3 bg-gray-50 rounded-lg p-3 border border-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cguAccepted}
                  onChange={e => setCguAccepted(e.target.checked)}
                  className="mt-0.5 accent-red-600"
                />
                <span className="text-xs text-gray-700 leading-relaxed">
                  {isEs ? CGU_CHECKBOX_LABEL_ES : CGU_CHECKBOX_LABEL_FR}{' '}
                  <button type="button" onClick={() => setShowCgu(true)} className="text-red-600 hover:text-red-700 font-medium underline underline-offset-2">
                    {isEs ? 'Leer las CGU' : 'Lire les CGU'}
                  </button>
                </span>
              </label>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? (isEs ? 'Registrando...' : 'Inscription...') : <>{isEs ? 'Registrarse' : 'S\'inscrire'} <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
              <p className="text-xs text-gray-500 leading-relaxed">
                {isEs
                  ? 'Al crear una cuenta, acepta que sus datos de coaching (perfil, balances, resultados) se almacenen para que el servicio funcione. Los contactos que anota (clientes potenciales, vendedores) son de su responsabilidad profesional: infórmeles y elimine sus datos en cuanto dejen de ser útiles. Puede eliminar su cuenta y todos sus datos en cualquier momento desde los ajustes.'
                  : 'En créant un compte, tu acceptes que tes données de coaching (profil, bilans, résultats) soient stockées pour faire fonctionner le service. Les contacts que tu notes (prospects, vendeurs) relèvent de ta responsabilité professionnelle\u00a0: informe-les et supprime leurs données dès qu\'elles ne sont plus utiles. Tu peux supprimer ton compte et toutes tes données à tout moment depuis les réglages.'}
              </p>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> Email</Label>
                <Input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder={isEs ? 'su@email.com' : 'ton@email.com'} className="mt-1" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? (isEs ? 'Enviando...' : 'Envoi...') : (isEs ? 'Enviar el enlace de restablecimiento' : 'Envoyer le lien de réinitialisation')}
              </Button>
              <div className="text-center">
                <button type="button" onClick={() => switchMode('login')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  {isEs ? 'Volver al inicio de sesión' : 'Retour à la connexion'}
                </button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
              {!resetToken && (
                <div>
                  <Label className="flex items-center gap-2 text-gray-700"><Key className="w-4 h-4 text-gray-400" /> {isEs ? 'Código de restablecimiento' : 'Code de réinitialisation'}</Label>
                  <Input value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder={isEs ? 'Código recibido por email' : 'Code reçu par email'} className="mt-1" />
                </div>
              )}
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Lock className="w-4 h-4 text-gray-400" /> {isEs ? 'Nueva contraseña' : 'Nouveau mot de passe'}</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder={isEs ? 'Mínimo 6 caracteres' : '6 caractères minimum'} className="mt-1" />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Lock className="w-4 h-4 text-gray-400" /> {isEs ? 'Confirmar la contraseña' : 'Confirmer le mot de passe'}</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder={isEs ? 'Confirme su contraseña' : 'Confirme ton mot de passe'} className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? (isEs ? 'Restableciendo...' : 'Réinitialisation...') : (isEs ? 'Restablecer la contraseña' : 'Réinitialiser le mot de passe')}
              </Button>
              <div className="text-center">
                <button type="button" onClick={() => switchMode('login')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  {isEs ? 'Volver al inicio de sesión' : 'Retour à la connexion'}
                </button>
              </div>
            </form>
          )}

          {mode !== 'register' && mode !== 'reset' && (
            <div className="mt-4 text-center">
              <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                {mode === 'login'
                  ? (isEs ? '¿Aún no tiene cuenta? Regístrese' : 'Pas encore de compte ? S\'inscrire')
                  : (isEs ? '¿Ya tiene cuenta? Inicie sesión' : 'Déjà un compte ? Se connecter')}
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-400 mt-6 space-y-1.5">
          <p>🔒 Tes données sont stockées sur ton appareil et synchronisées de façon sécurisée sur ton compte. Tu les retrouves sur n'importe quel appareil.</p>
          <p className="flex items-center justify-center gap-3">
            <button type="button" onClick={() => setShowCgu(true)} className="text-red-500 hover:text-red-600 font-medium underline underline-offset-2">
              CGU
            </button>
            <button type="button" onClick={() => setShowPrivacy(true)} className="text-red-500 hover:text-red-600 font-medium underline underline-offset-2">
              Politique de confidentialité
            </button>
          </p>
        </div>
      </div>

      {/* Modale CGU */}
      {showCgu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowCgu(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900">Conditions Générales d'Utilisation</h3>
            <p className="text-xs text-gray-400 mt-1 mb-4">Version {CGU_VERSION} — {CGU_DATE}</p>
            <div className="space-y-4">
              {CGU_ARTICLES.map(article => (
                <div key={article.titre}>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1.5">{article.titre}</h4>
                  <div className="space-y-2">
                    {article.paragraphes.map((p, i) => (
                      <p key={i} className="text-sm text-gray-600 leading-relaxed">{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Button onClick={() => setShowCgu(false)} className="w-full mt-6 bg-red-600 hover:bg-red-700">
              Fermer
            </Button>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowPrivacy(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Politique de confidentialité</h3>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p><strong className="text-gray-900">Responsable de traitement&nbsp;:</strong> l'éditeur de l'application Immo Pulse, qui met ce service à votre disposition dans le cadre de votre activité professionnelle.</p>
              <p><strong className="text-gray-900">Finalité&nbsp;:</strong> vos données (profil, bilans quotidiens, comptes rendus de visite, statistiques) sont traitées uniquement pour faire fonctionner le service de coaching et vous restituer votre historique et vos résultats.</p>
              <p><strong className="text-gray-900">Stockage&nbsp;:</strong> vos données sont enregistrées sur votre appareil (stockage local du navigateur) et synchronisées de façon sécurisée sur votre compte, hébergé par Cloudflare (Workers et base de données D1), afin que vous les retrouviez sur n'importe quel appareil.</p>
              <p><strong className="text-gray-900">Durée de conservation&nbsp;:</strong> vos données sont conservées tant que votre compte est actif, à une exception près&nbsp;: les fiches de vos prospects sans aucune interaction (appel, note, relance ou modification) pendant 90 jours sont automatiquement et définitivement supprimées, sur votre appareil comme sur votre compte (principe de minimisation — pensez à basculer vos prospects qualifiés sur l'intranet de votre réseau avant ce délai). La suppression de votre compte entraîne la suppression de l'ensemble de vos données.</p>
              <p><strong className="text-gray-900">Vos droits&nbsp;:</strong> vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Vous pouvez les exercer à tout moment depuis les réglages de l'application, notamment en supprimant votre compte.</p>
              <p><strong className="text-gray-900">Données de tiers&nbsp;:</strong> les contacts que vous saisissez (prospects, vendeurs) relèvent de votre responsabilité professionnelle. Informez ces personnes et supprimez leurs données dès qu'elles ne sont plus utiles.</p>
              <p><strong className="text-gray-900">Contact&nbsp;:</strong> pour toute question ou demande relative à vos données personnelles, contactez le responsable du service via les coordonnées communiquées par votre organisation.</p>
            </div>
            <Button onClick={() => setShowPrivacy(false)} className="w-full mt-6 bg-red-600 hover:bg-red-700">
              Fermer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
