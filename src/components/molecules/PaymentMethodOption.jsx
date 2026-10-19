import { Box, Typography } from '@mui/material';
import OptionCard from './OptionCard';
import { colors } from '../../utils/theme';

/** Medio de pago seleccionable; `children` es el detalle que se despliega al elegirlo (p. ej. el formulario de tarjeta). */
export default function PaymentMethodOption({ value, title, icon, description, selected, onSelect, children }) {
  return (
    <OptionCard name="medio-pago" value={value} selected={selected} onSelect={onSelect} ariaLabel={title}>
      <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 16, fontWeight: 600, color: colors.text }}>
        <Box component="span" aria-hidden sx={{ display: 'inline-flex', color: selected ? colors.primary : colors.muted }}>{icon}</Box>
        {title}
      </Typography>
      {description && <Typography sx={{ mt: 0.25, fontSize: 14, color: colors.muted }}>{description}</Typography>}
      {selected && children}
    </OptionCard>
  );
}
