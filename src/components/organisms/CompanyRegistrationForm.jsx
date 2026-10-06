import { useState } from 'react';
import { Box, Link, Stack, Typography } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import FormField from '../molecules/FormField';
import ItemListInput from '../molecules/ItemListInput';
import CheckboxField from '../molecules/CheckboxField';
import TextInput from '../atoms/TextInput';
import SectionTitle from '../atoms/SectionTitle';
import PrimaryButton from '../atoms/PrimaryButton';
import { colors } from '../../utils/theme';
import {
  formatRut, isValidRut, isValidEmail, isValidPhone, normalizePhone,
  isValidUrl, normalizeUrl,
} from '../../utils/validators';

const INITIAL = {
  rut: '', businessName: '', businessActivity: '', website: '',
  storeAddress: '', emails: [], phones: [], acceptedTerms: false,
};

/**
 * Segundo paso del registro (datos de la empresa).
 * - onBack(values): vuelve al paso 1 conservando lo escrito.
 */
export default function CompanyRegistrationForm({
  onSubmit, onBack, initialValues, loginHref = '/login',
}) {
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
    if (!isValidRut(values.rut)) e.rut = 'Ingresa un RUT válido';
    if (!values.businessName.trim()) e.businessName = 'Ingresa el nombre o razón social';
    if (!values.businessActivity.trim()) e.businessActivity = 'Ingresa el giro comercial';
    if (values.website.trim() && !isValidUrl(values.website)) e.website = 'Ingresa una URL válida';
    if (values.emails.length === 0) e.emails = 'Agrega al menos un correo';
    if (values.phones.length === 0) e.phones = 'Agrega al menos un teléfono';
    if (!values.acceptedTerms) e.acceptedTerms = 'Debes aceptar los términos y condiciones';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit?.({
        ...values,
        website: normalizeUrl(values.website),
        primaryEmail: values.emails[0],
        primaryPhone: values.phones[0],
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <SectionTitle onBack={() => onBack?.(values)}>Datos de tu empresa</SectionTitle>

      <Stack spacing={2.5}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormField label="RUT de la empresa" htmlFor="companyRut">
            <TextInput id="companyRut" placeholder="76.123.456-7" {...text('rut', formatRut)} />
          </FormField>
          <FormField label="Nombre o razón social" htmlFor="businessName">
            <TextInput id="businessName" placeholder="Ej. Mi Empresa SpA" {...text('businessName')} />
          </FormField>
        </Stack>

        <FormField label="Giro comercial" htmlFor="businessActivity">
          <TextInput
            id="businessActivity"
            placeholder="Ej. Venta de artículos para el hogar"
            {...text('businessActivity')}
          />
        </FormField>

        <FormField label="Sitio web" htmlFor="website" optional>
          <TextInput
            id="website"
            placeholder="https://www.miempresa.cl"
            inputProps={{ inputMode: 'url' }}
            {...text('website')}
          />
        </FormField>

        <FormField label="Dirección del local" htmlFor="storeAddress" optional>
          <TextInput
            id="storeAddress"
            placeholder="Av. República 517, Santiago"
            autoComplete="street-address"
            {...text('storeAddress')}
          />
        </FormField>

        <ItemListInput
          id="companyEmail"
          label="Correos electrónicos"
          items={values.emails}
          onChange={(v) => setField('emails', v)}
          placeholder="nuevo.correo@ejemplo.cl"
          icon={<MailOutlineIcon fontSize="small" />}
          validate={isValidEmail}
          errorMessage="Ingresa un correo válido"
          markFirstAsPrimary
          error={errors.emails}
          inputProps={{ type: 'email' }}
        />

        <ItemListInput
          id="companyPhone"
          label="Teléfonos"
          items={values.phones}
          onChange={(v) => setField('phones', v)}
          placeholder="+56 9 1234 5678"
          icon={<PhoneOutlinedIcon fontSize="small" />}
          validate={isValidPhone}
          normalize={(v) => (v.trim() ? normalizePhone(v) : '')}
          errorMessage="Usa un celular chileno: +56 9 1234 5678"
          markFirstAsPrimary
          error={errors.phones}
          inputProps={{ type: 'tel' }}
        />
      </Stack>

      <Box sx={{ mt: 3, mb: 3 }}>
        <CheckboxField
          label="Acepto los términos y condiciones y la política de privacidad"
          checked={values.acceptedTerms}
          onChange={(v) => setField('acceptedTerms', v)}
          error={errors.acceptedTerms}
        />
      </Box>

      <PrimaryButton type="submit" disabled={submitting}>
        {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
      </PrimaryButton>

      <Typography align="center" sx={{ mt: 3, fontSize: 14, color: colors.text }}>
        ¿Ya tienes cuenta?{' '}
        <Link href={loginHref} underline="always" sx={{ color: colors.link, fontFamily: 'inherit' }}>
          Inicia sesión
        </Link>
      </Typography>
    </Box>
  );
}
