import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import NovaMark from '../components/ui/NovaMark';
import chatbotLogo from '../assets/images/chabotLogo1.png';
import { useAuth } from '../hooks/useAuth';
import '../styles/login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Completa usuario y contraseña.');
      return;
    }

    setIsLoading(true);
    try {
      const loggedInUser = await login({ identifier, password });
      navigate(loggedInUser.role === 'super_admin' ? '/register' : '/admin');
    } catch (err) {
      if (err && typeof err === 'object' && 'response' in err) {
         const axiosErr = err as { response?: { data?: { error?: string }; status?: number } };
      if (axiosErr.response?.status === 401) {
         setError('Usuario o contraseña incorrectos. Verifica tus datos.');
      } else if (axiosErr.response?.status === 400) {
        setError('Completa correctamente todos los campos.');
      } else {
        setError(axiosErr.response?.data?.error ?? 'Ocurrió un error al iniciar sesión.');
      }
      } else {
        setError('No se pudo conectar con el servidor.');
      }
    }
  }

  return (
    <AuthLayout subtitle="Acceso administrativo">
      <Card>
        <div className="login-header">
          <NovaMark />
        </div>
        <h1 className="login-title">¡Bienvenido de nuevo!</h1>
        <p className="login-subtitle">
          Gestiona la información con la que NOVA responde a tus estudiantes.
        </p>

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <Input
            label="Usuario o correo"
            hideLabel
            type="text"
            icon={<User size={16} color="white" />}
            placeholder="Usuario o correo institucional"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Contraseña"
            hideLabel
            type="password"
            icon={<Lock size={16} color="white" />}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <p className="login-error">{error}</p>}

          <div className="login-forgot">
            <Link to="#">¿Olvidaste tu contraseña?</Link>
          </div>

          <Button type="submit" isLoading={isLoading}>
            Iniciar sesión
          </Button>
        </form>

        <div className="login-bottom-mark">
          <span>N</span>
          <img src={chatbotLogo} alt="O" />
          <span>VA</span>
        </div>
      </Card>
    </AuthLayout>
  );
}