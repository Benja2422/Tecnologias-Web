import { useState } from 'react';
import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import { CRITICAL_STOCK, parseAmount } from '../../utils/seller';
import { formatThousands } from '../../utils/format';
import { btnOutlined, btnPrimary } from '../../utils/sellerStyles';
import { colors } from '../../utils/theme';

const label = { display: 'block', mb: 1, fontSize: 14, fontWeight: 600, color: colors.ink };

/** "Agregar variante": SKU, atributos (talla / color…), precio, stock y stock mínimo. takenSkus: SKU ya usados. */
export default function VariantDialog({ baseSku, basePrice, takenSkus, onSave, onClose }) {
  const [v, setV] = useState({ sku: baseSku ? `${baseSku}-` : '', attributes: '', price: basePrice ? formatThousands(String(basePrice)) : '', stock: '', minStock: String(CRITICAL_STOCK) });
  const [errors, setErrors] = useState({});
  const set = (k, fn = (x) => x) => (e) => setV((s) => ({ ...s, [k]: fn(e.target.value) }));
  const digits = (n) => (x) => x.replace(/\D/g, '').slice(0, n);

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    const sku = v.sku.trim().toUpperCase();
    if (!/^[A-Z0-9][A-Z0-9-]{2,29}$/.test(sku)) errs.sku = 'Usa letras, números y guiones (3 a 30).';
    else if (takenSkus.includes(sku)) errs.sku = 'Ese SKU ya existe.';
    if (!v.attributes.trim()) errs.attributes = 'Describe la variante (ej. Talla M / Negro).';
    const price = parseAmount(v.price);
    if (!Number.isFinite(price) || price <= 0) errs.price = 'Ingresa el precio.';
    if (v.stock === '') errs.stock = 'Ingresa el stock.';
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({ sku, attributes: v.attributes.trim(), price, stock: Number(v.stock), minStock: v.minStock === '' ? CRITICAL_STOCK : Number(v.minStock) });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} slotProps={{ paper: { component: 'form', onSubmit: submit, noValidate: true, sx: { maxWidth: 520, width: 'calc(100% - 32px)', m: 2, borderRadius: 3 } } }} aria-labelledby="variant-title">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, px: 3, pt: 3 }}>
        <Typography id="variant-title" component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.ink }}>Agregar variante</Typography>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ mt: -0.5 }}><CloseIcon /></IconButton>
      </Box>
      <Box sx={{ px: 3, pt: 2, pb: 3, display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <Box>
          <Typography component="label" htmlFor="var-sku" sx={label}>SKU de la variante</Typography>
          <TextInput id="var-sku" autoFocus value={v.sku} onChange={set('sku', (x) => x.toUpperCase().slice(0, 30))} error={errors.sku} />
        </Box>
        <Box>
          <Typography component="label" htmlFor="var-attr" sx={label}>Atributos</Typography>
          <TextInput id="var-attr" value={v.attributes} onChange={set('attributes', (x) => x.slice(0, 60))} placeholder="Ej. Talla M / Negro" error={errors.attributes} />
        </Box>
        <Box sx={{ gridColumn: '1 / -1' }}>
          <Typography component="label" htmlFor="var-price" sx={label}>Precio de la variante (con IVA)</Typography>
          <TextInput id="var-price" value={v.price} onChange={set('price', (x) => formatThousands(digits(9)(x)))} prefix="$" error={errors.price} inputProps={{ inputMode: 'numeric' }} />
        </Box>
        <Box>
          <Typography component="label" htmlFor="var-stock" sx={label}>Stock</Typography>
          <TextInput id="var-stock" value={v.stock} onChange={set('stock', digits(6))} placeholder="Ej. 12" error={errors.stock} inputProps={{ inputMode: 'numeric' }} />
        </Box>
        <Box>
          <Typography component="label" htmlFor="var-min" sx={label}>Stock mínimo</Typography>
          <TextInput id="var-min" value={v.minStock} onChange={set('minStock', digits(6))} placeholder="Ej. 3" inputProps={{ inputMode: 'numeric' }} />
        </Box>
      </Box>
      <Box sx={{ px: 3, py: 2, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} sx={btnOutlined}>Cancelar</Button>
        <Button type="submit" sx={btnPrimary}>Agregar</Button>
      </Box>
    </Dialog>
  );
}
