import { Box, Typography } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { colors } from '../../utils/theme';

/** Aviso rojo "Acción requerida: …" con un texto explicativo. */
export default function ActionRequiredAlert({ title, children }) {
  return (
    <Box role="status" sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, px: 2, py: 2, bgcolor: '#FFF5F5', border: `1px solid ${colors.primary}`, borderRadius: '8px' }}>
      <Box aria-hidden sx={{ width: 32, height: 32, flexShrink: 0, borderRadius: '50%', bgcolor: colors.primary, color: '#fff', display: 'grid', placeItems: 'center', mt: 0.25 }}>
        <WarningAmberOutlinedIcon sx={{ fontSize: 18 }} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.primary }}>{title}</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.ink, lineHeight: 1.55, '& b': { fontWeight: 700 } }}>{children}</Typography>
      </Box>
    </Box>
  );
}
