import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import ProfileSection from '../molecules/ProfileSection';
import FormField from '../molecules/FormField';
import TextInput from '../atoms/TextInput';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';

const buttonSx = { height: 44, px: 3, py: 0, fontSize: 15 };

export default function PersonalInfoSection({ fullName, rut, onSave }) {
  const [name, setName] = useState(fullName);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const discard = () => { setName(fullName); setError(''); };

  const save = async (e) => {
    e.preventDefault();
    if (!name.trim()) return setError('Ingresa tu nombre completo');
    setSaving(true);
    try {
      await onSave?.({ fullName: name.trim() });
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProfileSection icon={<PersonOutlineIcon />} title="Información Personal" divider={false}>
      <Box component="form" onSubmit={save} noValidate>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          <FormField label="Nombre completo" htmlFor="fullName">
            <TextInput
              id="fullName"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              error={error}
              autoComplete="name"
            />
          </FormField>
          <FormField label="Nº / Documento de identidad" htmlFor="documentId">
            <TextInput
              id="documentId"
              value={rut}
              disabled
              sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F2F2F2' }, '& .Mui-disabled': { WebkitTextFillColor: '#9A9A9A' } }}
            />
          </FormField>
        </Stack>
        <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
          <SecondaryButton pill onClick={discard} sx={buttonSx}>Descartar cambios</SecondaryButton>
          <PrimaryButton type="submit" fullWidth={false} disabled={saving} sx={buttonSx}>
            Actualizar datos
          </PrimaryButton>
        </Stack>
      </Box>
    </ProfileSection>
  );
}
