import { useState } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import ItemThumb from '../atoms/ItemThumb';
import { stockAlert } from '../../utils/seller';
import { btnOutlined, btnPrimary } from '../../utils/sellerStyles';
import { colors } from '../../utils/theme';

const MODES = [
  { id: 'entrada', name: 'Ingreso de unidades (sumar)' },
  { id: 'salida', name: 'Salida o merma (restar)' },
  { id: 'fijar', name: 'Conteo físico (fijar cantidad)' },
];
const label = { display: 'block', mb: 1, fontSize: 14, fontWeight: 600, color: colors.ink };

/**
 * Modal "Ajustar stock" de una fila del inventario. row: { name, variant, sku, stock, minStock, image }.
 * onSave({ stock, minStock, mode, quantity, note }).
 */
export default function StockAdjustDialog({ row, onSave, onClose }) {
  const [mode, setMode] = useState('entrada');
  const [quantity, setQuantity] = useState('');
  const [minStock, setMinStock] = useState(String(row.minStock));
  const [note, setNote] = useState('');
  const [errors, setErrors] = useState({});

  const qty = quantity === '' ? NaN : Number(quantity);
  const next = Number.isFinite(qty) ? (mode === 'entrada' ? row.stock + qty : mode === 'salida' ? row.stock - qty : qty) : row.stock;
  const min = minStock === '' ? NaN : Number(minStock);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!Number.isInteger(qty) || qty < 0 || (mode !== 'fijar' && qty === 0)) errs.quantity = mode === 'fijar' ? 'Ingresa la cantidad contada (0 o más).' : 'Ingresa una cantidad mayor a 0.';
    else if (next < 0) errs.quantity = `No puedes restar más de ${row.stock} unidades.`;
    if (!Number.isInteger(min) || min < 0) errs.minStock = 'Ingresa un stock mínimo (0 o más).';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ stock: next, minStock: min, mode, quantity: qty, note: note.trim() });
  };

  const digits = (setter) => (e) => setter(e.target.value.replace(/\D/g, '').slice(0, 6));

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} slotProps={{ paper: { component: 'form', onSubmit: submit, noValidate: true, sx: { maxWidth: 520, width: 'calc(100% - 32px)', m: 2, borderRadius: 3 } } }} aria-labelledby="stock-title">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, px: 3, pt: 3 }}>
        <Typography id="stock-title" component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.ink }}>Ajustar stock</Typography>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ mt: -0.5 }}><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ px: 3, pt: 2, pb: 3, display: 'grid', gap: 2.5 }}>
        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', p: 1.5, bgcolor: '#F9FAFB', borderRadius: '8px' }}>
          <ItemThumb src={row.image} size={44} />
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{row.name}{row.variant ? ` · ${row.variant}` : ''}</Typography>
            <Typography sx={{ fontSize: 12, color: '#6B7280' }}>SKU: {row.sku} · Stock actual: <b>{row.stock}</b> · Mínimo: {row.minStock}</Typography>
          </Box>
        </Box>

        <Box>
          <Typography component="label" htmlFor="stock-mode" sx={label}>Tipo de ajuste</Typography>
          <SelectInput id="stock-mode" options={MODES} value={mode} onChange={(e) => setMode(e.target.value)} ariaLabel="Tipo de ajuste" />
        </Box>
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Box>
            <Typography component="label" htmlFor="stock-qty" sx={label}>{mode === 'fijar' ? 'Unidades contadas' : 'Cantidad'}</Typography>
            <TextInput id="stock-qty" autoFocus value={quantity} onChange={digits(setQuantity)} placeholder="Ej. 10" error={errors.quantity} inputProps={{ inputMode: 'numeric' }} />
          </Box>
          <Box>
            <Typography component="label" htmlFor="stock-min" sx={label}>Stock mínimo (alerta)</Typography>
            <TextInput id="stock-min" value={minStock} onChange={digits(setMinStock)} error={errors.minStock} inputProps={{ inputMode: 'numeric' }} />
          </Box>
        </Box>
        <Box>
          <Typography component="label" htmlFor="stock-note" sx={label}>Motivo <Box component="span" sx={{ fontWeight: 400, color: '#9CA3AF' }}>(opcional)</Box></Typography>
          <TextInput id="stock-note" value={note} onChange={(e) => setNote(e.target.value.slice(0, 120))} placeholder="Ej. Llegada de proveedor, producto dañado…" />
        </Box>
        <Box role="status" sx={{ px: 2, py: 1.5, borderRadius: '8px', bgcolor: '#F3F4F6', fontSize: 14, color: colors.ink }}>
          Nuevo stock: <b>{next < 0 ? '—' : `${next} unidades`}</b>
          {next >= 0 && Number.isInteger(min) && <Box component="span" sx={{ ml: 1, color: '#6B7280' }}>({stockAlert(next, min)})</Box>}
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} sx={btnOutlined}>Cancelar</Button>
        <Button type="submit" sx={btnPrimary}>Guardar ajuste</Button>
      </Box>
    </Dialog>
  );
}
