import { Box } from '@mui/material';

const STYLES = {
  Pendiente: { color: '#92600A', bg: '#FEF3C7' },
  Preparando: { color: '#1D4ED8', bg: '#DBEAFE' },
  Enviado: { color: '#6D28D9', bg: '#EDE9FE' },
  Entregado: { color: '#2E7D32', bg: '#E3F5EA' },
  Cancelado: { color: '#B00020', bg: '#FDE8EC' },
};

/** Estado de un pedido. size="large" para el título del detalle. */
export default function OrderStatusBadge({ status, size = 'small' }) {
  const { color, bg } = STYLES[status] ?? { color: '#555', bg: '#EEE' };
  const large = size === 'large';
  return (
    <Box component="span" sx={{ display: 'inline-block', color, bgcolor: bg, fontSize: large ? 14 : 13, fontWeight: 600, px: large ? 1.75 : 1.5, py: large ? 0.5 : 0.4, borderRadius: 999, whiteSpace: 'nowrap' }}>
      {status}
    </Box>
  );
}
