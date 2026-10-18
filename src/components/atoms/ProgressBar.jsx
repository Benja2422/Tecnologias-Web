import { Box } from '@mui/material';

/** Barra horizontal de porcentaje (distribución de calificaciones). */
export default function ProgressBar({ percent, label }) {
  return (
    <Box
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      sx={{ flex: 1, height: 8, borderRadius: 999, bgcolor: '#E5E5E5', overflow: 'hidden' }}
    >
      <Box sx={{ width: `${percent}%`, height: '100%', bgcolor: '#FBBF24', borderRadius: 999 }} />
    </Box>
  );
}
