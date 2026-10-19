import { Box, MenuItem, Select } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { colors } from '../../utils/theme';

/**
 * Menú "Ordenar por: …". options: [{ id, name }].
 * variant="plain": sin borde, texto gris con el valor en negrita (pantalla de resultados de búsqueda).
 */
export default function SortSelect({ options, value, onChange, label = 'Ordenar por', variant = 'outlined' }) {
  const plain = variant === 'plain';
  const current = (id) => options.find((o) => o.id === id)?.name ?? '';
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      IconComponent={plain ? ArrowDropDownIcon : KeyboardArrowDownIcon}
      renderValue={(id) => (plain ? (
        <>
          <Box component="span" sx={{ color: colors.muted, fontWeight: 400, mr: 0.5 }}>{label}:</Box>
          <Box component="span" sx={{ fontWeight: 600 }}>{current(id)}</Box>
        </>
      ) : `${label}: ${current(id)}`)}
      SelectDisplayProps={{ 'aria-label': label }}
      MenuProps={{ slotProps: { paper: { sx: { mt: 0.5, borderRadius: '8px', border: '1px solid #E5E7EB', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' } } } }}
      sx={{
        height: 38, borderRadius: '8px', bgcolor: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: colors.ink,
        '& .MuiSelect-select': { py: 0, pl: 2, pr: '40px !important', display: 'flex', alignItems: 'center', height: '38px !important', minHeight: 0 },
        '& fieldset': { borderColor: '#E5E7EB' },
        '&:hover fieldset': { borderColor: '#B0B5BC' },
        '&.Mui-focused fieldset': { borderColor: colors.primary, borderWidth: 1 },
        '& .MuiSelect-icon': { right: 12, color: colors.ink },
        ...(plain && {
          height: 32, bgcolor: 'transparent', fontSize: 14,
          '& .MuiSelect-select': { py: 0, pl: 0, pr: '28px !important', display: 'flex', alignItems: 'center', height: '32px !important', minHeight: 0 },
          '& fieldset': { border: 'none' },
          '&:hover fieldset, &.Mui-focused fieldset': { border: 'none' },
          '& .MuiSelect-icon': { right: 0, color: colors.ink, fontSize: 24 },
        }),
      }}
    >
      {options.map((o) => <MenuItem key={o.id} value={o.id} sx={{ fontSize: 14 }}>{o.name}</MenuItem>)}
    </Select>
  );
}
