import { Box, Typography } from '@mui/material';
import DiscountBadge from '../atoms/DiscountBadge';
import { colors } from '../../utils/theme';
import { discountPercent, formatPrice } from '../../utils/format';

/** Precio actual + precio anterior tachado (+ porcentaje de descuento si size="lg"). */
export default function PriceDisplay({ price, originalPrice, size = 'lg' }) {
  const large = size === 'lg';
  const percent = discountPercent(price, originalPrice);
  return (
    <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', gap: large ? 2 : 1.25 }}>
      <Typography component="span" sx={{ fontSize: large ? { xs: 30, md: 36 } : 18, fontWeight: 700, color: colors.text, lineHeight: 1.2 }}>
        {formatPrice(price)}
      </Typography>
      {percent > 0 && (
        <>
          <Typography
            component="span"
            sx={{ fontSize: large ? 20 : 14, color: '#9A9A9A', textDecoration: 'line-through' }}
            aria-label={`Precio anterior ${formatPrice(originalPrice)}`}
          >
            {formatPrice(originalPrice)}
          </Typography>
          {large && (
            <Box sx={{ alignSelf: 'center' }}>
              <DiscountBadge percent={percent} />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
