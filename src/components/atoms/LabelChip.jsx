import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

/** Etiqueta neutra con borde (p. ej. "Casa", "Oficina"). */
export default function LabelChip({ children }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block', px: 1.5, py: 0.5, fontSize: 13, fontWeight: 600, lineHeight: 1.4, color: colors.ink,
        bgcolor: '#FAFAFA', border: '1px solid #D9D9D9', borderRadius: '6px',
      }}
    >
      {children}
    </Box>
  );
}
