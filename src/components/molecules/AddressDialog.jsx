import { useState } from 'react';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import FormField from './FormField';
import CheckboxField from './CheckboxField';
import { colors } from '../../utils/theme';
import { getCommuneOptions, getProvinceOptions, getRegionOptions } from '../../utils/chileDivisions';

const REGIONS = getRegionOptions();
const newId = () => globalThis.crypto?.randomUUID?.() ?? `addr-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const toForm = (a, lockPrincipal) => ({
  label: a?.label ?? '',
  isPrincipal: lockPrincipal || (a?.isPrincipal ?? false),
  street: a?.street ?? '',
  number: a?.number ?? '',
  regionId: a?.regionId ?? '',
  provinceId: a?.provinceId ?? '',
  communeId: a?.communeId ?? '',
});

const buttonSx = { height: 48, px: 3.5, borderRadius: '8px', fontFamily: 'inherit', fontSize: 16, fontWeight: 600 };

/**
 * Modal para añadir o editar una dirección (calle, número, región, provincia y comuna).
 * Región → Provincia → Comuna son menús dependientes: cada uno muestra solo lo que pertenece al anterior.
 * Se monta solo cuando está abierto (el padre usa key para reiniciar el estado).
 *
 * initial: dirección a editar (null = crear)
 * La etiqueta ("Casa", "Oficina"…) es opcional.
 * showPrincipal: muestra la opción "Establecer como dirección principal" (Mis direcciones) y agrega `isPrincipal` al resultado.
 * lockPrincipal: la opción queda marcada y deshabilitada (la dirección principal actual, o la primera que se crea).
 * onSubmit(address): recibe { id, label?, street, number, regionId, region, provinceId, province, communeId, commune }
 */
export default function AddressDialog({ initial = null, onSubmit, onClose, showPrincipal = false, lockPrincipal = false }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(() => toForm(initial, lockPrincipal));
  const [errors, setErrors] = useState({});

  const provinces = getProvinceOptions(form.regionId);
  const communes = getCommuneOptions(form.provinceId);

  const clearError = (name) => setErrors((er) => ({ ...er, [name]: undefined }));
  const setText = (name) => (e) => { setForm((f) => ({ ...f, [name]: e.target.value })); clearError(name); };

  // Al cambiar un nivel se reinician los que dependen de él
  const setRegion = (e) => { setForm((f) => ({ ...f, regionId: e.target.value, provinceId: '', communeId: '' })); clearError('regionId'); };
  const setProvince = (e) => { setForm((f) => ({ ...f, provinceId: e.target.value, communeId: '' })); clearError('provinceId'); };
  const setCommune = (e) => { setForm((f) => ({ ...f, communeId: e.target.value })); clearError('communeId'); };

  const submit = (e) => {
    e.preventDefault();
    // Este diálogo puede estar dentro de otro <form> (registro): sin esto, el submit también llegaría a ese formulario
    e.stopPropagation();

    const next = {};
    if (!form.street.trim()) next.street = 'Ingresa la calle';
    if (!form.number.trim()) next.number = 'Ingresa el número';
    if (form.regionId === '') next.regionId = 'Selecciona la región';
    if (form.provinceId === '') next.provinceId = 'Selecciona la provincia';
    if (form.communeId === '') next.communeId = 'Selecciona la comuna';
    setErrors(next);
    if (Object.keys(next).length) return;

    const address = {
      ...(form.label.trim() ? { label: form.label.trim() } : {}),
      ...(showPrincipal ? { isPrincipal: form.isPrincipal } : {}),
      id: initial?.id ?? newId(),
      street: form.street.trim(),
      number: form.number.trim(),
      regionId: form.regionId,
      region: REGIONS.find((r) => r.id === form.regionId).name,
      provinceId: form.provinceId,
      province: provinces.find((p) => p.id === form.provinceId).name,
      communeId: form.communeId,
      commune: communes.find((c) => c.id === form.communeId).name,
    };
    // TODO: persistir con src/services
    console.log(`[Dirección] ${isEdit ? 'Actualizar' : 'Agregar'} dirección:`, address);
    onSubmit(address);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: 4 } }}>
      <Box component="form" onSubmit={submit} noValidate>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: { xs: 3, sm: 4 }, pt: 4, pb: 2 }}>
          <Box component="span" sx={{ fontSize: { xs: 24, sm: 28 }, fontWeight: 600, color: colors.text }}>
            {isEdit ? 'Editar dirección' : 'Añadir dirección'}
          </Box>
          <IconButton aria-label="Cerrar" onClick={onClose} sx={{ mr: -1 }}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: { xs: 3, sm: 4 } }}>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr 110px', sm: '1fr 144px' }, alignItems: 'start' }}>
              <FormField label="Calle" htmlFor="addressStreet">
                <TextInput id="addressStreet" autoFocus autoComplete="off" placeholder="Ej. Avenida Providencia" value={form.street} onChange={setText('street')} error={errors.street} />
              </FormField>
              <FormField label="Número" htmlFor="addressNumber">
                <TextInput
                  id="addressNumber" autoComplete="off" placeholder="Ej. 1234" value={form.number} onChange={setText('number')} error={errors.number}
                  slotProps={{ htmlInput: { maxLength: 30 } }}
                />
              </FormField>
            </Box>

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

            <FormField label="Etiqueta" htmlFor="addressLabel" optional>
              <TextInput
                id="addressLabel" autoComplete="off" placeholder="Ej. Casa, Oficina" value={form.label} onChange={setText('label')}
                slotProps={{ htmlInput: { maxLength: 30 } }}
              />
            </FormField>

            {showPrincipal && (
              <CheckboxField
                label="Establecer como dirección principal"
                checked={form.isPrincipal}
                disabled={lockPrincipal}
                onChange={(v) => setForm((f) => ({ ...f, isPrincipal: v }))}
              />
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: { xs: 3, sm: 4 }, pt: 3, pb: 4, gap: 1.5 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{ ...buttonSx, color: colors.text, borderColor: colors.border, '&:hover': { borderColor: colors.text, bgcolor: 'transparent' } }}
          >
            Cancelar
          </Button>
          <Button type="submit" variant="contained" disableElevation sx={buttonSx}>
            {isEdit ? 'Guardar cambios' : 'Guardar dirección'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
