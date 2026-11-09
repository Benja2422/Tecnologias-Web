import MainLayout from '../components/templates/MainLayout';
import HeroBanner from '../components/organisms/HeroBanner';
import ItemSection from '../components/organisms/ItemSection';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { toCartLine } from '../utils/cart';
import { currentUser, featuredProducts as allFeaturedProducts, featuredServices as allFeaturedServices } from '../utils/mockCatalog';
import { liveFeatured } from '../utils/catalogAdmin';

export default function CatalogPage() {
  const { addItem } = useCart();
  const { ids: favoriteIds, toggle } = useWishlist();
  // Sin lo que el administrador suspendió o dio de baja
  const featuredProducts = liveFeatured(allFeaturedProducts, 'p');
  const featuredServices = liveFeatured(allFeaturedServices, 's');

  const toggleFavorite = (item) => {
    const kind = featuredServices.some((s) => s.id === item.id) ? 'servicio' : 'producto';
    const adding = toggle(item, kind);
    console.log(`[Lista de deseos] ${adding ? 'Añadir' : 'Quitar'}:`, { id: item.id, name: item.name, tipo: kind });
  };

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
