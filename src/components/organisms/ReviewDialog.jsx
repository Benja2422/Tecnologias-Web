import { useState } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarRatingInput from '../molecules/StarRatingInput';
import TextInput from '../atoms/TextInput';
import { MAX_COMMENT_LENGTH } from '../../contexts/ReviewsContext';
import { colors } from '../../utils/theme';

const buttonBase = { height: 42, px: 3, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none' };

/**
 * Modal "Escribe tu opinión" para un producto pendiente { id, name, seller, image }.
 * onSubmit({ rating, comment }) se llama al publicar (la calificación es obligatoria); onClose cierra sin guardar.
 */
export default function ReviewDialog({ item, onSubmit, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const noun = item.kind === 'servicio' ? 'servicio' : 'producto';

  const submit = (e) => {
    e.preventDefault();
    if (rating < 1) return;
    onSubmit({ rating, comment: comment.trim() });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} slotProps={{ paper: { sx: { maxWidth: 560, borderRadius: 4, m: 2, width: 'calc(100% - 32px)' }, component: 'form', onSubmit: submit, noValidate: true } }} aria-labelledby="review-title">
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 3.5, pt: 3, pb: 2.5, borderBottom: '1px solid #EEE' }}>
        <Box>
          <Typography id="review-title" component="h2" sx={{ fontSize: 22, fontWeight: 600, color: colors.text }}>Escribe tu opinión</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13, color: colors.muted }}>Cuéntanos cómo fue tu experiencia con este {noun}.</Typography>
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

        <Box>
          <Typography id="rating-label" sx={{ fontSize: 15, fontWeight: 600, color: colors.text, mb: 1.5 }}>¿Cómo calificarías este {noun}?</Typography>
          <StarRatingInput value={rating} onChange={setRating} label={`¿Cómo calificarías este ${noun}?`} />
        </Box>

        <Box>
          <Typography component="label" htmlFor="review-comment" sx={{ display: 'block', fontSize: 15, fontWeight: 600, color: colors.text, mb: 1.5 }}>
            Comentario <Box component="span" sx={{ fontWeight: 400, color: colors.muted }}>(opcional)</Box>
          </Typography>
          <TextInput
            id="review-comment"
            multiline
            minRows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="¿Qué te gustó del producto? ¿Qué podría mejorar?"
            inputProps={{ maxLength: MAX_COMMENT_LENGTH }}
            sx={{
              '& .MuiOutlinedInput-root.MuiInputBase-multiline': { height: 'auto', py: 1.5, px: 2, alignItems: 'flex-start', bgcolor: '#FAFAFA' },
              '& .MuiInputBase-inputMultiline, & textarea': { height: 'auto', padding: '0 !important', fontSize: 14 },
            }}
          />
          <Typography sx={{ mt: 0.75, textAlign: 'right', fontSize: 12, color: colors.muted }}>{comment.length} / {MAX_COMMENT_LENGTH}</Typography>
        </Box>
      </Box>

      <Box sx={{ px: 3.5, py: 2.5, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ ...buttonBase, color: colors.text, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } }}>Cancelar</Button>
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={rating < 1}
          sx={{ ...buttonBase, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}
        >
          Publicar reseña
        </Button>
      </Box>
    </Dialog>
  );
}
