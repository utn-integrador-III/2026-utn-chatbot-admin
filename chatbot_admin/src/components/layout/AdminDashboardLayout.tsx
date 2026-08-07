import type { ReactNode } from 'react';
import AdminSidebar from '../Sidebar';
import brainBg from '../../assets/images/imgFondo.png';
import '../../styles/AdminDashboardLayout.css';

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main
        className="admin-layout__main"
        style={{ '--admin-bg-image': `url(${brainBg})` } as React.CSSProperties}
      >
        <div className="admin-layout__content">{children}</div>
      </main>
    </div>
  );
}