import { Box, Rating, Typography } from '@mui/material';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { colors } from '../../utils/theme';

/**
 * Estrellas + nota. Opcionales:
 * - reviewCount: agrega "• N reseñas"
 * - outlined: estrellas con contorno (como en la ficha de producto)
 * - size: tamaño de las estrellas en px
 * - color: color de las estrellas llenas (por defecto dorado)
 */
export default function RatingStars({ value, reviewCount, outlined = false, size = 16, color = '#F5A524' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexWrap: 'wrap' }}>
      <Rating
        readOnly
        value={value}
        precision={0.1}
        size="small"
        {...(outlined && {
          icon: <StarBorderRoundedIcon fontSize="inherit" />,
          emptyIcon: <StarBorderRoundedIcon fontSize="inherit" />,
        })}
        sx={{ color, fontSize: size, ...(outlined && { '& .MuiRating-iconEmpty': { color: '#D4D4D8' } }) }}
        aria-label={`Calificación ${value} de 5`}
      />
      <Typography sx={{ fontSize: 13, color: colors.muted }}>({value.toFixed(1)})</Typography>
      {reviewCount !== undefined && (
        <Typography sx={{ fontSize: 13, color: '#9A9A9A' }}>
          • {reviewCount} {reviewCount === 1 ? 'reseña' : 'reseñas'}
        </Typography>
      )}
    </Box>
  );
}
