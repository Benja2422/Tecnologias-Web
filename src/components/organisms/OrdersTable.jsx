import { Box, Button, Typography } from '@mui/material';
import OrderStatusBadge from '../atoms/OrderStatusBadge';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';
import { formatShortDate } from '../../utils/dates';
import { countProducts, getOrderStatus } from '../../utils/orders';

// Las columnas crecen con el ancho disponible (mínimo legible en cada una)
const COLUMNS = 'minmax(160px, 1.3fr) minmax(120px, 1fr) minmax(140px, 1.2fr) minmax(120px, 1fr) minmax(130px, 1fr) minmax(110px, 1fr) minmax(130px, 0.9fr)';
const HEAD = ['Nº Pedido', 'Fecha', 'Vendedor', 'Productos', 'Estado', 'Total'];
const cell = { fontSize: 15, color: colors.text };

/** Tabla de pedidos. Se desplaza horizontalmente en pantallas angostas. */
export default function OrdersTable({ orders, onView }) {
  return (
    <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 3, overflowX: 'auto' }}>
      <Box role="table" aria-label="Mis pedidos" sx={{ minWidth: 900 }}>
        <Box role="row" sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', px: 3, height: 52, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', borderRadius: '12px 12px 0 0' }}>
          {HEAD.map((h) => (
            <Box role="columnheader" key={h} sx={{ ...cell, fontWeight: 600 }}>{h}</Box>
          ))}
          <Box role="columnheader" sx={{ ...cell, fontWeight: 600, textAlign: 'right' }}>Acción</Box>
        </Box>
        {orders.map((o, i) => {
          const n = countProducts(o);
          return (
            <Box
              role="row"
              key={o.id}
              sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', px: 3, minHeight: 68, borderBottom: i < orders.length - 1 ? '1px solid #F0F0F0' : 'none' }}
            >
              <Box role="cell" sx={{ ...cell, fontWeight: 600 }}>#{o.id}</Box>
              <Box role="cell" sx={{ ...cell, color: colors.muted }}>{formatShortDate(o.createdAt)}</Box>
              <Box role="cell" sx={cell}>{o.seller.name}</Box>
              <Box role="cell" sx={{ ...cell, color: colors.muted }}>{n} {n === 1 ? 'producto' : 'productos'}</Box>
              <Box role="cell"><OrderStatusBadge status={getOrderStatus(o)} /></Box>
              <Box role="cell" sx={{ ...cell, fontWeight: 700 }}>{formatPrice(o.totals.total)}</Box>
              <Box role="cell" sx={{ textAlign: 'right' }}>
                <Button
                  variant="outlined"
                  onClick={() => onView(o)}
                  aria-label={`Ver detalle del pedido ${o.id}`}
                  sx={{
                    height: 36, px: 2, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none',
                    color: colors.primary, borderColor: colors.primary, '&:hover': { borderColor: colors.primaryDark, bgcolor: '#FDECEF' },
                  }}
                >
                  Ver detalle
                </Button>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
