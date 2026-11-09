import { useState } from 'react';
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormField from '../molecules/FormField';
import SelectInput from '../atoms/SelectInput';
import TextInput from '../atoms/TextInput';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import { HIDE_REASONS } from '../../utils/moderation';
import { colors } from '../../utils/theme';

/**
 * Pide el motivo antes de ocultar un contenido. what: "la pregunta", "el mensaje"…; preview: texto del contenido.
 * Opcionales para otros usos (p. ej. suspender una publicación): title, subtitle, reasons [{ id, name }], confirmLabel.
 * onConfirm(reason, note).
 */
export default function HideContentDialog({ what, preview, title, subtitle, reasons = HIDE_REASONS, confirmLabel = 'Ocultar', onConfirm, onClose }) {
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!reason) { setError('Elige un motivo.'); return; }
    onConfirm(reason, note);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }} aria-labelledby="hide-title">
      <Box component="form" onSubmit={submit} noValidate>
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1 }}>
          <Box>
            <Typography id="hide-title" component="span" sx={{ display: 'block', fontSize: 20, fontWeight: 600, color: colors.ink }}>{title ?? `Ocultar ${what}`}</Typography>
            <Typography component="span" sx={{ display: 'block', fontSize: 13, color: colors.muted }}>{subtitle ?? 'Dejará de verse en la plataforma. Podrás restaurarlo después.'}</Typography>
          </Box>
          <IconButton aria-label="Cerrar" onClick={onClose} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: '#EEF0F2', display: 'grid', gap: 2.5 }}>
          <Box sx={{ px: 2, py: 1.5, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', fontSize: 14, color: colors.ink, lineHeight: 1.5, overflowWrap: 'anywhere' }}>
            “{preview}”
          </Box>
          <FormField label="Motivo" htmlFor="hide-reason" error={error}>
            <SelectInput id="hide-reason" options={reasons} value={reason} onChange={(e) => { setReason(e.target.value); setError(''); }} placeholder="Selecciona un motivo" ariaLabel="Motivo" error={Boolean(error)} />
          </FormField>
          <FormField label="Nota interna" htmlFor="hide-note" optional hint="Solo la ve el equipo de administración.">
            <TextInput id="hide-note" value={note} onChange={(e) => setNote(e.target.value.slice(0, 200))} placeholder="Ej. Reincidente, ya se le advirtió por mensaje." />
          </FormField>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <SecondaryButton onClick={onClose} sx={{ height: 44 }}>Cancelar</SecondaryButton>
          <PrimaryButton type="submit" fullWidth={false} sx={{ height: 44, px: 3, py: 0, fontSize: 15 }}>{confirmLabel}</PrimaryButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
