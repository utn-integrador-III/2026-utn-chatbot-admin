export function formatDate(raw?: string): string {
  if (!raw) return '—';

  // Si el string no trae indicador de zona horaria (Z o +hh:mm),
  // el backend lo está mandando en UTC "desnudo" — se lo agregamos
  // para que el navegador lo convierta correctamente a hora local.
  const hasTimezone = /Z$|[+-]\d{2}:\d{2}$/.test(raw);
  const isoString = hasTimezone ? raw : `${raw}Z`;

  const date = new Date(isoString);
  if (isNaN(date.getTime())) return raw;

  return date.toLocaleString('es-CR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}