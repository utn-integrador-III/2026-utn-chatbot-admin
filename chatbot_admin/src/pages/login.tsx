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
import '../styles/Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Completa usuario y contraseña.');
      return;
    }
    setIsLoading(true);
    try {
      await login({ email, password });
      navigate('/upload-archive');
    } catch {
      setError('Credenciales incorrectas. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout>
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
            label="Correo institucional"
            hideLabel
            type="email"
            icon={<User size={16} color="white" />}
            placeholder="Correo institucional"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
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

        <p className="login-footer">
          ¿No tienes cuenta todavía? <Link to="/register">Regístrate</Link>
        </p>

        <div className="login-bottom-mark">
          <span>N</span>
          <img src={chatbotLogo} alt="O" />
          <span>VA</span>
        </div>
      </Card>
    </AuthLayout>
  );
}