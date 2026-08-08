import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NovaMark from '../components/ui/NovaMark';

describe('NovaMark', () => {
  it('se renderiza sin errores', () => {
    render(<NovaMark />);
  });

  it('muestra el texto "NOVA"', () => {
    render(<NovaMark />);
    expect(screen.getByText('NOVA')).toBeInTheDocument();
  });

  it('usa el tamaño por defecto de 40px', () => {
    const { container } = render(<NovaMark />);
    const img = container.querySelector('img');
    expect(img).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('respeta el tamaño personalizado cuando se pasa por prop', () => {
    const { container } = render(<NovaMark size={24} />);
    const img = container.querySelector('img');
    expect(img).toHaveStyle({ width: '24px', height: '24px' });
  });
});