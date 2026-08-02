export const DEFAULT_TEAM_CODE = 'IMMO2025';

export interface UserAccount {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  experienceLevel?: string;
  startDate?: string;
  teamCode?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserAccount | null;
}
