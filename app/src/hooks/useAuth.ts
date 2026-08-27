import { useState, useCallback, useEffect } from 'react';
import { apiLogin, apiRegister, logoutCloud, isApiConfigured } from '@/services/api';
import { toLocalDateKey } from '@/lib/utils';

const SESSION_KEY = 'iad-coach-session';
const LOCAL_USERS_KEY = 'immo-pulse-local-users';

interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  experienceLevel?: string;
  startDate?: string;
}

// Simple hash for local mode
function simpleHash(str: string): string {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    h = ((h << 5) - h + c) | 0;
  }
  return Math.abs(h).toString(36);
}

// Local user storage
interface LocalUser {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  experienceLevel?: string;
  startDate?: string;
}

// Comptes pré-enregistrés (pour démo et tests)
const DEFAULT_USERS: Record<string, Omit<LocalUser, 'passwordHash'>> = {
  'melissa.montagne66@gmail.com': {
    email: 'melissa.montagne66@gmail.com',
    firstName: 'Mélissa',
    lastName: 'Montagne',
    experienceLevel: 'débutant',
  },
  'marilleaujerome@gmail.com': {
    email: 'marilleaujerome@gmail.com',
    firstName: 'Jérôme',
    lastName: 'Marilleau',
    experienceLevel: 'débutant',
  },
  'augustin.le-roux@iadfrance.fr': {
    email: 'augustin.le-roux@iadfrance.fr',
    firstName: 'Augustin',
    lastName: 'Le Roux',
    experienceLevel: 'débutant',
  },
  'david.jourda@iadfrance.fr': {
    email: 'david.jourda@iadfrance.fr',
    firstName: 'David',
    lastName: 'Jourda',
    experienceLevel: 'débutant',
  },
  'gregory.merbah@iadfrance.fr': {
    email: 'gregory.merbah@iadfrance.fr',
    firstName: 'Grégory',
    lastName: 'Merbah',
    experienceLevel: 'débutant',
  },
};

function getLocalUsers(): Record<string, LocalUser> {
  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch { return {}; }
}

