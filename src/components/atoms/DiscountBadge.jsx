import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

export default function DiscountBadge({ percent }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block', color: colors.primary, bgcolor: '#FDECEC', border: `1px solid ${colors.primary}`,
        fontSize: 14, fontWeight: 700, px: 1, py: 0.25, borderRadius: '4px', lineHeight: 1.5,
      }}
    >
      -{percent}%
    </Box>
  );
}
