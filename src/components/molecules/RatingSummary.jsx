import { Box, Typography } from '@mui/material';
import RatingStars from '../atoms/RatingStars';
import ProgressBar from '../atoms/ProgressBar';
import { colors } from '../../utils/theme';

/** Resumen de calificaciones: nota grande, estrellas y distribución 5→1. */
export default function RatingSummary({ rating, count, distribution }) {
  return (
    <Box>
      <Typography sx={{ fontSize: 52, fontWeight: 700, lineHeight: 1.1, color: colors.text }}>{rating.toFixed(1)}</Typography>
      <Box sx={{ mt: 1 }}><RatingStars value={rating} reviewCount={count} outlined /></Box>
      <Typography sx={{ mt: 0.5, mb: 2, fontSize: 14, color: colors.muted }}>
        {count} {count === 1 ? 'calificación global' : 'calificaciones globales'}
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.25 }}>
        {[5, 4, 3, 2, 1].map((stars) => {
          const percent = count ? Math.round(((distribution[stars] ?? 0) / count) * 100) : 0;
          return (
            <Box key={stars} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Typography sx={{ width: 10, fontSize: 13, color: colors.muted }}>{stars}</Typography>
              <ProgressBar percent={percent} label={`${stars} estrellas`} />
              <Typography sx={{ width: 40, textAlign: 'right', fontSize: 13, color: colors.muted }}>{percent}%</Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
