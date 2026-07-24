import type { InputHTMLAttributes, ReactNode } from 'react';
import { useId } from 'react';
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
  className = '',
  ...rest
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

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
          className={`input-group__field ${error ? 'input-group__field--error' : ''} ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="input-group__error">{error}</p>}
    </div>
  );
}