import { Box, Button, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AppLink from '../atoms/AppLink';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

const buttonBase = { flex: 1, minWidth: 0, height: 36, px: 1, borderRadius: '8px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, textTransform: 'none', whiteSpace: 'nowrap' };

/**
 * Tarjeta de la lista de deseos: foto, tipo, nombre, precio y acciones.
 * item: { id, kind, name, price, priceSuffix?, image, href }. Los servicios muestran "Desde $X".
 */
export default function WishlistCard({ item, onAddToCart, onRemove }) {
  const service = item.kind === 'servicio';
  return (
    <Box component="article" sx={{ display: 'flex', flexDirection: 'column', bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ height: 118, bgcolor: '#F4F4F4', display: 'grid', placeItems: 'center', color: '#C8C8C8' }}>
        {item.image ? (
          <Box component="img" src={item.image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <ImageOutlinedIcon sx={{ fontSize: 40 }} />
        )}
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, p: 2 }}>
        <Typography sx={{ fontSize: 11, color: colors.muted }}>{service ? 'Servicio' : 'Producto'}</Typography>
        <Typography component="h3" sx={{ mt: 1, minHeight: 42, fontSize: 14, fontWeight: 600, lineHeight: 1.5, color: colors.text, overflowWrap: 'anywhere' }}>
          {item.href ? (
            <AppLink href={item.href} underline="none" sx={{ color: 'inherit', fontFamily: 'inherit', '&:hover': { color: colors.primary } }}>{item.name}</AppLink>
          ) : item.name}
        </Typography>
        <Typography sx={{ mt: 1, fontSize: 16, fontWeight: 700, color: colors.text }}>
          {service && 'Desde '}{formatPrice(item.price)}{item.priceSuffix}
        </Typography>

        <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            disableElevation
            onClick={() => onAddToCart(item)}
            aria-label={`Añadir ${item.name} al carrito`}
            sx={{ ...buttonBase, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}
          >
            Añadir al carrito
          </Button>
          <Button
            variant="outlined"
            onClick={() => onRemove(item)}
            aria-label={`Quitar ${item.name} de la lista`}
            sx={{ ...buttonBase, fontWeight: 400, color: colors.muted, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } }}
          >
            Quitar de lista
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
