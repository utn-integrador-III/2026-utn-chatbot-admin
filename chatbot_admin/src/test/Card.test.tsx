import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from '../components/ui/Card';

describe('Card', () => {
  it('se renderiza con su contenido hijo', () => {
    render(<Card>Contenido de prueba</Card>);
    expect(screen.getByText('Contenido de prueba')).toBeInTheDocument();
  });

  it('aplica las clases base "card card--padded"', () => {
    const { container } = render(<Card>Texto</Card>);
    expect(container.firstChild).toHaveClass('card', 'card--padded');
  });

  it('agrega clases adicionales pasadas por className', () => {
    const { container } = render(<Card className="extra-class">Texto</Card>);
    expect(container.firstChild).toHaveClass('card', 'card--padded', 'extra-class');
  });
});