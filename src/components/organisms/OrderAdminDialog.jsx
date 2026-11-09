import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import RestoreIcon from '@mui/icons-material/Restore';
import SellerChip from '../atoms/SellerChip';
import SelectInput from '../atoms/SelectInput';
import TextInput from '../atoms/TextInput';
import { paymentLabel } from '../../hooks/useAdminOrders';
import { ADMIN_ORDER_STATUSES, ORDER_STATUS_TONE } from '../../utils/ordersAdmin';
import { CARRIERS, formatWhen } from '../../utils/seller';
import { formatPrice } from '../../utils/format';
import { colors } from '../../utils/theme';

const h3 = { fontSize: 13, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#6B7280', mb: 1 };
const box = { border: '1px solid #E5E7EB', borderRadius: '8px', p: 2 };
const btn = { height: 40, px: 2, borderRadius: '6px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', whiteSpace: 'nowrap' };
const compact = { '& .MuiOutlinedInput-root': { height: 40 }, '& .MuiOutlinedInput-input.MuiSelect-select': { display: 'block', height: 40, lineHeight: '40px', minHeight: 0, py: 0, pr: '36px !important', boxSizing: 'border-box', fontSize: 14 }, '& .MuiOutlinedInput-input': { py: 0, fontSize: 14 } };
const RETURN_TONE = { Aceptada: 'green', Pendiente: 'yellow', Rechazada: 'grey' };

const Row = ({ label, value, strong }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.4, fontSize: 14, color: strong ? colors.ink : '#4B5563', fontWeight: strong ? 700 : 400 }}>
    <span>{label}</span><span>{value}</span>
  </Box>
);

/**
 * Detalle de un pedido para el administrador: comprador, artículos, totales con IVA, pago, despacho, devoluciones,
 * cambio de estado, anulación y enlace al comprobante.
 */
