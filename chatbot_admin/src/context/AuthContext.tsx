import { useState } from 'react';
import type { ReactNode } from 'react';
import type { AdminUser, LoginPayload } from '../types/user';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContextBase';

function getStoredUser(): AdminUser | null {
  const storedUser = localStorage.getItem('nova_user');
  const storedToken = localStorage.getItem('nova_token');
  if (!storedUser || !storedToken) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    localStorage.removeItem('nova_user');
    localStorage.removeItem('nova_token');
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
  const [isLoading] = useState(false);

  async function login(payload: LoginPayload): Promise<AdminUser> {
    const { token, admin } = await authService.login(payload);
    localStorage.setItem('nova_token', token);
    localStorage.setItem('nova_user', JSON.stringify(admin));
    setUser(admin);
    return admin;
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}