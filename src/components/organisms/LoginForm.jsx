import { useState } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import FormField from '../molecules/FormField';
import PasswordField from '../molecules/PasswordField';
import CheckboxField from '../molecules/CheckboxField';
import TextInput from '../atoms/TextInput';
import PrimaryButton from '../atoms/PrimaryButton';
import { colors } from '../../utils/theme';
import { formatRut, isValidRut } from '../../utils/validators';

const linkSx = { color: colors.link, fontFamily: 'inherit' };

export default function LoginForm({
  onSubmit,
  forgotPasswordHref = '/recuperar-contrasena',
  registerHref = '/registro',
}) {
  const [values, setValues] = useState({ rut: '', password: '', remember: false });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name] || errors.form) setErrors((e) => ({ ...e, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!isValidRut(values.rut)) e.rut = 'Ingresa un RUT válido';
    if (!values.password) e.password = 'Ingresa tu contraseña';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit?.(values);
    } catch (err) {
      // El servicio puede lanzar un error con message (ej. credenciales inválidas)
      setErrors({ form: err?.message || 'No pudimos iniciar sesión. Intenta nuevamente.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={3.5}>
        <FormField label="RUT" htmlFor="rut">
          <TextInput
            id="rut"
            placeholder="12.345.678-9"
            autoComplete="username"
            value={values.rut}
            onChange={(e) => setField('rut', formatRut(e.target.value))}
            error={errors.rut}
          />
        </FormField>

        <FormField label="Contraseña" htmlFor="password">
          <PasswordField
            id="password"
            autoComplete="current-password"
            value={values.password}
            onChange={(e) => setField('password', e.target.value)}
            error={errors.password}
          />
        </FormField>
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mt: 2.5, mb: 3.5 }}
      >
        <CheckboxField
          label="Recordarme"
          checked={values.remember}
          onChange={(v) => setField('remember', v)}
        />
      </Stack>

      {errors.form && (
        <Typography role="alert" sx={{ mb: 2, fontSize: 14, color: 'error.main', textAlign: 'center' }}>
          {errors.form}
        </Typography>
      )}

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? 'Ingresando…' : 'Continuar'}
      </PrimaryButton>

      <Typography align="center" sx={{ mt: 4, fontSize: 15, color: colors.text }}>
        ¿No estás registrado?{' '}
        <Link href={registerHref} underline="always" sx={linkSx}>
          Crear cuenta
        </Link>
      </Typography>
    </Box>
  );
}