export default function OrderAdminDialog({ row, onStatus, onShipping, onCancel, onRestore, onClose }) {
  const [status, setStatus] = useState(row.cancelled ? 'Recibido' : row.status);
  const [carrier, setCarrier] = useState(row.carrier ?? '');
  const [tracking, setTracking] = useState(row.tracking ?? '');
  const [error, setError] = useState('');
  const anulado = Boolean(row.cancelled);

  const applyStatus = () => {
    if (status === 'Enviado' && row.needsShipping && !(row.carrier && row.tracking)) {
      setError('Para marcarlo como Enviado, primero guarda la empresa de transporte y el número de seguimiento.');
      return;
    }
    setError('');
    onStatus(status);
  };
  const saveShipping = () => {
    if (!carrier || tracking.trim().length < 4) { setError('Elige la empresa de transporte e ingresa un número de seguimiento válido.'); return; }
    setError('');
    onShipping({ carrier, tracking: tracking.trim() });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" scroll="paper" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }} aria-labelledby="order-title">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, pb: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography id="order-title" component="span" sx={{ fontSize: 20, fontWeight: 600, color: colors.ink }}>Pedido {row.id}</Typography>
            <SellerChip label={row.status} tone={ORDER_STATUS_TONE[row.status]} dot />
          </Box>
          <Typography component="span" sx={{ display: 'block', mt: 0.25, fontSize: 13, color: colors.muted }}>{formatWhen(row.createdAt)} · Tienda: {row.seller}</Typography>
        </Box>
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#EEF0F2', display: 'grid', gap: 2.5 }}>
        {anulado && <Alert severity="warning">Pedido anulado por la administración · <b>{row.cancelled.reason}</b>{row.cancelled.note ? ` — ${row.cancelled.note}` : ''} ({formatWhen(row.cancelled.at)}). No cuenta en las ventas.</Alert>}
        {error && <Alert severity="error" onClose={() => setError('')}>{error}</Alert>}

        <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))' } }}>
          <Box sx={box}>
            <Typography sx={h3}>Comprador</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{row.buyer}</Typography>
            {row.buyerType && <Typography sx={{ fontSize: 13, color: colors.muted }}>{row.buyerType}</Typography>}
            <Typography sx={{ mt: 1, fontSize: 13.5, color: '#4B5563', overflowWrap: 'anywhere' }}>{row.address ?? 'Sin dirección (servicio)'}</Typography>
          </Box>
          <Box sx={box}>
            <Typography sx={h3}>Pago</Typography>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{paymentLabel(row.payment)}</Typography>
            <Typography sx={{ mt: 1, fontSize: 13.5, color: '#4B5563' }}>{row.shippingName ? `${row.shippingName}${row.carrier ? ` · ${row.carrier}` : ''}` : 'Sin despacho'}</Typography>
            {row.tracking && <Typography sx={{ fontSize: 13.5, color: '#4B5563' }}>Seguimiento: <b>{row.tracking}</b></Typography>}
          </Box>
        </Box>

        <Box sx={box}>
          <Typography sx={h3}>Artículos</Typography>
          {row.items.map((i, k) => (
            <Box key={k} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 2, py: 0.75, borderBottom: '1px solid #F3F4F6', fontSize: 14 }}>
              <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>{i.quantity} × {i.name}{i.detail && <Box component="span" sx={{ color: '#9CA3AF' }}> · {i.detail}</Box>}{i.kind === 'servicio' && <Box component="span" sx={{ color: '#9CA3AF' }}> · servicio</Box>}</Box>
              <Box sx={{ fontWeight: 600 }}>{formatPrice(i.unitPrice * i.quantity)}</Box>
            </Box>
          ))}
          <Box sx={{ mt: 1.5, ml: 'auto', maxWidth: 320 }}>
            <Row label="Subtotal" value={formatPrice(row.subtotal)} />
            <Row label="Despacho" value={row.shippingCost ? formatPrice(row.shippingCost) : 'Gratis / no aplica'} />
            <Row label="Valor neto" value={formatPrice(row.neto)} />
            <Row label="IVA (19 %)" value={formatPrice(row.iva)} />
            <Row label="Total" value={formatPrice(row.total)} strong />
            {row.refunded > 0 && <Row label="Reembolsado" value={`− ${formatPrice(row.refunded)}`} />}
          </Box>
        </Box>

        {row.returns.length > 0 && (
          <Box sx={box}>
            <Typography sx={h3}>Devoluciones</Typography>
            {row.returns.map((d) => (
              <Box key={d.id} sx={{ py: 0.75, display: 'grid', gap: 0.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{d.id} · {d.product}</Typography>
                  <SellerChip label={d.status} tone={RETURN_TONE[d.status]} />
                  {d.status === 'Aceptada' && <Typography sx={{ fontSize: 13, color: '#15803D', fontWeight: 600 }}>Reintegro {formatPrice(d.amount)}</Typography>}
                </Box>
                <Typography sx={{ fontSize: 13.5, color: '#4B5563' }}>Motivo: {d.reason}</Typography>
              </Box>
            ))}
          </Box>
        )}

        {!anulado && (
          <Box sx={{ ...box, display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: row.needsShipping ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)' } }}>
            <Box>
              <Typography sx={h3}>Estado del pedido</Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <SelectInput options={ADMIN_ORDER_STATUSES.map((s) => ({ id: s, name: s }))} value={status} onChange={(e) => setStatus(e.target.value)} ariaLabel="Nuevo estado" sx={compact} />
                </Box>
                <Button onClick={applyStatus} disabled={status === row.status} variant="contained" disableElevation sx={{ ...btn, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Actualizar</Button>
              </Box>
            </Box>
            {row.needsShipping && (
              <Box>
                <Typography sx={h3}>Despacho</Typography>
                <Box sx={{ display: 'grid', gap: 1, gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) auto' }}>
                  <SelectInput options={CARRIERS} value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="Transporte" ariaLabel="Empresa de transporte" sx={compact} />
                  <TextInput value={tracking} onChange={(e) => setTracking(e.target.value.slice(0, 30))} placeholder="N° seguimiento" inputProps={{ 'aria-label': 'Número de seguimiento' }} sx={compact} />
                  <Button onClick={saveShipping} variant="outlined" sx={{ ...btn, color: colors.ink, borderColor: '#D1D5DB' }}>Guardar</Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        {anulado ? (
          <Button onClick={onRestore} startIcon={<RestoreIcon />} sx={{ ...btn, color: colors.ink, mr: 'auto' }}>Deshacer anulación</Button>
        ) : (
          <Button onClick={onCancel} startIcon={<BlockOutlinedIcon />} sx={{ ...btn, color: colors.primary, mr: 'auto' }}>Anular pedido</Button>
        )}
        <Button component={RouterLink} to={`/admin/pedidos/${row.id}/comprobante`} startIcon={<ReceiptLongOutlinedIcon />} variant="outlined" sx={{ ...btn, color: colors.ink, borderColor: '#D1D5DB' }}>Ver comprobante</Button>
        <Button onClick={onClose} variant="contained" disableElevation sx={{ ...btn, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
