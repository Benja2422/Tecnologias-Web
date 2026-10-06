import { Typography } from '@mui/material';
import { colors } from '../../utils/theme';

/** Logo en una sola línea ("TodoMart") para paneles. */
export default function Wordmark({ size = 24 }) {
  return (
    <Typography component="span" sx={{ fontSize: size, fontWeight: 700, lineHeight: 1, color: colors.ink, fontFamily: 'inherit' }}>
      T<span style={{ color: colors.primary }}>o</span>d<span style={{ color: colors.primary }}>o</span>Mart
    </Typography>
  );
}
