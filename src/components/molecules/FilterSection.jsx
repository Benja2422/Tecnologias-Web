import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

/** Bloque del panel de filtros: título + contenido, separado del siguiente por una línea. */
export default function FilterSection({ title, children, divider = true }) {
  return (
    <Box component="section" aria-label={title} sx={{ py: 3, borderBottom: divider ? '1px solid #EEE' : 'none' }}>
      <Typography component="h2" sx={{ fontSize: 16, fontWeight: 600, color: colors.text, mb: 1.5 }}>{title}</Typography>
      {children}
    </Box>
  );
}
