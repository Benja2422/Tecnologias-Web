import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function FormField({ label, htmlFor, error, children }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        component="label"
        htmlFor={htmlFor}
        sx={{ display: 'block', mb: 1, fontSize: 15, color: colors.muted }}
      >
        {label}
      </Typography>
      {children}
      {error && (
        <Typography role="alert" sx={{ mt: 0.5, mx: 0.5, fontSize: 12, color: 'error.main' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
