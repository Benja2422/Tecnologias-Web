import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CheckoutLayout from '../components/templates/CheckoutLayout';
import SecondaryButton from '../components/atoms/SecondaryButton';
import PrimaryButton from '../components/atoms/PrimaryButton';
import { useCheckout } from '../contexts/CheckoutContext';
import { formatDateRange } from '../utils/dates';
import { formatPrice } from '../utils/format';
import { colors } from '../utils/theme';

const GREEN = '#22C55E';
const COLUMNS = { xs: '1fr 60px 90px', sm: '1fr 90px 130px 130px' };

const Row = ({ label, value, strong = false, accent = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <Typography sx={{ fontSize: strong ? 17 : 15, fontWeight: strong ? 700 : 400, color: strong ? colors.primary : colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: strong ? 20 : 15, fontWeight: strong ? 700 : 500, color: accent ? colors.primary : colors.text }}>{value}</Typography>
  </Box>
);

const Detail = ({ label, children }) => (
  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '180px 1fr' }, gap: { xs: 0, sm: 2 } }}>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{label}</Typography>
    <Typography sx={{ fontSize: 15, color: colors.muted, overflowWrap: 'anywhere' }}>{children}</Typography>
  </Box>
);

/** Paso 3 del checkout: resumen del pedido confirmado. */
export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { getOrder } = useCheckout();
  const order = getOrder(orderId);
  if (!order) return <Navigate to="/" replace />;

  const { items, totals, shipping, address, payment, seller } = order;
  const firstName = order.recipient.split(' ')[0];
  const paymentText = payment.method === 'tarjeta'
    ? `Tarjeta de crédito ****${payment.last4}`
    : `Transferencia bancaria (código ${payment.code})`;

  return (
    <CheckoutLayout step={3} finished maxWidth={800}>
      <Box sx={{ display: 'grid', justifyItems: 'center', textAlign: 'center' }}>
        <Box aria-hidden sx={{ width: 72, height: 72, borderRadius: '50%', bgcolor: GREEN, color: '#fff', display: 'grid', placeItems: 'center' }}>
          <CheckIcon sx={{ fontSize: 40 }} />
        </Box>
        <Typography component="h1" sx={{ mt: 3, fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.text, textAlign: 'center' }}>
          ¡Compra realizada con éxito!
        </Typography>
        <Typography sx={{ mt: 1.5, fontSize: 16, color: colors.muted, textAlign: 'center' }}>
          Gracias por tu compra, {firstName}. Hemos enviado la confirmación a tu correo electrónico.
        </Typography>
        <Box sx={{ mt: 2.5, px: 2.5, py: 0.75, borderRadius: 999, bgcolor: '#F3F4F6', color: colors.text, fontSize: 15, fontWeight: 600 }}>
          Pedido #{order.id}
        </Box>
      </Box>

      <Box component="section" aria-labelledby="resumen-compra" sx={{ mt: 5, p: { xs: 2, sm: 3 }, border: '1px solid #E5E7EB', borderRadius: 3 }}>
        <Typography id="resumen-compra" component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.text, mb: 2 }}>Resumen de tu compra</Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: COLUMNS, gap: 2, py: 1.5, borderBottom: '1px solid #E5E7EB', fontSize: 14, fontWeight: 600, color: colors.muted }}>
          <Box>Producto</Box>
          <Box sx={{ textAlign: 'center' }}>Cantidad</Box>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>Precio unit.</Box>
          <Box sx={{ textAlign: 'right' }}>Subtotal</Box>
        </Box>
        {items.map((it) => (
          <Box key={`${it.productId}-${it.detail}`} sx={{ display: 'grid', gridTemplateColumns: COLUMNS, gap: 2, py: 1.75, alignItems: 'center', borderBottom: '1px solid #F0F0F0', fontSize: 15, color: colors.text }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 15, fontWeight: 500 }}>{it.name}</Typography>
                {it.detail && <Typography sx={{ fontSize: 13, color: colors.muted }}>{it.detail}</Typography>}
              </Box>
            </Box>
            <Box sx={{ textAlign: 'center' }}>{it.quantity}</Box>
            <Box sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right' }}>{formatPrice(it.unitPrice)}</Box>
            <Box sx={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(it.subtotal)}</Box>
          </Box>
        ))}

        <Box sx={{ mt: 2.5, display: 'grid', gap: 1.25 }}>
          <Row label="Subtotal productos" value={formatPrice(totals.subtotal)} />
          {shipping && <Row label={shipping.name} value={totals.shipping === 0 ? 'Gratis' : formatPrice(totals.shipping)} />}
          <Row label="Neto" value={formatPrice(totals.neto)} />
          <Row label="IVA (19%)" value={formatPrice(totals.iva)} />
          <Box sx={{ mt: 0.5, pt: 1.5, borderTop: '2px solid #333' }}>
            <Row label="Total pagado" value={formatPrice(totals.total)} strong accent />
          </Box>
          <Row label="Medio de pago" value={paymentText} />
        </Box>
      </Box>

      <Box component="section" aria-labelledby="datos-envio" sx={{ mt: 3, p: { xs: 2, sm: 3 }, border: '1px solid #E5E7EB', borderRadius: 3 }}>
        <Typography id="datos-envio" component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.text, mb: 2 }}>
          {shipping ? 'Datos de envío' : 'Datos del servicio'}
        </Typography>
        <Box sx={{ display: 'grid', gap: 1.5 }}>
          <Detail label="Destinatario">{order.recipient}</Detail>
          {address && <Detail label="Dirección">{address.street} {address.number}, {address.commune}, {address.province}, {address.region}</Detail>}
          {shipping && <Detail label="Método">{shipping.name} ({shipping.eta})</Detail>}
          {order.estimatedDelivery && (
            <Detail label="Entrega estimada">{formatDateRange(order.estimatedDelivery.from, order.estimatedDelivery.to)}</Detail>
          )}
          <Detail label="Vendedor">{seller.name}</Detail>
        </Box>
      </Box>

      <Box sx={{ mt: 4, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
        <PrimaryButton sx={{ height: 50, py: 0, width: { sm: 300 } }} onClick={() => navigate(`/pedidos/${order.id}`)}>Ver mi pedido</PrimaryButton>
        <SecondaryButton pill sx={{ height: 50, width: { sm: 300 }, fontSize: 16, color: colors.text }} onClick={() => navigate('/')}>Volver al catálogo</SecondaryButton>
      </Box>
    </CheckoutLayout>
  );
}
