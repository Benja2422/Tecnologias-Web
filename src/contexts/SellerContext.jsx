import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialItems, initialOrders, initialProfile, initialQuestions, initialQuotations, initialReturns, initialReviews, initialShippingRates, initialStockUpdatedAt } from '../utils/mockSeller';
import { effectiveStatus, isPurged } from '../utils/quotations';
import { LEGACY_CATEGORY, LEGACY_ORDER_STATUS, migrateShippingRates } from '../utils/seller';

const STORAGE_KEY = 'todomart.seller';
const SellerContext = createContext(null);

const SEED = {
  profile: initialProfile, items: initialItems, orders: initialOrders, quotations: initialQuotations, questions: initialQuestions,
  returns: initialReturns, reviews: initialReviews, shippingRates: initialShippingRates, stockUpdatedAt: initialStockUpdatedAt,
};

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.items)) {
      // Datos guardados con versiones anteriores: nombres de estado y tarifas antiguas
      return {
        ...SEED, ...saved,
        items: saved.items.map((it) => (LEGACY_CATEGORY[it.category] ? { ...it, category: LEGACY_CATEGORY[it.category] } : it)),
        orders: (saved.orders ?? SEED.orders).map((o) => ({ ...o, status: LEGACY_ORDER_STATUS[o.status] ?? o.status })),
        shippingRates: migrateShippingRates(saved.shippingRates),
      };
    }
  } catch { /* sin almacenamiento o datos dañados: se usan los datos de ejemplo */ }
  return SEED;
};

// Las imágenes recién subidas viven solo en esta sesión (blob:); se guarda su nombre, no el archivo
const forStorage = (state) => ({
  ...state,
  items: state.items.map((it) => ({ ...it, images: (it.images ?? []).map((img) => (img.src?.startsWith('blob:') ? { name: img.name, src: null } : img)) })),
});

/**
 * Estado del panel de emprendedor: perfil y tienda, catálogo (productos y servicios con variantes, stock y ofertas), pedidos
 * recibidos, cotizaciones recibidas, preguntas, devoluciones, calificaciones y tarifas de despacho.
 * Los ítems dados de baja quedan con `retired` (no se borran: las ventas anteriores los referencian) y no se exponen en `items`.
 * Se guarda en localStorage (solo una comodidad).
 */
