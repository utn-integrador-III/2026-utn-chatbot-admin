import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';

describe('Button', () => {
  it('se renderiza con el texto pasado como children', () => {
    render(<Button>Iniciar sesión</Button>);
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
  });

  it('usa la variante "primary" por defecto', () => {
    render(<Button>Enviar</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--primary');
  });

  it('aplica la clase correspondiente cuando se pasa variant="danger"', () => {
    render(<Button variant="danger">Eliminar</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--danger');
  });

  it('aplica la clase correspondiente cuando se pasa variant="ghost"', () => {
    render(<Button variant="ghost">Cancelar</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn--ghost');
  });

  it('muestra "Cargando..." y se deshabilita cuando isLoading es true', () => {
    render(<Button isLoading>Enviar</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Cargando...');
    expect(button).toBeDisabled();
  });

  it('se deshabilita cuando se pasa disabled', () => {
    render(<Button disabled>Enviar</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('ejecuta el onClick al hacer clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Enviar</Button>);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta el onClick cuando está deshabilitado', () => {
    const handleClick = vi.fn();
    render(
      <Button onClick={handleClick} disabled>
        Enviar
      </Button>,
    );
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});