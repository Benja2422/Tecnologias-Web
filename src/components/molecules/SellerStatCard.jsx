import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

/**
 * Indicador del panel. variant="caps": etiqueta en mayúsculas (inventario, ofertas, pedidos); "icon": etiqueta normal con ícono (dashboard).
 * alert: borde y textos rojos. hint: texto o nodo bajo el valor.
 */
export default function SellerStatCard({ label, value, hint, icon, alert = false, variant = 'caps' }) {
  const caps = variant === 'caps';
  return (
    <Box sx={{ bgcolor: '#fff', border: `1px solid ${alert ? '#F5B5B5' : '#E5E7EB'}`, borderRadius: '10px', px: 2.5, py: caps ? 2.5 : 2.75, minWidth: 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={caps
          ? { fontSize: 11.5, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: alert ? colors.primary : '#4B5563' }
          : { fontSize: 14, color: '#4B5563' }}
        >
          {label}
        </Typography>
        {icon && <Box aria-hidden sx={{ width: 32, height: 32, display: 'grid', placeItems: 'center', border: '1px solid #E5E7EB', borderRadius: '6px', color: colors.ink, '& svg': { fontSize: 19 } }}>{icon}</Box>}
      </Box>
      <Typography sx={{ mt: caps ? 1.25 : 2.5, fontSize: caps ? 25 : 30, fontWeight: 700, lineHeight: 1.2, color: alert ? colors.primary : colors.ink, overflowWrap: 'anywhere' }}>{value}</Typography>
      {hint && <Box sx={{ mt: 1.25, fontSize: 12, color: '#9CA3AF' }}>{hint}</Box>}
    </Box>
  );
}
