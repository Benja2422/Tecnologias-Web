import { useNavigate } from 'react-router-dom';
import AuthLayout from '../components/templates/AuthLayout';
import LoginForm from '../components/organisms/LoginForm';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    // TODO: conectar con src/services. Si falla, lanza un Error con el mensaje
    // para que LoginForm lo muestre (ej. throw new Error('RUT o contraseña incorrectos'))
    console.log('[Login] Inicio de sesión:', data);
    navigate('/');
  };

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Ingresa tus datos para acceder a tu cuenta"
      topSpacing={12}
    >
      <LoginForm onSubmit={handleSubmit} />
    </AuthLayout>
  );
}
