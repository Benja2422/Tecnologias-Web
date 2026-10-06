import { Box, InputAdornment, TextField } from '@mui/material';
import { colors } from '../../utils/theme';

export const FIELD_HEIGHT = 50;

/** prefix: texto fijo a la izquierda del campo (ej. "+56" en teléfonos). */
export default function TextInput({ error, sx, prefix, InputProps, ...props }) {
  const inputProps = prefix
    ? {
        startAdornment: (
          <InputAdornment position="start" sx={{ m: 0, height: '100%', maxHeight: 'none' }}>
            <Box
              sx={{
                height: '100%', display: 'flex', alignItems: 'center', px: 2,
                bgcolor: '#F3F3F3', borderRight: `1px solid ${colors.border}`,
                color: colors.text, fontSize: 15, fontWeight: 500,
              }}
            >
              {prefix}
            </Box>
          </InputAdornment>
        ),
        ...InputProps,
      }
    : InputProps;

  return (
    <TextField
      fullWidth
      variant="outlined"
      error={Boolean(error)}
      helperText={error || undefined}
      FormHelperTextProps={{ sx: { mx: 0.5 } }}
      InputProps={inputProps}
      sx={{
        '& .MuiOutlinedInput-root': {
          height: FIELD_HEIGHT,
          borderRadius: '8px',
          backgroundColor: '#fff',
          fontFamily: 'inherit',
          '& fieldset': { borderColor: colors.border },
          '&:hover fieldset': { borderColor: '#B0B0B0' },
          '&.Mui-focused fieldset': { borderColor: colors.primary, borderWidth: 1 },
          '&.Mui-error fieldset': { borderColor: '#d32f2f' },
          ...(prefix && { paddingLeft: 0, overflow: 'hidden' }),
        },
        '& .MuiOutlinedInput-input': {
          padding: '0 16px',
          height: FIELD_HEIGHT,
          boxSizing: 'border-box',
          fontSize: 15,
          textAlign: 'left',
        },
        ...sx,
      }}
      {...props}
    />
  );
}
