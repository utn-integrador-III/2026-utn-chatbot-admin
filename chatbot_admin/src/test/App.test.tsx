import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../App';

vi.mock('../routes/AppRoutes', () => ({
  default: () => <div>Rutas de la aplicación</div>,
}));

vi.mock('../context/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="auth-provider">
      {children}
    </div>
  ),
}));

describe('App', () => {
  it('renderiza el proveedor de autenticación y las rutas', () => {
    render(<App />);

    expect(
      screen.getByTestId('auth-provider')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Rutas de la aplicación')
    ).toBeInTheDocument();
  });
});