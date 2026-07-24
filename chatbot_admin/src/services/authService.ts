import { apiClient } from './apiClient';
import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/user';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/forgot-password', { email });
  },

  logout(): void {
    localStorage.removeItem('nova_token');
    localStorage.removeItem('nova_user');
  },
};