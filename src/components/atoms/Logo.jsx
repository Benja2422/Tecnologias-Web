import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

/** size = font-size en px del texto (32 en las pantallas de auth, 22 en el header) */
export default function Logo({ size = 32 }) {
  const text = { fontWeight: 700, fontSize: size, lineHeight: 1, color: '#000', fontFamily: 'inherit' };
  return (
    <Box sx={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ width: size * 1.8, height: 2, bgcolor: colors.text, mb: `${size * 0.15}px` }} />
      <Typography component="span" sx={text}>
        T<span style={{ color: colors.primary }}>o</span>d<span style={{ color: colors.primary }}>o</span>
      </Typography>
      <Typography component="span" sx={{ ...text, ml: `${size * 0.5}px` }}>Mart</Typography>
      <Box sx={{ width: size * 1.7, height: 1.5, bgcolor: colors.text, mt: `${size * 0.15}px`, ml: `${size * 0.5}px` }} />
    </Box>
  );
}
