import { Box, Button, Typography } from '@mui/material';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppLink from '../atoms/AppLink';
import CartItemRow from '../molecules/CartItemRow';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

/** Productos de un mismo vendedor + subtotal + botón para continuar la compra con ese vendedor. */
export default function CartSellerGroup({ seller, items, subtotal, onQuantityChange, onRemove, onContinue }) {
  return (
    <Box component="section" aria-label={`Productos de ${seller.name}`} sx={{ p: { xs: 2, sm: 2.5 }, border: '1px solid #EEE', borderRadius: 3, bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 2, borderBottom: '1px solid #EEE' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
          <StorefrontOutlinedIcon sx={{ fontSize: 20, color: colors.text }} />
          <Typography component="h2" sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{seller.name}</Typography>
        </Box>
        <AppLink
          href={`/tienda/${seller.id}`}
          underline="none"
          sx={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: colors.primary }}
        >
          Ver tienda <ChevronRightIcon sx={{ fontSize: 18 }} />
        </AppLink>
      </Box>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
        {items.map((line) => (
          <CartItemRow
            key={line.lineId}
            line={line}
            onQuantityChange={(q) => onQuantityChange(line, q)}
            onRemove={() => onRemove(line)}
          />
        ))}
      </Box>

      <Typography sx={{ mt: 3, textAlign: 'right', fontSize: 16, fontWeight: 600, color: colors.text }}>
        Subtotal {seller.name}: <Box component="span" sx={{ color: colors.primary, fontWeight: 700 }}>{formatPrice(subtotal)}</Box>
      </Typography>

      <Button
        fullWidth
        variant="contained"
        disableElevation
        onClick={() => onContinue(seller)}
        sx={{ mt: 2.5, height: 46, borderRadius: '8px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, textTransform: 'none' }}
      >
        Continuar compra con {seller.name}
      </Button>
    </Box>
  );
}
