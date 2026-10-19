import { Navigate, Route, Routes } from 'react-router-dom';
import CatalogPage from '../pages/CatalogPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import CategoryPage from '../pages/CategoryPage';
import SearchResultsPage from '../pages/SearchResultsPage';
import CheckoutShippingPage from '../pages/CheckoutShippingPage';
import CheckoutPaymentPage from '../pages/CheckoutPaymentPage';
import OrderConfirmationPage from '../pages/OrderConfirmationPage';
import CartPage from '../pages/CartPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ProfilePage from '../pages/ProfilePage';
import AddressesPage from '../pages/AddressesPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import NotFoundPage from '../pages/NotFoundPage';

// TODO: proteger /perfil, /direcciones y /admin/* cuando exista la sesión en src/contexts
// (las rutas /admin/* deben exigir además el rol de administrador)
export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CatalogPage />} />
      <Route path="/categorias" element={<Navigate to="/categorias/tecnologia" replace />} />
      <Route path="/categorias/:categoryId" element={<CategoryPage />} />
      <Route path="/carrito" element={<CartPage />} />
      <Route path="/checkout/despacho" element={<CheckoutShippingPage />} />
      <Route path="/checkout/pago" element={<CheckoutPaymentPage />} />
      <Route path="/checkout/confirmacion/:orderId" element={<OrderConfirmationPage />} />
      <Route path="/buscar" element={<SearchResultsPage />} />
      <Route path="/producto/:productId" element={<ProductDetailPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/registro" element={<RegisterPage />} />
      <Route path="/perfil" element={<ProfilePage />} />
      <Route path="/direcciones" element={<AddressesPage />} />
      <Route path="/admin" element={<Navigate to="/admin/usuarios" replace />} />
      <Route path="/admin/usuarios" element={<AdminUsersPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
