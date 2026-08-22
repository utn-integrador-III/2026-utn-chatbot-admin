import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '../services/authService';
import { loginApiClient } from '../services/apiClient';

vi.mock('../services/apiClient', () => ({
  loginApiClient: {
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('login envía identifier y password a /login', async () => {
    const mockResponse = {
      data: {
        token: 'fake-token',
        admin: { id: '1', full_name: 'Test', user_name: 'test', email: 't@t.com', role: 'admin' },
      },
    };
    (loginApiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const result = await authService.login({ identifier: 'test@utn.ac.cr', password: '123' });

    expect(loginApiClient.post).toHaveBeenCalledWith('/login', {
      identifier: 'test@utn.ac.cr',
      password: '123',
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('createAdmin envía los datos a /signup', async () => {
    const mockResponse = { data: { token: 'x', admin: {}, message: 'ok', expires_at: '' } };
    (loginApiClient.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);

    const payload = { full_name: 'Nuevo', user_name: 'nuevo', email: 'n@utn.ac.cr', password: '123' };
    await authService.createAdmin(payload);

    expect(loginApiClient.post).toHaveBeenCalledWith('/signup', payload);
  });

  it('deleteUser envía admin_id en el body del DELETE', async () => {
    (loginApiClient.delete as ReturnType<typeof vi.fn>).mockResolvedValueOnce({});

    await authService.deleteUser('abc-123');

    expect(loginApiClient.delete).toHaveBeenCalledWith('/delete_user', {
      data: { admin_id: 'abc-123' },
    });
  });

  it('logout limpia el token y usuario de localStorage', () => {
    localStorage.setItem('nova_token', 'x');
    localStorage.setItem('nova_user', '{}');

    authService.logout();

    expect(localStorage.getItem('nova_token')).toBeNull();
    expect(localStorage.getItem('nova_user')).toBeNull();
  });
});