import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AuthLayout from '../components/layout/AuthLayout';

describe('AuthLayout', () => {
  it('renderiza el subtítulo correctamente', () => {
    render(
      <AuthLayout subtitle="Inicie sesión para continuar">
        <div>Formulario de login</div>
      </AuthLayout>
    );

    const title = document.querySelector('.auth-layout__title h2');

    expect(title).toBeInTheDocument();
    expect(title?.textContent).toContain(
      'Universidad Técnica Nacional'
    );
    expect(title?.textContent).toContain(
      'Inicie sesión para continuar'
    );
  });

  it('renderiza los elementos children', () => {
    render(
      <AuthLayout subtitle="Inicie sesión">
        <div>Formulario de login</div>
      </AuthLayout>
    );

    expect(
      screen.getByText('Formulario de login')
    ).toBeInTheDocument();
  });

  it('utiliza la posición derecha por defecto', () => {
    const { container } = render(
      <AuthLayout subtitle="Inicie sesión">
        <div>Contenido</div>
      </AuthLayout>
    );

    const layout = container.querySelector('.auth-layout');

    expect(layout).toBeInTheDocument();
    expect(layout).not.toHaveClass('auth-layout--left');
  });

  it('agrega la clase de posición izquierda cuando cardPosition es left', () => {
    const { container } = render(
      <AuthLayout
        subtitle="Inicie sesión"
        cardPosition="left"
      >
        <div>Contenido</div>
      </AuthLayout>
    );

    const layout = container.querySelector('.auth-layout');

    expect(layout).toBeInTheDocument();
    expect(layout).toHaveClass('auth-layout--left');
  });

  it('muestra el nombre de la Universidad Técnica Nacional', () => {
    render(
      <AuthLayout subtitle="Inicie sesión">
        <div>Contenido</div>
      </AuthLayout>
    );

    const title = document.querySelector('.auth-layout__title h2');

    expect(title).toBeInTheDocument();
    expect(title?.textContent).toContain(
      'Universidad Técnica Nacional'
    );
  });
});