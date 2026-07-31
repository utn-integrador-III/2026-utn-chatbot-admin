import { loginApiClient } from './apiClient';
import type { LoginPayload, CreateAdminPayload, AuthResponse } from '../types/user';

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const { data } = await loginApiClient.post<AuthResponse>('/login', payload);
    return data;
  },

  async createAdmin(payload: CreateAdminPayload): Promise<AuthResponse> {
    const { data } = await loginApiClient.post<AuthResponse>('/signup', payload);
    return data;
  },

  async logoutRemote(): Promise<void> {
    await loginApiClient.post('/logout');
  },

  async deleteUser(adminId: string): Promise<void> {
    await loginApiClient.delete('/delete_user', { data: { admin_id: adminId } });
  },

  logout(): void {
    localStorage.removeItem('nova_token');
    localStorage.removeItem('nova_user');
  },
};