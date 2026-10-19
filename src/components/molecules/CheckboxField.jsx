import { Checkbox, FormControlLabel, FormHelperText, Box } from '@mui/material';
import { colors } from '../../utils/theme';

export default function CheckboxField({ label, checked, onChange, error, disabled = false }) {
  return (
    <Box>
      <FormControlLabel
        control={<Checkbox checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />}
        label={label}
        disabled={disabled}
        slotProps={{ typography: { fontSize: 14, color: colors.muted } }}
      />
      {error && <FormHelperText error sx={{ mx: 1.5 }}>{error}</FormHelperText>}
    </Box>
  );
}
