import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, Lock, ArrowRight, LogIn, UserPlus, Key } from 'lucide-react';
import { apiForgotPassword, apiResetPassword, isApiConfigured } from '@/services/api';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister?: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
}

type Mode = 'login' | 'register' | 'forgot' | 'reset';

function isValidEmail(value: string) {
  return value.trim().length > 0 && value.includes('@');
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
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

  const clearMessages = () => {
    setError('');
    setInfo('');
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password.trim()) {
      setError('Renseigne ton email et ton mot de passe.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Saisis une adresse email valide.');
      return;
    }
    setLoading(true);
    const result = await onLogin(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Erreur de connexion.');
    }
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      setError('Renseigne tous les champs.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Saisis une adresse email valide.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (!onRegister) {
      setError('L\'inscription n\'est pas disponible.');
      return;
    }
    setLoading(true);
    const result = await onRegister(email.trim(), password, firstName.trim(), lastName.trim());
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Erreur lors de l\'inscription.');
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
      setError('Saisis une adresse email valide.');
      return;
    }
    if (!isApiConfigured()) {
      setError('La réinitialisation n’est pas disponible en mode local.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiForgotPassword(resetEmail.trim());
      setLoading(false);
      setInfo(data.message || 'Si un compte existe avec cet email, un lien de réinitialisation vient d\'être envoyé.');
    } catch {
      setLoading(false);
      setError('Impossible de demander la réinitialisation pour le moment.');
    }
  };

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();
    clearMessages();
    if (!resetToken.trim()) {
      setError('Le lien de réinitialisation est invalide.');
      return;
    }
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Renseigne tous les champs.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (!isApiConfigured()) {
      setError('La réinitialisation n’est pas disponible en mode local.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiResetPassword(resetToken.trim(), newPassword);
      setLoading(false);
      if (data.success) {
        setInfo('Ton mot de passe a été mis à jour. Tu peux te connecter.');
        setMode('login');
        setPassword('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        const url = new URL(window.location.href);
        url.searchParams.delete('reset');
        window.history.replaceState({}, '', url.toString());
      } else {
        setError(data.error || 'La réinitialisation a échoué.');
      }
    } catch {
      setLoading(false);
      setError('Impossible de réinitialiser le mot de passe pour le moment.');
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
          <p className="text-gray-500 mt-1">Ton accompagnement quotidien</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            {mode === 'login' ? (
              <><LogIn className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Connexion</h2></>
            ) : mode === 'register' ? (
              <><UserPlus className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Inscription</h2></>
            ) : mode === 'forgot' ? (
              <><Key className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Mot de passe oublié</h2></>
            ) : (
              <><Key className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Réinitialiser le mot de passe</h2></>
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
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" className="mt-1" required />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700">
                  <Lock className="w-4 h-4 text-gray-400" /> Mot de passe
                </Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Ton mot de passe" className="mt-1" required />
              </div>
              <div className="text-right">
                <button type="button" onClick={() => switchMode('forgot')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Mot de passe oublié ?
                </button>
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? 'Connexion...' : <>Se connecter <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-gray-700">Prénom</Label>
                  <Input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Prénom" className="mt-1" required />
                </div>
                <div>
                  <Label className="text-gray-700">Nom</Label>
                  <Input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Nom" className="mt-1" required />
                </div>
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> Email</Label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ton@email.com" className="mt-1" required />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Lock className="w-4 h-4 text-gray-400" /> Mot de passe</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6 caractères minimum" className="mt-1" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? 'Inscription...' : <>S'inscrire <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
              <p className="text-xs text-gray-500 leading-relaxed">
                En créant un compte, tu acceptes que tes données de coaching (profil, bilans, résultats) soient stockées pour faire fonctionner le service. Les contacts que tu notes (prospects, vendeurs) relèvent de ta responsabilité professionnelle&nbsp;: informe-les et supprime leurs données dès qu'elles ne sont plus utiles. Tu peux supprimer ton compte et toutes tes données à tout moment depuis les réglages.
              </p>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Mail className="w-4 h-4 text-gray-400" /> Email</Label>
                <Input type="email" value={resetEmail} onChange={e => setResetEmail(e.target.value)} placeholder="ton@email.com" className="mt-1" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? 'Envoi...' : 'Envoyer le lien de réinitialisation'}
              </Button>
              <div className="text-center">
                <button type="button" onClick={() => switchMode('login')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}

          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} className="space-y-4" noValidate>
              {!resetToken && (
                <div>
                  <Label className="flex items-center gap-2 text-gray-700"><Key className="w-4 h-4 text-gray-400" /> Code de réinitialisation</Label>
                  <Input value={resetToken} onChange={e => setResetToken(e.target.value)} placeholder="Code reçu par email" className="mt-1" />
                </div>
              )}
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Lock className="w-4 h-4 text-gray-400" /> Nouveau mot de passe</Label>
                <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="6 caractères minimum" className="mt-1" />
              </div>
              <div>
                <Label className="flex items-center gap-2 text-gray-700"><Lock className="w-4 h-4 text-gray-400" /> Confirmer le mot de passe</Label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirme ton mot de passe" className="mt-1" />
              </div>
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
              </Button>
              <div className="text-center">
                <button type="button" onClick={() => switchMode('login')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}

          {mode !== 'register' && mode !== 'reset' && (
            <div className="mt-4 text-center">
              <button onClick={() => switchMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-red-600 hover:text-red-700 font-medium">
                {mode === 'login' ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
              </button>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-gray-400 mt-6 space-y-1.5">
          <p>🔒 Tes données sont stockées sur ton appareil et synchronisées de façon sécurisée sur ton compte. Tu les retrouves sur n'importe quel appareil.</p>
          <button type="button" onClick={() => setShowPrivacy(true)} className="text-red-500 hover:text-red-600 font-medium underline underline-offset-2">
            Politique de confidentialité
          </button>
        </div>
      </div>

      {showPrivacy && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowPrivacy(false)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Politique de confidentialité</h3>
            <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
              <p><strong className="text-gray-900">Responsable de traitement&nbsp;:</strong> l'éditeur de l'application Immo Pulse, qui met ce service à ta disposition dans le cadre de ton activité professionnelle.</p>
              <p><strong className="text-gray-900">Finalité&nbsp;:</strong> tes données (profil, bilans quotidiens, comptes rendus de visite, statistiques) sont traitées uniquement pour faire fonctionner le service de coaching et te restituer ton historique et tes résultats.</p>
              <p><strong className="text-gray-900">Stockage&nbsp;:</strong> tes données sont enregistrées sur ton appareil (stockage local du navigateur) et synchronisées de façon sécurisée sur ton compte, hébergé par Cloudflare (Workers et base de données D1), afin que tu les retrouves sur n'importe quel appareil.</p>
              <p><strong className="text-gray-900">Durée de conservation&nbsp;:</strong> tes données sont conservées tant que ton compte est actif. La suppression de ton compte entraîne la suppression de l'ensemble de tes données.</p>
              <p><strong className="text-gray-900">Tes droits&nbsp;:</strong> tu disposes d'un droit d'accès, de rectification et de suppression de tes données. Tu peux les exercer à tout moment depuis les réglages de l'application, notamment en supprimant ton compte.</p>
              <p><strong className="text-gray-900">Données de tiers&nbsp;:</strong> les contacts que tu saisis (prospects, vendeurs) relèvent de ta responsabilité professionnelle. Informe ces personnes et supprime leurs données dès qu'elles ne sont plus utiles.</p>
              <p><strong className="text-gray-900">Contact&nbsp;:</strong> pour toute question ou demande relative à tes données personnelles, contacte le responsable du service via les coordonnées communiquées par ton organisation.</p>
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
