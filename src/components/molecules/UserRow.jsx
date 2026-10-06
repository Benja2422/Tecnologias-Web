import { Box, TableCell, TableRow, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import AccountTypeBadge from '../atoms/AccountTypeBadge';
import StatusBadge from '../atoms/StatusBadge';
import IconActionButton from '../atoms/IconActionButton';
import { colors } from '../../utils/theme';

const cell = { py: 2, borderBottom: '1px solid #EEF0F2', fontSize: 14, color: '#4B5563' };

export default function UserRow({ user, onEdit, onDelete }) {
  const fullName = `${user.firstName} ${user.lastName}`;
  return (
    <TableRow hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
      <TableCell sx={cell}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{fullName}</Typography>
        <Typography sx={{ fontSize: 12, color: '#9CA3AF', mt: 0.5 }}>ID: {user.id}</Typography>
      </TableCell>
      <TableCell sx={cell}>{user.rut}</TableCell>
      <TableCell sx={{ ...cell, wordBreak: 'break-all' }}>{user.email}</TableCell>
      <TableCell sx={cell}><AccountTypeBadge type={user.accountType} /></TableCell>
      <TableCell sx={cell}><StatusBadge status={user.status} /></TableCell>
      <TableCell sx={cell} align="right">
        <Box sx={{ display: 'inline-flex', gap: 1 }}>
          <IconActionButton label={`Editar a ${fullName}`} onClick={() => onEdit(user)}><EditOutlinedIcon /></IconActionButton>
          <IconActionButton label={`Eliminar a ${fullName}`} danger onClick={() => onDelete(user)}><DeleteOutlineIcon /></IconActionButton>
        </Box>
      </TableCell>
    </TableRow>
  );
}
