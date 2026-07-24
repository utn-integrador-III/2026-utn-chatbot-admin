import type { ReactNode } from 'react';
import brainBg from '../../assets/images/imgFondo.png';
import '../../styles/AuthLayout.css';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-layout">
      <img src={brainBg} alt="" aria-hidden="true" className="auth-layout__bg" />
      <div className="auth-layout__overlay" />
      <div className="auth-layout__title">
        <h2>
          Universidad Técnica Nacional
          <br />
          Plataforma Inteligente NOVA
        </h2>
      </div>
      <div className="auth-layout__content">{children}</div>
    </div>
  );
}