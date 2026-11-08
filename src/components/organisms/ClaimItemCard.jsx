import { Box, Typography } from '@mui/material';
import ClaimStatusBadge from '../atoms/ClaimStatusBadge';
import { colors } from '../../utils/theme';

/** Un ítem reclamado: imagen, cantidad × nombre, motivo y estado. */
export default function ClaimItemCard({ item }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 2.5, p: 2, border: '1px solid #E5E7EB', borderRadius: 3, bgcolor: '#fff' }}>
      <Box component="img" src={item.image} alt={item.name} sx={{ width: 76, height: 76, objectFit: 'cover', borderRadius: 2, bgcolor: '#F3F4F6', flexShrink: 0 }} />
      <Box sx={{ flex: '1 1 220px', minWidth: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{item.quantity} × {item.name}</Typography>
        <Typography sx={{ mt: 0.75, fontSize: 13, color: colors.muted }}>
          Motivo: <Box component="span" sx={{ color: colors.text, ml: 0.5 }}>{item.reason}</Box>
        </Typography>
      </Box>
      <ClaimStatusBadge status={item.status} />
    </Box>
  );
}
