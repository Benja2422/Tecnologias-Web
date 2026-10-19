import { Box, Radio } from '@mui/material';
import { colors } from '../../utils/theme';

/**
 * Tarjeta seleccionable con botón de opción (dirección, envío, medio de pago).
 * Toda la tarjeta es clicable (es un div, no un label, para poder llevar campos de formulario dentro).
 * `name` agrupa las opciones; `value` identifica esta; onSelect() se llama sin argumentos.
 */
export default function OptionCard({ name, value, selected, onSelect, children, ariaLabel }) {
  return (
    <Box
      onClick={onSelect}
      sx={{
        display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 2.5, cursor: 'pointer', bgcolor: '#fff', borderRadius: 3,
        border: `${selected ? 2 : 1}px solid ${selected ? colors.primary : '#E3E3E3'}`,
        m: selected ? 0 : '1px', // el borde de 2px no mueve el contenido
        '&:hover': { borderColor: selected ? colors.primary : '#B0B0B0' },
        '&:has(input[type=radio]:focus-visible)': { outline: `2px solid ${colors.link}`, outlineOffset: 2 },
      }}
    >
      <Radio
        name={name}
        value={value}
        checked={selected}
        onChange={onSelect}
        onClick={(e) => e.stopPropagation()}
        slotProps={{ input: { 'aria-label': ariaLabel } }}
        sx={{ p: 0, mt: '2px', '& .MuiSvgIcon-root': { fontSize: 24 } }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
    </Box>
  );
}