function saveLocalUser(email: string, user: LocalUser) {
  const users = getLocalUsers();
  users[email.toLowerCase()] = user;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

function loadSession(): UserInfo | null {
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return null;
}

function saveSession(user: UserInfo) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

// Check if email matches a default account with password 123456
function checkDefaultAccount(email: string, password: string): UserInfo | null {
  const normalizedEmail = email.toLowerCase().trim();
  const defaultUser = DEFAULT_USERS[normalizedEmail];
  if (!defaultUser) return null;
  if (simpleHash(password) !== simpleHash('123456')) return null;
  return {
    id: `local-${normalizedEmail}`,
    email: normalizedEmail,
    firstName: defaultUser.firstName,
    lastName: defaultUser.lastName,
    experienceLevel: defaultUser.experienceLevel,
    startDate: toLocalDateKey(new Date()),
  };
}

export function useAuth() {
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(() => loadSession());
  const [isLoading, setIsLoading] = useState(false);
  const [isOfflineMode, setIsOfflineMode] = useState(() => !isApiConfigured());

  const isAuthenticated = currentUser !== null;

  // Listen for storage changes (logout from other tabs)
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) {
        if (!e.newValue) {
          setCurrentUser(null);
        } else {
          try {
            setCurrentUser(JSON.parse(e.newValue));
          } catch { setCurrentUser(null); }
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // REGRESSION-CHECK: inscription compte neuf → étape 1 onboarding visible sans F5
  // (le rendu post-inscription est piloté par l'état React — pas de window.location.reload ici)
  // Register
  const register = useCallback(async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    experienceLevel?: string,
    startDate?: string,
    cguVersion?: string
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    // Check if it's a default account
    if (DEFAULT_USERS[normalizedEmail]) {
      setIsLoading(false);
      return { success: false, error: 'Ce compte existe déjà. Me connecter avec mon email et mon mot de passe.' };
    }

    // Check local accounts
    const localUsers = getLocalUsers();
    if (localUsers[normalizedEmail]) {
      setIsLoading(false);
      return { success: false, error: 'Un compte existe déjà avec cet email.' };
    }

    if (password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Le mot de passe doit faire au moins 6 caractères.' };
    }

    // Create the account on the backend so it's reachable from any device/session
    if (isApiConfigured()) {
      try {
        const data = await apiRegister(normalizedEmail, password, firstName.trim(), lastName.trim(), experienceLevel, startDate, cguVersion);
        if (data.token) {
          setIsOfflineMode(false);
          const user: UserInfo = {
            id: data.user?.id || normalizedEmail,
            email: data.user?.email || normalizedEmail,
            firstName: data.user?.firstName || firstName.trim(),
            lastName: data.user?.lastName || lastName.trim(),
            experienceLevel: data.user?.experienceLevel,
            startDate: data.user?.startDate,
          };
          setCurrentUser(user);
          saveSession(user);
          setIsLoading(false);
          // Pas de reload : setCurrentUser déclenche le rendu → App affiche
          // l'écran de chargement cloud puis l'étape 1 de l'onboarding.
          return { success: true };
        }
        setIsLoading(false);
        return { success: false, error: data.error || 'Impossible de créer le compte.' };
      } catch {
        setIsLoading(false);
        return { success: false, error: 'Impossible de contacter le serveur. Vérifier ma connexion et réessayer.' };
      }
    }

    // Offline fallback: save locally only (no API configured)
    saveLocalUser(normalizedEmail, {
      email: normalizedEmail,
      passwordHash: simpleHash(password),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      experienceLevel,
      startDate,
    });

    const user: UserInfo = {
      id: `local-${normalizedEmail}`,
      email: normalizedEmail,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      experienceLevel,
      startDate,
    };
    setCurrentUser(user);
    saveSession(user);
    setIsLoading(false);
    // Pas de reload : setCurrentUser déclenche le rendu → App affiche
    // directement l'étape 1 de l'onboarding (pas de profil → OnboardingWizard).
    return { success: true };
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    const normalizedEmail = email.toLowerCase().trim();

    // Compte connu localement (pré-enregistré démo ou créé hors-ligne) dont le
    // mot de passe saisi est le bon. Ces comptes doivent AUSSI obtenir un
    // token API : sans JWT, isCloudEnabled() est faux et leurs données ne sont
    // jamais synchronisées vers D1 (persistance par compte inexistante).
    const defaultMatch = checkDefaultAccount(normalizedEmail, password);
    const localUser = getLocalUsers()[normalizedEmail];
    const localMatch: UserInfo | null = defaultMatch
      ?? (localUser && localUser.passwordHash === simpleHash(password)
        ? {
            id: `local-${normalizedEmail}`,
            email: normalizedEmail,
            firstName: localUser.firstName,
            lastName: localUser.lastName,
            experienceLevel: localUser.experienceLevel,
            startDate: localUser.startDate,
          }
        : null);

    const startCloudSession = (data: { user?: Partial<UserInfo>; }, fallback: UserInfo | null): UserInfo => {
      const user: UserInfo = {
        id: data.user?.id || fallback?.id || normalizedEmail,
        email: data.user?.email || normalizedEmail,
        firstName: data.user?.firstName || fallback?.firstName || '',
        lastName: data.user?.lastName || fallback?.lastName || '',
        experienceLevel: data.user?.experienceLevel ?? fallback?.experienceLevel,
        startDate: data.user?.startDate ?? fallback?.startDate,
      };
      setIsOfflineMode(false);
      setCurrentUser(user);
      saveSession(user);
      return user;
    };

    if (isApiConfigured()) {
      try {
        const data = await apiLogin(normalizedEmail, password);
        if (data.token) {
          startCloudSession(data, localMatch);
          setIsLoading(false);
          // Force rechargement pour bien réinitialiser toute l'app
          setTimeout(() => { window.location.reload(); }, 100);
          return { success: true };
        }
        // Compte valide localement mais inconnu du serveur (comptes
        // pré-enregistrés ou créés hors-ligne) → migration transparente :
        // on crée le compte côté API avec les mêmes identifiants. Au premier
        // chargement, le cloud vide déclenche l'envoi des données locales
        // existantes (cf. « Migration » dans App.tsx).
        if (localMatch) {
          try {
            const reg = await apiRegister(
              normalizedEmail, password,
              localMatch.firstName, localMatch.lastName,
              localMatch.experienceLevel, localMatch.startDate
            );
            if (reg.token) {
              startCloudSession(reg, localMatch);
              setIsLoading(false);
              setTimeout(() => { window.location.reload(); }, 100);
              return { success: true };
            }
          } catch {
            // Réseau coupé entre login et register → session locale ci-dessous
          }
        } else if (data.error) {
          setIsLoading(false);
          return { success: false, error: data.error };
        }
      } catch {
        // API injoignable → session locale ci-dessous (mode hors-ligne)
      }
    }

    // Fallback local : compte pré-enregistré/local et API absente ou injoignable
    if (localMatch) {
      if (defaultMatch) {
        // Save to local storage for future logins
        const defaultDef = DEFAULT_USERS[normalizedEmail];
        if (defaultDef) {
          saveLocalUser(normalizedEmail, {
            email: normalizedEmail,
            passwordHash: simpleHash('123456'),
            firstName: defaultDef.firstName,
            lastName: defaultDef.lastName,
            experienceLevel: defaultDef.experienceLevel,
            startDate: toLocalDateKey(new Date()),
          });
        }
      }
      setCurrentUser(localMatch);
      saveSession(localMatch);
      setIsLoading(false);
      // Force rechargement pour bien réinitialiser toute l'app
      setTimeout(() => { window.location.reload(); }, 100);
      return { success: true };
    }

    // Compte local connu mais mauvais mot de passe (API absente/injoignable,
    // sinon l'erreur de l'API a déjà été renvoyée plus haut)
    if (localUser) {
      setIsLoading(false);
      return { success: false, error: 'Mot de passe incorrect.' };
    }

    setIsLoading(false);
    return { success: false, error: 'Aucun compte trouvé avec cet email. Vérifier mon email ou créer un compte.' };
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    clearSession();
    logoutCloud();
    // Force page reload to clear all React state and re-render from scratch
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, []);

  const getUserKey = useCallback((): string => {
    return currentUser?.email || 'anonymous';
  }, [currentUser]);

  return {
    currentUser,
    isAuthenticated,
    isLoading,
    isOfflineMode,
    register,
    login,
    logout,
    getUserKey,
  };
}
