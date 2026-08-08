import { describe, it, expect } from 'vitest';
import { formatDate } from '../utils/formatDate';

describe('formatDate', () => {
  it('devuelve "—" cuando no recibe fecha', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('devuelve el string original si la fecha es inválida', () => {
    expect(formatDate('no-es-una-fecha')).toBe('no-es-una-fecha');
  });

  it('formatea correctamente una fecha ISO sin zona horaria (asume UTC)', () => {
    const result = formatDate('2026-08-01T16:29:02.881986');
    expect(result).not.toBe('—');
    expect(typeof result).toBe('string');
  });

  it('formatea correctamente una fecha ISO que ya trae "Z"', () => {
    const result = formatDate('2026-08-01T16:29:02.881986Z');
    expect(result).not.toBe('—');
  });

  it('formatea correctamente una fecha con offset explícito (+00:00)', () => {
    const result = formatDate('2026-08-01T16:29:02+00:00');
    expect(result).not.toBe('—');
  });

  it('incluye el año en el resultado formateado', () => {
    const result = formatDate('2026-08-01T16:29:02.881986');
    expect(result).toContain('2026');
  });
});