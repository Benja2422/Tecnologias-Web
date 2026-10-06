import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/templates/AuthLayout';
import RegistrationForm from '../components/organisms/RegistrationForm';
import CompanyRegistrationForm from '../components/organisms/CompanyRegistrationForm';

const STEP = { USER: 'user', COMPANY: 'company' };

export default function RegisterPage() {
  const [step, setStep] = useState(STEP.USER);
  const [userData, setUserData] = useState(null);
  const [companyDraft, setCompanyDraft] = useState(null);
  const navigate = useNavigate();

  const register = async (payload) => {
    // TODO: conectar con src/services cuando exista el backend
    console.log('[Registro] Registro completo:', payload);
    navigate('/login');
  };

  // Paso 1: si quiere vender pasa a datos de empresa; si no, termina el registro
  const handleUserSubmit = async (data) => {
    console.log('[Registro] Datos de usuario (paso 1):', data);
    setUserData(data);
    if (data.wantsToSell) {
      setStep(STEP.COMPANY);
      window.scrollTo({ top: 0 });
    } else {
      await register({ user: data });
    }
  };

  // Volver al paso 1 sin perder lo escrito en la empresa
  const handleBack = (draft) => {
    setCompanyDraft(draft);
    setStep(STEP.USER);
    window.scrollTo({ top: 0 });
  };

  if (step === STEP.COMPANY) {
    return (
      <AuthLayout
        title="Registro de Empresa"
        subtitle="Completa los datos de tu empresa para crear tu cuenta"
        topSpacing={6}
      >
        <CompanyRegistrationForm
          initialValues={companyDraft}
          onBack={handleBack}
          onSubmit={(company) => register({ user: userData, company })}
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Registro de Usuario" subtitle="Completa tus datos para crear tu cuenta">
      <RegistrationForm
        // confirmPassword no viaja en el payload; se repone al volver desde el paso 2
        initialValues={userData && { ...userData, confirmPassword: userData.password }}
        onSubmit={handleUserSubmit}
      />
    </AuthLayout>
  );
}
