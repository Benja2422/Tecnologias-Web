import { useState } from 'react';
import {
  Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Button, Stack, Typography,
} from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import AddButton from '../atoms/AddButton';
import { colors } from '../../utils/theme';

const EMPTY = { street: '', commune: '', region: '' };

export default function AddressField({ addresses, onChange }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const close = () => { setOpen(false); setForm(EMPTY); setErrors({}); };

  const save = () => {
    const next = {};
    if (!form.street.trim()) next.street = 'Ingresa calle y número';
    if (!form.commune.trim()) next.commune = 'Ingresa la comuna';
    if (!form.region.trim()) next.region = 'Ingresa la región';
    setErrors(next);
    if (Object.keys(next).length) return;
    onChange([...addresses, { id: crypto.randomUUID(), ...form }]);
    close();
  };

  const remove = (id) => onChange(addresses.filter((a) => a.id !== id));

  return (
    <>
      {addresses.length > 0 && (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mb: 1, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          {addresses.map((a, i) => (
            <Box
              component="li"
              key={a.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 50, px: 2,
                borderBottom: i < addresses.length - 1 ? `1px solid ${colors.border}` : 'none',
              }}
            >
              <PlaceOutlinedIcon fontSize="small" sx={{ color: colors.muted }} />
              <Typography sx={{ flex: 1, fontSize: 15 }}>
                {a.street}, {a.commune}, {a.region}
              </Typography>
              <IconButton size="small" aria-label="Quitar dirección" onClick={() => remove(a.id)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Stack direction="row" spacing={1}>
        <TextInput
          placeholder="Aún no has agregado una dirección"
          value=""
          onClick={() => setOpen(true)}
          InputProps={{
            readOnly: true,
            startAdornment: <PlaceOutlinedIcon fontSize="small" sx={{ color: colors.muted, mr: 1.2 }} />,
          }}
          inputProps={{ 'aria-label': 'Dirección de despacho' }}
        />
        <AddButton onClick={() => setOpen(true)} />
      </Stack>

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
        <DialogTitle sx={{ fontWeight: 600 }}>Agregar dirección</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextInput label="Calle y número" value={form.street} onChange={set('street')} error={errors.street} />
            <TextInput label="Comuna" value={form.commune} onChange={set('commune')} error={errors.commune} />
            <TextInput label="Región" value={form.region} onChange={set('region')} error={errors.region} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} sx={{ color: colors.muted }}>Cancelar</Button>
          <Button onClick={save} variant="contained" disableElevation>Guardar dirección</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
