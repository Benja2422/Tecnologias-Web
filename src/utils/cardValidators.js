// Formato y validación de los datos de la tarjeta (el número y el CVV nunca se guardan ni se registran).
export const onlyDigits = (v = '') => v.replace(/\D/g, '');

/** '1234567890123456' → '1234 5678 9012 3456' (máximo 16 dígitos). */
export const formatCardNumber = (v = '') => onlyDigits(v).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ');

export const isValidCardNumber = (v = '') => onlyDigits(v).length === 16;

/** Escribe MM/AA: el primer dígito de mes mayor a 1 se completa con 0 (5 → 05) y un mes mayor a 12 no se acepta. */
export function formatExpiry(v = '') {
  let d = onlyDigits(v).slice(0, 4);
  if (d.length >= 1 && Number(d[0]) > 1) d = `0${d}`.slice(0, 4);
  if (d.length >= 2 && Number(d.slice(0, 2)) > 12) d = d[0] + d.slice(2);
  if (d.length >= 2 && d.slice(0, 2) === '00') d = d[0] + d.slice(2);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
}

/** MM/AA con mes entre 01 y 12 y que no esté vencida (vale hasta el último día del mes). */
export function isValidExpiry(v = '', now = new Date()) {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  if (month < 1 || month > 12) return false;
  return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

export const formatCvv = (v = '') => onlyDigits(v).slice(0, 3);
export const isValidCvv = (v = '') => onlyDigits(v).length === 3;
