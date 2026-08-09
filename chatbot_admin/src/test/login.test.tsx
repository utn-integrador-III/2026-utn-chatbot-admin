import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from '../pages/login';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

vi.mock('../components/layout/AuthLayout', () => ({
  default: ({
    children,
    subtitle,
  }: {
    children: React.ReactNode;
    subtitle: string;
  }) => (
    <div>
      <p>{subtitle}</p>
      {children}
    </div>
  ),
}));

vi.mock('../components/ui/Card', () => ({
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('../components/ui/Input', () => ({
  default: ({
    label,
    placeholder,
    value,
    onChange,
    type,
  }: {
    label: string;
    placeholder?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    type?: string;
  }) => (
    <div>
      <label>{label}</label>
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        type={type || 'text'}
      />
    </div>
  ),
}));

vi.mock('../components/ui/Button', () => ({
  default: ({
    children,
    type,
    isLoading,
  }: {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    isLoading?: boolean;
  }) => (
    <button type={type || 'button'}>
      {isLoading ? 'Cargando...' : children}
    </button>
  ),
}));

vi.mock('../components/ui/NovaMark', () => ({
  default: () => <div>NOVA</div>,
}));

describe('Login', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      login: mockLogin,
      logout: vi.fn(),
    });
  });

  function renderLogin() {
    return render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  }

  it('renderiza la pantalla de login', () => {
    renderLogin();

    expect(
      screen.getByText('¡Bienvenido de nuevo!')
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        'Gestiona la información con la que NOVA responde a tus estudiantes.'
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Usuario o correo institucional')
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText('Contraseña')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    ).toBeInTheDocument();
  });

  it('muestra error cuando se intenta iniciar sesión con campos vacíos', () => {
    renderLogin();

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    expect(
      screen.getByText('Completa usuario y contraseña.')
    ).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('muestra error cuando solo se completa el usuario', () => {
    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Usuario o correo institucional'),
      {
        target: {
          value: 'marco',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    expect(
      screen.getByText('Completa usuario y contraseña.')
    ).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('muestra error cuando solo se completa la contraseña', () => {
    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Contraseña'),
      {
        target: {
          value: '123456',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    expect(
      screen.getByText('Completa usuario y contraseña.')
    ).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('inicia sesión correctamente como administrador', async () => {
    mockLogin.mockResolvedValueOnce({
      id: '1',
      user_name: 'marco',
      email: 'marco@utn.ac.cr',
      role: 'admin',
      full_name: 'Marco',
    });

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Usuario o correo institucional'),
      {
        target: {
          value: 'marco',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Contraseña'),
      {
        target: {
          value: '123456',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        identifier: 'marco',
        password: '123456',
      });
    });
  });

  it('inicia sesión correctamente como super administrador', async () => {
    mockLogin.mockResolvedValueOnce({
      id: '2',
      user_name: 'superadmin',
      email: 'superadmin@utn.ac.cr',
      role: 'super_admin',
      full_name: 'Super Admin',
    });

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Usuario o correo institucional'),
      {
        target: {
          value: 'superadmin',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Contraseña'),
      {
        target: {
          value: '123456',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        identifier: 'superadmin',
        password: '123456',
      });
    });
  });

  it('muestra mensaje de error cuando las credenciales son incorrectas', async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        status: 401,
      },
    });

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Usuario o correo institucional'),
      {
        target: {
          value: 'usuario',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Contraseña'),
      {
        target: {
          value: 'incorrecta',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Usuario o contraseña incorrectos. Verifica tus datos.'
        )
      ).toBeInTheDocument();
    });
  });

  it('muestra mensaje de error cuando el servidor devuelve 400', async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        status: 400,
      },
    });

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Usuario o correo institucional'),
      {
        target: {
          value: 'usuario',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Contraseña'),
      {
        target: {
          value: '123456',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    await waitFor(() => {
      expect(
        screen.getByText(
          'Completa correctamente todos los campos.'
        )
      ).toBeInTheDocument();
    });
  });

  it('muestra el mensaje de error enviado por el servidor', async () => {
    mockLogin.mockRejectedValueOnce({
      response: {
        status: 500,
        data: {
          error: 'Servicio temporalmente no disponible',
        },
      },
    });

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Usuario o correo institucional'),
      {
        target: {
          value: 'usuario',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Contraseña'),
      {
        target: {
          value: '123456',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    await waitFor(() => {
      expect(
        screen.getByText('Servicio temporalmente no disponible')
      ).toBeInTheDocument();
    });
  });

  it('muestra error cuando no hay conexión con el servidor', async () => {
    mockLogin.mockRejectedValueOnce(
      new Error('Network Error')
    );

    renderLogin();

    fireEvent.change(
      screen.getByPlaceholderText('Usuario o correo institucional'),
      {
        target: {
          value: 'usuario',
        },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText('Contraseña'),
      {
        target: {
          value: '123456',
        },
      }
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Iniciar sesión' })
    );

    await waitFor(() => {
      expect(
        screen.getByText('No se pudo conectar con el servidor.')
      ).toBeInTheDocument();
    });
  });
});
