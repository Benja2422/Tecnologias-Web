import { Button } from '@mui/material';
import { colors } from '../../utils/theme';

/** Botón de texto con icono (Editar / Eliminar). underline: texto subrayado (tarjetas de dirección). */
export default function ActionButton({ icon, children, danger = false, underline = false, ...props }) {
  return (
    <Button
      size="small"
      startIcon={icon}
      sx={{
        minWidth: 0, px: 0.5, textTransform: 'none', fontFamily: 'inherit', fontSize: 14,
        fontWeight: danger ? 600 : 500, color: danger ? colors.primary : colors.muted,
        ...(underline && { textDecoration: 'underline', textUnderlineOffset: 3 }),
        '& .MuiButton-startIcon': { mr: 0.5, '& svg': { fontSize: 16 } },
        '&:hover': { bgcolor: danger ? '#FDECEF' : '#F5F5F5', ...(underline && { textDecoration: 'underline' }) },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
