import { useState } from 'react';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormField from '../molecules/FormField';
import PasswordField from '../molecules/PasswordField';
import TextInput from '../atoms/TextInput';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import { ACCOUNT_TYPES } from '../../utils/constants';
import { colors } from '../../utils/theme';
import { formatRut, isValidRut, formatDate, isValidDate, isAdult, isValidEmail, passwordError } from '../../utils/validators';

const full = { gridColumn: '1 / -1' };

/**
 * Modal de edición de usuario (admin). Se monta solo cuando hay un usuario seleccionado.
 * onSave(id, values) puede lanzar un Error; el mensaje se muestra en el modal.
 * La contraseña es opcional: vacía = se mantiene la actual (no se incluye en values).
 */
export default function UserEditDialog({ user, onSave, onClose }) {
  const [values, setValues] = useState({
    firstName: user.firstName, lastName: user.lastName, rut: user.rut, birthDate: user.birthDate,
    email: user.email, password: '', accountType: user.accountType,
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const set = (name, transform = (v) => v) => ({
    value: values[name],
    error: errors[name],
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: transform(e.target.value) }));
      setErrors((er) => ({ ...er, [name]: undefined }));
      setFormError('');
    },
  });

  const validate = () => {
    const e = {};
    if (!values.firstName.trim()) e.firstName = 'Ingresa el nombre';
    if (!values.lastName.trim()) e.lastName = 'Ingresa el apellido';
    if (!isValidRut(values.rut)) e.rut = 'Ingresa un RUN válido';
    if (!isValidDate(values.birthDate)) e.birthDate = 'Usa el formato DD/MM/AAAA';
    else if (!isAdult(values.birthDate)) e.birthDate = 'Debe ser mayor de 18 años';
    if (!isValidEmail(values.email)) e.email = 'Ingresa un correo válido';
    if (values.password && passwordError(values.password)) e.password = passwordError(values.password);
    if (!ACCOUNT_TYPES.includes(values.accountType)) e.accountType = 'Selecciona un tipo de usuario';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    const { password, ...rest } = values;
    const payload = {
      ...rest,
      firstName: rest.firstName.trim(),
      lastName: rest.lastName.trim(),
      email: rest.email.trim(),
      ...(password ? { password } : {}),
    };
    setSaving(true);
    try {
      await onSave(user.id, payload);
    } catch (err) {
      setFormError(err?.message || 'No pudimos guardar los cambios. Intenta nuevamente.');
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" PaperProps={{ component: 'form', onSubmit: submit, noValidate: true, sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1 }}>
        <Box>
          <Typography component="span" sx={{ display: 'block', fontSize: 20, fontWeight: 600, color: colors.ink }}>Editar usuario</Typography>
          <Typography component="span" sx={{ display: 'block', fontSize: 13, color: colors.muted }}>ID: {user.id}</Typography>
        </Box>
        <IconButton aria-label="Cerrar" onClick={onClose} disabled={saving} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#EEF0F2' }}>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, pt: 1 }}>
          <FormField label="Nombre" htmlFor="editFirstName">
            <TextInput id="editFirstName" autoFocus autoComplete="off" {...set('firstName')} />
          </FormField>
          <FormField label="Apellido" htmlFor="editLastName">
            <TextInput id="editLastName" autoComplete="off" {...set('lastName')} />
          </FormField>
          <FormField label="RUN" htmlFor="editRut">
            <TextInput id="editRut" placeholder="12.345.678-9" {...set('rut', formatRut)} />
          </FormField>
          <FormField label="Fecha de nacimiento" htmlFor="editBirthDate">
            <TextInput id="editBirthDate" placeholder="DD/MM/AAAA" inputProps={{ inputMode: 'numeric' }} {...set('birthDate', formatDate)} />
          </FormField>
          <Box sx={full}>
            <FormField label="Correo electrónico" htmlFor="editEmail">
              <TextInput id="editEmail" type="email" autoComplete="off" {...set('email')} />
            </FormField>
          </Box>
          <Box sx={full}>
            <FormField label="Contraseña" htmlFor="editPassword" hint="Déjala en blanco para mantener la contraseña actual">
              <PasswordField id="editPassword" placeholder="Nueva contraseña" {...set('password')} />
            </FormField>
          </Box>
          <Box sx={full}>
            <FormField label="Tipo de usuario" htmlFor="editAccountType">
              <TextInput
                id="editAccountType"
                select
                {...set('accountType')}
                sx={{ '& .MuiSelect-select': { display: 'flex', alignItems: 'center' } }}
              >
                {ACCOUNT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
              </TextInput>
            </FormField>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <SecondaryButton onClick={onClose} disabled={saving} sx={{ height: 44 }}>Cancelar</SecondaryButton>
        <PrimaryButton type="submit" fullWidth={false} disabled={saving} sx={{ height: 44, px: 3, py: 0, fontSize: 15 }}>
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
}
