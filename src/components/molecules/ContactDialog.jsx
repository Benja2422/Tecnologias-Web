import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material';
import TextInput from '../atoms/TextInput';
import CheckboxField from './CheckboxField';
import { colors } from '../../utils/theme';

// El <form> envuelve todo el contenido del diálogo (funciona en cualquier versión de MUI)
const formSx = { display: 'flex', flexDirection: 'column', minHeight: 0 };

/**
 * Diálogo para agregar / editar un correo o teléfono.
 * onSubmit(form) debe devolver un string de error, o null si guardó bien.
 * Se monta solo cuando está abierto (el padre usa key para reiniciar el estado).
 */
export default function ContactDialog({
  title, valueLabel, placeholder, initial, onSubmit, onClose, inputProps,
  prefix, formatDraft = (v) => v, toDraft = (v) => v,
}) {
  const [form, setForm] = useState({
    value: formatDraft(toDraft(initial?.value ?? '')),
    isPrincipal: initial?.isPrincipal ?? false,
  });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const err = onSubmit(form);
    if (err) setError(err);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <Box component="form" onSubmit={submit} noValidate sx={formSx}>
        <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextInput
              autoFocus
              label={valueLabel}
              placeholder={placeholder}
              prefix={prefix}
              value={form.value}
              onChange={(e) => { setForm((f) => ({ ...f, value: formatDraft(e.target.value) })); setError(''); }}
              error={error}
              {...inputProps}
            />
            <CheckboxField
              label="Establecer como principal"
              checked={form.isPrincipal}
              disabled={initial?.isPrincipal}
              onChange={(v) => setForm((f) => ({ ...f, isPrincipal: v }))}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} sx={{ color: colors.muted }}>Cancelar</Button>
          <Button type="submit" variant="contained" disableElevation>Guardar</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
