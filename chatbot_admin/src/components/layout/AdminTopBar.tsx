import type { ReactNode } from 'react';
import { LogOut } from 'lucide-react';
import NovaMark from '../ui/NovaMark';
import { useAuth } from '../../hooks/useAuth';
import brainBg from '../../assets/images/imgFondo.png';
import '../../styles/AdminTopBar.css';

export default function AdminTopBar({ children }: { children: ReactNode }) {
  const { logout } = useAuth();

  return (
    <div
      className="admin-topbar-layout"
      style={{ '--admin-bg-image': `url(${brainBg})` } as React.CSSProperties}
    >
      <div className="admin-topbar">
        <NovaMark size={28} />
        <button type="button" className="admin-topbar__logout" onClick={logout}>
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
      <div className="admin-topbar-layout__content">{children}</div>
    </div>
  );
}