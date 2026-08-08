import { describe, it, expect } from 'vitest';
import { formatDate } from '../utils/formatDate';

describe('formatDate', () => {
  it('devuelve "—" cuando no recibe fecha', () => {
    expect(formatDate(undefined)).toBe('—');
  });

  it('devuelve el string original si la fecha es inválida', () => {
    expect(formatDate('no-es-una-fecha')).toBe('no-es-una-fecha');
  });

  it('formatea una fecha ISO válida sin lanzar error', () => {
    const result = formatDate('2026-08-01T16:29:02.881986');
    expect(result).not.toBe('—');
    expect(typeof result).toBe('string');
  });
});