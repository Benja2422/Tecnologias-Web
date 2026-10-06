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
 * Modal para crear o editar un usuario (admin). Se monta solo cuando está abierto.
 * - user = null  → modo "crear" (contraseña obligatoria)
 * - user = {...} → modo "editar" (contraseña opcional: vacía = se mantiene la actual)
 * onSave(values) puede lanzar un Error; el mensaje se muestra dentro del modal.
 */
export default function UserFormDialog({ user = null, onSave, onClose }) {
  const isCreate = !user;
  const [values, setValues] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    rut: user?.rut ?? '',
    birthDate: user?.birthDate ?? '',
    email: user?.email ?? '',
    password: '',
    accountType: user?.accountType ?? ACCOUNT_TYPES[0],
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
    if (isCreate && !values.password) e.password = 'Ingresa una contraseña';
    else if (values.password && passwordError(values.password)) e.password = passwordError(values.password);
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
      await onSave(payload);
    } catch (err) {
      setFormError(err?.message || 'No pudimos guardar los cambios. Intenta nuevamente.');
      setSaving(false);
    }
  };

  return (
    <Dialog open onClose={saving ? undefined : onClose} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }}>
      <Box component="form" onSubmit={submit} noValidate sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1 }}>
        <Box>
          <Typography component="span" sx={{ display: 'block', fontSize: 20, fontWeight: 600, color: colors.ink }}>
            {isCreate ? 'Crear usuario' : 'Editar usuario'}
          </Typography>
          <Typography component="span" sx={{ display: 'block', fontSize: 13, color: colors.muted }}>
            {isCreate ? 'Completa los datos de la nueva cuenta' : `ID: ${user.id}`}
          </Typography>
        </Box>
        <IconButton aria-label="Cerrar" onClick={onClose} disabled={saving} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: '#EEF0F2' }}>
        {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
        <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, pt: 1 }}>
          <FormField label="Nombre" htmlFor="userFirstName">
            <TextInput id="userFirstName" autoFocus autoComplete="off" placeholder="Ej. Juan" {...set('firstName')} />
          </FormField>
          <FormField label="Apellido" htmlFor="userLastName">
            <TextInput id="userLastName" autoComplete="off" placeholder="Ej. Pérez" {...set('lastName')} />
          </FormField>
          <FormField label="RUN" htmlFor="userRut">
            <TextInput id="userRut" placeholder="12.345.678-9" {...set('rut', formatRut)} />
          </FormField>
          <FormField label="Fecha de nacimiento" htmlFor="userBirthDate">
            <TextInput id="userBirthDate" placeholder="DD/MM/AAAA" inputProps={{ inputMode: 'numeric' }} {...set('birthDate', formatDate)} />
          </FormField>
          <Box sx={full}>
            <FormField label="Correo electrónico" htmlFor="userEmail">
              <TextInput id="userEmail" type="email" autoComplete="off" placeholder="correo@ejemplo.cl" {...set('email')} />
            </FormField>
          </Box>
          <Box sx={full}>
            <FormField
              label="Contraseña"
              htmlFor="userPassword"
              hint={isCreate ? 'Mínimo 8 caracteres, con letras y números' : 'Déjala en blanco para mantener la contraseña actual'}
            >
              <PasswordField id="userPassword" placeholder={isCreate ? 'Contraseña' : 'Nueva contraseña'} {...set('password')} />
            </FormField>
          </Box>
          <Box sx={full}>
            <FormField label="Tipo de usuario" htmlFor="userAccountType">
              <TextInput
                id="userAccountType"
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
          {saving ? 'Guardando…' : isCreate ? 'Crear usuario' : 'Guardar cambios'}
        </PrimaryButton>
      </DialogActions>
      </Box>
    </Dialog>
  );
}
