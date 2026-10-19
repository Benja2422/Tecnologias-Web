import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import MainLayout from '../components/templates/MainLayout';
import PageContainer from '../components/atoms/PageContainer';
import SecondaryButton from '../components/atoms/SecondaryButton';
import SortSelect from '../components/molecules/SortSelect';
import PaginationBar from '../components/molecules/PaginationBar';
import SearchFilters from '../components/organisms/SearchFilters';
import ItemGrid from '../components/organisms/ItemGrid';
import { useCart } from '../contexts/CartContext';
import { toCartLine } from '../utils/cart';
import { currentUser } from '../utils/mockCatalog';
import { searchCatalog } from '../utils/searchCatalog';
import { DEFAULT_TYPE, TYPE_OPTIONS } from '../components/molecules/TypeFilter';
import { DEFAULT_SORT, SORT_OPTIONS, sortItems } from '../utils/sortItems';
import { colors } from '../utils/theme';

const PAGE_SIZE = 6;
const DEFAULT_RATING = 0; // 0 = todos
const KIND_BY_TYPE = { productos: 'producto', servicios: 'servicio' };
const TYPE_LABEL = { productos: 'productos', servicios: 'servicios', ambos: 'productos y servicios' };

const actionLabelFor = (item) => (item.kind === 'servicio' ? 'Solicitar servicio' : 'Añadir al carrito');

