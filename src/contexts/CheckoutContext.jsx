import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useCart } from './CartContext';
import { useAddresses } from './AddressesContext';
import { addBusinessDays } from '../utils/dates';
import { calcTotals, getShippingMethod, needsShipping } from '../utils/cart';
import { getPrincipalPhone, mockProfile } from '../utils/mockProfile';
import { seedOrder } from '../utils/mockOrders';

const ORDERS_KEY = 'todomart.orders';
const FIRST_ORDER_NUMBER = 848;

const CheckoutContext = createContext({
  draft: null, orders: [], startDraft: () => {}, updateDraft: () => {}, placeOrder: () => null, getOrder: () => null,
});

const loadOrders = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(ORDERS_KEY));
    if (Array.isArray(saved)) return saved;
  } catch { /* ignorar */ }
  return [];
};

/**
 * Estado del checkout de un vendedor: dirección y método de envío elegidos (borrador) y los pedidos ya confirmados.
 * Se compra de a un vendedor: el borrador guarda a cuál.
 */
export function CheckoutProvider({ children }) {
  const { items, removeSeller } = useCart();
  const { addresses } = useAddresses();
  const [draft, setDraft] = useState(null); // { sellerId, addressId, shippingId }
  const [placed, setPlaced] = useState(loadOrders); // pedidos hechos en esta app (el de ejemplo se suma aparte)
  // Más reciente primero
  const orders = useMemo(() => [...placed].reverse().concat(seedOrder), [placed]);

  const startDraft = useCallback((sellerId) => {
    const principal = addresses.find((a) => a.isPrincipal) ?? addresses[0];
    setDraft({ sellerId, addressId: principal?.id ?? null, shippingId: 'estandar' });
  }, [addresses]);

  const updateDraft = useCallback((patch) => setDraft((d) => (d ? { ...d, ...patch } : d)), []);

  /**
   * Confirma la compra del vendedor del borrador: arma el pedido, lo guarda y saca esas líneas del carrito.
   * payment: { method: 'tarjeta', last4, holder, saved } | { method: 'transferencia' } (nunca el número completo ni el CVV).
   */
  const placeOrder = useCallback((payment) => {
    if (!draft) return null;
    const lines = items.filter((l) => l.seller.id === draft.sellerId);
    if (lines.length === 0) return null;

    const shippable = needsShipping(lines);
    const method = shippable ? getShippingMethod(draft.shippingId) : null;
    const address = addresses.find((a) => a.id === draft.addressId) ?? null;
    const now = new Date();
    const number = FIRST_ORDER_NUMBER + placed.length;

    const order = {
      id: `TM-${now.getFullYear()}-${String(number).padStart(5, '0')}`,
      createdAt: now.toISOString(),
      status: 'activo',
      timeline: { confirmado: now.toISOString() }, // los demás hitos los completa el vendedor
      carrier: null,
      tracking: null,
      seller: lines[0].seller,
      recipient: mockProfile.fullName,
      phone: getPrincipalPhone(),
      items: lines.map((l) => ({ productId: l.productId, kind: l.kind, name: l.name, detail: l.detail, image: l.image, quantity: l.quantity, unitPrice: l.unitPrice, subtotal: l.unitPrice * l.quantity })),
      shipping: method && { id: method.id, name: method.name, price: method.price, eta: method.eta },
      address,
      estimatedDelivery: method ? { from: addBusinessDays(now, method.minDays).toISOString(), to: addBusinessDays(now, method.maxDays).toISOString() } : null,
      totals: calcTotals(lines, method),
      payment: payment.method === 'transferencia'
        ? { method: 'transferencia', code: `TRF-${now.getFullYear()}-${String(number).padStart(5, '0')}` }
        : payment,
    };

    // TODO: enviar a src/services
    setPlaced((prev) => {
      const next = [...prev, order];
      try { window.localStorage.setItem(ORDERS_KEY, JSON.stringify(next)); } catch { /* ignorar */ }
      return next;
    });
    removeSeller(draft.sellerId);
    setDraft(null);
    return order;
  }, [draft, items, addresses, placed.length, removeSeller]);

  const getOrder = useCallback((id) => orders.find((o) => o.id === id) ?? null, [orders]);

  const value = useMemo(() => ({ draft, orders, startDraft, updateDraft, placeOrder, getOrder }), [draft, orders, startDraft, updateDraft, placeOrder, getOrder]);
  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>;
}

export const useCheckout = () => useContext(CheckoutContext);
