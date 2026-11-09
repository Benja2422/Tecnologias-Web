import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useCheckout } from '../contexts/CheckoutContext';
import { useSeller } from '../contexts/SellerContext';
import { IVA_RATE } from '../utils/cart';
import { platformOrders } from '../utils/mockPlatformOrders';
import { applyOrderOverride, getOrdersAdminState, patchOrder, statusFromTimeline, subscribeOrdersAdmin, timelineFor } from '../utils/ordersAdmin';
import { SELLER, SHIPPING_METHODS } from '../utils/seller';
import { mockProfile } from '../utils/mockProfile';

const taxes = (total) => { const neto = Math.floor(total / (1 + IVA_RATE)); return { neto, iva: total - neto }; };
const addressText = (a) => (a ? [[a.street, a.number].filter(Boolean).join(' '), a.commune, a.region].filter(Boolean).join(', ') : null);
const stamp = (reason, note) => ({ reason, note: (note ?? '').trim(), at: new Date().toISOString() });

/** "Tarjeta ···· 3456" · "Transferencia (TRF-…)" */
export function paymentLabel(p) {
  if (!p) return '—';
  return p.method === 'transferencia' ? `Transferencia${p.code ? ` (${p.code})` : ''}` : `Tarjeta ···· ${p.last4 ?? '••••'}`;
}

// Los pedidos del panel de ejemplo no guardan el medio de pago: se asigna uno fijo por pedido
const panelPayment = (id) => {
  const n = Number(id.replace(/\D/g, '')) || 0;
  return n % 3 === 0 ? { method: 'transferencia', code: `TRF-2026-${String(n).padStart(5, '0')}` } : { method: 'tarjeta', last4: String(1000 + ((n * 7919) % 9000)) };
};

/**
 * Todos los pedidos de la plataforma con un formato común para el administrador:
 * { key, source: 'cliente' | 'panel' | 'plataforma', id, createdAt, buyer, seller, items: [{ name, quantity, unitPrice, kind }],
 *   subtotal, shippingName, shippingCost, total, neto, iva, payment, address, carrier, tracking, needsShipping,
 *   status: Recibido | En preparación | Enviado | Entregado | Anulado, cancelled, returns: [{ id, product, reason, status, amount, at }], refunded }
 * Acciones: setStatus, setShipping({ carrier, tracking }), cancel(reason, note), restore.
 */
export function useAdminOrders() {
  const { orders: buyerOrders } = useCheckout();
  const { orders: panelOrders, returns: panelReturns, profile, setOrderStatus, setOrderShipping, cancelOrder } = useSeller();
  const adminChanges = useSyncExternalStore(subscribeOrdersAdmin, getOrdersAdminState, getOrdersAdminState);
  const panelSeller = profile?.company?.name || SELLER.name;

  const rows = useMemo(() => {
    const finish = (r) => {
      const total = r.subtotal + r.shippingCost;
      const refunded = r.returns.filter((d) => d.status === 'Aceptada').reduce((s, d) => s + d.amount, 0);
      return { ...r, total, ...taxes(total), refunded, needsShipping: r.items.some((i) => i.kind !== 'servicio') };
    };

    const fromBuyer = buyerOrders.map((o) => finish({
      key: `c:${o.id}`, source: 'cliente', id: o.id, createdAt: o.createdAt, buyer: o.recipient ?? mockProfile.fullName, seller: o.seller?.name ?? '—',
      items: o.items.map((i) => ({ name: i.name, detail: i.detail, quantity: i.quantity, unitPrice: i.unitPrice, kind: i.kind ?? 'producto' })),
      subtotal: o.totals?.subtotal ?? o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
      shippingName: o.shipping?.name ?? null, shippingCost: o.totals?.shipping ?? o.shipping?.price ?? 0,
      payment: o.payment, address: addressText(o.address), carrier: o.carrier ?? null, tracking: o.tracking ?? null,
      status: statusFromTimeline(o), cancelled: o.cancelled ?? (o.status === 'cancelado' ? { reason: 'Cancelado', note: '', at: o.createdAt } : null),
      timeline: o.timeline ?? {}, returns: [],
    }));

    const fromPanel = panelOrders.map((o) => {
      const returns = panelReturns.filter((d) => d.orderId === o.id).map((d) => {
        const it = o.items.find((i) => i.name === d.product);
        return { id: d.id, product: d.product, reason: d.reason, status: d.status, amount: it ? it.unitPrice * it.quantity : 0, at: d.resolution?.at ?? d.createdAt };
      });
      return finish({
        key: `v:${o.id}`, source: 'panel', id: o.id, createdAt: o.createdAt, buyer: o.buyer.name, buyerType: o.buyer.type, seller: panelSeller,
        items: o.items.map((i) => ({ name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, kind: i.kind })),
        subtotal: o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
        shippingName: o.shipping ? SHIPPING_METHODS.find((m) => m.id === o.shipping.method)?.name ?? null : null, shippingCost: o.shipping?.cost ?? 0,
        payment: panelPayment(o.id), address: addressText(o.address), carrier: o.shipping?.carrier ?? null, tracking: o.shipping?.tracking ?? null,
        status: o.cancelled ? 'Anulado' : o.status, cancelled: o.cancelled ?? null, raw: o, returns,
      });
    });

    const fromPlatform = platformOrders.map((base) => {
      const o = applyOrderOverride(`x:${base.id}`, base);
      return finish({
        key: `x:${o.id}`, source: 'plataforma', id: o.id, createdAt: o.createdAt, buyer: o.buyer, seller: o.seller, items: o.items,
        subtotal: o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), shippingName: o.shippingName, shippingCost: o.shippingCost,
        payment: o.payment, address: o.address, carrier: o.carrier, tracking: o.tracking,
        status: o.cancelled ? 'Anulado' : statusFromTimeline(o), cancelled: o.cancelled ?? null, timeline: o.timeline, returns: o.returns,
      });
    });

    return [...fromBuyer, ...fromPanel, ...fromPlatform]
      .map((r) => (r.cancelled ? { ...r, status: 'Anulado' } : r))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [buyerOrders, panelOrders, panelReturns, panelSeller, adminChanges]); // eslint-disable-line react-hooks/exhaustive-deps

  const setStatus = useCallback((row, status) => {
    if (row.source === 'panel') setOrderStatus(row.id, status);
    else patchOrder(row.key, { timeline: timelineFor(status, row.timeline) });
  }, [setOrderStatus]);

  const setShipping = useCallback((row, { carrier, tracking }) => {
    if (row.source === 'panel') setOrderShipping(row.id, { method: row.raw.shipping?.method ?? 'estandar', cost: row.raw.shipping?.cost ?? 0, ...row.raw.shipping, carrier, tracking });
    else patchOrder(row.key, { carrier, tracking });
  }, [setOrderShipping]);

  const cancel = useCallback((row, reason, note) => {
    if (row.source === 'panel') cancelOrder(row.id, stamp(reason, note));
    else patchOrder(row.key, { cancelled: stamp(reason, note) });
  }, [cancelOrder]);

  const restore = useCallback((row) => {
    if (row.source === 'panel') cancelOrder(row.id, null);
    else patchOrder(row.key, { cancelled: null });
  }, [cancelOrder]);

  return { rows, setStatus, setShipping, cancel, restore };
}
