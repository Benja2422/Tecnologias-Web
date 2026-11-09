import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

/** Título y bajada de una página del panel, con acciones opcionales a la derecha. */
export default function SellerPageTitle({ title, subtitle, actions }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
      <Box sx={{ minWidth: 0, flex: '1 1 420px' }}>
        <Typography component="h1" sx={{ fontSize: { xs: 24, md: 26 }, fontWeight: 700, color: colors.ink, lineHeight: 1.25 }}>{title}</Typography>
        {subtitle && <Typography sx={{ mt: 1, fontSize: 15, color: '#4B5563', lineHeight: 1.5 }}>{subtitle}</Typography>}
      </Box>
      {actions && <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>{actions}</Box>}
    </Box>
  );
}
