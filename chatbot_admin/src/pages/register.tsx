import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import AuthLayout from '../components/layout/AuthLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import NovaMark from '../components/ui/NovaMark';
import chatbotLogo from '../assets/images/chabotLogo1.png';
import { useAuth } from '../hooks/useAuth';
import '../styles/register.css';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Completa todos los campos.');
      return;
    }
    if (!email.endsWith('@utn.ac.cr')) {
      setError('Usa tu correo institucional (@utn.ac.cr).');
      return;
    }
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);
    try {
      await register({ name, email, password, confirmPassword });
      navigate('/upload-archive');
    } catch {
      setError('No se pudo crear la cuenta. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout cardPosition="left" subtitle="Registro administrativo">
      <Card>
        <div className="register-header">
          <NovaMark />
        </div>
        <h1 className="register-title">¡Bienvenido!</h1>
        <p className="register-subtitle">
          Crea tu cuenta administrativa para gestionar el conocimiento de NOVA.
        </p>

        <form onSubmit={handleSubmit} className="register-form" noValidate>
          <Input
            label="Nombre completo"
            hideLabel
            type="text"
            icon={<User size={16} color="white" />}
            placeholder="Nombre y apellidos"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          <Input
            label="Correo institucional"
            hideLabel
            type="email"
            icon={<Mail size={16} color="white" />}
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
            autoComplete="new-password"
          />
          <Input
            label="Confirmar contraseña"
            hideLabel
            type="password"
            icon={<Lock size={16} color="white" />}
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          {error && <p className="register-error">{error}</p>}

          <Button type="submit" isLoading={isLoading}>
            Registrarme
          </Button>
        </form>

        <p className="register-footer">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>

        <div className="register-bottom-mark">
          <span>N</span>
          <img src={chatbotLogo} alt="O" />
          <span>VA</span>
        </div>
      </Card>
    </AuthLayout>
  );
}