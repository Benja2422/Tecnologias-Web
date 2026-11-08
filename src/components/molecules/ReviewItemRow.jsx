import { Box, Button, Typography } from '@mui/material';
import RatingStars from '../atoms/RatingStars';
import { colors } from '../../utils/theme';
import { formatPurchaseDate } from '../../utils/dates';

/**
 * Fila de un producto en "Mis reseñas". Pendiente: botón "Dejar una opinión" (onReview).
 * Realizada (tiene `rating`): muestra comentario y estrellas, y toda la fila se puede abrir (onOpen) para ver el detalle.
 */
export default function ReviewItemRow({ item, onReview, onOpen }) {
  const done = item.rating !== undefined;
  const open = done && onOpen ? {
    role: 'button',
    tabIndex: 0,
    'aria-label': `Ver reseña de ${item.name}`,
    onClick: () => onOpen(item),
    onKeyDown: (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(item); } },
  } : {};
  return (
    <Box
      {...open}
      sx={{
        display: 'flex', alignItems: 'center', gap: 2.5, flexWrap: { xs: 'wrap', sm: 'nowrap' }, px: { xs: 2, sm: 3 }, py: 2.25,
        ...(open.role && { cursor: 'pointer', borderRadius: 'inherit', '&:hover': { bgcolor: '#FAFAFA' }, '&:focus-visible': { outline: `2px solid ${colors.link}`, outlineOffset: -2 } }),
      }}
    >
      {item.image ? (
        <Box component="img" src={item.image} alt="" sx={{ width: 72, height: 72, borderRadius: 2, objectFit: 'cover', flexShrink: 0 }} />
      ) : (
        <Box aria-hidden sx={{ width: 72, height: 72, borderRadius: 2, bgcolor: '#E5E7EB', flexShrink: 0 }} />
      )}
      <Box sx={{ flex: 1, minWidth: 180 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{item.name}</Typography>
        <Typography sx={{ mt: 0.75, fontSize: 13, color: colors.muted }}>Vendido por {item.seller}</Typography>
        {done && item.comment && <Typography sx={{ mt: 0.75, fontSize: 13, color: colors.muted, overflowWrap: 'anywhere' }}>{item.comment}</Typography>}
      </Box>
      <Box sx={{ display: 'grid', justifyItems: { xs: 'start', sm: 'end' }, gap: 1.25, ml: { xs: 'auto', sm: 0 } }}>
        <Typography sx={{ fontSize: 12, color: colors.muted }}>Comprado el {formatPurchaseDate(item.purchasedAt)}</Typography>
        {done ? (
          <RatingStars value={item.rating} size={18} showValue={false} />
        ) : (
          <Button
            variant="contained"
            disableElevation
            onClick={() => onReview(item)}
            aria-label={`Dejar una opinión sobre ${item.name}`}
            sx={{ height: 36, px: 2, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}
          >
            Dejar una opinión
          </Button>
        )}
      </Box>
    </Box>
  );
}
