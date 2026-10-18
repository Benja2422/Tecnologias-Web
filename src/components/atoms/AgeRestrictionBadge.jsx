import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

/** Etiqueta roja de venta restringida a mayores de edad. */
export default function AgeRestrictionBadge({ children = 'Venta restringida +18' }) {
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-block', bgcolor: colors.primary, color: '#fff', fontSize: 12, fontWeight: 700,
        px: 1.5, py: 0.5, borderRadius: '4px', lineHeight: 1.4,
      }}
    >
      {children}
    </Box>
  );
}
