import { Box, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import TagBadge from '../atoms/TagBadge';
import ActionButton from '../atoms/ActionButton';
import { colors } from '../../utils/theme';

export default function ContactRow({ item, icon, onEdit, onDelete, canDelete = true }) {
  return (
    <Box
      component="li"
      sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, minHeight: 68, px: 1, py: 1, borderBottom: '1px solid #EEE' }}
    >
      <Box sx={{ width: 36, height: 36, flexShrink: 0, borderRadius: '50%', bgcolor: '#F2F2F2', color: colors.muted, display: 'grid', placeItems: 'center' }}>
        {icon}
      </Box>
      <Typography sx={{ fontSize: 17, fontWeight: 500, color: '#222', wordBreak: 'break-all' }}>{item.value}</Typography>
      {item.isPrincipal && <TagBadge label="Principal" />}
      <Box sx={{ ml: 'auto', display: 'flex', gap: 1.5 }}>
        <ActionButton icon={<EditOutlinedIcon />} onClick={onEdit}>Editar</ActionButton>
        <ActionButton
          danger
          icon={<DeleteOutlineIcon />}
          onClick={onDelete}
          disabled={!canDelete}
          title={canDelete ? undefined : 'Debes mantener al menos uno'}
        >
          Eliminar
        </ActionButton>
      </Box>
    </Box>
  );
}