export default function SearchResultsPage() {
  const [params, setParams] = useSearchParams();
  const { addItem } = useCart();
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());

  const q = (params.get('q') ?? '').trim();
  const type = TYPE_OPTIONS.some((o) => o.value === params.get('tipo')) ? params.get('tipo') : DEFAULT_TYPE;
  const min = (params.get('min') ?? '').replace(/\D/g, '');
  const max = (params.get('max') ?? '').replace(/\D/g, '');
  const ratingParam = params.get('rating');
  const minRating = ratingParam === null || Number.isNaN(Number(ratingParam)) ? DEFAULT_RATING : Number(ratingParam);
  const sort = SORT_OPTIONS.some((o) => o.id === params.get('orden')) ? params.get('orden') : DEFAULT_SORT;

  const found = useMemo(() => searchCatalog(q), [q]);
  // Resultados que existen pero quedan fuera por el tipo elegido (para sugerir cambiarlo)
  const hiddenByType = type !== 'ambos' && found.some((item) => item.kind !== KIND_BY_TYPE[type]);

  const results = useMemo(() => {
    const filtered = found.filter(
      (item) =>
        (type === 'ambos' || item.kind === KIND_BY_TYPE[type]) &&
        item.rating >= minRating &&
        (min === '' || item.price >= Number(min)) &&
        (max === '' || item.price <= Number(max)),
    );
    return sortItems(filtered, sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [found, params]);

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const page = Math.min(Math.max(parseInt(params.get('pagina') ?? '1', 10) || 1, 1), totalPages);
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const filtersActive = type !== DEFAULT_TYPE || min !== '' || max !== '' || minRating !== DEFAULT_RATING;

  useEffect(() => { window.scrollTo(0, 0); }, [q, page]);

  // La URL guarda la búsqueda, los filtros, el orden y la página (los valores por defecto se omiten)
  const update = (changes) =>
    setParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') next.delete(key);
        else next.set(key, String(value));
      });
      next.delete('pagina'); // cualquier cambio de filtro u orden vuelve a la primera página
      return next;
    }, { replace: true });

  const changeType = (value) => {
    console.log('[Búsqueda] Filtrar por tipo:', { query: q, tipo: value });
    update({ tipo: value === DEFAULT_TYPE ? null : value });
  };
  const applyPrice = ({ min: nextMin, max: nextMax }) => {
    console.log('[Búsqueda] Filtrar por precio:', { query: q, min: nextMin === '' ? null : Number(nextMin), max: nextMax === '' ? null : Number(nextMax) });
    update({ min: nextMin, max: nextMax });
  };
  const changeRating = (value) => {
    console.log('[Búsqueda] Filtrar por rating mínimo:', { query: q, ratingMinimo: value });
    update({ rating: value === DEFAULT_RATING ? null : value });
  };
  const clearFilters = () => {
    console.log('[Búsqueda] Limpiar filtros:', { query: q });
    update({ tipo: null, min: null, max: null, rating: null });
  };
  const changeSort = (value) => {
    console.log('[Búsqueda] Ordenar:', { query: q, orden: value });
    update({ orden: value === DEFAULT_SORT ? null : value });
  };
  const changePage = (next) => setParams((prev) => {
    const copy = new URLSearchParams(prev);
    if (next === 1) copy.delete('pagina'); else copy.set('pagina', String(next));
    return copy;
  }, { replace: true });

  const toggleFavorite = (item) => {
    const adding = !favoriteIds.has(item.id);
    console.log(`[Lista de deseos] ${adding ? 'Añadir' : 'Quitar'}:`, { id: item.id, name: item.name, tipo: item.kind });
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      adding ? next.add(item.id) : next.delete(item.id);
      return next;
    });
  };

  // TODO: conectar con src/services (carrito y solicitudes de servicio)
  const handleAction = (item) => {
    if (item.kind === 'servicio') {
      console.log('[Servicios] Solicitar servicio:', { serviceId: item.id, name: item.name, price: item.price });
      return;
    }
    const line = toCartLine(item, { variant: item.variant });
    console.log('[Carrito] Añadir producto:', { productId: line.productId, name: line.name, variantId: item.variant?.id ?? null, quantity: 1, unitPrice: line.unitPrice });
    addItem(line);
  };

  const total = results.length;

  return (
    <MainLayout headerProps={{ user: currentUser, searchQuery: q }}>
      <PageContainer sx={{ pt: { xs: 3, md: 3 }, pb: { xs: 6, md: 8 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: { xs: 3, md: 2.5 } }}>
          <Typography component="h1" aria-live="polite" sx={{ fontSize: { xs: 16, md: 17 }, fontWeight: 400, color: colors.text }}>
            {q ? (
              <>
                Mostrando <b>{total.toLocaleString('es-CL')}</b> {total === 1 ? 'resultado' : 'resultados'} para{' '}
                <i>"{q}"</i>
              </>
            ) : 'Resultados de búsqueda'}
          </Typography>
          {total > 0 && <SortSelect variant="plain" options={SORT_OPTIONS} value={sort} onChange={changeSort} />}
        </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 3, md: 4 }, alignItems: { md: 'flex-start' } }}>
          <SearchFilters
            type={type}
            onTypeChange={changeType}
            min={min}
            max={max}
            onApplyPrice={applyPrice}
            minRating={minRating}
            onRatingChange={changeRating}
            onClear={clearFilters}
          />

          <Box sx={{ flex: 1, minWidth: 0 }}>
            {total === 0 ? (
              <Box sx={{ py: 10, display: 'grid', justifyItems: 'center', gap: 1.5, textAlign: 'center' }}>
                <SearchOffOutlinedIcon sx={{ fontSize: 56, color: '#C8C8C8' }} />
                <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600, color: colors.text }}>
                  {q ? 'No encontramos resultados' : 'Escribe lo que buscas'}
                </Typography>
                <Typography sx={{ color: colors.muted, maxWidth: 420 }}>
                  {!q
                    ? 'Usa la barra de búsqueda para encontrar productos y servicios.'
                    : hiddenByType
                      ? `No hay ${TYPE_LABEL[type]} para esta búsqueda, pero sí en ${type === 'productos' ? 'servicios' : 'productos'}.`
                      : found.length > 0 && filtersActive
                        ? 'Prueba quitando algunos filtros para ver más opciones.'
                        : 'Revisa la ortografía o prueba con términos más generales.'}
                </Typography>
                {hiddenByType && (
                  <SecondaryButton onClick={() => changeType('ambos')} sx={{ mt: 1, px: 4 }}>Ver productos y servicios</SecondaryButton>
                )}
                {filtersActive && found.length > 0 && !hiddenByType && (
                  <SecondaryButton onClick={clearFilters} sx={{ mt: 1, px: 4 }}>Limpiar filtros</SecondaryButton>
                )}
                {!q && <SecondaryButton component={RouterLink} to="/" sx={{ mt: 1, px: 4 }}>Ir al inicio</SecondaryButton>}
              </Box>
            ) : (
              <>
                <ItemGrid
                  items={pageItems}
                  actionLabel={actionLabelFor}
                  onAction={handleAction}
                  favoriteIds={favoriteIds}
                  onToggleFavorite={toggleFavorite}
                />
                {total > PAGE_SIZE && (
                  <PaginationBar page={page} pageSize={PAGE_SIZE} total={total} onChange={changePage} itemLabel="resultados" sx={{ px: 0, mt: 2 }} />
                )}
              </>
            )}
          </Box>
        </Box>
      </PageContainer>
    </MainLayout>
  );
}
