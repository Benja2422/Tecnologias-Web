import { Checkbox, FormControlLabel, FormHelperText, Box } from '@mui/material';
import { colors } from '../../utils/theme';

export default function CheckboxField({ label, checked, onChange, error, disabled = false, labelColor = colors.muted, labelSize = 14, dense = false }) {
  return (
    <Box>
      <FormControlLabel
        control={<Checkbox checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} {...(dense && { size: 'small', sx: { p: 0.75 } })} />}
        label={label}
        disabled={disabled}
        sx={dense ? { ml: '-6px' } : undefined}
        slotProps={{ typography: { fontSize: labelSize, color: labelColor } }}
      />
      {error && <FormHelperText error sx={{ mx: 1.5 }}>{error}</FormHelperText>}
    </Box>
  );
}
