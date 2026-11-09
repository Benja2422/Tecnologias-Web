import { useState } from 'react';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import ActionRequiredAlert from '../components/molecules/ActionRequiredAlert';
import SellerRequestCard from '../components/organisms/SellerRequestCard';
import ItemThumb from '../components/atoms/ItemThumb';
import PaginationBar from '../components/molecules/PaginationBar';
import { useSeller } from '../contexts/SellerContext';
import { formatWhen, norm, paginate, timeAgo } from '../utils/seller';
import { card } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 4;
const STATUSES = ['Pendiente', 'Aceptada', 'Rechazada'];
const TONE = { Pendiente: 'yellow', Aceptada: 'green', Rechazada: 'red' };
const caps = { fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#6B7280' };

/** Solicitudes de devolución recibidas: aprobar o rechazar con un comentario que se envía al comprador. */
export default function SellerReturnsPage() {
  const { returns, resolveReturn } = useSeller();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');

  const now = new Date();
  const sorted = [...returns].sort((a, b) => (a.status !== 'Pendiente') - (b.status !== 'Pendiente') || b.createdAt.localeCompare(a.createdAt));
  const pending = returns.filter((r) => r.status === 'Pendiente').length;
  const term = norm(query.trim());
  const filtered = sorted.filter((r) => (!status || r.status === status) && (!term || norm(`${r.id} ${r.buyer.name} ${r.product} ${r.orderId}`).includes(term)));
  const view = paginate(filtered, page, PAGE_SIZE);

  const resolve = (r, decision, comment) => {
    console.log('[Emprendedor] Resolver devolución:', { returnId: r.id, orderId: r.orderId, decision, largo: comment.length });
    resolveReturn(r.id, decision, comment);
    setToast(`Devolución #${r.id} ${decision === 'Aceptada' ? 'aprobada' : 'rechazada'}. Se notificó a ${r.buyer.name}.`);
  };

  return (
    <SellerLayout crumbs={[{ label: 'Solicitudes de Devolución' }]}>
      <SellerPageTitle title="Solicitudes de Devolución Recibidas" subtitle="Revisa, aprueba o rechaza los requerimientos de reembolso y devolución de productos enviados por tus clientes en TodoMart." />

      {pending > 0 && (
        <Box sx={{ mt: 3 }}>
          <ActionRequiredAlert title="Acción requerida: Solicitudes pendientes de revisión">
            Tienes <b>{pending} {pending === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}</b> por evaluar. Resolverlas a tiempo mejora la puntuación de tu tienda y previene disputas.
          </ActionRequiredAlert>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar por cliente o producto..."
          filter={{ label: 'Filtrar por Estado', icon: 'funnel', showValue: true, options: STATUSES.map((s) => ({ id: s, name: s })), value: status, onChange: (v) => { setStatus(v); setPage(1); } }}
          summary={<>Resultados: <b>Mostrando {view.rows.length} de {filtered.length} {filtered.length === 1 ? 'solicitud' : 'solicitudes'}</b></>}
        />
      </Box>

      <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
        {view.rows.length === 0 && <Typography role="status" sx={{ ...card, p: 5, textAlign: 'center', color: colors.muted }}>No hay solicitudes con ese filtro.</Typography>}
        {view.rows.map((r) => (
          <SellerRequestCard
            key={r.id}
            header={{ id: r.id, name: r.buyer.name, type: r.buyer.type, status: r.status, tone: TONE[r.status] }}
            form={r.status !== 'Pendiente' ? null : {
              label: 'Comentario de resolución (Interno y para el cliente):',
              placeholder: 'Escribe los motivos de la aprobación o rechazo de la devolución...',
              note: '* Al resolver se notificará al comprador de TodoMart de forma automática.',
              max: 500,
              actions: [
                { label: 'Rechazar', variant: 'outlined', requireText: 'Para rechazar, explica el motivo al cliente.', onClick: (c) => resolve(r, 'Rechazada', c) },
                { label: 'Aprobar Devolución', onClick: (c) => resolve(r, 'Aceptada', c || 'Tu devolución fue aprobada. Coordinaremos el retiro del producto y el reembolso.') },
              ],
            }}
            resolved={r.resolution && { title: `Solicitud ${r.status === 'Aceptada' ? 'aprobada' : 'rechazada'} - comentario registrado:`, text: r.resolution.comment, tone: r.status === 'Rechazada' ? 'red' : 'green' }}
          >
            <Box sx={{ display: 'grid', gap: 2.5, alignItems: 'start', gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 1.4fr) minmax(0, 1.4fr) 140px' } }}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <ItemThumb dashed />
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={caps}>Producto · Pedido #{r.orderId}</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 14.5, fontWeight: 600, color: colors.ink }}>{r.product}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography sx={caps}>Motivo de devolución</Typography>
                <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.ink, lineHeight: 1.55 }}>{r.reason}</Typography>
              </Box>
              <Box>
                <Typography sx={caps}>Fecha solicitud</Typography>
                <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.ink }}>{formatWhen(r.createdAt, now)}</Typography>
                <Typography sx={{ fontSize: 11.5, color: '#9CA3AF' }}>{timeAgo(r.createdAt, now)}</Typography>
              </Box>
            </Box>
          </SellerRequestCard>
        ))}
        <Box sx={card}>
          <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} devoluciones recibidas`} sx={{ px: 3 }} />
        </Box>
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
