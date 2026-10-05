import AuthLayout from '../components/templates/AuthLayout';
import LoginForm from '../components/organisms/LoginForm';

export default function LoginPage() {
  const handleSubmit = async (data) => {
    // TODO: conectar con src/services. Si falla, lanza un Error con el mensaje
    // para que LoginForm lo muestre (ej. throw new Error('RUT o contraseña incorrectos'))
    console.log('Datos de login:', data);
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Ingresa tus datos para acceder a tu cuenta"
    >
      <LoginForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
