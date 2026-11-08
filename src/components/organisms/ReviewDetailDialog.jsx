import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RatingStars from '../atoms/RatingStars';
import { formatPurchaseDate } from '../../utils/dates';
import { colors } from '../../utils/theme';

const label = { fontSize: 15, fontWeight: 600, color: colors.text };

/**
 * Modal "Detalle de tu reseña" (solo lectura) para una opinión ya publicada
 * { name, seller, image, purchasedAt, rating, comment, kind? }. onClose lo cierra.
 */
export default function ReviewDetailDialog({ item, onClose }) {
  const noun = item.kind === 'servicio' ? 'servicio' : 'producto';
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} aria-labelledby="review-detail-title" slotProps={{ paper: { sx: { maxWidth: 560, borderRadius: 4, m: 2, width: 'calc(100% - 32px)' } } }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 3.5, pt: 3, pb: 2.5, borderBottom: '1px solid #EEE' }}>
        <Box>
          <Typography id="review-detail-title" component="h2" sx={{ fontSize: 22, fontWeight: 600, color: colors.text }}>Detalle de tu reseña</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.muted }}>Consulta la opinión que publicaste sobre este {noun}.</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ color: colors.text, mt: 0.5 }}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ px: 3.5, py: 3, display: 'grid', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1.75, bgcolor: '#F5F5F6', borderRadius: 2 }}>
          {item.image ? (
            <Box component="img" src={item.image} alt="" sx={{ width: 58, height: 58, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }} />
          ) : (
            <Box aria-hidden sx={{ width: 58, height: 58, borderRadius: 1.5, bgcolor: '#E5E7EB', flexShrink: 0 }} />
          )}
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{item.name}</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.muted }}>Vendido por {item.seller}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) 174px' }, gap: { xs: 3, sm: 4 } }}>
          <Box>
            <Typography sx={{ ...label, mb: 1.25 }}>Tu puntuación</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <RatingStars value={item.rating} size={26} showValue={false} />
              <Typography sx={{ fontSize: 13, color: colors.muted }}>{item.rating} de 5</Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={{ ...label, mb: 1.25 }}>Fecha de compra</Typography>
            <Typography sx={{ fontSize: 14, color: colors.muted }}>{formatPurchaseDate(item.purchasedAt)}</Typography>
          </Box>
        </Box>

        <Box>
          <Typography sx={{ ...label, mb: 1.25 }}>Tu opinión</Typography>
          {item.comment ? (
            <Typography sx={{ fontSize: 17, lineHeight: 1.5, color: colors.text, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{item.comment}</Typography>
          ) : (
            <Typography sx={{ fontSize: 15, color: colors.muted }}>No dejaste un comentario.</Typography>
          )}
        </Box>
      </Box>

      <Box sx={{ px: 3.5, py: 2.5, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} variant="contained" disableElevation autoFocus sx={{ height: 42, px: 3, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>
          Cerrar
        </Button>
      </Box>
    </Dialog>
  );
}
