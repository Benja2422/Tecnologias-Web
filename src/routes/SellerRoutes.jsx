import { Route, Routes } from 'react-router-dom';
import SellerDashboardPage from '../pages/SellerDashboardPage';
import SellerInventoryPage from '../pages/SellerInventoryPage';
import SellerCatalogPage from '../pages/SellerCatalogPage';
import SellerProductFormPage from '../pages/SellerProductFormPage';
import SellerServiceFormPage from '../pages/SellerServiceFormPage';
import SellerOffersPage from '../pages/SellerOffersPage';
import SellerOrdersPage from '../pages/SellerOrdersPage';
import SellerQuotationsPage from '../pages/SellerQuotationsPage';
import SellerQuestionsPage from '../pages/SellerQuestionsPage';
import SellerReturnsPage from '../pages/SellerReturnsPage';
import SellerReviewsPage from '../pages/SellerReviewsPage';
import SellerProfilePage from '../pages/SellerProfilePage';
import NotFoundPage from '../pages/NotFoundPage';

// Panel de emprendedor (/emprendedor/*). TODO: exigir la sesión con rol de emprendedor cuando exista en src/contexts.
export default function SellerRoutes() {
  return (
    <Routes>
      <Route index element={<SellerDashboardPage />} />
      <Route path="inventario" element={<SellerInventoryPage />} />
      <Route path="catalogo" element={<SellerCatalogPage />} />
      <Route path="productos/nuevo" element={<SellerProductFormPage />} />
      <Route path="productos/:itemId/editar" element={<SellerProductFormPage />} />
      <Route path="servicios/nuevo" element={<SellerServiceFormPage />} />
      <Route path="servicios/:itemId/editar" element={<SellerServiceFormPage />} />
      <Route path="ofertas" element={<SellerOffersPage />} />
      <Route path="pedidos" element={<SellerOrdersPage />} />
      <Route path="cotizaciones" element={<SellerQuotationsPage />} />
      <Route path="preguntas" element={<SellerQuestionsPage />} />
      <Route path="devoluciones" element={<SellerReturnsPage />} />
      <Route path="calificaciones" element={<SellerReviewsPage />} />
      <Route path="perfil" element={<SellerProfilePage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
