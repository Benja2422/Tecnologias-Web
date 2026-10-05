import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

export default function Badge({ children }) {
  return (
    <Box
      component="span"
      sx={{ bgcolor: colors.link, color: '#fff', fontSize: 12, fontWeight: 600, px: 1.2, py: 0.4, borderRadius: 1 }}
    >
      {children}
    </Box>
  );
}
