import { Navigate, Route, Routes } from 'react-router-dom';
import CatalogPage from '../pages/CatalogPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import AdminUsersPage from '../pages/AdminUsersPage';
import NotFoundPage from '../pages/NotFoundPage';

// TODO: proteger /perfil y /admin/* cuando exista la sesión en src/contexts
// (las rutas /admin/* deben exigir además el rol de administrador)
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/admin" element={<Navigate to="/admin/usuarios" replace />} />
      <Route path="/admin/usuarios" element={<AdminUsersPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
