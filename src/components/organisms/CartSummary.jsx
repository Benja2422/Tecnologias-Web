import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

const Row = ({ label, value, muted = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
    <Typography sx={{ fontSize: 15, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: 15, fontWeight: muted ? 400 : 600, color: muted ? '#9A9A9A' : colors.text }}>{value}</Typography>
  </Box>
);

/** "Resumen del pedido" del carrito (todos los vendedores). El envío se calcula al elegir la dirección. */
export default function CartSummary({ count, total }) {
  return (
    <Box component="aside" aria-label="Resumen del pedido" sx={{ p: 3, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 3, position: { lg: 'sticky' }, top: { lg: 160 } }}>
      <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.text, mb: 2.5 }}>Resumen del pedido</Typography>
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        <Row label={`Productos (${count})`} value={formatPrice(total)} />
        <Row label="Envío estimado" value="Por calcular" muted />
      </Box>
      <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 17, fontWeight: 600, color: colors.text }}>Total estimado</Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{formatPrice(total)}</Typography>
      </Box>
      <Typography sx={{ mt: 2, fontSize: 12, color: '#9A9A9A' }}>El total final se calculará al seleccionar dirección de envío.</Typography>
    </Box>
  );
}
