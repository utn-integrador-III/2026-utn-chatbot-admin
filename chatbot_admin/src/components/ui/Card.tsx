import type { ReactNode } from 'react';
import '../../styles/Card.css';

export default function Card({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`card card--padded ${className}`}>{children}</div>;
}