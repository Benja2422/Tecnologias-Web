import { useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import HeroBanner from '../components/organisms/HeroBanner';
import ItemSection from '../components/organisms/ItemSection';
import { useCart } from '../contexts/CartContext';
import { toCartLine } from '../utils/cart';
import { currentUser, featuredProducts, featuredServices } from '../utils/mockCatalog';

export default function CatalogPage() {
  const { addItem } = useCart();
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());

  const toggleFavorite = ({ id }) =>
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // TODO: conectar con src/services (carrito, solicitudes, búsqueda, sesión)
  const addToCart = (item) => {
    const line = toCartLine(item);
    console.log('[Carrito] Añadir producto:', { productId: line.productId, name: line.name, variantId: null, quantity: 1, unitPrice: line.unitPrice });
    addItem(line);
  };
  const requestService = (service) => console.log('Solicitar servicio:', service);

  return (
    <MainLayout headerProps={{ user: currentUser }}>
      <HeroBanner onCta={() => console.log('Ir al catálogo')} />
      <ItemSection
        title="Productos destacados"
        seeAllHref="/productos"
        items={featuredProducts}
        actionLabel="Añadir al carrito"
        onAction={addToCart}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
      <ItemSection
        title="Servicios destacados"
        seeAllHref="/servicios"
        items={featuredServices}
        actionLabel="Solicitar servicio"
        onAction={requestService}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
      />
    </MainLayout>
  );
}
