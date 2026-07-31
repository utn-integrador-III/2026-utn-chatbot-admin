import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
import SuperadminDashboard from '../pages/superadmin-dashboar';
import ProtectedRoute from './ProtectedRoute';

function AdminPlaceholder() {
  return <div style={{ padding: 40 }}>Panel de administrador — próximamente.</div>;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={['super_admin']}>
            <SuperadminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminPlaceholder />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}