import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Users, ShieldCheck, UserPlus, Trash2, LogOut } from 'lucide-react';
import DashboardLayoutSA from '../components/layout/DashboardLayoutSA';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { authService } from '../services/authService';
import type { AdminUser } from '../types/user';
import { useAuth } from '../hooks/useAuth';
import '../styles/superadmin-dashboard.css';

const MOCK_ADMINS: AdminUser[] = [
  {
    id: '1',
    full_name: 'Marco Campos',
    user_name: 'marco.campos',
    email: 'marco@superadmin.com',
    role: 'super_admin',
  },
  {
    id: '2',
    full_name: 'Laura Montero',
    user_name: 'laura.montero',
    email: 'laura@superadmin.com',
    role: 'super_admin',
  },
];

export default function SuperadminDashboard() {
  const { logout } = useAuth();
  const [admins, setAdmins] = useState<AdminUser[]>(() => {
  const stored = localStorage.getItem('nova_admins_cache');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return MOCK_ADMINS;
    }
  }
   return MOCK_ADMINS;
 });

  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const totalAdmins = admins.filter((a) => a.role === 'admin').length;
  const totalSuperAdmins = admins.filter((a) => a.role === 'super_admin').length;


  useEffect(() => {
  localStorage.setItem('nova_admins_cache', JSON.stringify(admins));
 }, [admins]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fullName || !userName || !email || !password) {
      setError('Completa todos los campos.');
      return;
    }

    setIsLoading(true);
    try {
      const { admin } = await authService.createAdmin({
        full_name: fullName,
        user_name: userName,
        email,
        password,
      });
      setAdmins((prev) => [admin, ...prev]);
      setSuccess(`Cuenta creada para ${admin.full_name}.`);
      setFullName('');
      setUserName('');
      setEmail('');
      setPassword('');
    } catch (err) {
  if (err && typeof err === 'object' && 'response' in err) {
    const axiosErr = err as {
      response?: { data?: Record<string, unknown>; status?: number };
    };
    const status = axiosErr.response?.status;
    const data = axiosErr.response?.data;
    console.log('Signup error response:', status, data);
    const message =
      (data?.error as string) ||
      (data?.message as string) ||
      `Error del servidor (${status}). Revisa la consola para más detalle.`;
    setError(message);
  } else {
    setError('No se pudo conectar con el servidor.');
  }
}

  }

  async function handleDelete(admin: AdminUser) {
    if (!confirm(`¿Eliminar la cuenta de ${admin.full_name}?`)) return;

    try {
      await authService.deleteUser(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
        alert(axiosErr.response?.data?.error ?? `No se pudo eliminar (${axiosErr.response?.status}).`);
      } else {
        alert('No se pudo conectar con el servidor para eliminar la cuenta.');
      }
    }
}

  return (
    <DashboardLayoutSA>
      <div className="sa-header">
        <h1 className="sa-title">Panel de Super-administrador</h1>
        <p className="sa-subtitle">Gestiona las cuentas administrativas de NOVA.</p>
      </div>

      <div className="sa-stats">
        <Card className="sa-stat-card">
          <div className="sa-stat-icon">
            <Users size={20} />
          </div>
          <div>
            <p className="sa-stat-value">{admins.length}</p>
            <p className="sa-stat-label">Cuentas totales</p>
          </div>
        </Card>
        <Card className="sa-stat-card">
          <div className="sa-stat-icon">
            <UserPlus size={20} />
          </div>
          <div>
            <p className="sa-stat-value">{totalAdmins}</p>
            <p className="sa-stat-label">Administradores</p>
          </div>
        </Card>
        <Card className="sa-stat-card">
          <div className="sa-stat-icon">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p className="sa-stat-value">{totalSuperAdmins}</p>
            <p className="sa-stat-label">Super-administradores</p>
          </div>
        </Card>
      </div>

      <Card className="sa-card">
        <h2 className="sa-section-title">Crear nueva cuenta admin</h2>
        <form onSubmit={handleCreate} className="sa-create-form">
          <Input
            label="Nombre completo"
            placeholder="Nombre y apellidos"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            label="Usuario"
            placeholder="Nombre de usuario"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <Input
            label="Correo institucional"
            type="email"
            placeholder="correo@utn.ac.cr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Contraseña temporal"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="sa-create-error">{error}</p>}
          {success && <p className="sa-create-success">{success}</p>}

          <Button type="submit" isLoading={isLoading} className="sa-create-btn">
            <UserPlus size={16} /> Crear cuenta
          </Button>
        </form>
      </Card>

      <Card className="sa-card">
        <h2 className="sa-section-title">Usuarios registrados</h2>
        {admins.length === 0 ? (
          <p className="sa-empty">Todavía no hay cuentas registradas.</p>
        ) : (
          <table className="sa-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Usuario</th>
                <th>Correo</th>
                <th>Rol</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => (
                <tr key={admin.id}>
                  <td>{admin.full_name}</td>
                  <td>{admin.user_name}</td>
                  <td>{admin.email}</td>
                  <td>
                    <span className={`sa-role-badge sa-role-badge--${admin.role}`}>
                      {admin.role === 'super_admin' ? 'Super admin' : 'Admin'}
                    </span>
                  </td>
                  <td>
                    {admin.role === 'admin' && (
                    <button
                      type="button"
                      className="sa-delete-btn"
                      onClick={() => handleDelete(admin)}
                      title="Eliminar"
                      >
                      <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Button variant="ghost" onClick={logout} className="sa-create-btn" style={undefined}>
        <LogOut size={16} /> Cerrar sesión
      </Button>
    </DashboardLayoutSA>
  );
}