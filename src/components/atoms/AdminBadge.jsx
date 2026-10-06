import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

export default function AdminBadge({ children = 'ADMIN' }) {
  return (
    <Box component="span" sx={{ bgcolor: colors.ink, color: '#fff', fontSize: 9, fontWeight: 700, letterSpacing: '0.04em', px: 0.9, py: 0.45, borderRadius: 0.75 }}>
      {children}
    </Box>
  );
}
