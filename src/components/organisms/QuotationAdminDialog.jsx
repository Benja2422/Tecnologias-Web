import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SellerChip from '../atoms/SellerChip';
import SelectInput from '../atoms/SelectInput';
import { QUOTE_STATUS_TONE } from '../../utils/quotationsAdmin';
import { QUOTE_ADJUST_RATE, QUOTE_DELETE_DAYS, formatDMY, quoteTotals } from '../../utils/quotations';
import { formatWhen } from '../../utils/seller';
import { formatPrice } from '../../utils/format';
import { colors } from '../../utils/theme';

const STORED = ['Solicitada', 'Respondida', 'Aceptada', 'Rechazada'].map((s) => ({ id: s, name: s }));
const h3 = { fontSize: 13, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#6B7280', mb: 1 };
const box = { border: '1px solid #E5E7EB', borderRadius: '8px', p: 2 };
const btn = { height: 40, px: 2, borderRadius: '6px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', whiteSpace: 'nowrap' };
const compact = { '& .MuiOutlinedInput-root': { height: 40 }, '& .MuiOutlinedInput-input.MuiSelect-select': { display: 'block', height: 40, lineHeight: '40px', minHeight: 0, py: 0, pr: '36px !important', boxSizing: 'border-box', fontSize: 14 } };
const Row = ({ label, value, strong }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, py: 0.4, fontSize: 14, color: strong ? colors.ink : '#4B5563', fontWeight: strong ? 700 : 400 }}><span>{label}</span><span>{value}</span></Box>
);

