import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialDone, initialPending } from '../utils/mockReviews';

const STORAGE_KEY = 'todomart.reviews';
export const MAX_COMMENT_LENGTH = 500;

// Sin proveedor, el contexto responde vacío (así los componentes no fallan en pruebas aisladas)
const ReviewsContext = createContext({ pending: [], done: [], publishReview: () => null, hasReview: () => false });

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.pending) && Array.isArray(saved.done)) return saved;
  } catch { /* sin almacenamiento o datos dañados: se usan las reseñas de ejemplo */ }
  return { pending: initialPending, done: initialDone };
};

/**
 * Reseñas del usuario. `pending`: productos comprados sin opinión { id, name, seller, image, purchasedAt }.
 * `done`: opiniones publicadas (lo mismo + rating 1-5, comment, reviewedAt), la más reciente primero.
 * publishReview(itemOrId, { rating, comment }) publica la opinión: acepta un pendiente (o su id) o un producto
 * cualquiera { id, name, seller, image, purchasedAt, kind? } (p. ej. desde el detalle de un pedido). Lo quita de
 * pendientes (si estaba) y lo agrega a realizadas. Devuelve null si la nota es inválida o el id ya tiene reseña.
 * hasReview(id) indica si ese producto ya fue calificado.
 */
export function ReviewsProvider({ children }) {
  const [state, setState] = useState(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignorar */ }
  }, [state]);

  const publishReview = useCallback((itemOrId, { rating, comment = '' }) => {
    const item = typeof itemOrId === 'string' ? state.pending.find((p) => p.id === itemOrId) : itemOrId;
    if (!item?.id || !Number.isInteger(rating) || rating < 1 || rating > 5) return null;
    if (state.done.some((d) => d.id === item.id)) return null;
    const review = { ...item, rating, comment: comment.trim().slice(0, MAX_COMMENT_LENGTH), reviewedAt: new Date().toISOString() };
    setState((prev) => ({ pending: prev.pending.filter((p) => p.id !== item.id), done: [review, ...prev.done] }));
    return review;
  }, [state.pending, state.done]);

  const hasReview = useCallback((id) => state.done.some((d) => d.id === id), [state.done]);

  const value = useMemo(() => ({ pending: state.pending, done: state.done, publishReview, hasReview }), [state, publishReview, hasReview]);
  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export const useReviews = () => useContext(ReviewsContext);
