import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

const VARIANTS = {
  Principal: { color: colors.primary, bg: '#FDECEF' },
  Trabajo: { color: colors.link, bg: '#E8EEFB' },
};
const DEFAULT = { color: '#555', bg: '#EEEEEE' };

/** outlined: contorno rojo sobre fondo blanco (checkout). */
export default function TagBadge({ label, outlined = false }) {
  const { color, bg } = VARIANTS[label] ?? DEFAULT;
  return (
    <Box component="span" sx={{ color, bgcolor: outlined ? '#fff' : bg, fontSize: 12, fontWeight: 600, px: 1.25, py: 0.4, borderRadius: 1, whiteSpace: 'nowrap', ...(outlined && { border: `1px solid ${color}`, fontSize: 11, px: 1, py: 0.15 }) }}>
      {label}
    </Box>
  );
}
