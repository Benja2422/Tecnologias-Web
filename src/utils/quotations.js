// Reglas de las cotizaciones de productos (lado cliente). Los precios incluyen IVA (19 %).
import { IVA_RATE } from './cart';

export const QUOTE_VALID_DAYS = 15; // vigencia fija desde que se solicita
export const QUOTE_DELETE_DAYS = 45; // la cotización se elimina a los 45 días de creada
export const QUOTE_MESSAGE_MAX = 256;
export const QUOTE_ADJUST_RATE = 0.1; // reajuste semanal de precios de una cotización expirada (simulado)

// Estados que se muestran. "Expirada" se deduce de la fecha: no se guarda.
export const QUOTE_STATUSES = ['Solicitada', 'Respondida', 'Aceptada', 'Rechazada', 'Expirada'];

export const QUOTE_STATUS_LABEL = {
  Solicitada: 'Solicitada',
  Respondida: 'Respondida',
  Aceptada: 'Aceptada por el cliente',
  Rechazada: 'Rechazada',
  Expirada: 'Expirada',
};

const DAY = 24 * 60 * 60 * 1000;
const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const addDays = (d, n) => { const x = startOfDay(d); x.setDate(x.getDate() + n); return x; };
const diffDays = (a, b) => Math.round((startOfDay(a) - startOfDay(b)) / DAY);

const two = (n) => String(n).padStart(2, '0');
/** 18/11 */
export const formatDM = (d) => { const x = new Date(d); return `${two(x.getDate())}/${two(x.getMonth() + 1)}`; };
/** 18/11/2026 */
export const formatDMY = (d) => { const x = new Date(d); return `${formatDM(x)}/${x.getFullYear()}`; };
const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
/** 18 nov 2026 */
export const formatDayMonthYear = (d) => { const x = new Date(d); return `${x.getDate()} ${MONTHS[x.getMonth()]} ${x.getFullYear()}`; };

/** Último día en que se puede aceptar. */
export const validUntil = (q) => addDays(q.createdAt, QUOTE_VALID_DAYS);
/** Día en que se elimina. */
export const deleteOn = (q) => addDays(q.createdAt, QUOTE_DELETE_DAYS);
/** Días que faltan para el vencimiento (0 = vence hoy). */
export const daysLeft = (q, now = new Date()) => diffDays(validUntil(q), now);
/** Una cotización ya eliminada (45 días) no se muestra. */
export const isPurged = (q, now = new Date()) => diffDays(now, q.createdAt) >= QUOTE_DELETE_DAYS;

/** Estado visible: una cotización Solicitada o Respondida pasa a Expirada cuando termina su vigencia. */
export function effectiveStatus(q, now = new Date()) {
  if ((q.status === 'Solicitada' || q.status === 'Respondida') && daysLeft(q, now) < 0) return 'Expirada';
  return q.status;
}

/** Semanas completas desde el vencimiento (cada semana se reajustan los precios). */
export const weeksSinceExpiry = (q, now = new Date()) => Math.max(0, Math.floor(-daysLeft(q, now) / 7));

/** Fecha del último reajuste de precios de una cotización expirada. */
export const lastAdjustment = (q, now = new Date()) => addDays(validUntil(q), 7 * weeksSinceExpiry(q, now));

/** Precio unitario vigente de una línea: el cotizado, o el reajustado si la cotización expiró. */
export function currentUnitPrice(q, item, now = new Date()) {
  if (effectiveStatus(q, now) !== 'Expirada') return item.unitPrice;
  if (item.currentPrice) return item.currentPrice;
  return Math.round(item.unitPrice * (1 + QUOTE_ADJUST_RATE * weeksSinceExpiry(q, now)));
}

/** Líneas con el precio que corresponde mostrar (cotizado o actualizado) y su subtotal. */
export function quoteLines(q, now = new Date()) {
  return q.items.map((it) => {
    const unitPrice = currentUnitPrice(q, it, now);
    return { ...it, quotedPrice: it.unitPrice, unitPrice, adjusted: unitPrice !== it.unitPrice, subtotal: unitPrice * it.quantity };
  });
}

/** Totales con IVA incluido: neto = total / 1,19 (309.400 → neto 260.000, IVA 49.400). */
export function quoteTotals(lines) {
  const total = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const neto = Math.floor(total / (1 + IVA_RATE));
  return { neto, iva: total - neto, total };
}

export const getQuoteTotals = (q, now = new Date()) => quoteTotals(quoteLines(q, now));

/** Líneas con más unidades que el stock (solo es una advertencia: se puede cotizar igual). */
export const stockIssues = (items) => items.filter((it) => typeof it.stock === 'number' && it.quantity > it.stock);

/** Texto de vigencia de la tabla: "Vence el 22/11", "Vence en 10 días", "Venció el 04/11". */
export function describeValidity(q, now = new Date()) {
  const status = effectiveStatus(q, now);
  if (status === 'Expirada') return { text: `Venció el ${formatDM(validUntil(q))}`, note: `Se elimina el ${formatDM(deleteOn(q))}`, urgent: false };
  const left = daysLeft(q, now);
  if ((status === 'Solicitada' || status === 'Respondida') && left <= 3) return { text: `Vence el ${formatDM(validUntil(q))}`, urgent: true };
  if (status === 'Solicitada' || status === 'Respondida') {
    if (left <= 10) return { text: `Vence en ${left} ${left === 1 ? 'día' : 'días'}`, urgent: false };
  }
  return { text: `Vence el ${formatDM(validUntil(q))}`, urgent: false };
}

/** Resumen de productos de la tabla: nombre del primero y "+N más" / "1 producto". */
export function describeProducts(q) {
  const [first, ...rest] = q.items;
  return { name: first?.name ?? '', more: rest.length ? `+${rest.length} más` : '1 producto' };
}

export const nextQuoteId = (quotes) => {
  const max = quotes.reduce((m, q) => Math.max(m, Number(q.id.replace(/\D/g, '')) || 0), 0);
  return `COT-${String(max + 1).padStart(5, '0')}`;
};

/** Convierte las líneas de una cotización en líneas de compra (precio fijo, sin pasar por el carrito). */
export const quotationToLines = (q, now = new Date()) =>
  quoteLines(q, now).map((l) => ({
    lineId: `${l.productId}:${l.detail ?? ''}`, productId: l.productId, kind: 'producto', name: l.name, image: l.image ?? null,
    detail: l.detail ?? '', unitPrice: l.unitPrice, listPrice: l.listPrice ?? null, quantity: l.quantity, stock: l.stock, seller: q.seller,
  }));
