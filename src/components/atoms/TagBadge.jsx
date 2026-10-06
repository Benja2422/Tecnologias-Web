import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

const VARIANTS = {
  Principal: { color: colors.primary, bg: '#FDECEF' },
  Trabajo: { color: colors.link, bg: '#E8EEFB' },
};
const DEFAULT = { color: '#555', bg: '#EEEEEE' };

export default function TagBadge({ label }) {
  const { color, bg } = VARIANTS[label] ?? DEFAULT;
  return (
    <Box component="span" sx={{ color, bgcolor: bg, fontSize: 12, fontWeight: 600, px: 1.25, py: 0.4, borderRadius: 1, whiteSpace: 'nowrap' }}>
      {label}
    </Box>
  );
}
