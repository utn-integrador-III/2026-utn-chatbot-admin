import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../routes/AppRoutes';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AppRoutes />
    </MemoryRouter>
  );
}

describe('AppRoutes', () => {
  it('redirige "/" a la pantalla de login', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderAt('/');

    expect(
      screen.getByText('¡Bienvenido de nuevo!')
    ).toBeInTheDocument();
  });

  it('una ruta desconocida redirige a login', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderAt('/ruta-que-no-existe');

    expect(
      screen.getByText('¡Bienvenido de nuevo!')
    ).toBeInTheDocument();
  });

  it('/admin sin sesión redirige a login', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderAt('/admin');

    expect(
      screen.getByText('¡Bienvenido de nuevo!')
    ).toBeInTheDocument();
  });

  it('/superadmin con sesión de super_admin muestra el dashboard', () => {
    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        user_name: 'marco',
        email: 'marco@utn.ac.cr',
        role: 'super_admin',
        full_name: 'Marco',
      },
      login: vi.fn(),
      logout: vi.fn(),
    });

    renderAt('/superadmin');

    expect(
      screen.getByText('Panel de Super-administrador')
    ).toBeInTheDocument();
  });
});
