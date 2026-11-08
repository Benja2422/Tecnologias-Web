import { Box, Button, Dialog, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { WarningStrip } from '../molecules/QuotationItemRow';
import { stockIssues } from '../../utils/quotations';
import { colors } from '../../utils/theme';

const buttonBase = { height: 42, px: 2.5, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none' };

/**
 * Confirmación para aceptar o rechazar una cotización.
 * mode: 'aceptar' (avisa si falta stock, pero deja continuar) | 'rechazar' (no se puede deshacer).
 */
export default function QuotationDecisionDialog({ mode, quotation, onConfirm, onClose }) {
  const accept = mode === 'aceptar';
  const issues = accept ? stockIssues(quotation.items) : [];

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} slotProps={{ paper: { sx: { maxWidth: 560, borderRadius: 4, m: 2, width: 'calc(100% - 32px)' } } }} aria-labelledby="decision-title">
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, px: 3.5, pt: 3.5, pb: 2.5 }}>
        <Box>
          <Typography id="decision-title" component="h2" sx={{ fontSize: 22, fontWeight: 600, color: colors.text }}>
            {accept ? '¿Aceptar esta cotización?' : '¿Rechazar esta cotización?'}
          </Typography>
          <Typography sx={{ mt: 1, fontSize: 14, color: colors.muted }}>
            {accept ? 'Se mantendrán estos precios hasta que completes el pago.' : 'Esta acción no se puede deshacer.'}
          </Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ color: colors.text, mt: -0.5 }}><CloseIcon /></IconButton>
      </Box>

      {issues.length > 0 && (
        <Box sx={{ px: 3.5, pb: 3 }}>
          <WarningStrip role="alert" sx={{ py: 2, alignItems: 'flex-start' }}>
            <Box sx={{ display: 'grid', gap: 0.75 }}>
              {issues.map((it) => (
                <span key={`${it.productId}-${it.detail}`}>{it.name}: cantidad {it.quantity}, stock {it.stock}. Verifica la disponibilidad antes de pagar.</span>
              ))}
            </Box>
          </WarningStrip>
        </Box>
      )}

      <Box sx={{ px: 3.5, py: 2.5, borderTop: '1px solid #EEE', display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
        <Button onClick={onClose} variant="outlined" sx={{ ...buttonBase, color: colors.text, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } }}>Cancelar</Button>
        {accept ? (
          <Button onClick={onConfirm} autoFocus variant="contained" disableElevation sx={{ ...buttonBase, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Aceptar</Button>
        ) : (
          <Button onClick={onConfirm} autoFocus variant="outlined" sx={{ ...buttonBase, color: colors.primary, borderColor: colors.primary, '&:hover': { borderColor: colors.primaryDark, bgcolor: '#FDECEF' } }}>Rechazar</Button>
        )}
      </Box>
    </Dialog>
  );
}
