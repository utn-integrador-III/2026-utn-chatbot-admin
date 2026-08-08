import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

vi.mock('../hooks/useAuth');

function renderProtected(allowedRoles?: ('admin' | 'super_admin')[]) {
  return render(
    <MemoryRouter initialEntries={['/protected']}>
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute allowedRoles={allowedRoles}>
              <div>Contenido protegido</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Pantalla de login</div>} />
        <Route path="/admin" element={<div>Dashboard admin</div>} />
        <Route path="/superadmin" element={<div>Dashboard superadmin</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('ProtectedRoute', () => {
  it('muestra "Cargando..." mientras isLoading es true', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    renderProtected();
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('redirige a /login si no está autenticado', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    renderProtected();
    expect(screen.getByText('Pantalla de login')).toBeInTheDocument();
  });

  it('muestra el contenido si está autenticado y no se restringen roles', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { role: 'admin' },
    });

    renderProtected();
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('muestra el contenido si el rol del usuario está permitido', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { role: 'admin' },
    });

    renderProtected(['admin']);
    expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
  });

  it('redirige a /admin si un admin intenta acceder a una ruta solo de super_admin', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { role: 'admin' },
    });

    renderProtected(['super_admin']);
    expect(screen.getByText('Dashboard admin')).toBeInTheDocument();
  });

  it('redirige a /superadmin si un super_admin intenta acceder a una ruta solo de admin', () => {
    (useAuth as ReturnType<typeof vi.fn>).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { role: 'super_admin' },
    });

    renderProtected(['admin']);
    expect(screen.getByText('Dashboard superadmin')).toBeInTheDocument();
  });
});