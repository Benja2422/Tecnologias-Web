import { Button } from '@mui/material';
import { colors } from '../../utils/theme';

/** Botón neutro con borde. pill=true para el estilo redondeado completo. */
export default function SecondaryButton({ children, pill = false, sx, ...props }) {
  return (
    <Button
      variant="outlined"
      sx={{
        height: 46, px: 3, borderRadius: pill ? 999 : '8px', textTransform: 'none', fontFamily: 'inherit',
        fontSize: 15, fontWeight: pill ? 400 : 600, color: pill ? colors.muted : colors.text,
        borderColor: colors.border, '&:hover': { borderColor: colors.text, bgcolor: 'transparent' },
        ...sx,
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
