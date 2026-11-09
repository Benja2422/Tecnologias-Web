import { useCallback, useMemo } from 'react';
import { useQuotations } from '../contexts/QuotationsContext';
import { useSeller } from '../contexts/SellerContext';
import { cycleDay, daysLeft, deleteOn, effectiveStatus, getQuoteTotals, isPurged, quoteLines, validUntil, weeksSinceExpiry } from '../utils/quotations';
import { SELLER } from '../utils/seller';
import { mockProfile } from '../utils/mockProfile';

const LIFECYCLE_KEY = 'todomart.quotesLifecycle';
const DAY = 86400000;
export const LIFECYCLE_EVERY_DAYS = 7; // la limpieza automática corre una vez por semana

/** Última ejecución de la limpieza ({ at, removed }). La primera vez se asume una ejecución de hace 3 días. */
export function readLifecycle() {
  try {
    const saved = JSON.parse(window.localStorage.getItem(LIFECYCLE_KEY));
    if (saved?.at) return saved;
  } catch { /* sin almacenamiento */ }
  const seed = { at: new Date(Date.now() - 3 * DAY).toISOString(), removed: 0, auto: true };
  try { window.localStorage.setItem(LIFECYCLE_KEY, JSON.stringify(seed)); } catch { /* ignorar */ }
  return seed;
}
const writeLifecycle = (value) => { try { window.localStorage.setItem(LIFECYCLE_KEY, JSON.stringify(value)); } catch { /* ignorar */ } };

/**
 * Cotizaciones de toda la plataforma para el administrador (las del cliente y las del panel de emprendedor):
 * { key, source: 'cliente' | 'panel', id, createdAt, buyer, seller, lines (con precio cotizado y vigente), total, quotedTotal,
 *   status: Solicitada | Respondida | Aceptada | Rechazada | Expirada | Por eliminar, stored, message, reply, validUntil, deleteOn,
 *   daysLeft, cycleDay, adjustWeeks, orderId, renewedAt }
 * Acciones: setStatus, renew (+15 días desde hoy), remove, purge (elimina las de 45 días o más; devuelve cuántas).
 */
export function useAdminQuotations() {
  const { allQuotations, adminUpdate, adminDelete, purge: purgeClient } = useQuotations();
  const { allQuotations: panelQuotes, profile, updateQuotation, deleteQuotation, purgeQuotations } = useSeller();
  const panelSeller = profile?.company?.name || SELLER.name;

  const rows = useMemo(() => {
    const now = new Date();
    const build = (q, extra) => {
      const lines = quoteLines(q, now);
      const purged = isPurged(q, now);
      return {
        ...extra, id: q.id, createdAt: q.createdAt, renewedAt: q.renewedAt ?? null, stored: q.status,
        status: purged ? 'Por eliminar' : effectiveStatus(q, now), lines, total: getQuoteTotals(q, now).total,
        quotedTotal: q.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), validUntil: validUntil(q), deleteOn: deleteOn(q),
        daysLeft: daysLeft(q, now), cycleDay: Math.min(45, cycleDay(q, now)), adjustWeeks: effectiveStatus(q, now) === 'Expirada' ? weeksSinceExpiry(q, now) : 0,
        orderId: q.orderId ?? null,
      };
    };
    return [
      ...allQuotations.map((q) => build(q, { key: `c:${q.id}`, source: 'cliente', buyer: mockProfile.fullName, seller: q.seller?.name ?? '—', message: q.message, reply: q.reply?.text ?? null, raw: q })),
      ...panelQuotes.map((q) => build(q, { key: `v:${q.id}`, source: 'panel', buyer: q.buyer.name, buyerType: q.buyer.type, seller: panelSeller, message: q.message, reply: q.reply?.text ?? null, raw: q })),
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [allQuotations, panelQuotes, panelSeller]);

  const write = useCallback((row, changes) => {
    if (row.source === 'panel') updateQuotation(row.id, changes);
    else adminUpdate(row.id, changes);
  }, [updateQuotation, adminUpdate]);

  /** Fuerza un estado guardado (Solicitada | Respondida | Aceptada | Rechazada). */
  const setStatus = useCallback((row, status) => {
    const now = new Date().toISOString();
    const changes = { status };
    if (status === 'Respondida' && !row.raw.reply) changes.reply = { text: 'Respondida por la administración.', at: now, attachment: null };
    if (status === 'Aceptada' || status === 'Rechazada') changes.decidedAt = now;
    write(row, changes);
  }, [write]);

  /** Renueva la vigencia: el ciclo (15 días de vigencia, eliminación a los 45) parte de nuevo hoy. */
  const renew = useCallback((row) => write(row, { renewedAt: new Date().toISOString() }), [write]);

  const remove = useCallback((row) => (row.source === 'panel' ? deleteQuotation(row.id) : adminDelete(row.id)), [deleteQuotation, adminDelete]);

  const purge = useCallback((auto = false) => {
    const removed = purgeClient() + purgeQuotations();
    const run = { at: new Date().toISOString(), removed, auto };
    writeLifecycle(run);
    return run;
  }, [purgeClient, purgeQuotations]);

  return { rows, setStatus, renew, remove, purge };
}
