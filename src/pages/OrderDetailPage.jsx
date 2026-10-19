import { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import AccountLayout from '../components/templates/AccountLayout';
import OrderStatusBadge from '../components/atoms/OrderStatusBadge';
import OrderTimeline from '../components/molecules/OrderTimeline';
import { useCheckout } from '../contexts/CheckoutContext';
import { getOrderStatus } from '../utils/orders';
import { formatLongDate } from '../utils/dates';
import { formatPrice } from '../utils/format';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const card = { p: { xs: 2.5, sm: 3 }, border: '1px solid #E5E7EB', borderRadius: 3, bgcolor: '#fff' };
const h2 = { fontSize: 18, fontWeight: 600, color: colors.text };

const Field = ({ label, children, accent = false }) => (
  <Box sx={{ mt: 2, '&:first-of-type': { mt: 0 } }}>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{label}</Typography>
    <Typography sx={{ mt: 0.5, fontSize: 15, color: accent ? colors.primary : colors.muted, fontWeight: accent ? 700 : 400, overflowWrap: 'anywhere' }}>{children}</Typography>
  </Box>
);

const Total = ({ label, value, strong = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <Typography sx={{ fontSize: 15, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: 15, fontWeight: strong ? 700 : 400, color: colors.text }}>{value}</Typography>
  </Box>
);

const linkSx = { p: 0, minWidth: 0, fontFamily: 'inherit', fontSize: 15, fontWeight: 600, textTransform: 'none', textDecoration: 'underline', color: colors.primary, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } };

/** Detalle de un pedido: seguimiento, datos de entrega, productos y totales. */
export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getOrder } = useCheckout();
  const [toast, setToast] = useState('');
  const order = getOrder(orderId);
  if (!order) return <Navigate to="/pedidos" replace />;

  const status = getOrderStatus(order);
  const { items, totals, shipping, address, payment, seller } = order;
  const delivered = status === 'Entregado';
  const cancelled = status === 'Cancelado';

  const rate = (item) => {
    console.log('[Pedidos] Calificar:', { orderId: order.id, productId: item.productId, kind: item.kind });
    if (item.kind === 'producto') navigate(`/producto/${item.productId}`);
    else setToast('La calificación de servicios estará disponible pronto');
  };
  const help = (action) => {
    console.log(`[Pedidos] ${action}:`, { orderId: order.id, sellerId: seller.id });
    setToast(`${action}: función disponible pronto`);
  };

  const addressText = address && `${address.street} ${address.number}, ${address.commune}, ${address.province}`;
  const paymentText = payment.method === 'tarjeta' ? `Con Tarjeta ****${payment.last4}` : `Con transferencia bancaria${payment.code ? ` (${payment.code})` : ''}`;

  return (
    <AccountLayout maxWidth={1600} headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <Button component={RouterLink} to="/pedidos" sx={{ ...linkSx, textDecoration: 'none', fontSize: 14, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}>
        ← Volver a mis pedidos
      </Button>

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 26, md: 36 }, fontWeight: 600, color: colors.text, overflowWrap: 'anywhere' }}>Pedido #{order.id}</Typography>
        <OrderStatusBadge status={status} size="large" />
      </Box>
      <Typography sx={{ mt: 1.5, fontSize: 16, color: colors.muted }}>Realizado el {formatLongDate(order.createdAt)}</Typography>

      <Box component="section" aria-labelledby="seguimiento" sx={{ ...card, mt: 4 }}>
        <Typography id="seguimiento" component="h2" sx={{ ...h2, mb: 2 }}>Seguimiento del pedido</Typography>
        {cancelled ? (
          <Alert severity="error">Este pedido fue cancelado.</Alert>
        ) : (
          <Box sx={{ overflowX: 'auto' }}><Box sx={{ minWidth: 520 }}><OrderTimeline timeline={order.timeline} /></Box></Box>
        )}
      </Box>

      <Box component="section" aria-label="Entrega" sx={{ ...card, mt: 4, display: 'grid', gap: 4, gridTemplateColumns: { xs: '1fr', md: shipping ? '1fr 1fr' : '1fr' }, position: 'relative' }}>
        {shipping && <Box aria-hidden sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 24, bottom: 24, left: '50%', width: '1px', bgcolor: '#E5E7EB' }} />}
        <Box>
          <Typography component="h2" sx={{ ...h2, mb: 2 }}>{shipping ? 'Datos de entrega' : 'Datos del servicio'}</Typography>
          <Field label="Destinatario:">{order.recipient}</Field>
          {address && <Field label="Dirección:">{addressText}</Field>}
        </Box>
        {shipping && (
          <Box sx={{ pl: { md: 4 } }}>
            <Typography component="h2" sx={{ ...h2, mb: 2 }}>Método de envío</Typography>
            <Field label={`${shipping.name}:`}>{order.carrier ?? shipping.eta}</Field>
            <Field label="Número de seguimiento:" accent={Boolean(order.tracking)}>{order.tracking ?? 'Se informará cuando el pedido sea enviado'}</Field>
          </Box>
        )}
      </Box>

      <Box component="section" aria-label="Productos y totales" sx={{ ...card, mt: 4 }}>
        <Typography sx={{ fontSize: 15, color: colors.muted, pb: 2.5, borderBottom: '1px solid #EEE' }}>
          Vendedor: <Box component="span" sx={{ fontWeight: 600, color: colors.text, ml: 0.5 }}>{seller.name}</Box>
        </Typography>

        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {items.map((it, i) => (
            <Box component="li" key={`${it.productId}-${it.detail}`} sx={{ display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: { xs: 'wrap', sm: 'nowrap' }, py: 2.5, borderBottom: '1px solid #EEE' }}>
              {it.image ? (
                <Box component="img" src={it.image} alt="" sx={{ width: 60, height: 60, borderRadius: 1.5, objectFit: 'cover', border: '1px solid #E5E7EB', flexShrink: 0 }} />
              ) : (
                <Box aria-hidden sx={{ width: 60, height: 60, borderRadius: 1.5, bgcolor: '#F3F4F6', flexShrink: 0 }} />
              )}
              <Box sx={{ flex: 1, minWidth: 160 }}>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{it.name}</Typography>
                <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.muted }}>{[it.detail, `Cantidad: ${it.quantity}`].filter(Boolean).join(' • ')}</Typography>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography sx={{ fontSize: 18, fontWeight: 700, color: colors.text }}>{formatPrice(it.subtotal)}</Typography>
                <Typography sx={{ fontSize: 13, color: colors.muted }}>{formatPrice(it.unitPrice)} / unidad</Typography>
              </Box>
              {delivered && (
                <Button
                  variant="outlined"
                  onClick={() => rate(it)}
                  aria-label={`Calificar ${it.name}`}
                  sx={{ height: 36, px: 2, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', color: colors.primary, borderColor: colors.primary, '&:hover': { borderColor: colors.primaryDark, bgcolor: '#FDECEF' } }}
                >
                  Calificar
                </Button>
              )}
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 3, display: 'grid', gap: 1.75 }}>
          <Total label="Subtotal productos" value={formatPrice(totals.subtotal)} strong />
          {shipping && <Total label="Costo de envío" value={totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)} strong />}
          <Total label="Neto" value={formatPrice(totals.neto)} />
          <Total label="IVA (19%)" value={formatPrice(totals.iva)} />
        </Box>
        <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #EEE', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 600, color: colors.text }}>Total Pagado</Typography>
            <Typography sx={{ fontSize: 13, color: colors.muted }}>{paymentText}</Typography>
          </Box>
          <Typography sx={{ fontSize: 28, fontWeight: 700, color: colors.text }}>{formatPrice(totals.total)}</Typography>
        </Box>
      </Box>

      <Box component="section" aria-labelledby="ayuda" sx={{ mt: 5 }}>
        <Typography id="ayuda" component="h2" sx={h2}>¿Necesitas ayuda con este pedido?</Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          <Button onClick={() => help('Realizar reclamo')} sx={linkSx}>Realizar reclamo</Button>
          <Button onClick={() => help('Contactar vendedor')} sx={linkSx}>Contactar vendedor</Button>
        </Box>
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="info" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AccountLayout>
  );
}
