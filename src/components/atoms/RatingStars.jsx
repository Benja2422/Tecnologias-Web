import { Box, Rating, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function RatingStars({ value }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
      <Rating
        readOnly
        value={value}
        precision={0.1}
        size="small"
        sx={{ color: '#F5A524', fontSize: 16 }}
        aria-label={`Calificación ${value} de 5`}
      />
      <Typography sx={{ fontSize: 13, color: colors.muted }}>({value.toFixed(1)})</Typography>
    </Box>
  );
}
