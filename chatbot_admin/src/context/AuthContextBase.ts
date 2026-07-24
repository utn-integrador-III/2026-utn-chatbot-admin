import { createContext } from 'react';
import type { AdminUser, LoginPayload, RegisterPayload } from '../types/user';

export interface AuthContextValue {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);