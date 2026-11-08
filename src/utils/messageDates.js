import { formatShortDate } from './dates';

const two = (n) => String(n).padStart(2, '0');
const DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 86400000);

/** '10:30' */
export const formatClock = (iso) => { const d = new Date(iso); return `${two(d.getHours())}:${two(d.getMinutes())}`; };

/** Hora en la lista de conversaciones: hoy "10:30", ayer "Ayer", esta semana "Lun", antes "15/09". */
export function formatListTime(iso, now = new Date()) {
  const d = new Date(iso);
  const diff = daysBetween(d, now);
  if (diff <= 0) return formatClock(iso);
  if (diff === 1) return 'Ayer';
  if (diff < 7) return DAYS[d.getDay()];
  return `${two(d.getDate())}/${two(d.getMonth() + 1)}`;
}

/** Separador de día dentro de una conversación: "Hoy", "Ayer" o "15 Sep 2026". */
export function formatDayLabel(iso, now = new Date()) {
  const diff = daysBetween(new Date(iso), now);
  if (diff <= 0) return 'Hoy';
  if (diff === 1) return 'Ayer';
  return formatShortDate(iso);
}

/** Clave para agrupar mensajes por día. */
export const dayKey = (iso) => { const d = new Date(iso); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
