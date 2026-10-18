import { Box, ButtonBase, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const cellSx = {
  width: 40, height: 40, color: '#333', fontFamily: 'inherit',
  '&.Mui-disabled': { color: '#C4C4C4' },
  '&:hover:not(.Mui-disabled)': { bgcolor: '#F7F7F7' },
};

/** Selector de cantidad: [-] n [+]. */
export default function QuantityStepper({ value, min = 1, max = Infinity, onChange, disabled = false }) {
  return (
    <Box
      role="group"
      aria-label="Cantidad"
      sx={{ display: 'inline-flex', alignItems: 'center', height: 40, border: '1px solid #E3E3E3', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff' }}
    >
      <ButtonBase
        aria-label="Disminuir cantidad"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        sx={cellSx}
      >
        <RemoveIcon sx={{ fontSize: 16 }} />
      </ButtonBase>
      <Typography
        aria-live="polite"
        sx={{ width: 48, height: 40, display: 'grid', placeItems: 'center', fontSize: 15, fontWeight: 600, borderLeft: '1px solid #EEE', borderRight: '1px solid #EEE' }}
      >
        {value}
      </Typography>
      <ButtonBase
        aria-label="Aumentar cantidad"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        sx={cellSx}
      >
        <AddIcon sx={{ fontSize: 16 }} />
      </ButtonBase>
    </Box>
  );
}
