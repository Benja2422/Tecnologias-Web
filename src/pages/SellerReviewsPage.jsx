import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerStatCard from '../components/molecules/SellerStatCard';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import SellerChip from '../components/atoms/SellerChip';
import RatingStars from '../components/atoms/RatingStars';
import PaginationBar from '../components/molecules/PaginationBar';
import { useSeller } from '../contexts/SellerContext';
import { formatDay, norm, paginate } from '../utils/seller';
import { card } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 6;
const FILTERS = [
  { id: 'tienda', name: 'Sobre la tienda' },
  { id: 'producto', name: 'Productos' },
  { id: 'servicio', name: 'Servicios' },
  { id: 'baja', name: '3 estrellas o menos' },
];
const average = (list) => (list.length ? list.reduce((s, r) => s + r.rating, 0) / list.length : 0);
const fmt = (n) => n.toLocaleString('es-CL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

/** Calificaciones y reseñas que los clientes dejaron a la tienda y a sus productos o servicios (solo lectura). */
export default function SellerReviewsPage() {
  const { reviews } = useSeller();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);

  // Tipo de cada reseña según el ítem calificado (los ítems dados de baja también cuentan)
  const kindOf = (r) => (!r.itemId ? 'tienda' : r.itemId.startsWith('s-') ? 'servicio' : 'producto');
  const store = reviews.filter((r) => kindOf(r) === 'tienda');
  const catalog = reviews.filter((r) => kindOf(r) !== 'tienda');
  const sorted = [...reviews].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const q = norm(query.trim());
  const filtered = sorted.filter((r) => (!filter || (filter === 'baja' ? r.rating <= 3 : kindOf(r) === filter)) && (!q || norm(`${r.buyer} ${r.target} ${r.comment}`).includes(q)));
  const view = paginate(filtered, page, PAGE_SIZE);
  const counts = [5, 4, 3, 2, 1].map((n) => ({ n, count: reviews.filter((r) => r.rating === n).length }));

  return (
    <SellerLayout crumbs={[{ label: 'Calificaciones y Reseñas' }]}>
      <SellerPageTitle title="Calificaciones y Reseñas" subtitle="Revisa lo que opinan tus clientes de tu tienda y de tus productos y servicios. Las reseñas no se pueden editar ni eliminar." />

      <Box sx={{ mt: 3, display: 'grid', gap: 2.5, alignItems: 'stretch', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
        <SellerStatCard label="Promedio general" value={reviews.length ? `${fmt(average(reviews))} de 5` : 'Sin reseñas'} hint={`${reviews.length} ${reviews.length === 1 ? 'reseña' : 'reseñas'} en total`} />
        <SellerStatCard label="Calificación de la tienda" value={store.length ? `${fmt(average(store))} de 5` : 'Sin reseñas'} hint={`${store.length} ${store.length === 1 ? 'reseña' : 'reseñas'} sobre la atención y el despacho`} />
        <Box sx={{ ...card, px: 2.5, py: 2 }} aria-label="Distribución de calificaciones">
          {counts.map(({ n, count }) => (
            <Box key={n} sx={{ display: 'grid', gridTemplateColumns: '54px 1fr 24px', alignItems: 'center', gap: 1, py: 0.25 }}>
              <Typography sx={{ fontSize: 12.5, color: '#4B5563' }}>{n} ★</Typography>
              <Box sx={{ height: 8, borderRadius: 4, bgcolor: '#F3F4F6', overflow: 'hidden' }}>
                <Box sx={{ height: '100%', width: `${reviews.length ? (count / reviews.length) * 100 : 0}%`, bgcolor: '#F5A524' }} />
              </Box>
              <Typography sx={{ fontSize: 12.5, color: '#4B5563', textAlign: 'right' }}>{count}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar por cliente, producto o comentario..."
          filter={{ label: 'Filtrar', icon: 'funnel', showValue: true, allLabel: 'Todas', options: FILTERS, value: filter, onChange: (v) => { setFilter(v); setPage(1); } }}
          summary={<>Resultados: <b>{filtered.length} {filtered.length === 1 ? 'reseña' : 'reseñas'}</b>{catalog.length ? <> · Catálogo: <b>{fmt(average(catalog))}</b></> : null}</>}
        />
      </Box>

      <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
        {view.rows.length === 0 && <Typography role="status" sx={{ ...card, p: 5, textAlign: 'center', color: colors.muted }}>No hay reseñas con ese filtro.</Typography>}
        {view.rows.map((r) => (
          <Box component="article" key={r.id} sx={{ ...card, p: 2.5 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
              <Box>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{r.buyer}</Typography>
                <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>{formatDay(r.createdAt)}</Typography>
              </Box>
              <SellerChip label={kindOf(r) === 'tienda' ? 'Tienda' : kindOf(r) === 'servicio' ? 'Servicio' : 'Producto'} tone={kindOf(r) === 'tienda' ? 'blue' : 'grey'} />
            </Box>
            <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5 }}>
              <RatingStars value={r.rating} size={18} />
              {kindOf(r) !== 'tienda' && <Typography sx={{ fontSize: 13, color: '#4B5563' }}>· {r.target}</Typography>}
            </Box>
            <Typography sx={{ mt: 1, fontSize: 14.5, color: colors.ink, lineHeight: 1.55, overflowWrap: 'anywhere' }}>{r.comment}</Typography>
          </Box>
        ))}
        <Box sx={card}>
          <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} reseñas`} sx={{ px: 3 }} />
        </Box>
      </Box>
    </SellerLayout>
  );
}
