import { Box, Divider, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import LabelChip from '../atoms/LabelChip';
import TagBadge from '../atoms/TagBadge';
import ActionButton from '../atoms/ActionButton';
import { colors } from '../../utils/theme';

/** Tarjeta de una dirección guardada: etiqueta, calle y número, comuna/provincia y acciones. */
export default function AddressCard({ address, onEdit, onDelete }) {
  const { label, street, number, commune, province, isPrincipal = false } = address;
  return (
    <Box
      component="article"
      sx={{ p: 3, bgcolor: '#fff', border: '1px solid #DDD', borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, minHeight: 28 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
          {label && <LabelChip>{label}</LabelChip>}
          {isPrincipal && <TagBadge label="Principal" />}
        </Box>
        <PlaceOutlinedIcon aria-hidden sx={{ color: colors.muted, fontSize: 24 }} />
      </Box>

      <Typography component="h3" sx={{ mt: 1.5, fontSize: 18, fontWeight: 600, color: '#222', overflowWrap: 'anywhere' }}>
        {street} {number}
      </Typography>
      <Typography sx={{ mt: 0.5, fontSize: 16, color: colors.muted }}>{commune}, {province}</Typography>

      <Divider sx={{ my: 2, borderColor: '#EEE' }} />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <ActionButton underline icon={<EditOutlinedIcon />} onClick={onEdit} aria-label={`Editar dirección ${street} ${number}`}>
          Editar
        </ActionButton>
        <ActionButton underline danger icon={<DeleteOutlineIcon />} onClick={onDelete} aria-label={`Eliminar dirección ${street} ${number}`}>
          Eliminar
        </ActionButton>
      </Box>
    </Box>
  );
}
