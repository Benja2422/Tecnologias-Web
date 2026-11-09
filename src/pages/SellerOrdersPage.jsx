import { useState } from 'react';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerStatCard from '../components/molecules/SellerStatCard';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import SellerTable from '../components/organisms/SellerTable';
import ItemThumb from '../components/atoms/ItemThumb';
import PaginationBar from '../components/molecules/PaginationBar';
import OrderStatusSelect from '../components/molecules/OrderStatusSelect';
import SellerChip from '../components/atoms/SellerChip';
import OrderShippingDialog from '../components/organisms/OrderShippingDialog';
import ShippingRatesDialog from '../components/organisms/ShippingRatesDialog';
import { useSeller } from '../contexts/SellerContext';
import { ORDER_STATUSES, formatWhen, isPendingDispatch, needsShipping, norm, orderSubtotal, paginate } from '../utils/seller';
import { formatPrice } from '../utils/format';
import { btnOutlined, btnPrimary, btnSmall } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 5;
const sameMonth = (iso, ref) => { const d = new Date(iso); return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear(); };

/** Pedidos recibidos: estado del envío (selector), detalle y cálculo del costo de despacho. */
export default function SellerOrdersPage() {
  const { orders, items, setOrderStatus, setOrderShipping, shippingRates, setShippingRates } = useSeller();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [detail, setDetail] = useState(null); // { order, markShipped }
  const [ratesOpen, setRatesOpen] = useState(false);
  const [toast, setToast] = useState('');

  const now = new Date();
  const sorted = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const month = orders.filter((o) => sameMonth(o.createdAt, now)).length;
  const pending = orders.filter(isPendingDispatch).length;
  const delivered = orders.filter((o) => !o.cancelled && o.status === 'Entregado').length;

  const q = norm(query.trim());
  const filtered = sorted.filter((o) => (!status || o.status === status) && (!q || norm(`${o.id} ${o.buyer.name} ${o.items.map((i) => i.name).join(' ')}`).includes(q)));
  const view = paginate(filtered, page, PAGE_SIZE);

  const changeStatus = (o, next) => {
    // Para pasar a "Enviado" se necesita el seguimiento (empresa de transporte y número), salvo retiro en tienda
    if (next === 'Enviado' && needsShipping(o) && o.shipping?.method !== 'retiro' && !o.shipping?.tracking) {
      setDetail({ order: o, markShipped: true });
      return;
    }
    console.log('[Emprendedor] Cambiar estado de pedido:', { orderId: o.id, antes: o.status, despues: next });
    setOrderStatus(o.id, next);
    setToast(`Pedido #${o.id}: ${next}.`);
  };
  const saveShipping = (shipping, { markShipped }) => {
    const { order } = detail;
    console.log('[Emprendedor] Guardar despacho:', { orderId: order.id, ...shipping, marcarEnviado: markShipped });
    setOrderShipping(order.id, shipping);
    if (markShipped) setOrderStatus(order.id, 'Enviado');
    setToast(markShipped ? `Pedido #${order.id}: Enviado por ${shipping.carrier ?? 'retiro en tienda'}${shipping.tracking ? ` (N° ${shipping.tracking})` : ''}.` : `Despacho del pedido #${order.id} guardado (${shipping.cost === 0 ? 'gratis' : formatPrice(shipping.cost)}).`);
    setDetail(null);
  };
  const saveRates = (rates) => {
    console.log('[Emprendedor] Guardar tarifas de despacho:', rates);
    setShippingRates(rates);
    setRatesOpen(false);
    setToast('Tarifas de despacho actualizadas.');
  };

  const columns = [
    {
      key: 'buyer', header: 'ID / Comprador', width: 'minmax(200px, 1.8fr)', render: (o) => (
        <>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>#{o.id}</Typography>
          <Box sx={{ mt: 0.5, display: 'flex', gap: 1.25, alignItems: 'center' }}>
            <ItemThumb size={28} dashed />
            <Box sx={{ minWidth: 0 }}>
              <Typography title={o.buyer.name} sx={{ fontSize: 15, fontWeight: 600, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.buyer.name}</Typography>
              <Typography sx={{ fontSize: 11.5, color: '#9CA3AF' }}>{o.buyer.type}</Typography>
            </Box>
          </Box>
        </>
      ),
    },
    { key: 'date', header: 'Fecha', width: 'minmax(100px, 0.9fr)', render: (o) => <Box sx={{ color: '#4B5563' }}>{formatWhen(o.createdAt, now)}</Box> },
    {
      key: 'items', header: 'Productos', width: 'minmax(150px, 1.3fr)', render: (o) => (
        <Box component="ul" sx={{ m: 0, pl: 0, listStylePosition: 'inside', fontSize: 13.5, color: colors.ink, '& li': { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }}>
          {o.items.map((i) => <li key={i.itemId} title={`${i.quantity}x ${i.name}`}>{i.quantity}x {i.name}</li>)}
        </Box>
      ),
    },
    { key: 'total', header: 'Total', width: 'minmax(100px, 0.8fr)', align: 'right', render: (o) => <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.ink }}>{formatPrice(orderSubtotal(o))}</Typography> },
    { key: 'status', header: 'Estado (selector)', width: '150px', render: (o) => (o.cancelled
      ? <Box title={`Anulado por la administración: ${o.cancelled.reason}`}><SellerChip label="Anulado" tone="grey" dot /><Typography sx={{ mt: 0.5, fontSize: 11.5, color: '#6B7280' }}>{o.cancelled.reason}</Typography></Box>
      : <OrderStatusSelect value={o.status} onChange={(v) => changeStatus(o, v)} label={`Estado del pedido ${o.id}`} />) },
    {
      key: 'action', header: 'Acción rápida', width: 'minmax(220px, 1fr)', render: (o) => (
        <Box>
          <Button onClick={() => setDetail({ order: o, markShipped: false })} startIcon={<LocalShippingOutlinedIcon />} aria-label={`Ver detalle y despacho del pedido ${o.id}`} sx={{ ...btnOutlined, ...btnSmall, height: 34, width: '100%', fontSize: 12.5, fontWeight: 500 }}>
            {!needsShipping(o) ? 'Ver detalle (sin despacho)' : o.shipping ? `Despacho: ${o.shipping.cost === 0 ? 'gratis' : formatPrice(o.shipping.cost)}` : 'Ver detalle y calcular costo'}
          </Button>
          {o.shipping?.tracking && <Typography sx={{ mt: 0.5, fontSize: 11.5, color: '#6B7280', textAlign: 'center' }}>{o.shipping.carrier} · N° {o.shipping.tracking}</Typography>}
        </Box>
      ),
    },
  ];

  return (
    <SellerLayout crumbs={[{ label: 'Pedidos Recibidos' }]} action={<Button onClick={() => setRatesOpen(true)} sx={{ ...btnPrimary, height: 38 }}>+ Ajustar Despachos</Button>}>
      <SellerPageTitle title="Control de Pedidos y Envíos" subtitle="Visualiza las ventas de tu tienda TodoMart, cambia los estados del envío mediante los selectores y calcula tarifas de despacho asociadas." />

      <Box sx={{ mt: 3, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
        <SellerStatCard label="Total recibidos (mes)" value={`${month} ${month === 1 ? 'Orden' : 'Órdenes'}`} />
        <SellerStatCard label="Pendientes de despacho" value={`${pending} ${pending === 1 ? 'Orden' : 'Órdenes'}`} alert={pending > 0} />
        <SellerStatCard label="Total entregados" value={`${delivered} ${delivered === 1 ? 'Entregado' : 'Entregados'}`} />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar comprador, ID o producto..."
          filter={{ label: 'Filtrar por Estado', icon: 'funnel', options: ORDER_STATUSES.map((s) => ({ id: s, name: s })), value: status, onChange: (v) => { setStatus(v); setPage(1); } }}
          summary={<>Filtrado: <b>Mostrando {view.rows.length} de {filtered.length} pedidos</b></>}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerTable
          label="Pedidos recibidos"
          columns={columns}
          rows={view.rows}
          getKey={(o) => o.id}
          minWidth={1000}
          rowSx={() => ({ minHeight: 94 })}
          empty={<Typography role="status" sx={{ p: 5, textAlign: 'center', color: colors.muted }}>No hay pedidos que coincidan con tu búsqueda.</Typography>}
          footer={<PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} pedidos registrados`} sx={{ px: 3 }} />}
        />
      </Box>

      {detail && <OrderShippingDialog order={detail.order} markShipped={detail.markShipped} rates={shippingRates} items={items} onSave={saveShipping} onClose={() => setDetail(null)} />}
      {ratesOpen && <ShippingRatesDialog rates={shippingRates} onSave={saveRates} onClose={() => setRatesOpen(false)} />}
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
