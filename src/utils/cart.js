// Reglas del carrito y del pedido. Los precios incluyen IVA (19 %).
export const IVA_RATE = 0.19;

export const DEFAULT_SELLER = { id: 'techstore', name: 'TechStore' };

export const SHIPPING_METHODS = [
  { id: 'estandar', name: 'Envío estándar', price: 3990, eta: '3-5 días hábiles', minDays: 3, maxDays: 5 },
  { id: 'express', name: 'Envío express', price: 7990, eta: '1-2 días hábiles', minDays: 1, maxDays: 2 },
  { id: 'retiro', name: 'Retiro en tienda', price: 0, eta: 'Disponible en 24 horas', minDays: 1, maxDays: 1 },
];

export const getShippingMethod = (id) => SHIPPING_METHODS.find((m) => m.id === id) ?? SHIPPING_METHODS[0];

/**
 * Convierte un producto, una tarjeta del listado o un servicio en una línea de carrito.
 * variant: { id, label, stock } (p. ej. el color elegido).
 */
export function toCartLine(item, { quantity = 1, variant = null, image } = {}) {
  const kind = item.kind ?? 'producto';
  return {
    lineId: variant ? `${item.id}:${variant.id}` : item.id,
    productId: item.id,
    kind,
    name: item.name,
    image: image ?? item.image ?? item.images?.[0]?.src ?? null,
    detail: variant ? `Color: ${variant.label}` : (item.detail ?? ''),
    unitPrice: item.price,
    quantity,
    maxQuantity: variant ? variant.stock : (item.stock ?? 99),
    seller: item.seller ?? DEFAULT_SELLER,
    href: kind === 'producto' ? `/producto/${item.id}` : null,
  };
}

export const lineTotal = (line) => line.unitPrice * line.quantity;
export const sumLines = (lines) => lines.reduce((sum, l) => sum + lineTotal(l), 0);

/** [{ seller, items, subtotal }] en el orden en que aparece cada vendedor. */
export function groupBySeller(items) {
  const groups = new Map();
  items.forEach((line) => {
    if (!groups.has(line.seller.id)) groups.set(line.seller.id, { seller: line.seller, items: [] });
    groups.get(line.seller.id).items.push(line);
  });
  return [...groups.values()].map((g) => ({ ...g, subtotal: sumLines(g.items) }));
}

/** Un pedido con solo servicios no se despacha: no lleva método de envío. */
export const needsShipping = (lines) => lines.some((l) => l.kind === 'producto');

/** Totales con IVA incluido: neto = total / 1,19 y IVA = lo que falta para el total. */
export function calcTotals(lines, shippingMethod) {
  const subtotal = sumLines(lines);
  const shipping = shippingMethod ? shippingMethod.price : 0;
  const total = subtotal + shipping;
  const neto = Math.floor(total / (1 + IVA_RATE)); // coincide con el diseño: 279.960 → neto 235.260, IVA 44.700
  return { subtotal, shipping, neto, iva: total - neto, total };
}
