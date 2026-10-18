const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });

export const formatPrice = (value) => clp.format(value);

export const getInitials = (name = '') =>
  name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? '').join('');

export const discountPercent = (price, originalPrice) =>
  originalPrice && originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

const MONTHS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

/** '2026-01-14' → '14 Ene 2026' */
export const formatShortDate = (iso = '') => {
  const [y, m, d] = iso.split('-').map(Number);
  return y && m && d ? `${String(d).padStart(2, '0')} ${MONTHS[m - 1]} ${y}` : '';
};
