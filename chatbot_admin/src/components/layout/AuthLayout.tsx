import type { ReactNode } from 'react';
import brainBg from '../../assets/images/imgFondo.png';
import '../../styles/AuthLayout.css';

interface AuthLayoutProps {
  children: ReactNode;
  cardPosition?: 'left' | 'right';
  subtitle: string;
}

export default function AuthLayout({ children, cardPosition = 'right', subtitle }: AuthLayoutProps) {
  return (
    <div className={`auth-layout ${cardPosition === 'left' ? 'auth-layout--left' : ''}`}>
      <img src={brainBg} alt="" aria-hidden="true" className="auth-layout__bg" />
      <div className="auth-layout__overlay" />
      <div className="auth-layout__title">
        <h2>
          Universidad Técnica Nacional
          <br />
          {subtitle}
        </h2>
      </div>
      <div className="auth-layout__content">{children}</div>
    </div>
  );
}