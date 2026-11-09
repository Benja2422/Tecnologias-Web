import { Box, MenuItem, Select } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { ORDER_STATUSES } from '../../utils/seller';

const TONES = {
  Recibido: { color: '#1D4ED8', border: '#2563EB', bg: '#F5F8FF' },
  'En preparación': { color: '#C2410C', border: '#F59E0B', bg: '#FFFBF2' },
  Enviado: { color: '#C00000', border: '#CC0000', bg: '#FFF7F7' },
  Entregado: { color: '#15803D', border: '#16A34A', bg: '#F4FDF7' },
};

const Dot = ({ color }) => <Box component="span" aria-hidden sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />;

/** Selector del estado de envío de un pedido, con el color de cada estado. */
export default function OrderStatusSelect({ value, onChange, label }) {
  const t = TONES[value];
  return (
    <Select
      size="small"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      IconComponent={KeyboardArrowDownIcon}
      inputProps={{ 'aria-label': label }}
      renderValue={(v) => <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><Dot color={TONES[v].color} />{v}</Box>}
      sx={{
        width: 156, height: 32, borderRadius: '6px', bgcolor: t.bg, color: t.color, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
        '& .MuiOutlinedInput-notchedOutline': { borderColor: t.border },
        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: t.border },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: t.border, borderWidth: 2 },
        '& .MuiSelect-select': { py: 0.5, pl: 1.25, fontSize: 13 },
        '& .MuiSelect-icon': { color: t.color, fontSize: 18 },
      }}
    >
      {ORDER_STATUSES.map((s) => (
        <MenuItem key={s} value={s} sx={{ fontSize: 13.5, gap: 1, color: TONES[s].color }}><Dot color={TONES[s].color} />{s}</MenuItem>
      ))}
    </Select>
  );
}
