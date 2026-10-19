import { Box, IconButton, Typography } from '@mui/material';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import AppLink from '../atoms/AppLink';
import QuantityStepper from './QuantityStepper';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

/** Línea del carrito: foto, nombre, detalle, precio unitario, cantidad, total y botón para quitar. */
export default function CartItemRow({ line, onQuantityChange, onRemove }) {
  const { name, image, detail, unitPrice, quantity, maxQuantity, href } = line;

  return (
    <Box
      component="li"
      sx={{
        display: 'grid', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, py: 2.5, borderBottom: '1px solid #EEE',
        gridTemplateColumns: { xs: '80px 1fr auto', sm: '80px 1fr auto 110px 32px' },
        '&:last-of-type': { borderBottom: '1px solid #EEE' },
      }}
    >
      <Box sx={{ width: 80, height: 80, borderRadius: '6px', overflow: 'hidden', bgcolor: '#fff', display: 'grid', placeItems: 'center' }}>
        {image ? (
          <Box component="img" src={image} alt="" loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <ImageOutlinedIcon sx={{ fontSize: 32, color: '#C8C8C8' }} />
        )}
      </Box>

      <Box sx={{ minWidth: 0 }}>
        <Typography component="h3" sx={{ fontSize: 16, fontWeight: 500, color: colors.text, overflowWrap: 'anywhere' }}>
          {href ? (
            <AppLink href={href} underline="none" sx={{ color: 'inherit', fontFamily: 'inherit', '&:hover': { color: colors.primary } }}>{name}</AppLink>
          ) : name}
        </Typography>
        {detail && <Typography sx={{ mt: 0.75, fontSize: 13, color: colors.text }}>{detail}</Typography>}
        <Typography sx={{ mt: 0.75, fontSize: 13, color: '#9A9A9A' }}>Precio unitario: {formatPrice(unitPrice)}</Typography>
      </Box>

      <QuantityStepper size="small" value={quantity} max={maxQuantity} onChange={onQuantityChange} />

      <Typography sx={{ display: { xs: 'none', sm: 'block' }, textAlign: 'right', fontSize: 16, fontWeight: 700, color: colors.text }}>
        {formatPrice(unitPrice * quantity)}
      </Typography>

      <IconButton onClick={onRemove} aria-label={`Quitar ${name} del carrito`} sx={{ color: '#6B6B6B', justifySelf: 'end', gridColumn: { xs: 3, sm: 'auto' } }}>
        <HighlightOffOutlinedIcon sx={{ fontSize: 22 }} />
      </IconButton>

      <Typography sx={{ display: { xs: 'block', sm: 'none' }, gridColumn: '2 / 4', fontSize: 16, fontWeight: 700, color: colors.text }}>
        {formatPrice(unitPrice * quantity)}
      </Typography>
    </Box>
  );
}
