import { Link as RouterLink } from 'react-router-dom';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import AddIcon from '@mui/icons-material/Add';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { colors } from '../../utils/theme';

const action = { width: 34, height: 34, borderRadius: '8px', color: '#6B7280', '&:hover': { bgcolor: '#F3F4F6', color: colors.ink }, '& svg': { fontSize: 19 } };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/** Fila del árbol de categorías del administrador: nombre, conteos y acciones. */
export default function CategoryAdminRow({
  name, depth, href, expandable, expanded, onToggle, childCount, itemCount, first, last, onAdd, onEdit, onUp, onDown, onDelete,
}) {
  const FolderIcon = expanded ? FolderOpenOutlinedIcon : FolderOutlinedIcon;
  return (
    <Box
      sx={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', columnGap: 1.5, rowGap: 0.5, minHeight: 58, py: 1,
        pr: { xs: 1.5, md: 2.5 }, pl: { xs: 1 + depth * 2, md: 2 + depth * 3.5 }, borderTop: '1px solid #F0F1F3',
        '&:hover': { bgcolor: '#FAFAFB' },
      }}
    >
      <Box sx={{ flex: '1 1 220px', minWidth: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
        {expandable ? (
          <IconButton size="small" onClick={onToggle} aria-expanded={expanded} aria-label={`${expanded ? 'Contraer' : 'Expandir'} ${name}`} sx={{ width: 30, height: 30, color: '#6B7280' }}>
            <ChevronRightIcon sx={{ fontSize: 20, transition: 'transform .15s', transform: expanded ? 'rotate(90deg)' : 'none' }} />
          </IconButton>
        ) : (
          <Box sx={{ width: 30, flexShrink: 0 }} />
        )}
        <FolderIcon sx={{ flexShrink: 0, fontSize: 21, color: depth === 0 ? colors.primary : '#9CA3AF' }} />
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: 14.5, fontWeight: depth === 0 ? 600 : 500, color: colors.ink, overflowWrap: 'anywhere', lineHeight: 1.35 }}>{name}</Typography>
          <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>
            {childCount ? `${plural(childCount, 'subcategoría', 'subcategorías')} · ` : ''}{plural(itemCount, 'publicación', 'publicaciones')}
          </Typography>
        </Box>
      </Box>

      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.25 }}>
        <Tooltip title="Agregar subcategoría"><IconButton onClick={onAdd} aria-label={`Agregar subcategoría a ${name}`} sx={action}><AddIcon /></IconButton></Tooltip>
        <Tooltip title="Subir"><span><IconButton onClick={onUp} disabled={first} aria-label={`Subir ${name}`} sx={action}><ArrowUpwardIcon /></IconButton></span></Tooltip>
        <Tooltip title="Bajar"><span><IconButton onClick={onDown} disabled={last} aria-label={`Bajar ${name}`} sx={action}><ArrowDownwardIcon /></IconButton></span></Tooltip>
        <Tooltip title="Ver en la tienda"><IconButton component={RouterLink} to={href} aria-label={`Ver ${name} en la tienda`} sx={action}><OpenInNewIcon /></IconButton></Tooltip>
        <Tooltip title="Editar o mover"><IconButton onClick={onEdit} aria-label={`Editar ${name}`} sx={action}><EditOutlinedIcon /></IconButton></Tooltip>
        <Tooltip title="Eliminar"><IconButton onClick={onDelete} aria-label={`Eliminar ${name}`} sx={{ ...action, '&:hover': { bgcolor: '#FEF2F2', color: colors.primary } }}><DeleteOutlinedIcon /></IconButton></Tooltip>
      </Box>
    </Box>
  );
}