export function SellerProvider({ children }) {
  const [state, setState] = useState(load);
  const stateRef = useRef(state); // estado más reciente, para validar antes de cambiar
  stateRef.current = state;

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(forStorage(state))); } catch { /* ignorar */ }
  }, [state]);

  const patch = useCallback((key, fn) => setState((s) => ({ ...s, [key]: fn(s[key]) })), []);

  // ---------- Catálogo ----------
  /** Crea o actualiza un ítem (si no trae id, se crea). Devuelve el ítem guardado. */
  const saveItem = useCallback((item) => {
    const saved = { ...item, id: item.id ?? `${item.kind === 'servicio' ? 's' : 'p'}-${Date.now().toString(36)}`, updatedAt: new Date().toISOString() };
    setState((s) => ({
      ...s,
      items: s.items.some((i) => i.id === saved.id) ? s.items.map((i) => (i.id === saved.id ? saved : i)) : [saved, ...s.items],
      stockUpdatedAt: saved.updatedAt,
    }));
    return saved;
  }, [patch]);

  /** Retira un ítem del catálogo (baja lógica): deja de mostrarse, pero se conserva para el historial de ventas. */
  const deleteItem = useCallback((id) => {
    const at = new Date().toISOString();
    patch('items', (items) => items.map((i) => {
      if (i.id === id) return { ...i, retired: true, retiredAt: at, offer: i.offer ? { ...i.offer, endedAt: i.offer.endedAt ?? at } : null };
      return i.related?.includes(id) ? { ...i, related: i.related.filter((r) => r !== id) } : i;
    }));
  }, [patch]);

  // ---------- Perfil ----------
  /** Guarda el perfil del emprendedor y su empresa ({ company, owner }). No se puede eliminar. */
  const saveProfile = useCallback((profile) => setState((s) => ({ ...s, profile: { ...profile, updatedAt: new Date().toISOString() } })), []);

  /** Ajusta el stock (y el mínimo) de un producto o de una de sus variantes. */
  const adjustStock = useCallback((itemId, variantSku, { stock, minStock }) => {
    setState((s) => ({
      ...s,
      stockUpdatedAt: new Date().toISOString(),
      items: s.items.map((it) => {
        if (it.id !== itemId) return it;
        if (!variantSku) return { ...it, stock, minStock };
        return { ...it, variants: it.variants.map((v) => (v.sku === variantSku ? { ...v, stock, minStock } : v)) };
      }),
    }));
  }, []);

  /** Crea o cambia la oferta de un ítem: { price, startsAt, endsAt }. */
  const saveOffer = useCallback((itemId, offer) => {
    patch('items', (items) => items.map((it) => (it.id === itemId ? { ...it, offer: { ...offer, endedAt: null } } : it)));
  }, [patch]);

  /** Termina una oferta antes de tiempo (queda en el historial como Finalizada). */
  const endOffer = useCallback((itemId) => {
    patch('items', (items) => items.map((it) => (it.id === itemId && it.offer ? { ...it, offer: { ...it.offer, endedAt: new Date().toISOString() } } : it)));
  }, [patch]);

  // ---------- Pedidos ----------
  const setOrderStatus = useCallback((id, status) => patch('orders', (orders) => orders.map((o) => (o.id === id ? { ...o, status } : o))), [patch]);
  const setOrderShipping = useCallback((id, shipping) => patch('orders', (orders) => orders.map((o) => (o.id === id ? { ...o, shipping } : o))), [patch]);
  /** El administrador anula un pedido (cancelled: { reason, note, at }) o deshace la anulación (null). */
  const cancelOrder = useCallback((id, cancelled) => patch('orders', (orders) => orders.map((o) => (o.id === id ? { ...o, cancelled } : o))), [patch]);
  const setShippingRates = useCallback((rates) => setState((s) => ({ ...s, shippingRates: rates })), []);

  // ---------- Cotizaciones ----------
  /** El vendedor responde una cotización Solicitada y vigente. reply: { text, attachment } */
  const respondQuotation = useCallback((id, { text, attachment }) => {
    const current = stateRef.current.quotations.find((q) => q.id === id);
    if (!current || effectiveStatus(current) !== 'Solicitada') return false;
    const reply = { text, attachment: attachment ?? null, at: new Date().toISOString() };
    patch('quotations', (list) => list.map((q) => (q.id === id ? { ...q, status: 'Respondida', reply } : q)));
    return true;
  }, [patch]);

  /** Administración: cambia datos de una cotización, la elimina o elimina las que cumplieron 45 días (devuelve cuántas). */
  const updateQuotation = useCallback((id, changes) => patch('quotations', (list) => list.map((q) => (q.id === id ? { ...q, ...changes } : q))), [patch]);
  const deleteQuotation = useCallback((id) => patch('quotations', (list) => list.filter((q) => q.id !== id)), [patch]);
  const purgeQuotations = useCallback(() => {
    const now = new Date();
    const count = stateRef.current.quotations.filter((q) => isPurged(q, now)).length;
    if (count) patch('quotations', (list) => list.filter((q) => !isPurged(q, now)));
    return count;
  }, [patch]);

  // ---------- Preguntas y devoluciones ----------
  const answerQuestion = useCallback((id, text) => {
    patch('questions', (list) => list.map((q) => (q.id === id && !q.answer ? { ...q, answer: { text, at: new Date().toISOString() } } : q)));
  }, [patch]);

  /** decision: 'Aceptada' | 'Rechazada' */
  const resolveReturn = useCallback((id, decision, comment) => {
    patch('returns', (list) => list.map((r) => (r.id === id && r.status === 'Pendiente' ? { ...r, status: decision, resolution: { comment, at: new Date().toISOString() } } : r)));
  }, [patch]);

  // Pendientes para los números del menú lateral
  const counts = useMemo(() => ({
    quotations: state.quotations.filter((q) => effectiveStatus(q) === 'Solicitada').length,
    questions: state.questions.filter((q) => !q.answer).length,
    returns: state.returns.filter((r) => r.status === 'Pendiente').length,
  }), [state.quotations, state.questions, state.returns]);

  // Las cotizaciones que cumplieron 45 días ya no se muestran (la limpieza las elimina)
  const visibleQuotations = useMemo(() => state.quotations.filter((q) => !isPurged(q)), [state.quotations]);

  // Catálogo vigente (sin los ítems dados de baja)
  const items = useMemo(() => state.items.filter((i) => !i.retired), [state.items]);

  const value = useMemo(() => ({
    ...state, items, allItems: state.items, counts,
    quotations: visibleQuotations, allQuotations: state.quotations, updateQuotation, deleteQuotation, purgeQuotations,
    saveProfile, saveItem, deleteItem, adjustStock, saveOffer, endOffer,
    setOrderStatus, setOrderShipping, setShippingRates, cancelOrder,
    respondQuotation, answerQuestion, resolveReturn,
  }), [state, items, counts, saveProfile, saveItem, deleteItem, adjustStock, saveOffer, endOffer, setOrderStatus, setOrderShipping, setShippingRates, cancelOrder, respondQuotation, answerQuestion, resolveReturn, visibleQuotations, updateQuotation, deleteQuotation, purgeQuotations]);

  return <SellerContext.Provider value={value}>{children}</SellerContext.Provider>;
}

export function useSeller() {
  const ctx = useContext(SellerContext);
  if (!ctx) throw new Error('useSeller debe usarse dentro de <SellerProvider>');
  return ctx;
}
