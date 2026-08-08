import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardLayoutSA from '../components/layout/DashboardLayoutSA';

describe('DashboardLayoutSA', () => {
  it('renderiza el contenido recibido por children', () => {
    render(
      <DashboardLayoutSA>
        <div>Contenido del dashboard</div>
      </DashboardLayoutSA>
    );

    expect(
      screen.getByText('Contenido del dashboard')
    ).toBeInTheDocument();
  });

  it('renderiza el fondo del dashboard', () => {
    render(
      <DashboardLayoutSA>
        <div>Contenido</div>
      </DashboardLayoutSA>
    );

    const background = document.querySelector(
      '.dashboard-layout__bg'
    );

    expect(background).toBeInTheDocument();
    expect(background).toHaveAttribute('alt', '');
    expect(background).toHaveAttribute('aria-hidden', 'true');
  });

  it('renderiza el overlay', () => {
    render(
      <DashboardLayoutSA>
        <div>Contenido</div>
      </DashboardLayoutSA>
    );

    const overlay = document.querySelector(
      '.dashboard-layout__overlay'
    );

    expect(overlay).toBeInTheDocument();
  });

  it('renderiza la marca NOVA', () => {
    render(
      <DashboardLayoutSA>
        <div>Contenido</div>
      </DashboardLayoutSA>
    );

    expect(
      screen.getByText('NOVA')
    ).toBeInTheDocument();
  });

  it('renderiza la estructura principal del layout', () => {
    render(
      <DashboardLayoutSA>
        <div>Contenido</div>
      </DashboardLayoutSA>
    );

    expect(
      document.querySelector('.dashboard-layout')
    ).toBeInTheDocument();

    expect(
      document.querySelector('.dashboard-layout__content')
    ).toBeInTheDocument();
  });
});