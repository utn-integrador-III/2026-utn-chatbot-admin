import type { ReactNode } from 'react';
import NovaMark from '../ui/NovaMark';
import brainBg from '../../assets/images/imgFondo.png';
import '../../styles/DashboardLayoutSA.css';

export default function DashboardLayoutSA({ children }: { children: ReactNode }) {
  return (
    <div className="dashboard-layout">
      <img src={brainBg} alt="" aria-hidden="true" className="dashboard-layout__bg" />
      <div className="dashboard-layout__overlay" />
      <div className="dashboard-layout__content">
        <div style={{ marginBottom: 24 }}>
          <NovaMark />
        </div>
        {children}
      </div>
    </div>
  );
}