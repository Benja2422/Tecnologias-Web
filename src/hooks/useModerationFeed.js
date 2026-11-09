import { useMemo } from 'react';
import { useMessages } from '../contexts/MessagesContext';
import { useReviews } from '../contexts/ReviewsContext';
import { useSeller } from '../contexts/SellerContext';
import { useModeration } from '../contexts/ModerationContext';
import { currentUser } from '../utils/mockCatalog';
import { platformConversations, platformQuestions, platformReviews } from '../utils/mockModeration';

export const OVERDUE_HOURS = 48; // umbral crítico del enunciado: consultas sin réplica del vendedor
const hoursSince = (iso, now) => (now - new Date(iso)) / 3600000;

/**
 * Todo el contenido que modera el administrador, con un formato común:
 * - questions: { key, id, buyer, seller, product, text, askedAt, answer, status: 'Alerta' | 'Sin responder' | 'Respondida' }
 * - conversations: { key, id, client, seller, sellerRole, messages: [{ key, id, from: 'client' | 'seller', text, at }], lastAt, waitingSince, status: 'Alerta' | 'Esperando respuesta' | 'Al día' }
 * - reviews: { key, id, buyer, seller, target, rating, comment, createdAt }
 * Reúne lo que generan las vistas de cliente y emprendedor con el resto de la plataforma (utils/mockModeration).
 * Lo eliminado por moderación no se incluye.
 */
export function useModerationFeed() {
  const seller = useSeller();
  const { conversations } = useMessages();
  const { done } = useReviews();
  const { isDeleted } = useModeration();
  const storeName = seller.profile?.company?.name || 'Mi tienda';

  return useMemo(() => {
    const now = new Date();
    const questionStatus = (q) => (q.answer ? 'Respondida' : hoursSince(q.askedAt, now) > OVERDUE_HOURS ? 'Alerta' : 'Sin responder');

    const questions = [
      ...seller.questions.map((q) => ({ id: q.id, buyer: q.buyer.name, seller: storeName, product: q.product, text: q.text, askedAt: q.askedAt, answer: q.answer })),
      ...platformQuestions,
    ]
      .map((q) => ({ ...q, key: `q:${q.id}`, status: questionStatus(q) }))
      .filter((q) => !isDeleted(q.key));

    const threads = [
      ...conversations.map((c) => ({
        id: c.id, client: currentUser.name, seller: c.name, sellerRole: c.role,
        messages: c.messages.map((m) => ({ ...m, from: m.from === 'me' ? 'client' : 'seller' })),
      })),
      ...platformConversations,
    ]
      .filter((c) => c.messages.length > 0)
      .map((c) => {
        const messages = c.messages.map((m) => ({ ...m, key: `m:${m.id}` })).filter((m) => !isDeleted(m.key));
        // Desde cuándo el cliente espera respuesta: primer mensaje suyo después de la última réplica del vendedor
        const lastSeller = messages.map((m) => m.from).lastIndexOf('seller');
        const waiting = messages.slice(lastSeller + 1).filter((m) => m.from === 'client');
        const waitingSince = waiting[0]?.at ?? null;
        const status = !waitingSince ? 'Al día' : hoursSince(waitingSince, now) > OVERDUE_HOURS ? 'Alerta' : 'Esperando respuesta';
        return { ...c, key: `c:${c.id}`, messages, lastAt: messages.at(-1)?.at ?? '', waitingSince, status };
      })
      .filter((c) => c.messages.length > 0);

    const reviews = [
      ...seller.reviews.map((r) => ({ id: r.id, buyer: r.buyer, seller: storeName, target: r.target === 'Tienda' ? `Tienda ${storeName}` : r.target, rating: r.rating, comment: r.comment, createdAt: r.createdAt })),
      ...done.map((d) => ({ id: d.id, buyer: currentUser.name, seller: d.seller, target: d.name, rating: d.rating, comment: d.comment, createdAt: d.reviewedAt })),
      ...platformReviews,
    ]
      .map((r) => ({ ...r, key: `r:${r.id}` }))
      .filter((r) => !isDeleted(r.key));

    return { questions, conversations: threads, reviews };
  }, [seller.questions, seller.reviews, storeName, conversations, done, isDeleted]);
}
