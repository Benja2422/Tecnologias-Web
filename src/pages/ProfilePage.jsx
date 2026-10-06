import { useState } from 'react';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import AccountLayout from '../components/templates/AccountLayout';
import PersonalInfoSection from '../components/organisms/PersonalInfoSection';
import ContactListSection from '../components/organisms/ContactListSection';
import SecuritySection from '../components/organisms/SecuritySection';
import { colors } from '../utils/theme';
import { isValidEmail, isValidPhone, normalizePhone } from '../utils/validators';
import { mockProfile } from '../utils/mockProfile';

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockProfile);
  const [toast, setToast] = useState('');

  const update = (patch, message) => {
    // TODO: persistir con src/services
    setProfile((p) => ({ ...p, ...patch }));
    if (message) setToast(message);
  };

  const changePassword = async (data) => {
    // TODO: conectar con src/services. Si falla, lanza un Error con el mensaje a mostrar.
    console.log('Cambiar contraseña:', Object.keys(data));
    setToast('Contraseña actualizada');
  };

  const headerUser = { name: profile.fullName };

  return (
    <AccountLayout headerProps={{ user: headerUser, cartCount: 3 }}>
      <Typography component="h1" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 600, color: colors.text }}>
        Mi perfil
      </Typography>
      <Typography sx={{ mt: 1.5, mb: 5, fontSize: 16, color: colors.muted }}>
        Edita tu información personal
      </Typography>

      <PersonalInfoSection
        key={profile.fullName}
        fullName={profile.fullName}
        rut={profile.rut}
        onSave={(data) => update(data, 'Datos actualizados')}
      />

      <ContactListSection
        title="Correos"
        icon={<MailOutlineIcon />}
        rowIcon={<MailOutlineIcon sx={{ fontSize: 18 }} />}
        items={profile.emails}
        onChange={(emails) => update({ emails })}
        typeOptions={['Personal', 'Trabajo', 'Otro']}
        addLabel="Agregar correo"
        valueLabel="Correo electrónico"
        placeholder="nuevo.correo@ejemplo.cl"
        validate={isValidEmail}
        errorMessage="Ingresa un correo válido"
        inputProps={{ type: 'email' }}
      />

      <ContactListSection
        title="Teléfonos"
        icon={<PhoneOutlinedIcon />}
        rowIcon={<PhoneOutlinedIcon sx={{ fontSize: 18 }} />}
        items={profile.phones}
        onChange={(phones) => update({ phones })}
        typeOptions={['Móvil', 'Trabajo', 'Fijo', 'Otro']}
        addLabel="Agregar teléfono"
        valueLabel="Teléfono"
        placeholder="+56 9 1234 5678"
        validate={isValidPhone}
        normalize={(v) => (v.trim() ? normalizePhone(v) : '')}
        errorMessage="Usa un número chileno: +56 9 1234 5678"
        inputProps={{ type: 'tel' }}
      />

      <SecuritySection onSubmit={changePassword} />

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AccountLayout>
  );
}
