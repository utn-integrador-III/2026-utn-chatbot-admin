import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../components/ui/Input';

describe('Input', () => {
  it('se renderiza con su label visible', () => {
    render(<Input label="Correo institucional" />);
    expect(screen.getByText('Correo institucional')).toBeInTheDocument();
  });

  it('oculta visualmente el label cuando hideLabel es true', () => {
    render(<Input label="Correo institucional" hideLabel />);
    const label = screen.getByText('Correo institucional');
    expect(label).toHaveClass('input-group__label--hidden');
  });

  it('muestra el mensaje de error cuando se pasa la prop error', () => {
    render(<Input label="Contraseña" error="Este campo es obligatorio" />);
    expect(screen.getByText('Este campo es obligatorio')).toBeInTheDocument();
  });

  it('no muestra ningún error si no se pasa la prop error', () => {
    render(<Input label="Correo" />);
    expect(screen.queryByText(/obligatorio/i)).not.toBeInTheDocument();
  });

  it('permite escribir en el campo', () => {
    render(<Input label="Nombre" />);
    const input = screen.getByLabelText('Nombre') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Jorjan' } });
    expect(input.value).toBe('Jorjan');
  });

  it('no muestra el botón de mostrar/ocultar contraseña si type no es "password"', () => {
    render(<Input label="Correo" type="email" />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('muestra el botón de mostrar/ocultar contraseña cuando type es "password"', () => {
    render(<Input label="Contraseña" type="password" />);
    expect(screen.getByRole('button', { name: /mostrar contraseña/i })).toBeInTheDocument();
  });

  it('cambia el tipo de input de "password" a "text" al hacer clic en mostrar', () => {
    render(<Input label="Contraseña" type="password" />);
    const input = screen.getByLabelText('Contraseña');
    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(screen.getByRole('button', { name: /mostrar contraseña/i }));
    expect(input).toHaveAttribute('type', 'text');
  });

  it('vuelve a ocultar la contraseña al hacer clic de nuevo', () => {
    render(<Input label="Contraseña" type="password" />);
    const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });
    fireEvent.click(toggleButton);
    fireEvent.click(screen.getByRole('button', { name: /ocultar contraseña/i }));

    expect(screen.getByLabelText('Contraseña')).toHaveAttribute('type', 'password');
  });
});