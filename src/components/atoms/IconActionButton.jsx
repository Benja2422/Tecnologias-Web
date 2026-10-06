import { IconButton } from '@mui/material';
import { colors } from '../../utils/theme';

/** Botón cuadrado con borde para acciones de tabla (editar / eliminar). */
export default function IconActionButton({ label, danger = false, children, ...props }) {
  return (
    <IconButton
      aria-label={label}
      title={label}
      sx={{
        width: 38, height: 28, borderRadius: '6px', border: '1px solid',
        borderColor: danger ? colors.primary : '#D1D5DB', color: danger ? colors.primary : colors.ink,
        bgcolor: '#fff', '& svg': { fontSize: 15 },
        '&:hover': { bgcolor: danger ? '#FDECEF' : '#F3F4F6' },
      }}
      {...props}
    >
      {children}
    </IconButton>
  );
}
