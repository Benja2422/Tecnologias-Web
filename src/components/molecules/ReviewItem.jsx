import { Box, Typography } from '@mui/material';
import RatingStars from '../atoms/RatingStars';
import { colors } from '../../utils/theme';
import { formatShortDate } from '../../utils/format';

export default function ReviewItem({ review, last = false }) {
  return (
    <Box component="article" sx={{ py: 2.5, borderBottom: last ? 'none' : '1px solid #EEE' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 2 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#222' }}>{review.author}</Typography>
        <Typography component="time" dateTime={review.date} sx={{ fontSize: 12, color: '#9A9A9A', flexShrink: 0 }}>
          {formatShortDate(review.date)}
        </Typography>
      </Box>
      <Box sx={{ mt: 0.5 }}><RatingStars value={review.rating} outlined /></Box>
      <Typography sx={{ mt: 1, fontSize: 14, color: colors.muted, lineHeight: 1.7 }}>{review.comment}</Typography>
    </Box>
  );
}
