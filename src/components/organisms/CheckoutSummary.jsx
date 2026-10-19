import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

const Row = ({ label, value, strong = false }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
    <Typography sx={{ fontSize: 15, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: 15, fontWeight: strong ? 600 : 500, color: colors.text }}>{value}</Typography>
  </Box>
);

/**
 * "Resumen del pedido" del checkout (un solo vendedor).
 * lines: líneas del carrito del vendedor; totals: resultado de calcTotals.
 * showTax: agrega Neto e IVA (paso de pago).
 * shippingLabel: texto del envío ("Gratis", "$3.990", "No aplica").
 */
export default function CheckoutSummary({ seller, lines, totals, shippingLabel, shippingName, showTax = false, showShipping = true }) {
  return (
    <Box component="aside" aria-label="Resumen del pedido" sx={{ p: 3, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 3, position: { lg: 'sticky' }, top: { lg: 160 } }}>
      <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.text, pb: 2.5, borderBottom: '1px solid #E5E7EB' }}>Resumen del pedido</Typography>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, pt: 2.5, display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 1.5, pb: 2.5, borderBottom: '1px solid #E5E7EB' }}>
        {lines.map((l) => (
          <Box component="li" key={l.lineId} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              {l.image ? (
                <Box component="img" src={l.image} alt="" sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover', bgcolor: '#fff', border: '1px solid #E5E7EB', display: 'block' }} />
              ) : (
                <Box aria-hidden sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: '#E5E7EB' }} />
              )}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 500, color: colors.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.name}</Typography>
              <Typography sx={{ fontSize: 13, color: colors.muted }}>x{l.quantity}</Typography>
            </Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.text, whiteSpace: 'nowrap' }}>{formatPrice(l.unitPrice * l.quantity)}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ pt: 2.5, display: 'grid', gap: 1.5 }}>
        <Row label={showTax ? 'Subtotal productos' : 'Subtotal'} value={formatPrice(totals.subtotal)} />
        {showShipping && <Row label={shippingName ?? 'Envío'} value={shippingLabel} />}
        {showTax && (
          <>
            <Box sx={{ borderTop: '1px solid #E5E7EB' }} />
            <Row label="Neto" value={formatPrice(totals.neto)} />
            <Row label="IVA (19%)" value={formatPrice(totals.iva)} />
          </>
        )}
      </Box>

      <Box sx={{ mt: 2.5, pt: 2.5, borderTop: '2px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography sx={{ fontSize: 17, fontWeight: 600, color: colors.text }}>Total</Typography>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{formatPrice(totals.total)}</Typography>
      </Box>

      <Typography sx={{ mt: 2, fontSize: 13, color: colors.muted }}>
        Vendido por: {seller.name}
      </Typography>
    </Box>
  );
}
