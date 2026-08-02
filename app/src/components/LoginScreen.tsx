import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sparkles, Mail, Lock, ArrowRight, LogIn, UserPlus, WifiOff } from 'lucide-react';
import { isApiConfigured } from '@/services/api';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onRegister?: (email: string, password: string, firstName: string, lastName: string) => Promise<{ success: boolean; error?: string }>;
}

export function LoginScreen({ onLogin, onRegister }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Renseigne ton email et ton mot de passe.');
      return;
    }
    setLoading(true);
    const result = await onLogin(email.trim(), password);
    setLoading(false);
    if (!result.success) {
      setError(result.error || 'Erreur de connexion.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim() || !firstName.trim() || !lastName.trim()) {
      setError('Renseigne tous les champs.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
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

  const toggleMode = () => {
    setMode(m => m === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Immo Pulse</h1>
          <p className="text-gray-500 mt-1">Ton accompagnement personnalisé</p>
          {!isApiConfigured() && (
            <div className="mt-2 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium border border-amber-200">
              <WifiOff className="w-3 h-3" />
              Mode local — tes données restent sur cet appareil
            </div>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-center gap-2 mb-6">
            {mode === 'login' ? (
              <><LogIn className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Connexion</h2></>
            ) : (
              <><UserPlus className="w-5 h-5 text-red-600" /><h2 className="text-lg font-semibold text-gray-900">Inscription</h2></>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
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
              <Button type="submit" disabled={loading} className="w-full bg-red-600 hover:bg-red-700">
                {loading ? 'Connexion...' : <>Se connecter <ArrowRight className="w-4 h-4 ml-2" /></>}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
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
            </form>
          )}

          <div className="mt-4 text-center">
            <button onClick={toggleMode} className="text-sm text-red-600 hover:text-red-700 font-medium">
              {mode === 'login' ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>

        {/* Info */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Tes données sont synchronisées sur le cloud.<br />
          Tu peux y accéder depuis n\'importe quel appareil.
        </p>
      </div>
    </div>
  );
}
