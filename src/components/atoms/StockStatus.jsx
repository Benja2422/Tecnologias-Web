import { Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function StockStatus({ available }) {
  return (
    <Typography sx={{ fontSize: 14, fontWeight: 600, color: available ? '#12B76A' : colors.primary }}>
      {available ? 'Stock disponible' : 'Sin stock'}
    </Typography>
  );
}
