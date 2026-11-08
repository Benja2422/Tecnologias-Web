import { Box, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';
import { quoteTotals } from '../../utils/quotations';

const Row = ({ label, value, strong = false, muted = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
    <Typography sx={{ fontSize: 14, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: 14, fontWeight: strong ? 700 : 400, color: muted ? colors.muted : colors.text }}>{value}</Typography>
  </Box>
);

/**
 * "Resumen del pedido" cuando se paga una cotización: precios fijos de la cotización (con el de lista tachado),
 * neto e IVA de los productos, envío y total a pagar.
 * lines: quotationToLines(); shippingName / shippingPrice: método elegido (null si no aplica).
 */
export default function QuotationCheckoutSummary({ quotation, lines, shippingName, shippingPrice = 0 }) {
  const { neto, iva, total } = quoteTotals(lines);
  return (
    <Box component="aside" aria-label="Resumen del pedido" sx={{ p: 3, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, position: { lg: 'sticky' }, top: { lg: 160 } }}>
      <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600, color: colors.text }}>Resumen del pedido</Typography>
      <Typography sx={{ mt: 2, fontSize: 12.5, fontWeight: 600, color: colors.primary }}>Precio cotizado · {quotation.id}</Typography>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0 }}>
        {lines.map((l, i) => (
          <Box component="li" key={`${l.productId}-${i}`} sx={{ display: 'flex', gap: 1.75, py: 2, borderTop: i === 0 ? 'none' : '1px solid #EEE', pt: i === 0 ? 0 : 2 }}>
            <Box sx={{ width: 48, height: 48, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
              {l.image ? <Box component="img" src={l.image} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageOutlinedIcon aria-hidden sx={{ fontSize: 26, color: '#C8C8C8' }} />}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.text, overflowWrap: 'anywhere' }}>{l.name}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.text, whiteSpace: 'nowrap' }}>{formatPrice(l.unitPrice * l.quantity)}</Typography>
              </Box>
              {l.detail && <Typography sx={{ mt: 0.25, fontSize: 12, color: colors.muted }}>{l.detail}</Typography>}
              <Typography sx={{ mt: 0.25, fontSize: 12, color: colors.text }}>
                {formatPrice(l.unitPrice)} / un. con IVA
                {l.listPrice ? <Box component="span" sx={{ ml: 1, fontSize: 11, color: '#9A9A9A', textDecoration: 'line-through' }}>{formatPrice(l.listPrice)}</Box> : null}
              </Typography>
              <Typography sx={{ mt: 0.25, fontSize: 12, color: colors.muted }}>Cantidad: {l.quantity}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ pt: 2, borderTop: '1px solid #EEE', display: 'grid', gap: 1.25 }}>
        <Row label="Neto" value={formatPrice(neto)} strong />
        <Row label="IVA (19%)" value={formatPrice(iva)} strong />
        <Row label="Productos con IVA" value={formatPrice(total)} muted />
        {shippingName && <Row label={shippingName} value={shippingPrice === 0 ? 'Gratis' : formatPrice(shippingPrice)} muted />}
      </Box>

      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>Total a pagar</Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{formatPrice(total + shippingPrice)}</Typography>
      </Box>
      <Typography sx={{ mt: 2, fontSize: 12.5, color: colors.muted }}>Vendido por: {quotation.seller.name}</Typography>
    </Box>
  );
}
