// Estados y seguimiento de un pedido.
export const ORDER_STATUSES = ['Pendiente', 'Preparando', 'Enviado', 'Entregado', 'Cancelado'];

// Hitos del seguimiento, en orden. Cada pedido guarda la fecha de los que ya ocurrieron en `timeline`.
export const TRACKING_STEPS = [
  { key: 'confirmado', label: 'Confirmado' },
  { key: 'preparando', label: 'Preparando' },
  { key: 'enviado', label: 'Enviado' },
  { key: 'entregado', label: 'Entregado' },
];

/** Estado que se muestra según los hitos cumplidos (un pedido recién hecho está "Pendiente"). */
export function getOrderStatus(order) {
  if (order.status === 'cancelado') return 'Cancelado';
  const done = TRACKING_STEPS.filter((s) => order.timeline?.[s.key]).length;
  return ['Pendiente', 'Pendiente', 'Preparando', 'Enviado', 'Entregado'][done] ?? 'Pendiente';
}

export const countProducts = (order) => order.items.length;
