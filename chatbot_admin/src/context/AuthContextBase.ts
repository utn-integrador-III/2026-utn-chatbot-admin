import { createContext } from 'react';
import type { AdminUser, LoginPayload } from '../types/user';

export interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<AdminUser>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);