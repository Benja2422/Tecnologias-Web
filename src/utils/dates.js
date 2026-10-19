const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

/** Suma días hábiles (lunes a viernes) a una fecha. */
export function addBusinessDays(date, days) {
  const d = new Date(date);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() !== 0 && d.getDay() !== 6) left -= 1;
  }
  return d;
}

/** '25 - 28 de Septiembre, 2026' (o '30 de Septiembre - 2 de Octubre, 2026' si cambia de mes). */
export function formatDateRange(from, to) {
  const a = new Date(from);
  const b = new Date(to);
  if (a.toDateString() === b.toDateString()) return `${a.getDate()} de ${MONTHS[a.getMonth()]}, ${a.getFullYear()}`;
  if (a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()) {
    return `${a.getDate()} - ${b.getDate()} de ${MONTHS[b.getMonth()]}, ${b.getFullYear()}`;
  }
  const year = a.getFullYear() === b.getFullYear() ? '' : ` ${a.getFullYear()}`;
  return `${a.getDate()} de ${MONTHS[a.getMonth()]}${year} - ${b.getDate()} de ${MONTHS[b.getMonth()]}, ${b.getFullYear()}`;
}
