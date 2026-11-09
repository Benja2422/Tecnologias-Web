import { Box, Checkbox, Collapse, Typography } from '@mui/material';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import TextInput from '../atoms/TextInput';
import { formatThousands } from '../../utils/format';
import { colors } from '../../utils/theme';

const label = { display: 'block', mb: 1, fontSize: 14, fontWeight: 600, color: colors.ink };
const req = <Box component="span" sx={{ color: colors.primary, ml: 0.5 }}>*</Box>;

/**
 * Bloque "Activar oferta" de los formularios. value: { on, price, ends } (ends: "YYYY-MM-DDTHH:mm" o "YYYY-MM-DD" si dateOnly).
 * variant="tint": fondo rosado (producto); "outlined": fondo blanco con borde rojo (servicio).
 */
export default function OfferFields({ value, onChange, errors = {}, title, description, priceLabel, endLabel, endHint, pricePlaceholder, dateOnly = false, variant = 'tint' }) {
  const set = (patch) => onChange({ ...value, ...patch });
  const icon = (node) => ({ startAdornment: <Box aria-hidden sx={{ display: 'flex', color: '#6B7280', mr: 1, '& svg': { fontSize: 19 } }}>{node}</Box> });
  return (
    <Box sx={{ p: { xs: 2, md: 3 }, border: `1px solid ${colors.primary}`, borderRadius: '10px', bgcolor: variant === 'tint' ? '#FDF1F1' : '#fff' }}>
      <Box component="label" sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, cursor: 'pointer' }}>
        <Checkbox checked={value.on} onChange={(e) => set({ on: e.target.checked })} sx={{ p: 0, mt: 0.1, color: colors.primary, '&.Mui-checked': { color: colors.primary } }} />
        <Box>
          <Typography sx={{ fontSize: variant === 'tint' ? 17 : 15, fontWeight: variant === 'tint' ? 700 : 500, color: variant === 'tint' ? colors.primary : colors.ink }}>{title}</Typography>
          {variant === 'tint' && <Typography sx={{ mt: 0.25, fontSize: 13.5, color: '#4B5563' }}>{description}</Typography>}
        </Box>
      </Box>
      {variant !== 'tint' && <Typography sx={{ mt: 2, fontSize: 13, color: '#4B5563' }}>{description}</Typography>}
      <Collapse in={value.on} unmountOnExit>
        <Box sx={{ mt: 2.5, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Box>
            <Typography component="label" htmlFor="offer-price" sx={label}>{priceLabel}{req}</Typography>
            <TextInput id="offer-price" value={value.price} onChange={(e) => set({ price: formatThousands(e.target.value.replace(/\D/g, '').slice(0, 9)) })} placeholder={pricePlaceholder} error={errors.offerPrice} inputProps={{ inputMode: 'numeric' }} InputProps={variant === 'tint' ? icon(<PaymentsOutlinedIcon />) : undefined} />
          </Box>
          <Box>
            <Typography component="label" htmlFor="offer-end" sx={label}>{endLabel}{req}</Typography>
            <TextInput id="offer-end" type={dateOnly ? 'date' : 'datetime-local'} value={value.ends} onChange={(e) => set({ ends: e.target.value })} error={errors.offerEnds} InputProps={variant === 'tint' ? icon(<CalendarTodayOutlinedIcon />) : undefined} />
            {endHint && !errors.offerEnds && <Typography sx={{ mt: 0.75, fontSize: 12, color: '#6B7280' }}>{endHint}</Typography>}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
}
