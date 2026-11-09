import { useState } from 'react';
import { Alert, Box, Button, Dialog, FormControlLabel, IconButton, Radio, RadioGroup, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import SellerChip from '../atoms/SellerChip';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import { CARRIERS, ORDER_TONE, SHIPPING_METHODS, formatWhen, needsShipping, orderSubtotal, orderWeight, shippingQuote } from '../../utils/seller';
import { formatPrice } from '../../utils/format';
import { btnOutlined, btnPrimary } from '../../utils/sellerStyles';
import { colors } from '../../utils/theme';

const caps = { fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', color: '#6B7280' };
const label = { display: 'block', mb: 1, fontSize: 13.5, fontWeight: 600, color: colors.ink };
const kg = (n) => `${n.toLocaleString('es-CL', { maximumFractionDigits: 1 })} kg`;

const Row = ({ label: text, value, strong }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <Typography sx={{ fontSize: 14, color: strong ? colors.ink : '#4B5563', fontWeight: strong ? 700 : 400 }}>{text}</Typography>
    <Typography sx={{ fontSize: strong ? 18 : 14, fontWeight: 700, color: strong ? colors.primary : colors.ink, whiteSpace: 'nowrap' }}>{value}</Typography>
  </Box>
);

/**
 * Detalle de un pedido recibido: costo de despacho según la zona (región o comuna) y el peso, y seguimiento
 * (empresa de transporte y número). markShipped: al guardar, el pedido pasa a "Enviado" (exige el seguimiento).
 * onSave({ method, cost, carrier, tracking }, { markShipped })
 */
export default function OrderShippingDialog({ order, rates, items, markShipped = false, onSave, onClose }) {
  const [method, setMethod] = useState(order.shipping?.method ?? 'estandar');
  const [carrier, setCarrier] = useState(order.shipping?.carrier ?? '');
  const [tracking, setTracking] = useState(order.shipping?.tracking ?? '');
  const [errors, setErrors] = useState({});
  const subtotal = orderSubtotal(order);
  const shipping = needsShipping(order);
  const weightKg = orderWeight(order, items);
  const quoteFor = (m) => shippingQuote(rates, { method: m, region: order.address.region, commune: order.address.commune, subtotal, weightKg });
  const quote = quoteFor(method);
  const pickup = method === 'retiro';

  const save = () => {
    const e = {};
    if (markShipped && !pickup) {
      if (!carrier) e.carrier = 'Elige la empresa de transporte.';
      if (!tracking.trim()) e.tracking = 'Ingresa el número de seguimiento.';
    }
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave({ method, cost: quote.cost, carrier: pickup ? null : carrier || null, tracking: pickup ? null : tracking.trim() || null }, { markShipped });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} scroll="paper" slotProps={{ paper: { sx: { maxWidth: 620, width: 'calc(100% - 32px)', m: 2, borderRadius: 3 } } }} aria-labelledby="order-title">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, px: 3, pt: 3 }}>
        <Box>
          <Typography id="order-title" component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.ink }}>Pedido #{order.id}</Typography>
          <Typography component="div" sx={{ mt: 0.5, fontSize: 13.5, color: '#6B7280', display: 'flex', alignItems: 'center', gap: 1 }}>{formatWhen(order.createdAt)} <SellerChip label={order.status} tone={ORDER_TONE[order.status]} /></Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ mt: -0.5 }}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ px: 3, pt: 2.5, pb: 3, display: 'grid', gap: 2.5, overflowY: 'auto' }}>
        {markShipped && <Alert severity="info">Para marcar el pedido como <b>Enviado</b>, registra la empresa de transporte y el número de seguimiento.</Alert>}
        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, p: 2, bgcolor: '#F9FAFB', borderRadius: '8px' }}>
          <Box>
            <Typography sx={caps}>COMPRADOR</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 14, fontWeight: 600, color: colors.ink }}>{order.buyer.name}</Typography>
            <Typography sx={{ fontSize: 12.5, color: '#6B7280' }}>{order.buyer.type}</Typography>
          </Box>
          <Box>
            <Typography sx={caps}>DIRECCIÓN DE DESPACHO</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.ink }}>{order.address.street}</Typography>
            <Typography sx={{ fontSize: 12.5, color: '#6B7280' }}>{order.address.commune}, {order.address.region}</Typography>
          </Box>
        </Box>

        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {order.items.map((i) => (
            <Box component="li" key={`${i.itemId}-${i.name}`} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 1.25, borderBottom: '1px solid #F0F0F0' }}>
              <Typography sx={{ fontSize: 14, color: colors.ink }}>{i.quantity} × {i.name}{i.kind === 'servicio' && <Box component="span" sx={{ ml: 1, fontSize: 12, color: '#6B7280' }}>(servicio)</Box>}</Typography>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink, whiteSpace: 'nowrap' }}>{formatPrice(i.unitPrice * i.quantity)}</Typography>
            </Box>
          ))}
        </Box>

        {!shipping ? (
          <Typography role="note" sx={{ px: 2, py: 1.5, bgcolor: '#F3F4F6', borderRadius: '8px', fontSize: 14, color: '#4B5563' }}>Este pedido solo tiene servicios: no requiere despacho.</Typography>
        ) : (
          <>
            <Box>
              <Typography id="ship-method" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 15, fontWeight: 600, color: colors.ink }}><LocalShippingOutlinedIcon aria-hidden sx={{ fontSize: 20 }} /> Calcular despacho</Typography>
              <RadioGroup aria-labelledby="ship-method" value={method} onChange={(e) => setMethod(e.target.value)} sx={{ mt: 1 }}>
                {SHIPPING_METHODS.map((m) => {
                  const c = quoteFor(m.id).cost;
                  return <FormControlLabel key={m.id} value={m.id} control={<Radio size="small" />} sx={{ mr: 0 }} label={<Box sx={{ display: 'flex', gap: 1, fontSize: 14 }}>{m.name}<Box component="span" sx={{ color: '#6B7280' }}>· {c === 0 ? 'Gratis' : formatPrice(c)}</Box></Box>} />;
                })}
              </RadioGroup>
              {!pickup && (
                <Typography sx={{ mt: 0.5, fontSize: 12.5, color: '#6B7280', lineHeight: 1.6 }}>
                  Tarifa de {quote.zone === 'comuna' ? `la comuna de ${order.address.commune}` : `la región ${order.address.region}`}: {formatPrice(quote.base)}.
                  {' '}Peso del pedido: {kg(weightKg)}{quote.extraKg > 0 ? ` (${quote.extraKg} kg sobre los ${rates.kgIncluidos} incluidos: +${formatPrice(quote.extraCost)})` : ` (incluye hasta ${rates.kgIncluidos} kg)`}.
                  {quote.free && ' Envío estándar gratis por el monto del pedido.'}
                </Typography>
              )}
            </Box>

            {!pickup && (
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                <Box>
                  <Typography component="label" htmlFor="ship-carrier" sx={label}>Empresa de transporte</Typography>
                  <SelectInput id="ship-carrier" options={CARRIERS} value={carrier} onChange={(e) => { setCarrier(e.target.value); setErrors((x) => ({ ...x, carrier: undefined })); }} placeholder="Selecciona" ariaLabel="Empresa de transporte" error={errors.carrier} />
                </Box>
                <Box>
                  <Typography component="label" htmlFor="ship-tracking" sx={label}>N° de seguimiento</Typography>
                  <TextInput id="ship-tracking" value={tracking} onChange={(e) => { setTracking(e.target.value.toUpperCase().slice(0, 30)); setErrors((x) => ({ ...x, tracking: undefined })); }} placeholder="Ej. 981245563" error={errors.tracking} />
                </Box>
              </Box>
            )}
          </>
        )}

        <Box sx={{ display: 'grid', gap: 1, pt: 2, borderTop: '1px solid #E5E7EB' }}>
          <Row label="Productos (con IVA)" value={formatPrice(subtotal)} />
          {shipping && <Row label="Despacho" value={quote.cost === 0 ? 'Gratis' : formatPrice(quote.cost)} />}
          <Row label="Total" value={formatPrice(subtotal + (shipping ? quote.cost : 0))} strong />
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 2, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} sx={btnOutlined}>{shipping ? 'Cancelar' : 'Cerrar'}</Button>
        {shipping && <Button onClick={save} sx={btnPrimary}>{markShipped ? 'Guardar y marcar Enviado' : 'Guardar despacho'}</Button>}
      </Box>
    </Dialog>
  );
}
