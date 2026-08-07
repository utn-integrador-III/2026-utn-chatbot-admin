import { Home, FolderOpen, History, Settings, Power } from 'lucide-react';
import NovaMark from '../components/ui/NovaMark';
import { useAuth } from '../hooks/useAuth';
import '../styles/Sidebar.css';

const navItems = [
  { label: 'Inicio', icon: Home, active: true },
  { label: 'Gestionar Fuentes de Datos', icon: FolderOpen, active: false },
  { label: 'Historial de Carga', icon: History, active: false },
  { label: 'Configuración', icon: Settings, active: false },
];

export default function AdminSidebar() {
  const { logout } = useAuth();

  return (
    <aside className="admin-sidebar">
      <div>
        <div className="admin-sidebar__logo">
          <NovaMark size={30} />
        </div>
        <nav className="admin-sidebar__nav">
          {navItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              type="button"
              className={`admin-sidebar__link ${active ? 'admin-sidebar__link--active' : ''}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <button type="button" className="admin-sidebar__logout" onClick={logout}>
        <Power size={18} />
        Cerrar sesión
      </button>
    </aside>
  );
}