import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import AddButton from '../atoms/AddButton';
import FormField from './FormField';
import { colors } from '../../utils/theme';
import { getCommuneOptions, getProvinceOptions, getRegionOptions } from '../../utils/chileDivisions';

const EMPTY = { street: '', regionId: '', provinceId: '', communeId: '' };
const REGIONS = getRegionOptions();
const newId = () => globalThis.crypto?.randomUUID?.() ?? `addr-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const formatAddress = (a) => `${a.street}, ${a.commune}, ${a.province}, ${a.region}`;

/**
 * Lista de direcciones + modal para agregar una (calle, región, provincia y comuna).
 * Región → Provincia → Comuna son menús dependientes: cada uno muestra solo lo que pertenece al anterior.
 * Cada dirección guarda nombres e IDs de la base de datos:
 *   { id, street, regionId, region, provinceId, province, communeId, commune }
 * maxItems: al alcanzarlo se oculta el campo de ingreso (p. ej. 1 para "Dirección del local").
 */
export default function AddressField({ id, addresses, onChange, maxItems = Infinity }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const full = addresses.length >= maxItems;
  const provinces = getProvinceOptions(form.regionId);
  const communes = getCommuneOptions(form.provinceId);

  const clearError = (name) => setErrors((er) => ({ ...er, [name]: undefined }));
  const setStreet = (e) => { setForm((f) => ({ ...f, street: e.target.value })); clearError('street'); };

  // Al cambiar un nivel se reinician los que dependen de él
  const setRegion = (e) => { setForm((f) => ({ ...f, regionId: e.target.value, provinceId: '', communeId: '' })); clearError('regionId'); };
  const setProvince = (e) => { setForm((f) => ({ ...f, provinceId: e.target.value, communeId: '' })); clearError('provinceId'); };
  const setCommune = (e) => { setForm((f) => ({ ...f, communeId: e.target.value })); clearError('communeId'); };

  const openDialog = () => setOpen(true);
  const close = () => { setOpen(false); setForm(EMPTY); setErrors({}); };

  const save = (e) => {
    e.preventDefault();
    // Este diálogo está dentro del <form> del registro: sin esto, el submit también llegaría a ese formulario
    e.stopPropagation();

    const next = {};
    if (!form.street.trim()) next.street = 'Ingresa calle y número';
    if (form.regionId === '') next.regionId = 'Selecciona la región';
    if (form.provinceId === '') next.provinceId = 'Selecciona la provincia';
    if (form.communeId === '') next.communeId = 'Selecciona la comuna';
    setErrors(next);
    if (Object.keys(next).length) return;

    const address = {
      id: newId(),
      street: form.street.trim(),
      regionId: form.regionId,
      region: REGIONS.find((r) => r.id === form.regionId).name,
      provinceId: form.provinceId,
      province: provinces.find((p) => p.id === form.provinceId).name,
      communeId: form.communeId,
      commune: communes.find((c) => c.id === form.communeId).name,
    };
    // TODO: persistir con src/services
    console.log('[Dirección] Agregar dirección:', address);
    onChange([...addresses, address]);
    close();
  };

  const remove = (addressId) => {
    console.log('[Dirección] Eliminar dirección:', addresses.find((a) => a.id === addressId));
    onChange(addresses.filter((a) => a.id !== addressId));
  };

  return (
    <>
      {addresses.length > 0 && (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mb: full ? 0 : 1, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          {addresses.map((a, i) => (
            <Box
              component="li"
              key={a.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 50, px: 2, py: 0.5,
                borderBottom: i < addresses.length - 1 ? `1px solid ${colors.border}` : 'none',
              }}
            >
              <PlaceOutlinedIcon fontSize="small" sx={{ color: colors.muted }} />
              <Typography sx={{ flex: 1, fontSize: 15 }}>{formatAddress(a)}</Typography>
              <IconButton size="small" aria-label="Quitar dirección" onClick={() => remove(a.id)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {!full && (
        <Stack direction="row" spacing={1}>
          <TextInput
            id={id}
            placeholder="Aún no has agregado una dirección"
            value=""
            onClick={openDialog}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDialog(); } }}
            InputProps={{
              readOnly: true,
              startAdornment: <PlaceOutlinedIcon fontSize="small" sx={{ color: colors.muted, mr: 1.2 }} />,
            }}
            inputProps={{ 'aria-label': 'Agregar dirección' }}
            sx={{ '& input': { cursor: 'pointer' } }}
          />
          <AddButton onClick={openDialog} />
        </Stack>
      )}

      <Dialog open={open} onClose={close} fullWidth maxWidth="xs" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
        <Box component="form" onSubmit={save} noValidate>
          <DialogTitle sx={{ fontWeight: 600 }}>Agregar dirección</DialogTitle>
          <DialogContent>
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <FormField label="Calle y número" htmlFor="addressStreet">
                <TextInput id="addressStreet" autoFocus autoComplete="off" placeholder="Ej. Av. República 517" value={form.street} onChange={setStreet} error={errors.street} />
              </FormField>

              <FormField label="Región" htmlFor="addressRegion">
                <SelectInput
                  id="addressRegion" ariaLabel="Región" placeholder="Selecciona una región"
                  options={REGIONS} value={form.regionId} onChange={setRegion} error={errors.regionId}
                />
              </FormField>

              <FormField label="Provincia" htmlFor="addressProvince">
                <SelectInput
                  id="addressProvince" ariaLabel="Provincia"
                  placeholder={form.regionId === '' ? 'Primero elige una región' : 'Selecciona una provincia'}
                  options={provinces} value={form.provinceId} onChange={setProvince} error={errors.provinceId}
                  disabled={form.regionId === ''}
                />
              </FormField>

              <FormField label="Comuna" htmlFor="addressCommune">
                <SelectInput
                  id="addressCommune" ariaLabel="Comuna"
                  placeholder={form.provinceId === '' ? 'Primero elige una provincia' : 'Selecciona una comuna'}
                  options={communes} value={form.communeId} onChange={setCommune} error={errors.communeId}
                  disabled={form.provinceId === ''}
                />
              </FormField>
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={close} sx={{ color: colors.muted }}>Cancelar</Button>
            <Button type="submit" variant="contained" disableElevation>Guardar dirección</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </>
  );
}
