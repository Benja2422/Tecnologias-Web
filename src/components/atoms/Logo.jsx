import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function Logo() {
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: 58, height: 2, bgcolor: colors.text, mb: 0.5 }} />
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 32, lineHeight: 1, color: '#000' }}>
        T<span style={{ color: colors.primary }}>o</span>d<span style={{ color: colors.primary }}>o</span>
      </Typography>
      <Typography component="span" sx={{ fontWeight: 700, fontSize: 32, lineHeight: 1, color: '#000', ml: 2 }}>
        Mart
      </Typography>
      <Box sx={{ width: 54, height: 1.5, bgcolor: colors.text, mt: 0.5, ml: 2 }} />
    </Box>
  );
}
