import type { ButtonHTMLAttributes, ReactNode } from 'react';
import '../../styles/Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'ghost' | 'danger';
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  disabled,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`btn btn--${variant} ${className}`}
      {...rest}
    >
      {isLoading ? 'Cargando...' : children}
    </button>
  );
}