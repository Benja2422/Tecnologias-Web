import { Button } from '@mui/material';
import { colors } from '../../utils/theme';

export default function AddButton({ children = '+ Agregar', ...props }) {
  return (
    <Button
      variant="outlined"
      sx={{
        height: 50,
        px: 2.5,
        flexShrink: 0,
        color: colors.text,
        borderColor: colors.border,
        '&:hover': { borderColor: colors.text, bgcolor: 'transparent' },
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
