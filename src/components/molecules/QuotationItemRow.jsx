import { Box, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

export const WarningStrip = ({ children, ...props }) => (
  <Box role="status" {...props} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, bgcolor: '#FFF6DD', borderRadius: '6px', color: '#8A5A00', fontSize: 14, ...props.sx }}>
    <WarningAmberOutlinedIcon aria-hidden sx={{ fontSize: 22, flexShrink: 0 }} />
    <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{children}</Box>
  </Box>
);

/**
 * Producto de una cotización. line: { name, detail, image, quantity, unitPrice, quotedPrice, listPrice, adjusted, subtotal, stock }.
 * Si el precio fue reajustado (cotización expirada) se muestra el vigente y el cotizado tachado; si no, el precio de lista tachado.
 */
export default function QuotationItemRow({ line }) {
  const struck = line.adjusted ? line.quotedPrice : line.listPrice;
  const short = typeof line.stock === 'number' && line.quantity > line.stock;
  return (
    <Box component="li" sx={{ py: 2.25, borderBottom: '1px solid #EEE', '&:first-of-type': { pt: 0.5 } }}>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <Box sx={{ width: 56, height: 56, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '6px', bgcolor: '#fff' }}>
          {line.image ? (
            <Box component="img" src={line.image} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          ) : (
            <ImageOutlinedIcon aria-hidden sx={{ fontSize: 28, color: '#C8C8C8' }} />
          )}
        </Box>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h3" sx={{ fontSize: 15, fontWeight: 600, color: colors.text, overflowWrap: 'anywhere' }}>{line.name}</Typography>
          {line.detail && <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.muted }}>{line.detail}</Typography>}
          <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.text }}>
            {formatPrice(line.unitPrice)} / un. con IVA
            {struck ? <Box component="span" sx={{ ml: 1, fontSize: 12, color: '#9A9A9A', textDecoration: 'line-through' }}>{formatPrice(struck)}</Box> : null}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.muted }}>Cantidad: {line.quantity}</Typography>
        </Box>
        <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.text, whiteSpace: 'nowrap' }}>{formatPrice(line.subtotal)}</Typography>
      </Box>
      {short && <WarningStrip sx={{ mt: 2 }}>Stock disponible: {line.stock}</WarningStrip>}
    </Box>
  );
}
