import { Box, ButtonBase, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';

const cellSx = (h, w) => ({
  width: w, height: h, color: '#333', fontFamily: 'inherit',
  '&.Mui-disabled': { color: '#C4C4C4' },
  '&:hover:not(.Mui-disabled)': { bgcolor: '#F7F7F7' },
});

/** Selector de cantidad: [-] n [+]. size="small" para el carrito (32 px de alto). */
export default function QuantityStepper({ value, min = 1, max = Infinity, onChange, disabled = false, size = 'medium' }) {
  const small = size === 'small';
  const h = small ? 32 : 40;
  return (
    <Box
      role="group"
      aria-label="Cantidad"
      sx={{ display: 'inline-flex', alignItems: 'center', height: h, border: '1px solid #E3E3E3', borderRadius: 2, overflow: 'hidden', bgcolor: '#fff' }}
    >
      <ButtonBase
        aria-label="Disminuir cantidad"
        disabled={disabled || value <= min}
        onClick={() => onChange(value - 1)}
        sx={cellSx(h, small ? 30 : 40)}
      >
        <RemoveIcon sx={{ fontSize: small ? 14 : 16 }} />
      </ButtonBase>
      <Typography
        aria-live="polite"
        sx={{ width: small ? 34 : 48, height: h, display: 'grid', placeItems: 'center', fontSize: small ? 14 : 15, fontWeight: small ? 500 : 600, bgcolor: small ? '#F9FAFB' : 'transparent', borderLeft: '1px solid #EEE', borderRight: '1px solid #EEE' }}
      >
        {value}
      </Typography>
      <ButtonBase
        aria-label="Aumentar cantidad"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        sx={cellSx(h, small ? 30 : 40)}
      >
        <AddIcon sx={{ fontSize: small ? 14 : 16 }} />
      </ButtonBase>
    </Box>
  );
}
