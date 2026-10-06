import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function StatCard({ label, value, color = colors.ink }) {
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, px: 2.5, py: 3, boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
      <Typography sx={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#9CA3AF' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 1.5, fontSize: 28, fontWeight: 700, lineHeight: 1.1, color }}>
        {value}
      </Typography>
    </Box>
  );
}
