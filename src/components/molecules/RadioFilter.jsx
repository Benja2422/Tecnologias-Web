import { FormControlLabel, Radio, RadioGroup } from '@mui/material';
import { colors } from '../../utils/theme';

/** Grupo de opciones excluyentes del panel de filtros. options: [{ value (texto), label }]. */
export default function RadioFilter({ label, options, value, onChange }) {
  return (
    <RadioGroup aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
      {options.map((o) => (
        <FormControlLabel
          key={o.value}
          value={o.value}
          control={<Radio size="small" />}
          label={o.label}
          sx={{ ml: '-6px', mr: 0, '& .MuiRadio-root': { p: 0.75, mr: 0.5 } }}
          slotProps={{ typography: { fontSize: 15, color: colors.muted } }}
        />
      ))}
    </RadioGroup>
  );
}
