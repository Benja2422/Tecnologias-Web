// Cambios del administrador sobre pedidos que no pertenecen al panel de emprendedor: compras del cliente
// (CheckoutContext, clave "c:<id>") y pedidos de otras tiendas (utils/mockPlatformOrders, clave "x:<id>").
// Los del panel de emprendedor se cambian en SellerContext. Se guarda en el navegador hasta que exista el backend.
import { getOrderStatus } from './orders';

const STORAGE_KEY = 'todomart.ordersAdmin';

/** Estados del enunciado (iguales a los del panel de emprendedor) + Anulado. */
export const ADMIN_ORDER_STATUSES = ['Recibido', 'En preparación', 'Enviado', 'Entregado'];
export const ORDER_STATUS_TONE = { Recibido: 'blue', 'En preparación': 'orange', Enviado: 'red', Entregado: 'green', Anulado: 'grey' };
export const PERIODS = [{ id: '7', name: 'Últimos 7 días' }, { id: '30', name: 'Últimos 30 días' }, { id: '90', name: 'Últimos 90 días' }, { id: 'todo', name: 'Todo el historial' }];
/** ¿La fecha cae en el período elegido ('7' | '30' | '90' | 'todo')? */
export const inPeriod = (iso, period, now = new Date()) => period === 'todo' || now - new Date(iso) <= Number(period) * 86400000;
const STEPS = ['confirmado', 'preparando', 'enviado', 'entregado'];
const FROM_BUYER_STATUS = { Pendiente: 'Recibido', Preparando: 'En preparación', Enviado: 'Enviado', Entregado: 'Entregado', Cancelado: 'Anulado' };

/** Estado (del enunciado) de un pedido que guarda sus hitos en `timeline`. */
export const statusFromTimeline = (order) => FROM_BUYER_STATUS[getOrderStatus(order)] ?? 'Recibido';

/** Hitos para dejar el pedido en `status`: conserva las fechas que ya tenía, completa con ahora y quita los posteriores. */
export function timelineFor(status, prev = {}) {
  const upTo = ADMIN_ORDER_STATUSES.indexOf(status);
  const now = new Date().toISOString();
  return Object.fromEntries(STEPS.slice(0, upTo + 1).map((k) => [k, prev[k] ?? now]));
}

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) return saved;
  } catch { /* sin almacenamiento o datos dañados */ }
  return {};
};

let state = load();
const listeners = new Set();
export const subscribeOrdersAdmin = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getOrdersAdminState = () => state;

/** patch: { timeline?, carrier?, tracking?, cancelled? (null para quitar) } */
export function patchOrder(key, patch) {
  state = { ...state, [key]: { ...state[key], ...patch } };
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* sin almacenamiento */ }
  listeners.forEach((l) => l());
}

/** El pedido con los cambios del administrador (un pedido anulado queda con status 'cancelado'). */
export function applyOrderOverride(key, order) {
  const o = state[key];
  if (!o) return order;
  const next = { ...order, ...o };
  if (o.cancelled) next.status = 'cancelado';
  else if (order.status === 'cancelado' && o.cancelled === null) next.status = 'activo';
  return next;
}
