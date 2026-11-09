import { Navigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import DocumentLayout from '../components/templates/DocumentLayout';
import Logo from '../components/atoms/Logo';
import SellerChip from '../components/atoms/SellerChip';
import { useAdminOrders } from '../hooks/useAdminOrders';
import { ORDER_STATUS_TONE } from '../utils/ordersAdmin';
import { formatPrice } from '../utils/format';
import { colors } from '../utils/theme';

const COLS = '56px minmax(0, 1fr) 120px 120px';
const th = { fontSize: 12, fontWeight: 600, color: colors.text };
const dmy = (iso) => new Date(iso).toLocaleString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const Party = ({ title, children }) => (
  <Box>
    <Typography sx={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: colors.muted }}>{title}</Typography>
    <Box sx={{ mt: 1, fontSize: 14.5, color: colors.text, lineHeight: 1.6, overflowWrap: 'anywhere' }}>{children}</Box>
  </Box>
);
const Total = ({ label, value, strong }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.5 }}>
    <Typography sx={{ fontSize: strong ? 16 : 14, fontWeight: strong ? 700 : 400, color: strong ? colors.text : colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: strong ? 16 : 14, fontWeight: 700, color: colors.text }}>{value}</Typography>
  </Box>
);

/** Comprobante de venta (boleta electrónica): fecha, artículos, valor neto, IVA 19 %, total y medio de pago. */
export default function AdminReceiptPage() {
  const { orderId } = useParams();
  const { rows } = useAdminOrders();
  const order = rows.find((r) => r.id === orderId);
  if (!order) return <Navigate to="/admin/pedidos" replace />;

  return (
    <DocumentLayout backTo="/admin/pedidos" fileName={`Comprobante-${order.id}`} label={`Comprobante de venta ${order.id}`}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, pb: 3.5, borderBottom: '1px solid #E5E7EB' }}>
        <Logo size={24} />
        <Box sx={{ textAlign: 'right', border: `2px solid ${colors.primary}`, borderRadius: '6px', px: 2.5, py: 1.5 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.primary }}>COMPROBANTE DE VENTA</Typography>
          <Typography component="h1" sx={{ fontSize: 15, fontWeight: 700, color: colors.text }}>Boleta electrónica N° {order.id}</Typography>
        </Box>
      </Box>

      {order.cancelled && (
        <Box role="status" sx={{ mt: 3, p: 1.5, border: `2px dashed ${colors.primary}`, borderRadius: '6px', textAlign: 'center', color: colors.primary, fontWeight: 700, letterSpacing: '0.08em' }}>
          ANULADA · {order.cancelled.reason}
        </Box>
      )}

      <Box sx={{ mt: 3.5, display: 'grid', gap: 3, gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(3, minmax(0, 1fr))' } }}>
        <Party title="Vendedor">{order.seller}<br />Vendido a través de TodoMart</Party>
        <Party title="Cliente">{order.buyer}{order.address && <><br />{order.address}</>}</Party>
        <Party title="Transacción">Fecha: {dmy(order.createdAt)}<br />Estado: <SellerChip label={order.status} tone={ORDER_STATUS_TONE[order.status]} /></Party>
      </Box>

      <Box sx={{ mt: 4, overflowX: 'auto' }}>
        <Box role="table" aria-label="Artículos" sx={{ minWidth: 520 }}>
          <Box role="row" sx={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', px: 1.5, height: 42, bgcolor: '#F8F8F9' }}>
            <Box role="columnheader" sx={th}>Cant.</Box><Box role="columnheader" sx={th}>Descripción</Box>
            <Box role="columnheader" sx={{ ...th, textAlign: 'right' }}>Precio unit.</Box><Box role="columnheader" sx={{ ...th, textAlign: 'right' }}>Total</Box>
          </Box>
          {order.items.map((i, k) => (
            <Box role="row" key={k} sx={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', px: 1.5, py: 1.25, borderBottom: '1px solid #EEE', fontSize: 14, color: colors.text }}>
              <Box role="cell">{i.quantity}</Box>
              <Box role="cell" sx={{ overflowWrap: 'anywhere' }}>{i.name}{i.detail && <Box component="span" sx={{ color: colors.muted }}> · {i.detail}</Box>}</Box>
              <Box role="cell" sx={{ textAlign: 'right' }}>{formatPrice(i.unitPrice)}</Box>
              <Box role="cell" sx={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(i.unitPrice * i.quantity)}</Box>
            </Box>
          ))}
          {order.shippingCost > 0 && (
            <Box role="row" sx={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', px: 1.5, py: 1.25, borderBottom: '1px solid #EEE', fontSize: 14, color: colors.text }}>
              <Box role="cell">1</Box><Box role="cell">{order.shippingName ?? 'Despacho'}</Box>
              <Box role="cell" sx={{ textAlign: 'right' }}>{formatPrice(order.shippingCost)}</Box><Box role="cell" sx={{ textAlign: 'right', fontWeight: 600 }}>{formatPrice(order.shippingCost)}</Box>
            </Box>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'grid', gap: 3, gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) 300px' }, alignItems: 'start' }}>
        <Party title="Medio de pago">
          {order.payment?.method === 'transferencia' ? 'Transferencia bancaria' : 'Tarjeta de crédito o débito'}
          {order.payment?.method === 'transferencia' && order.payment.code && <><br />Código de transferencia: <b>{order.payment.code}</b></>}
          {order.payment?.method !== 'transferencia' && <><br />Últimos 4 dígitos: <b>{order.payment?.last4}</b></>}
        </Party>
        <Box sx={{ borderTop: '2px solid #E5E7EB', pt: 1 }}>
          <Total label="Valor neto (sin IVA)" value={formatPrice(order.neto)} />
          <Total label="IVA (19 %)" value={formatPrice(order.iva)} />
          <Total label="Total cobrado" value={formatPrice(order.total)} strong />
          {order.refunded > 0 && <Total label="Reintegrado por devolución" value={`− ${formatPrice(order.refunded)}`} />}
        </Box>
      </Box>

      <Typography sx={{ mt: 6, pt: 2, borderTop: '1px solid #EEE', fontSize: 12, color: colors.muted }}>
        Documento generado por TodoMart el {dmy(new Date().toISOString())} · Precios en pesos chilenos con IVA incluido.
      </Typography>
    </DocumentLayout>
  );
}
