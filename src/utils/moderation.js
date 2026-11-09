// Reglas y textos del panel de moderación del administrador.

/** Motivos para ocultar contenido. */
export const HIDE_REASONS = [
  'Spam o publicidad externa',
  'Lenguaje ofensivo o acoso',
  'Datos personales o de contacto',
  'Intento de pago fuera de la plataforma',
  'Información falsa o engañosa',
  'Otro motivo',
].map((r) => ({ id: r, name: r }));

/** "2 d 6 h" · "5 h" · "12 min" */
export function elapsed(iso, now = new Date()) {
  const mins = Math.max(0, Math.floor((now - new Date(iso)) / 60000));
  if (mins < 60) return `${Math.max(1, mins)} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.floor(hours / 24);
  return hours % 24 ? `${days} d ${hours % 24} h` : `${days} d`;
}

export const STATUS_TONE = { Alerta: 'red', 'Sin responder': 'yellow', 'Esperando respuesta': 'yellow', Respondida: 'green', 'Al día': 'green' };
