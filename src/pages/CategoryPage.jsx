import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import MainLayout from '../components/templates/MainLayout';
import CategoryLayout from '../components/templates/CategoryLayout';
import PageContainer from '../components/atoms/PageContainer';
import PrimaryButton from '../components/atoms/PrimaryButton';
import CategorySidebar from '../components/organisms/CategorySidebar';
import CategoryListing from '../components/organisms/CategoryListing';
import { useCart } from '../contexts/CartContext';
import { toCartLine } from '../utils/cart';
import { currentUser } from '../utils/mockCatalog';
import { categoryTrees, getCategory, getCategoryPath, getCategoryType, getFirstCategoryId } from '../utils/mockCategories';
import { getProductsByCategory } from '../utils/mockProducts';
import { getServicesByCategory } from '../utils/mockServices';
import { DEFAULT_SORT, SORT_OPTIONS, sortItems } from '../utils/sortItems';
import { colors } from '../utils/theme';

const PAGE_SIZE = 6;

const TYPES = {
  productos: { actionLabel: 'Añadir al carrito', singular: 'producto', plural: 'productos', empty: 'Todavía no hay productos en esta categoría.' },
  servicios: { actionLabel: 'Solicitar servicio', singular: 'servicio', plural: 'servicios', empty: 'Todavía no hay servicios en esta categoría.' },
};

function CategoryNotFound() {
  return (
    <MainLayout headerProps={{ user: currentUser }}>
      <PageContainer sx={{ py: 10, textAlign: 'center' }}>
        <Typography component="h1" sx={{ fontSize: 28, fontWeight: 700, color: colors.text }}>Categoría no encontrada</Typography>
        <Typography sx={{ mt: 1.5, mb: 4, color: colors.muted }}>Es posible que la categoría ya no exista.</Typography>
        <Box sx={{ maxWidth: 280, mx: 'auto' }}>
          <PrimaryButton component={RouterLink} to="/categorias/tecnologia">Ver categorías</PrimaryButton>
        </Box>
      </PageContainer>
    </MainLayout>
  );
}

export default function CategoryPage() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { addItem } = useCart();
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());

  const category = getCategory(categoryId);
  const type = getCategoryType(categoryId) ?? 'productos'; // 'productos' | 'servicios' según el árbol de la categoría
  const sort = SORT_OPTIONS.some((o) => o.id === params.get('orden')) ? params.get('orden') : DEFAULT_SORT;
  const copy = TYPES[type];

  const results = useMemo(() => {
    if (!category) return [];
    const list = type === 'servicios' ? getServicesByCategory(category.id) : getProductsByCategory(category.id);
    return sortItems(list, sort);
  }, [category, type, sort]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(parseInt(params.get('pagina') ?? '1', 10) || 1, 1), totalPages);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { window.scrollTo(0, 0); }, [categoryId, page]);

  // Mantiene en la URL el orden y la página (lo que está en su valor por defecto se omite)
  const updateParams = (changes) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === undefined) next.delete(key);
        else next.set(key, value);
      });
      return next;
    });

  // Cambiar entre Productos y Servicios lleva a la primera categoría del otro árbol
  const changeType = (next) => {
    if (next !== type) navigate(`/categorias/${getFirstCategoryId(next)}`);
  };
  const changeSort = (next) => {
    console.log('[Categoría] Ordenar:', { categoryId, orden: next });
    updateParams({ orden: next === DEFAULT_SORT ? null : next, pagina: null });
  };
  const changePage = (next) => updateParams({ pagina: next === 1 ? null : String(next) });

  const getHref = (id) => `/categorias/${id}`;

  const toggleFavorite = (item) => {
    const adding = !favoriteIds.has(item.id);
    console.log(`[Lista de deseos] ${adding ? 'Añadir' : 'Quitar'}:`, { id: item.id, name: item.name, tipo: type });
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      adding ? next.add(item.id) : next.delete(item.id);
      return next;
    });
  };

  // TODO: conectar con src/services (carrito y solicitudes de servicio)
  const handleAction = (item) => {
    if (type === 'servicios') {
      console.log('[Servicios] Solicitar servicio:', { serviceId: item.id, name: item.name, price: item.price });
      return;
    }
    const line = toCartLine(item, { variant: item.variant });
    console.log('[Carrito] Añadir producto:', { productId: line.productId, name: line.name, variantId: item.variant?.id ?? null, quantity: 1, unitPrice: line.unitPrice });
    addItem(line);
  };

  if (!category) return <CategoryNotFound />;

  const path = getCategoryPath(category.id);
  const breadcrumb = [
    { label: 'Inicio', href: '/' },
    ...path.map((c, i) => (i === path.length - 1 ? { label: c.name } : { label: c.name, href: getHref(c.id) })),
  ];
  const total = results.length;

  return (
    <CategoryLayout
      headerProps={{ user: currentUser }}
      sidebar={
        <CategorySidebar
          categories={categoryTrees[type]}
          activeId={category.id}
          activePathIds={path.map((c) => c.id)}
          type={type}
          onTypeChange={changeType}
          getHref={getHref}
        />
      }
    >
      <CategoryListing
        breadcrumb={breadcrumb}
        title={category.name}
        countLabel={`${total.toLocaleString('es-CL')} ${total === 1 ? copy.singular : copy.plural} ${total === 1 ? 'encontrado' : 'encontrados'}`}
        sortOptions={SORT_OPTIONS}
        sort={sort}
        onSortChange={changeSort}
        items={pageItems}
        total={total}
        page={page}
        pageSize={PAGE_SIZE}
        onPageChange={changePage}
        paginationLabel={copy.plural}
        actionLabel={copy.actionLabel}
        onAction={handleAction}
        favoriteIds={favoriteIds}
        onToggleFavorite={toggleFavorite}
        emptyMessage={copy.empty}
      />
    </CategoryLayout>
  );
}
