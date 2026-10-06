import { useState } from 'react';
import { Stack, Typography, Box } from '@mui/material';
import AppLink from '../atoms/AppLink';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import FormField from '../molecules/FormField';
import PasswordField from '../molecules/PasswordField';
import ItemListInput from '../molecules/ItemListInput';
import AddressField from '../molecules/AddressField';
import CheckboxField from '../molecules/CheckboxField';
import TextInput from '../atoms/TextInput';
import SectionTitle from '../atoms/SectionTitle';
import PrimaryButton from '../atoms/PrimaryButton';
import { colors } from '../../utils/theme';
import {
  formatRut, isValidRut, formatDate, isValidDate, isAdult,
  isValidEmail, isValidPhone, normalizePhone, formatNationalPhone, passwordError,
} from '../../utils/validators';

const INITIAL = {
  firstName: '', lastName: '', rut: '', birthDate: '',
  emails: [], phones: [], password: '', confirmPassword: '',
  addresses: [], wantsToSell: false, acceptedTerms: false,
};

export default function RegistrationForm({ onSubmit, initialValues, loginHref = '/login' }) {
  const [values, setValues] = useState({ ...INITIAL, ...initialValues });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const text = (name, transform = (v) => v) => ({
    value: values[name],
    onChange: (e) => setField(name, transform(e.target.value)),
    error: errors[name],
  });

  const validate = () => {
    const e = {};
    if (!values.firstName.trim()) e.firstName = 'Ingresa tu nombre';
    if (!values.lastName.trim()) e.lastName = 'Ingresa tu apellido';
    if (!isValidRut(values.rut)) e.rut = 'Ingresa un RUT válido';
    if (!isValidDate(values.birthDate)) e.birthDate = 'Usa el formato DD/MM/AAAA';
    else if (!isAdult(values.birthDate)) e.birthDate = 'Debes ser mayor de 18 años';
    if (values.emails.length === 0) e.emails = 'Agrega al menos un correo';
    if (values.phones.length === 0) e.phones = 'Agrega al menos un teléfono';
    const pe = passwordError(values.password);
    if (pe) e.password = pe;
    if (values.confirmPassword !== values.password) e.confirmPassword = 'Las contraseñas no coinciden';
    if (!values.acceptedTerms) e.acceptedTerms = 'Debes aceptar los términos y condiciones';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = values; // eslint-disable-line no-unused-vars
      await onSubmit?.({ ...payload, primaryEmail: values.emails[0] });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <SectionTitle>Datos personales</SectionTitle>

      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormField label="Nombre" htmlFor="firstName">
            <TextInput id="firstName" placeholder="Ej. Juan" autoComplete="given-name" {...text('firstName')} />
          </FormField>
          <FormField label="Apellido" htmlFor="lastName">
            <TextInput id="lastName" placeholder="Ej. Pérez" autoComplete="family-name" {...text('lastName')} />
          </FormField>
        </Stack>

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormField label="RUT" htmlFor="rut">
            <TextInput id="rut" placeholder="12.345.678-9" {...text('rut', formatRut)} />
          </FormField>
          <FormField label="Fecha de nacimiento" htmlFor="birthDate">
            <TextInput
              id="birthDate"
              placeholder="DD/MM/AAAA"
              autoComplete="bday"
              inputProps={{ inputMode: 'numeric' }}
              {...text('birthDate', formatDate)}
            />
          </FormField>
        </Stack>

        <ItemListInput
          id="email"
          label="Correos electrónicos"
          items={values.emails}
          onChange={(v) => setField('emails', v)}
          placeholder="nuevo.correo@ejemplo.cl"
          icon={<MailOutlineIcon fontSize="small" />}
          validate={isValidEmail}
          errorMessage="Ingresa un correo válido"
          markFirstAsPrimary
          error={errors.emails}
          inputProps={{ type: 'email', autoComplete: 'email' }}
        />

        <ItemListInput
          id="phone"
          label="Teléfonos"
          items={values.phones}
          onChange={(v) => setField('phones', v)}
          placeholder="9 1234 5678"
          prefix="+56"
          formatDraft={formatNationalPhone}
          icon={<PhoneOutlinedIcon fontSize="small" />}
          validate={isValidPhone}
          normalize={(v) => (v.trim() ? normalizePhone(v) : '')}
          errorMessage="Ingresa un celular chileno válido: 9 1234 5678"
          error={errors.phones}
          inputProps={{ type: 'tel', autoComplete: 'tel-national' }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormField label="Contraseña" htmlFor="password">
            <PasswordField id="password" {...text('password')} />
          </FormField>
          <FormField label="Confirmar contraseña" htmlFor="confirmPassword">
            <PasswordField id="confirmPassword" {...text('confirmPassword')} />
          </FormField>
        </Stack>
      </Stack>

      <Box sx={{ mt: 5 }}>
        <SectionTitle>Dirección de despacho</SectionTitle>
        <AddressField addresses={values.addresses} onChange={(v) => setField('addresses', v)} />
      </Box>

      <Stack spacing={0.5} sx={{ mt: 2.5, mb: 3 }}>
        <CheckboxField
          label="También quiero vender en la plataforma"
          checked={values.wantsToSell}
          onChange={(v) => setField('wantsToSell', v)}
        />
        <CheckboxField
          label="Acepto los términos y condiciones y la política de privacidad"
          checked={values.acceptedTerms}
          onChange={(v) => setField('acceptedTerms', v)}
          error={errors.acceptedTerms}
        />
      </Stack>

      <PrimaryButton type="submit" disabled={submitting}>
        {values.wantsToSell ? 'Siguiente' : submitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </PrimaryButton>

      <Typography align="center" sx={{ mt: 3, fontSize: 14, color: colors.text }}>
        ¿Ya tienes cuenta?{' '}
        <AppLink href={loginHref} underline="always" sx={{ color: colors.link }}>
          Inicia sesión
        </AppLink>
      </Typography>
    </Box>
  );
}
