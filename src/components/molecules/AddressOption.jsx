import { Box, Button, Typography } from '@mui/material';
import OptionCard from './OptionCard';
import TagBadge from '../atoms/TagBadge';
import { colors } from '../../utils/theme';

/** Dirección seleccionable en el checkout: nombre, badge "Principal", Editar, dirección completa y teléfono. */
export default function AddressOption({ address, phone, selected, onSelect, onEdit }) {
  const { label, street, number, commune, province, region, isPrincipal } = address;
  const title = label || 'Dirección';
  return (
    <OptionCard name="direccion" value={address.id} selected={selected} onSelect={onSelect} ariaLabel={`${title}: ${street} ${number}, ${commune}`}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{title}</Typography>
          {isPrincipal && <TagBadge label="Principal" outlined />}
        </Box>
        <Button
          size="small"
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(address); }}
          sx={{ minWidth: 0, p: 0, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', color: colors.primary, textDecoration: 'underline', '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
        >
          Editar
        </Button>
      </Box>
      <Typography sx={{ mt: 0.75, fontSize: 15, color: colors.text }}>{street} {number}</Typography>
      <Typography sx={{ fontSize: 15, color: colors.muted }}>{commune}, {province}, {region}</Typography>
      {phone && <Typography sx={{ fontSize: 15, color: colors.muted }}>Teléfono: {phone}</Typography>}
    </OptionCard>
  );
}
