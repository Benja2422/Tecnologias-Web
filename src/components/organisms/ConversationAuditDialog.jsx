import { Fragment } from 'react';
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { dayKey, formatClock, formatDayLabel } from '../../utils/messageDates';
import { colors } from '../../utils/theme';

const small = { height: 28, px: 1.25, borderRadius: '6px', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, textTransform: 'none', whiteSpace: 'nowrap' };

/**
 * Lectura completa de una conversación privada (solo auditoría: el administrador no escribe en ella).
 * hiddenOf(key) → { reason } | null. onHide(message) / onRestore(message).
 */
export default function ConversationAuditDialog({ conversation, hiddenOf, onHide, onRestore, onClose }) {
  const { client, seller, sellerRole, messages } = conversation;
  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" scroll="paper" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }} aria-labelledby="audit-title">
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1.5 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography id="audit-title" component="span" sx={{ display: 'block', fontSize: 19, fontWeight: 600, color: colors.ink, overflowWrap: 'anywhere' }}>{client} ↔ {seller}</Typography>
          <Typography component="span" sx={{ display: 'block', fontSize: 13, color: colors.muted }}>Cliente · {sellerRole} — {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'}. Vista de auditoría: los participantes no ven que fue revisada.</Typography>
        </Box>
        <IconButton aria-label="Cerrar" onClick={onClose} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ borderColor: '#EEF0F2', bgcolor: '#FCFCFC', display: 'grid', gap: 1.5, alignContent: 'start' }}>
        {messages.map((m, i) => {
          const fromClient = m.from === 'client';
          const hidden = hiddenOf(m.key);
          return (
            <Fragment key={m.id}>
              {(i === 0 || dayKey(messages[i - 1].at) !== dayKey(m.at)) && (
                <Typography sx={{ textAlign: 'center', fontSize: 12, color: '#8A8A8A', py: 0.5 }}>{formatDayLabel(m.at)}</Typography>
              )}
              <Box sx={{ display: 'flex', justifyContent: fromClient ? 'flex-start' : 'flex-end' }}>
                <Box role="group" aria-label={`Mensaje de ${fromClient ? client : seller}`} sx={{ maxWidth: { xs: '92%', md: 520 }, px: 2, py: 1.25, borderRadius: 2, bgcolor: fromClient ? '#F0F0F1' : '#FBECEC', border: `1px solid ${fromClient ? '#E6E6E8' : '#F1D5D5'}` }}>
                  <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: '#6B7280' }}>{fromClient ? client : seller}</Typography>
                  {hidden && (
                    <Typography sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 0.5, fontSize: 12, color: '#4B5563' }}>
                      <VisibilityOffOutlinedIcon sx={{ fontSize: 15 }} /> Oculto · {hidden.reason}
                    </Typography>
                  )}
                  <Typography sx={{ mt: 0.5, fontSize: 14.5, lineHeight: 1.45, color: colors.text, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', opacity: hidden ? 0.55 : 1 }}>{m.text}</Typography>
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
                    <Typography component="time" dateTime={m.at} sx={{ fontSize: 11, color: '#8A8A8A' }}>{formatClock(m.at)}</Typography>
                    {hidden ? (
                      <Button onClick={() => onRestore(m)} sx={{ ...small, color: colors.ink }}>Restaurar</Button>
                    ) : (
                      <Button onClick={() => onHide(m)} sx={{ ...small, color: colors.primary }}>Ocultar mensaje</Button>
                    )}
                  </Box>
                </Box>
              </Box>
            </Fragment>
          );
        })}
      </DialogContent>
    </Dialog>
  );
}
