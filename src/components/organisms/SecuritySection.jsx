import { useState } from 'react';
import { Box } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ProfileSection from '../molecules/ProfileSection';
import FormField from '../molecules/FormField';
import TextInput from '../atoms/TextInput';
import PrimaryButton from '../atoms/PrimaryButton';
import { passwordError } from '../../utils/validators';

const EMPTY = { current: '', next: '', confirm: '' };

export default function SecuritySection({ onSubmit }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const field = (name) => ({
    value: values[name],
    error: errors[name],
    onChange: (e) => {
      setValues((v) => ({ ...v, [name]: e.target.value }));
      setErrors((er) => ({ ...er, [name]: undefined }));
    },
  });

  const validate = () => {
    const e = {};
    if (!values.current) e.current = 'Ingresa tu contraseña actual';
    const pe = passwordError(values.next);
    if (pe) e.next = pe;
    else if (values.next === values.current) e.next = 'Debe ser distinta a la actual';
    if (values.confirm !== values.next) e.confirm = 'Las contraseñas no coinciden';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit?.({ currentPassword: values.current, newPassword: values.next });
      setValues(EMPTY);
    } catch (err) {
      // p. ej. el servicio responde "La contraseña actual es incorrecta"
      setErrors({ current: err?.message || 'No pudimos actualizar la contraseña' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSection icon={<LockOutlinedIcon />} title="Seguridad" subtitle="Actualiza tu contraseña de acceso a TodoMart">
      <Box component="form" onSubmit={submit} noValidate>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          <FormField label="Contraseña actual" htmlFor="currentPassword">
            <TextInput id="currentPassword" type="password" autoComplete="current-password" {...field('current')} />
          </FormField>
          <FormField label="Nueva contraseña" htmlFor="newPassword">
            <TextInput id="newPassword" type="password" autoComplete="new-password" placeholder="Mínimo 8 caracteres" {...field('next')} />
          </FormField>
          <FormField label="Confirmar nueva contraseña" htmlFor="confirmNewPassword">
            <TextInput id="confirmNewPassword" type="password" autoComplete="new-password" placeholder="Repite tu nueva contraseña" {...field('confirm')} />
          </FormField>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <PrimaryButton type="submit" fullWidth={false} disabled={saving} sx={{ height: 44, px: 3, py: 0, fontSize: 15 }}>
            Actualizar contraseña
          </PrimaryButton>
        </Box>
      </Box>
    </ProfileSection>
  );
}
