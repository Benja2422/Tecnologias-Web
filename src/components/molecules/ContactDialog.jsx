import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack } from '@mui/material';
import TextInput from '../atoms/TextInput';
import CheckboxField from './CheckboxField';
import { colors } from '../../utils/theme';

/**
 * Diálogo para agregar / editar un correo o teléfono.
 * onSubmit(form) debe devolver un string de error, o null si guardó bien.
 * Se monta solo cuando está abierto (el padre usa key para reiniciar el estado).
 */
export default function ContactDialog({
  title, valueLabel, placeholder, typeOptions, initial, onSubmit, onClose, inputProps,
}) {
  const [form, setForm] = useState({
    value: initial?.value ?? '',
    type: initial?.type ?? typeOptions[0],
    isPrincipal: initial?.isPrincipal ?? false,
  });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const err = onSubmit(form);
    if (err) setError(err);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="xs" PaperProps={{ component: 'form', onSubmit: submit, noValidate: true }}>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <TextInput
            autoFocus
            label={valueLabel}
            placeholder={placeholder}
            value={form.value}
            onChange={(e) => { setForm((f) => ({ ...f, value: e.target.value })); setError(''); }}
            error={error}
            {...inputProps}
          />
          <TextInput
            select
            label="Etiqueta"
            value={form.type}
            onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
            sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center' } }}
          >
            {typeOptions.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
          </TextInput>
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
    </Dialog>
  );
}
