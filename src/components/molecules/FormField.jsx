import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function FormField({ label, htmlFor, error, optional = false, children }) {
  return (
    <Box sx={{ width: '100%', textAlign: 'left' }}>
      <Typography
        component="label"
        htmlFor={htmlFor}
        sx={{ display: 'block', mb: 1, fontSize: 15, color: colors.muted, textAlign: 'left' }}
      >
        {label}
        {optional && (
          <Box component="span" sx={{ ml: 0.75, fontSize: 13, color: '#B5B5B5' }}>
            (opcional)
          </Box>
        )}
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