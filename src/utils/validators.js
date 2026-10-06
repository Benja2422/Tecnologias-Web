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

// ---------- Fecha DD/MM/AAAA ----------
export const formatDate = (v = '') => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
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