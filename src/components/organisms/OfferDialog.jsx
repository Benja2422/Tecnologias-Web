import { useState } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import { parseAmount, toLocalInput } from '../../utils/seller';
import { formatPrice, formatThousands } from '../../utils/format';
import { btnOutlined, btnPrimary } from '../../utils/sellerStyles';
import { colors } from '../../utils/theme';

const label = { display: 'block', mb: 1, fontSize: 14, fontWeight: 600, color: colors.ink };

/**
 * Crear o editar una oferta. item: ítem a editar (o null para elegirlo de `candidates`).
 * onSave(itemId, { price, startsAt, endsAt }).
 */
export default function OfferDialog({ item, candidates = [], onSave, onClose }) {
  const [itemId, setItemId] = useState(item?.id ?? '');
  const target = item ?? candidates.find((c) => c.id === itemId);
  const live = item?.offer && !item.offer.endedAt ? item.offer : null;
  const [price, setPrice] = useState(live ? formatThousands(String(live.price)) : '');
  const [startsAt, setStartsAt] = useState(toLocalInput(live?.startsAt ?? new Date().toISOString()));
  const [endsAt, setEndsAt] = useState(toLocalInput(live?.endsAt));
  const [errors, setErrors] = useState({});

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    const amount = parseAmount(price);
    const start = new Date(startsAt);
    const end = new Date(endsAt);
    if (!target) errs.item = 'Elige un producto o servicio.';
    if (!Number.isFinite(amount) || amount <= 0) errs.price = 'Ingresa el precio de oferta.';
    else if (target && amount >= target.price) errs.price = `Debe ser menor al precio normal (${formatPrice(target.price)}).`;
    if (!startsAt || Number.isNaN(start.getTime())) errs.startsAt = 'Indica cuándo empieza.';
    if (!endsAt || Number.isNaN(end.getTime())) errs.endsAt = 'Indica cuándo termina.';
    else if (end <= new Date()) errs.endsAt = 'Debe terminar en el futuro.';
    else if (!errs.startsAt && end <= start) errs.endsAt = 'Debe terminar después de empezar.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave(target.id, { price: amount, startsAt: start.toISOString(), endsAt: end.toISOString() });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} slotProps={{ paper: { component: 'form', onSubmit: submit, noValidate: true, sx: { maxWidth: 540, width: 'calc(100% - 32px)', m: 2, borderRadius: 3 } } }} aria-labelledby="offer-title">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, px: 3, pt: 3 }}>
        <Box>
          <Typography id="offer-title" component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.ink }}>{item ? 'Editar oferta' : 'Crear nueva oferta'}</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: '#6B7280' }}>El precio de oferta se muestra destacado junto al precio normal mientras esté vigente.</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ mt: -0.5 }}><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ px: 3, pt: 2.5, pb: 3, display: 'grid', gap: 2.5 }}>
        {item ? (
          <Box sx={{ p: 1.5, bgcolor: '#F9FAFB', borderRadius: '8px' }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{item.name}</Typography>
            <Typography sx={{ fontSize: 12.5, color: '#6B7280' }}>SKU: {item.sku} · Precio normal: {formatPrice(item.price)}</Typography>
          </Box>
        ) : (
          <Box>
            <Typography component="label" htmlFor="offer-item" sx={label}>Producto o servicio</Typography>
            <SelectInput id="offer-item" options={candidates.map((c) => ({ id: c.id, name: `${c.name} · ${formatPrice(c.price)}` }))} value={itemId} onChange={(e) => setItemId(e.target.value)} placeholder="Elige un ítem de tu catálogo" ariaLabel="Producto o servicio" error={errors.item} />
          </Box>
        )}
        <Box>
          <Typography component="label" htmlFor="offer-price" sx={label}>Precio de oferta (con IVA)</Typography>
          <TextInput id="offer-price" value={price} onChange={(e) => setPrice(formatThousands(e.target.value.replace(/\D/g, '').slice(0, 9)))} placeholder="Ej. 39.990" prefix="$" error={errors.price} inputProps={{ inputMode: 'numeric' }} />
        </Box>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Box>
            <Typography component="label" htmlFor="offer-start" sx={label}>Inicio</Typography>
            <TextInput id="offer-start" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} error={errors.startsAt} />
          </Box>
          <Box>
            <Typography component="label" htmlFor="offer-end" sx={label}>Fin</Typography>
            <TextInput id="offer-end" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} error={errors.endsAt} />
          </Box>
        </Box>
        <Typography sx={{ fontSize: 12.5, color: '#6B7280' }}>Si el inicio es una fecha futura, la oferta queda programada y se activa sola.</Typography>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} sx={btnOutlined}>Cancelar</Button>
        <Button type="submit" sx={btnPrimary}>{item ? 'Guardar oferta' : 'Crear oferta'}</Button>
      </Box>
    </Dialog>
  );
}
