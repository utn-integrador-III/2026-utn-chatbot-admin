import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AdminTopBar from '../components/layout/AdminTopBar';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

vi.mock('../components/ui/NovaMark', () => ({
  default: () => <div data-testid="nova-mark">NOVA</div>,
}));

describe('AdminTopBar', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

   vi.mocked(useAuth).mockReturnValue({
    isAuthenticated: true,
    isLoading: false,
    user: {
      id: '1',
      user_name: 'marco',
      email: 'marco@utn.ac.cr',
      role: 'admin',
      full_name: 'Marco',
    },
  login: vi.fn(),
  logout: mockLogout,
});
  });

  it('renderiza el contenido recibido por children', () => {
    render(
      <AdminTopBar>
        <div>Contenido del dashboard</div>
      </AdminTopBar>
    );

    expect(
      screen.getByText('Contenido del dashboard')
    ).toBeInTheDocument();
  });

  it('renderiza la marca NOVA', () => {
    render(
      <AdminTopBar>
        <div>Dashboard</div>
      </AdminTopBar>
    );

    expect(screen.getByTestId('nova-mark')).toBeInTheDocument();
  });

  it('muestra el botón de cerrar sesión', () => {
    render(
      <AdminTopBar>
        <div>Dashboard</div>
      </AdminTopBar>
    );

    expect(
      screen.getByText('Cerrar sesión')
    ).toBeInTheDocument();
  });

  it('ejecuta logout al hacer clic en cerrar sesión', () => {
    render(
      <AdminTopBar>
        <div>Dashboard</div>
      </AdminTopBar>
    );

    fireEvent.click(screen.getByText('Cerrar sesión'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});