import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../../styles/Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  hideLabel?: boolean;
}

export default function Input({
  label,
  error,
  icon,
  hideLabel = false,
  id,
  type,
  className = '',
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="input-group">
      <label
        htmlFor={inputId}
        className={hideLabel ? 'input-group__label--hidden' : 'input-group__label'}
      >
        {label}
      </label>
      <div className="input-group__wrapper">
        {icon && <span className="input-group__icon">{icon}</span>}
        <input
          id={inputId}
          type={resolvedType}
          className={`input-group__field ${isPassword ? 'input-group__field--with-toggle' : ''} ${
            error ? 'input-group__field--error' : ''
          } ${className}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="input-group__toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="input-group__error">{error}</p>}
    </div>
  );
}