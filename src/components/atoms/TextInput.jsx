import { Box, InputAdornment, TextField } from '@mui/material';
import { colors } from '../../utils/theme';

export const FIELD_HEIGHT = 50;

/**
 * Campo de texto base de la app.
 * - prefix: bloque fijo a la izquierda del campo (ej. "+56" en teléfonos).
 * - InputProps / inputProps / SelectProps: MUI 9 ya no las lee en <TextField>, así que se
 *   aceptan aquí por comodidad y se traducen a slotProps.input / htmlInput / select.
 */
export default function TextInput({ error, sx, prefix, InputProps, inputProps, SelectProps, slotProps = {}, ...props }) {
  const input = {
    ...(prefix && {
      startAdornment: (
        <InputAdornment position="start" sx={{ m: 0, height: '100%', maxHeight: 'none' }}>
          <Box
            sx={{
              height: '100%', display: 'flex', alignItems: 'center', px: 2,
              bgcolor: '#F3F3F3', borderRight: `1px solid ${colors.border}`, borderRadius: '8px 0 0 8px',
              color: colors.text, fontSize: 15, fontWeight: 500,
            }}
          >
            {prefix}
          </Box>
        </InputAdornment>
      ),
    }),
    ...InputProps,
    ...slotProps.input,
  };

  return (
    <TextField
      fullWidth
      variant="outlined"
      error={Boolean(error)}
      helperText={typeof error === 'string' ? error : undefined}
      slotProps={{
        ...slotProps,
        input,
        htmlInput: { ...inputProps, ...slotProps.htmlInput },
        select: { ...SelectProps, ...slotProps.select },
        formHelperText: { ...slotProps.formHelperText, sx: { mx: 0.5 } },
      }}
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
        },
        // Con prefijo, MUI agrega 14px de relleno a la izquierda: se quita para que el bloque llegue al borde
        ...(prefix && { '& .MuiOutlinedInput-root.MuiInputBase-adornedStart': { paddingLeft: 0 } }),
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
