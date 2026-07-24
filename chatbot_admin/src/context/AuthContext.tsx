import { useState } from 'react';
import type { ReactNode } from 'react';
import type { AdminUser, LoginPayload, RegisterPayload } from '../types/user';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContextBase';

function getStoredUser(): AdminUser | null {
  const storedUser = localStorage.getItem('nova_user');
  const storedToken = localStorage.getItem('nova_token');
  if (storedUser && storedToken) {
    return JSON.parse(storedUser);
  }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(() => getStoredUser());
  const [isLoading] = useState(false);

  async function login(payload: LoginPayload) {
    const { token, user: loggedInUser } = await authService.login(payload);
    localStorage.setItem('nova_token', token);
    localStorage.setItem('nova_user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
  }

  async function register(payload: RegisterPayload) {
    const { token, user: newUser } = await authService.register(payload);
    localStorage.setItem('nova_token', token);
    localStorage.setItem('nova_user', JSON.stringify(newUser));
    setUser(newUser);
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}