/** Detalle de una cotización para el administrador: productos (precio cotizado y vigente), ciclo de vida y acciones. */
export default function QuotationAdminDialog({ row, onStatus, onRenew, onDelete, onClose }) {
  const [status, setStatus] = useState(row.stored);
  const totals = quoteTotals(row.lines);
  const adjusted = row.lines.some((l) => l.adjusted);

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" scroll="paper" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }} aria-labelledby="quote-title">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, pb: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
            <Typography id="quote-title" component="span" sx={{ fontSize: 20, fontWeight: 600, color: colors.ink }}>Cotización {row.id}</Typography>
            <SellerChip label={row.status} tone={QUOTE_STATUS_TONE[row.status]} dot />
          </Box>
          <Typography component="span" sx={{ display: 'block', mt: 0.25, fontSize: 13, color: colors.muted }}>{row.buyer} → {row.seller} · {formatWhen(row.createdAt)}</Typography>
        </Box>
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#EEF0F2', display: 'grid', gap: 2.5 }}>
        {row.status === 'Por eliminar' && <Alert severity="error">Cumplió {QUOTE_DELETE_DAYS} días: ya no la ven el cliente ni la tienda y se eliminará en la próxima limpieza automática. Puedes renovarla si aún se necesita.</Alert>}
        {row.status === 'Expirada' && <Alert severity="warning">Venció el {formatDMY(row.validUntil)}. Sus precios se reajustan {Math.round(QUOTE_ADJUST_RATE * 100)} % cada semana desde el vencimiento ({row.adjustWeeks} {row.adjustWeeks === 1 ? 'semana' : 'semanas'}).</Alert>}

        <Box sx={box}>
          <Typography sx={h3}>Ciclo de vida</Typography>
          <Box sx={{ display: 'grid', gap: 1.5, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' }, fontSize: 13.5 }}>
            <Box><Box sx={{ color: colors.muted, fontSize: 12 }}>Emisión</Box>{formatDMY(row.createdAt)}</Box>
            <Box><Box sx={{ color: colors.muted, fontSize: 12 }}>{row.renewedAt ? 'Renovada' : 'Inicio del ciclo'}</Box>{formatDMY(row.renewedAt ?? row.createdAt)}</Box>
            <Box><Box sx={{ color: colors.muted, fontSize: 12 }}>Vence (15 días)</Box>{formatDMY(row.validUntil)}</Box>
            <Box><Box sx={{ color: colors.muted, fontSize: 12 }}>Se elimina (45 días)</Box>{formatDMY(row.deleteOn)}</Box>
          </Box>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LinearProgress variant="determinate" value={(row.cycleDay / QUOTE_DELETE_DAYS) * 100} aria-label="Avance del ciclo de 45 días" sx={{ flex: 1, height: 8, borderRadius: 4, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: row.cycleDay >= QUOTE_DELETE_DAYS ? colors.primary : row.cycleDay > 15 ? '#F59E0B' : '#16A34A' } }} />
            <Typography sx={{ fontSize: 12.5, color: colors.muted, whiteSpace: 'nowrap' }}>Día {row.cycleDay} de {QUOTE_DELETE_DAYS}</Typography>
          </Box>
          {row.orderId && <Typography sx={{ mt: 1.5, fontSize: 13.5 }}>Pagada con el pedido <Box component={RouterLink} to="/admin/pedidos" sx={{ color: colors.primary, fontWeight: 600 }}>{row.orderId}</Box></Typography>}
        </Box>

        <Box sx={box}>
          <Typography sx={h3}>Productos</Typography>
          {row.lines.map((l, i) => (
            <Box key={i} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 2, py: 0.75, borderBottom: '1px solid #F3F4F6', fontSize: 14 }}>
              <Box sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
                {l.quantity} × {l.name}{l.detail && <Box component="span" sx={{ color: '#9CA3AF' }}> · {l.detail}</Box>}
                <Box sx={{ fontSize: 12, color: '#9CA3AF' }}>Cotizado {formatPrice(l.quotedPrice)} c/u{l.adjusted && <> · vigente {formatPrice(l.unitPrice)} c/u</>}</Box>
              </Box>
              <Box sx={{ fontWeight: 600, textAlign: 'right' }}>{formatPrice(l.subtotal)}</Box>
            </Box>
          ))}
          <Box sx={{ mt: 1.5, ml: 'auto', maxWidth: 320 }}>
            {adjusted && <Row label="Total cotizado" value={formatPrice(row.quotedTotal)} />}
            <Row label="Valor neto" value={formatPrice(totals.neto)} />
            <Row label="IVA (19 %)" value={formatPrice(totals.iva)} />
            <Row label={adjusted ? 'Total vigente' : 'Total'} value={formatPrice(totals.total)} strong />
          </Box>
        </Box>

        {(row.message || row.reply) && (
          <Box sx={{ ...box, display: 'grid', gap: 1.5 }}>
            {row.message && <Box><Typography sx={h3}>Mensaje del cliente</Typography><Typography sx={{ fontSize: 14, color: colors.ink, overflowWrap: 'anywhere' }}>{row.message}</Typography></Box>}
            {row.reply && <Box><Typography sx={h3}>Respuesta de la tienda</Typography><Typography sx={{ fontSize: 14, color: colors.ink, overflowWrap: 'anywhere' }}>{row.reply}</Typography></Box>}
          </Box>
        )}

        <Box sx={box}>
          <Typography sx={h3}>Estado</Typography>
          <Box sx={{ display: 'flex', gap: 1, maxWidth: 420 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}><SelectInput options={STORED} value={status} onChange={(e) => setStatus(e.target.value)} ariaLabel="Estado de la cotización" sx={compact} /></Box>
            <Button onClick={() => onStatus(status)} disabled={status === row.stored} variant="contained" disableElevation sx={{ ...btn, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Actualizar</Button>
          </Box>
          <Typography sx={{ mt: 1, fontSize: 12.5, color: colors.muted }}>"Expirada" y "Por eliminar" dependen de la fecha: para reactivarla, renueva su vigencia.</Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1, flexWrap: 'wrap' }}>
        <Button onClick={onDelete} startIcon={<DeleteOutlinedIcon />} sx={{ ...btn, color: colors.primary, mr: 'auto' }}>Eliminar</Button>
        <Button onClick={onRenew} startIcon={<AutorenewIcon />} variant="outlined" sx={{ ...btn, color: colors.ink, borderColor: '#D1D5DB' }}>Renovar vigencia (15 días)</Button>
        <Button onClick={onClose} variant="contained" disableElevation sx={{ ...btn, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Cerrar</Button>
      </DialogActions>
    </Dialog>
  );
}
