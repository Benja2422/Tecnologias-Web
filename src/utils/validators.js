// ---------- RUT ----------
export const cleanRut = (v = '') => v.replace(/[^0-9kK]/g, '').toUpperCase();

export const formatRut = (v = '') => {
  const c = cleanRut(v).slice(0, 9);
  if (c.length <= 1) return c;
  const body = c.slice(0, -1).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `${body}-${c.slice(-1)}`;
};

export const isValidRut = (v = '') => {
  const c = cleanRut(v);
  if (c.length < 8) return false;
  const body = c.slice(0, -1);
  const dv = c.slice(-1);
  let sum = 0;
  let mul = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    sum += Number(body[i]) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const res = 11 - (sum % 11);
  const expected = res === 11 ? '0' : res === 10 ? 'K' : String(res);
  return dv === expected;
};

// ---------- Nombre / Apellido ----------
// Solo letras (con tildes y ñ), espacios, apóstrofe y guion. Se descartan números y símbolos.
export const formatName = (v = '') =>
  v
    .replace(/[^\p{L}\p{M}\s'’-]/gu, '')
    .replace(/^\s+/, '')
    .replace(/\s{2,}/g, ' ')
    .slice(0, 50);

export const isValidName = (v = '') => {
  const name = v.trim();
  return /^[\p{L}\p{M}]+(?:[ '’-][\p{L}\p{M}]+)*$/u.test(name) && name.replace(/[^\p{L}]/gu, '').length >= 2;
};

// ---------- Fecha DD/MM/AAAA ----------
const daysInMonth = (month, year) => new Date(year ?? 2000, month, 0).getDate(); // sin año: permite 29/02

// ¿Estos dígitos (DDMMAAAA, posiblemente incompletos) pueden llegar a ser una fecha válida?
const isFeasibleDateDigits = (s) => {
  const n = s.length;
  if (n >= 1 && !/[0-3]/.test(s[0])) return false;
  if (n >= 2) {
    const dd = Number(s.slice(0, 2));
    if (dd < 1 || dd > 31) return false;
  }
  if (n >= 3 && !/[01]/.test(s[2])) return false;
  if (n >= 4) {
    const dd = Number(s.slice(0, 2));
    const mm = Number(s.slice(2, 4));
    if (mm < 1 || mm > 12 || dd > daysInMonth(mm)) return false;
  }
  if (n >= 5) {
    const y = s.slice(4);
    const lowest = Number(y.padEnd(4, '0'));
    const highest = Number(y.padEnd(4, '9'));
    if (lowest > new Date().getFullYear() || highest < 1900) return false;
  }
  if (n === 8) {
    const fmt = `${s.slice(0, 2)}/${s.slice(2, 4)}/${s.slice(4)}`;
    return isValidDate(fmt);
  }
  return true;
};

/**
 * Formatea mientras se escribe: ignora los dígitos que harían imposible la fecha
 * (día > 31, mes > 12, 31/04, 29/02 en año no bisiesto, año futuro, etc.).
 * Si el primer dígito del día o del mes es > 3 / > 1, antepone un 0 (5 → 05).
 */
export const formatDate = (v = '') => {
  let digits = '';
  for (const ch of v.replace(/\D/g, '')) {
    if (digits.length === 8) break;
    if (isFeasibleDateDigits(digits + ch)) {
      digits += ch;
    } else if ((digits.length === 0 || digits.length === 2) && isFeasibleDateDigits(`${digits}0${ch}`)) {
      digits += `0${ch}`;
    }
  }
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

export const isValidDate = (v = '') => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (!m) return false;
  const [, dd, mm, yyyy] = m.map(Number);
  const date = new Date(yyyy, mm - 1, dd);
  return (
    date.getFullYear() === yyyy &&
    date.getMonth() === mm - 1 &&
    date.getDate() === dd &&
    date <= new Date() &&
    yyyy >= 1900
  );
};

export const isAdult = (v = '') => {
  const [dd, mm, yyyy] = v.split('/').map(Number);
  const limit = new Date(yyyy + 18, mm - 1, dd);
  return limit <= new Date();
};

// ---------- Correo / Teléfono / Contraseña ----------
export const isValidEmail = (v = '') => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

export const normalizePhone = (v = '') => {
  const d = v.replace(/\D/g, '');
  const n = d.startsWith('56') ? d : `56${d}`;
  return `+${n.slice(0, 2)} ${n.slice(2, 3)} ${n.slice(3, 7)} ${n.slice(7, 11)}`.trim();
};

export const isValidPhone = (v = '') => {
  const d = v.replace(/\D/g, '');
  const n = d.startsWith('56') ? d : `56${d}`;
  return /^569\d{8}$/.test(n);
};

export const passwordError = (v = '') => {
  if (v.length < 8) return 'Usa al menos 8 caracteres';
  if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Incluye letras y números';
  return '';
};

export const normalizeUrl = (v = '') => {
  const t = v.trim();
  if (!t) return '';
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
};

export const isValidUrl = (v = '') => {
  try {
    const u = new URL(normalizeUrl(v));
    return /\.[a-z]{2,}$/i.test(u.hostname);
  } catch {
    return false;
  }
};

// Móvil (9 xxxx xxxx) o fijo (ej. 2 xxxx xxxx)
export const isValidChileanPhone = (v = '') => {
  const d = v.replace(/\D/g, '');
  const n = d.startsWith('56') ? d : `56${d}`;
  return /^56[2-9]\d{8}$/.test(n);
};

// Número nacional (sin +56) con formato "9 1234 5678"
export const formatNationalPhone = (v = '') => {
  let d = v.replace(/\D/g, '');
  if (d.startsWith('56') && d.length > 9) d = d.slice(2); // pegaron "+56 9..."
  d = d.slice(0, 9);
  if (d.length <= 1) return d;
  if (d.length <= 5) return `${d[0]} ${d.slice(1)}`;
  return `${d[0]} ${d.slice(1, 5)} ${d.slice(5)}`;
};

export const stripCountryCode = (v = '') => v.replace(/^\+?56\s*/, '');
