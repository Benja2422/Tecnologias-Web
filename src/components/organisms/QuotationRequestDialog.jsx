import { useState } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import QuantityStepper from '../molecules/QuantityStepper';
import { WarningStrip } from '../molecules/QuotationItemRow';
import TextInput from '../atoms/TextInput';
import { QUOTE_MESSAGE_MAX, QUOTE_VALID_DAYS, addDays, formatDayMonthYear, quoteTotals } from '../../utils/quotations';
import { formatPrice } from '../../utils/format';
import { colors } from '../../utils/theme';

const buttonBase = { height: 42, px: 3, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none' };
const Row = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <Typography sx={{ fontSize: 15, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{value}</Typography>
  </Box>
);

/**
 * Modal "Solicitar cotización" para un vendedor. seller: { id, name }; lines: productos con
 * { productId, name, detail, image, quantity, unitPrice, listPrice, stock }.
 * Se puede ajustar la cantidad y pedir más que el stock (solo es una advertencia).
 * onSubmit({ items, message }) envía la solicitud; onClose cierra sin enviar.
 */
export default function QuotationRequestDialog({ seller, lines, onSubmit, onClose }) {
  const [items, setItems] = useState(() => lines.map((l) => ({ ...l })));
  const [message, setMessage] = useState('');
  const totals = quoteTotals(items);
  const until = addDays(new Date(), QUOTE_VALID_DAYS);

  const setQuantity = (index, quantity) => setItems((list) => list.map((l, i) => (i === index ? { ...l, quantity } : l)));
  const submit = (e) => {
    e.preventDefault();
    onSubmit({ items, message: message.trim() });
  };

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth={false}
      scroll="paper"
      slotProps={{ paper: { sx: { maxWidth: 560, borderRadius: 4, m: 2, width: 'calc(100% - 32px)' }, component: 'form', onSubmit: submit, noValidate: true } }}
      aria-labelledby="quote-title"
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 3.5, pt: 3, pb: 2 }}>
        <Box>
          <Typography id="quote-title" component="h2" sx={{ fontSize: 22, fontWeight: 600, color: colors.text }}>Solicitar cotización</Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14, color: colors.muted }}>Recibirás los precios vigentes por {QUOTE_VALID_DAYS} días.</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ color: colors.text, mt: 0.5 }}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ px: 3.5, pb: 3, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 2, py: 1.5, bgcolor: '#F8F8F9', borderRadius: '6px' }}>
          <StorefrontOutlinedIcon aria-hidden sx={{ fontSize: 20, color: colors.text }} />
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{seller.name}</Typography>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {items.map((it, i) => {
            const short = typeof it.stock === 'number' && it.quantity > it.stock;
            return (
              <Box component="li" key={`${it.productId}-${it.detail}-${i}`} sx={{ py: 2, borderBottom: '1px solid #EEE' }}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Box sx={{ width: 48, height: 48, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                    {it.image ? <Box component="img" src={it.image} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageOutlinedIcon aria-hidden sx={{ fontSize: 26, color: '#C8C8C8' }} />}
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text, overflowWrap: 'anywhere' }}>{it.name}</Typography>
                    {it.detail && <Typography sx={{ mt: 0.25, fontSize: 13, color: colors.muted }}>{it.detail}</Typography>}
                    <Typography sx={{ mt: 0.25, fontSize: 13, color: colors.text }}>
                      {formatPrice(it.unitPrice)} / un. con IVA
                      {it.listPrice ? <Box component="span" sx={{ ml: 1, fontSize: 12, color: '#9A9A9A', textDecoration: 'line-through' }}>{formatPrice(it.listPrice)}</Box> : null}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <QuantityStepper size="small" value={it.quantity} max={999} onChange={(q) => setQuantity(i, q)} />
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.text, whiteSpace: 'nowrap' }}>{formatPrice(it.unitPrice * it.quantity)}</Typography>
                </Box>
                {short && <WarningStrip sx={{ mt: 1.75 }}>Solo hay {it.stock} {it.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}. Puedes cotizar igualmente.</WarningStrip>}
              </Box>
            );
          })}
        </Box>

        <Box sx={{ mt: 2.5 }}>
          <Typography component="label" htmlFor="quote-message" sx={{ display: 'block', fontSize: 15, fontWeight: 600, color: colors.text, mb: 1.25 }}>
            Mensaje para el vendedor (opcional)
          </Typography>
          <TextInput
            id="quote-message"
            multiline
            minRows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, QUOTE_MESSAGE_MAX))}
            placeholder="Cuéntale qué necesitas"
            inputProps={{ maxLength: QUOTE_MESSAGE_MAX }}
            sx={{
              '& .MuiOutlinedInput-root.MuiInputBase-multiline': { height: 'auto', py: 1.5, px: 2, alignItems: 'flex-start', bgcolor: '#fff' },
              '& .MuiInputBase-inputMultiline, & textarea': { height: 'auto', padding: '0 !important', fontSize: 14 },
            }}
          />
          <Typography sx={{ mt: 0.75, textAlign: 'right', fontSize: 12, color: colors.muted }}>{message.length} / {QUOTE_MESSAGE_MAX}</Typography>
        </Box>

        <Box sx={{ mt: 1.5, display: 'grid', gap: 1.5 }}>
          <Row label="Neto" value={formatPrice(totals.neto)} />
          <Row label="IVA (19%)" value={formatPrice(totals.iva)} />
        </Box>
        <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: 17, fontWeight: 600, color: colors.text }}>Total</Typography>
          <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{formatPrice(totals.total)}</Typography>
        </Box>
        <Typography sx={{ mt: 2, fontSize: 13, color: colors.muted }}>Vigencia: {QUOTE_VALID_DAYS} días, hasta el {formatDayMonthYear(until)}.</Typography>
      </Box>

      <Box sx={{ px: 3.5, py: 2.5, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ ...buttonBase, color: colors.text, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } }}>Cancelar</Button>
        <Button type="submit" variant="contained" disableElevation sx={{ ...buttonBase, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Enviar solicitud</Button>
      </Box>
    </Dialog>
  );
}
