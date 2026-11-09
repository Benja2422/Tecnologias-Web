import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { initialQuotations } from '../utils/mockQuotations';
import { QUOTE_MESSAGE_MAX, effectiveStatus, isPurged, nextQuoteId } from '../utils/quotations';

const STORAGE_KEY = 'todomart.quotations';

// Sin proveedor, el contexto responde vacío (así los componentes no fallan en pruebas aisladas)
const QuotationsContext = createContext({
  quotations: [], pendingDecisionCount: 0, getQuotation: () => null,
  requestQuotation: () => null, acceptQuotation: () => false, rejectQuotation: () => false, respondQuotation: () => false, markPaid: () => {},
});

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch { /* sin almacenamiento o datos dañados: se usan las cotizaciones de ejemplo */ }
  return initialQuotations;
};

/**
 * Cotizaciones del cliente. Cada una: { id, createdAt, updatedAt, seller: { id, name, rut }, status, items, message, reply,
 * respondedAt, decidedAt, orderId }. `status` guarda Solicitada | Respondida | Aceptada | Rechazada; "Expirada" se deduce de la
 * fecha (ver utils/quotations). Las que cumplen 45 días se eliminan. Se guarda en localStorage (solo es una comodidad).
 */
export function QuotationsProvider({ children }) {
  const [raw, setRaw] = useState(load);
  const rawRef = useRef(raw); // última lista, para numerar y devolver la cotización nueva de inmediato
  rawRef.current = raw;

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(raw)); } catch { /* ignorar */ }
  }, [raw]);

  // Más reciente primero; las de 45 días o más ya no existen
  const quotations = useMemo(() => {
    const now = new Date();
    return raw.filter((q) => !isPurged(q, now)).sort((a, b) => b.createdAt.localeCompare(a.createdAt) || b.id.localeCompare(a.id));
  }, [raw]);

  // Respondidas que esperan una decisión del cliente (es el número del menú lateral)
  const pendingDecisionCount = useMemo(() => {
    const now = new Date();
    return quotations.filter((q) => effectiveStatus(q, now) === 'Respondida').length;
  }, [quotations]);

  const getQuotation = useCallback((id) => quotations.find((q) => q.id === id) ?? null, [quotations]);
  const update = useCallback((id, fn) => setRaw((prev) => prev.map((q) => (q.id === id ? fn(q) : q))), []);

  /**
   * Crea una cotización Solicitada para un vendedor. items: [{ productId, name, detail, image, quantity, unitPrice, listPrice, stock }].
   * Devuelve la cotización o null si no hay productos.
   */
  const requestQuotation = useCallback(({ seller, items, message = '' }) => {
    const lines = items.filter((l) => l.quantity > 0);
    if (!seller || lines.length === 0) return null;
    const now = new Date().toISOString();
    const created = {
      id: nextQuoteId(rawRef.current), createdAt: now, updatedAt: now, seller, status: 'Solicitada',
      items: lines.map(({ productId, name, detail, image, quantity, unitPrice, listPrice, stock }) => ({
        productId, name, detail: detail ?? '', image: image ?? null, quantity, unitPrice, listPrice: listPrice ?? null, stock,
      })),
      message: message.trim().slice(0, QUOTE_MESSAGE_MAX), reply: null, respondedAt: null, decidedAt: null, orderId: null,
    };
    rawRef.current = [created, ...rawRef.current];
    setRaw((prev) => [created, ...prev]);
    return created;
  }, []);

  // TODO: el cliente solo acepta o rechaza; responder una cotización le corresponde al vendedor (src/services)
  const respondQuotation = useCallback((id, text = '') => {
    const now = new Date().toISOString();
    update(id, (q) => (q.status === 'Solicitada' ? { ...q, status: 'Respondida', respondedAt: now, updatedAt: now, reply: text ? { text, at: now } : q.reply } : q));
    return true;
  }, [update]);

  /** Acepta una cotización Respondida y vigente. Devuelve false si ya no se puede. */
  const acceptQuotation = useCallback((id) => {
    const q = raw.find((x) => x.id === id);
    if (!q || effectiveStatus(q) !== 'Respondida') return false;
    const now = new Date().toISOString();
    update(id, (x) => ({ ...x, status: 'Aceptada', decidedAt: now, updatedAt: now }));
    return true;
  }, [raw, update]);

  const rejectQuotation = useCallback((id) => {
    const q = raw.find((x) => x.id === id);
    if (!q || effectiveStatus(q) !== 'Respondida') return false;
    const now = new Date().toISOString();
    update(id, (x) => ({ ...x, status: 'Rechazada', decidedAt: now, updatedAt: now }));
    return true;
  }, [raw, update]);

  // ---------- Administración ----------
  /** Todas las cotizaciones guardadas, incluso las que ya cumplieron 45 días (aún sin eliminar). */
  const allQuotations = useMemo(() => [...raw].sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [raw]);
  /** El administrador cambia datos de una cotización (estado, renovación…). */
  const adminUpdate = useCallback((id, patch) => update(id, (q) => ({ ...q, ...patch, updatedAt: new Date().toISOString() })), [update]);
  const adminDelete = useCallback((id) => setRaw((prev) => prev.filter((q) => q.id !== id)), []);
  /** Elimina físicamente las que cumplieron 45 días. Devuelve cuántas eran. */
  const purge = useCallback(() => {
    const now = new Date();
    const count = rawRef.current.filter((q) => isPurged(q, now)).length;
    if (count) setRaw((prev) => prev.filter((q) => !isPurged(q, now)));
    return count;
  }, []);

  /** Al pagar una cotización aceptada queda ligada al pedido. */
  const markPaid = useCallback((id, orderId) => update(id, (q) => ({ ...q, orderId, updatedAt: new Date().toISOString() })), [update]);

  const value = useMemo(
    () => ({ quotations, pendingDecisionCount, getQuotation, requestQuotation, acceptQuotation, rejectQuotation, respondQuotation, markPaid, allQuotations, adminUpdate, adminDelete, purge }),
    [quotations, pendingDecisionCount, getQuotation, requestQuotation, acceptQuotation, rejectQuotation, respondQuotation, markPaid, allQuotations, adminUpdate, adminDelete, purge],
  );
  return <QuotationsContext.Provider value={value}>{children}</QuotationsContext.Provider>;
}

export const useQuotations = () => useContext(QuotationsContext);
