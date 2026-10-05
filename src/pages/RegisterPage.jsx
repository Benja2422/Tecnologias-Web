import AuthLayout from '../components/templates/AuthLayout';
import RegistrationForm from '../components/organisms/RegistrationForm';

export default function RegisterPage() {
  const handleSubmit = async (data) => {
    // TODO: conectar con el servicio (src/services) cuando exista el backend
    console.log('Datos de registro:', data);
  };

  return (
    <AuthLayout title="Registro de Usuario" subtitle="Completa tus datos para crear tu cuenta">
      <RegistrationForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
