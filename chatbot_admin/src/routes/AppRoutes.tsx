import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login';
//import Register from '../pages/register';
//import UploadArchive from '../pages/upload-archive';

// NOTA: por ahora las rutas están abiertas para poder revisar lo visual
// sin backend conectado. Cuando conectemos la API, envolvemos
// "/upload-archive" con <ProtectedRoute> para exigir sesión iniciada.
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}