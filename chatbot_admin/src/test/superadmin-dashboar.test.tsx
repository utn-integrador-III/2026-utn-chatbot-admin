import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SuperadminDashboard from '../pages/superadmin-dashboar';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';

vi.mock('../services/authService', () => ({
  authService: {
    createAdmin: vi.fn(),
    deleteUser: vi.fn(),
  },
}));

vi.mock('../hooks/useAuth');

vi.mock('../components/layout/DashboardLayoutSA', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('SuperadminDashboard', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    localStorage.clear();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: {
        id: '1',
        user_name: 'superadmin',
        email: 'superadmin@utn.ac.cr',
        role: 'super_admin',
        full_name: 'Super Admin',
      },
      login: vi.fn(),
      logout: mockLogout,
    });
  });

  it('renderiza el panel de super-administrador', () => {
    render(<SuperadminDashboard />);

    expect(
      screen.getByText('Panel de Super-administrador')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Gestiona las cuentas administrativas de NOVA.')
    ).toBeInTheDocument();
  });

  it('muestra las cuentas iniciales', () => {
    render(<SuperadminDashboard />);

    expect(
      screen.getByText('Marco Campos')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Laura Montero')
    ).toBeInTheDocument();
  });

  it('muestra correctamente las estadísticas', () => {
    render(<SuperadminDashboard />);

    // 2 cuentas totales y 2 super-administradores
    expect(screen.getAllByText('2')).toHaveLength(2);

    // 0 administradores normales
    expect(screen.getByText('0')).toBeInTheDocument();

    expect(
      screen.getByText('Cuentas totales')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Administradores')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Super-administradores')
    ).toBeInTheDocument();
  });

  it('muestra el formulario para crear una cuenta', () => {
    render(<SuperadminDashboard />);

    expect(
      screen.getByText('Crear nueva cuenta admin')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Nombre y apellidos')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Nombre de usuario')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('correo@utn.ac.cr')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('••••••••')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /Crear cuenta/i })
    ).toBeInTheDocument();
  });

  it('muestra error si se intenta crear una cuenta con campos vacíos', () => {
    render(<SuperadminDashboard />);

    fireEvent.click(
      screen.getByRole('button', { name: /Crear cuenta/i })
    );

    expect(
      screen.getByText('Completa todos los campos.')
    ).toBeInTheDocument();

    expect(
      authService.createAdmin
    ).not.toHaveBeenCalled();
  });

  it('crea una nueva cuenta correctamente', async () => {
    vi.mocked(authService.createAdmin).mockResolvedValueOnce({
      message: 'Administrador creado correctamente.',
      token: 'mock-token',
      expires_at: '2026-12-31T23:59:59',
      admin: {
        id: '3',
        full_name: 'Juan Pérez',
        user_name: 'juan.perez',
        email: 'juan@utn.ac.cr',
        role: 'admin',
      },
    });

    render(<SuperadminDashboard />);

    fireEvent.change(
      screen.getByPlaceholderText('Nombre y apellidos'),
      {
        target: {
          value: 'Juan Pérez',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Nombre de usuario'),
      {
        target: {
          value: 'juan.perez',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('correo@utn.ac.cr'),
      {
        target: {
          value: 'juan@utn.ac.cr',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••••'),
      {
        target: {
          value: '12345678',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Crear cuenta/i })
    );

    await waitFor(() => {
      expect(authService.createAdmin).toHaveBeenCalledWith({
        full_name: 'Juan Pérez',
        user_name: 'juan.perez',
        email: 'juan@utn.ac.cr',
        password: '12345678',
      });
    });

    expect(
      await screen.findByText('Cuenta creada para Juan Pérez.')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Juan Pérez')
    ).toBeInTheDocument();
  });

  it('muestra el error enviado por el servidor al crear una cuenta', async () => {
    vi.mocked(authService.createAdmin).mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          error: 'El usuario ya existe.',
        },
      },
    });

    render(<SuperadminDashboard />);

    fireEvent.change(
      screen.getByPlaceholderText('Nombre y apellidos'),
      {
        target: {
          value: 'Juan Pérez',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Nombre de usuario'),
      {
        target: {
          value: 'juan.perez',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('correo@utn.ac.cr'),
      {
        target: {
          value: 'juan@utn.ac.cr',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••••'),
      {
        target: {
          value: '12345678',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Crear cuenta/i })
    );

    expect(
      await screen.findByText('El usuario ya existe.')
    ).toBeInTheDocument();
  });

  it('muestra error de conexión al crear una cuenta', async () => {
    vi.mocked(authService.createAdmin).mockRejectedValueOnce(
      new Error('Network Error')
    );

    render(<SuperadminDashboard />);

    fireEvent.change(
      screen.getByPlaceholderText('Nombre y apellidos'),
      {
        target: {
          value: 'Juan Pérez',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Nombre de usuario'),
      {
        target: {
          value: 'juan.perez',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('correo@utn.ac.cr'),
      {
        target: {
          value: 'juan@utn.ac.cr',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('••••••••'),
      {
        target: {
          value: '12345678',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: /Crear cuenta/i })
    );

    expect(
      await screen.findByText(
        'No se pudo conectar con el servidor.'
      )
    ).toBeInTheDocument();
  });

  it('permite cancelar la eliminación de un administrador', () => {
    const confirmMock = vi
      .spyOn(window, 'confirm')
      .mockReturnValue(false);

    localStorage.setItem(
      'nova_admins_cache',
      JSON.stringify([
        {
          id: '1',
          full_name: 'Marco Campos',
          user_name: 'marco.campos',
          email: 'marco@superadmin.com',
          role: 'super_admin',
        },
        {
          id: '2',
          full_name: 'Laura Montero',
          user_name: 'laura.montero',
          email: 'laura@superadmin.com',
          role: 'super_admin',
        },
        {
          id: '3',
          full_name: 'Juan Pérez',
          user_name: 'juan.perez',
          email: 'juan@utn.ac.cr',
          role: 'admin',
        },
      ])
    );

    render(<SuperadminDashboard />);

    const deleteButton = screen.getByTitle('Eliminar');

    fireEvent.click(deleteButton);

    expect(confirmMock).toHaveBeenCalledWith(
      '¿Eliminar la cuenta de Juan Pérez?'
    );

    expect(
      authService.deleteUser
    ).not.toHaveBeenCalled();

    expect(
      screen.getByText('Juan Pérez')
    ).toBeInTheDocument();

    confirmMock.mockRestore();
  });

  it('cierra sesión al presionar Cerrar sesión', () => {
    render(<SuperadminDashboard />);

    fireEvent.click(
      screen.getByRole('button', { name: /Cerrar sesión/i })
    );

    expect(mockLogout).toHaveBeenCalled();
  });

  it('guarda las cuentas en localStorage', async () => {
    render(<SuperadminDashboard />);

    await waitFor(() => {
      const stored = localStorage.getItem('nova_admins_cache');

      expect(stored).not.toBeNull();

      const admins = JSON.parse(stored!);

      expect(admins).toHaveLength(2);
    });
  });
});