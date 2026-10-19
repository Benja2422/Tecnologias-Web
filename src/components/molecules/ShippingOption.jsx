import { Box, Typography } from '@mui/material';
import OptionCard from './OptionCard';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

/** Método de envío seleccionable: nombre, plazo y precio ("Gratis" si cuesta 0). */
export default function ShippingOption({ method, selected, onSelect }) {
  return (
    <OptionCard name="envio" value={method.id} selected={selected} onSelect={onSelect} ariaLabel={`${method.name}, ${method.eta}`}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{method.name}</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 14, color: colors.muted }}>{method.eta}</Typography>
        </Box>
        {method.price === 0 ? (
          <Box component="span" sx={{ px: 1, py: 0.25, borderRadius: 1, bgcolor: '#DCFCE7', color: '#16A34A', fontSize: 14, fontWeight: 600 }}>Gratis</Box>
        ) : (
          <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.text, whiteSpace: 'nowrap' }}>{formatPrice(method.price)}</Typography>
        )}
      </Box>
    </OptionCard>
  );
}
