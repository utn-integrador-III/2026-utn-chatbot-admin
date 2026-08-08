import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';

vi.mock('../services/authService', () => ({
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'logueado' : 'no logueado'}</p>
      <p data-testid="user-name">{user?.full_name ?? 'sin usuario'}</p>
      <button onClick={() => login({ identifier: 'test', password: '123' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>,
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('inicia sin usuario autenticado si no hay nada en localStorage', () => {
    renderWithProvider();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no logueado');
  });

  it('restaura el usuario desde localStorage si existe token y usuario válidos', () => {
    localStorage.setItem('nova_token', 'fake-token');
    localStorage.setItem('nova_user', JSON.stringify({ full_name: 'Jorjan' }));

    renderWithProvider();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('logueado');
    expect(screen.getByTestId('user-name')).toHaveTextContent('Jorjan');
  });

  it('no truena si nova_user tiene JSON inválido, y limpia localStorage', () => {
    localStorage.setItem('nova_token', 'fake-token');
    localStorage.setItem('nova_user', '{json-invalido');

    renderWithProvider();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no logueado');
    expect(localStorage.getItem('nova_user')).toBeNull();
  });

  it('login exitoso actualiza el estado y guarda en localStorage', async () => {
    (authService.login as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      token: 'nuevo-token',
      admin: { full_name: 'Marco', role: 'super_admin' },
    });

    renderWithProvider();
    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('logueado');
    });
    expect(screen.getByTestId('user-name')).toHaveTextContent('Marco');
    expect(localStorage.getItem('nova_token')).toBe('nuevo-token');
  });

  it('logout limpia el estado y llama a authService.logout', () => {
    localStorage.setItem('nova_token', 'fake-token');
    localStorage.setItem('nova_user', JSON.stringify({ full_name: 'Jorjan' }));

    renderWithProvider();
    fireEvent.click(screen.getByText('Logout'));

    expect(authService.logout).toHaveBeenCalled();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('no logueado');
  });
});