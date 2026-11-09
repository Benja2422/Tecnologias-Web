import { useState } from 'react';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import ActionRequiredAlert from '../components/molecules/ActionRequiredAlert';
import SellerRequestCard from '../components/organisms/SellerRequestCard';
import ItemThumb from '../components/atoms/ItemThumb';
import PaginationBar from '../components/molecules/PaginationBar';
import { useSeller } from '../contexts/SellerContext';
import { norm, paginate, timeAgo } from '../utils/seller';
import { card } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 4;
const OVERDUE_HOURS = 48; // umbral crítico del enunciado para preguntas sin réplica
const FILTERS = [{ id: 'Pendiente', name: 'Pendientes' }, { id: 'Respondida', name: 'Respondidas' }];

/** Preguntas públicas de los compradores sobre los productos de la tienda, con respuesta pública. */
export default function SellerQuestionsPage() {
  const { questions, items, answerQuestion } = useSeller();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState('');

  const now = new Date();
  const statusOf = (q) => (q.answer ? 'Respondida' : 'Pendiente');
  // Pendientes primero; dentro de cada grupo, la más reciente arriba
  const sorted = [...questions].sort((a, b) => (Boolean(a.answer) - Boolean(b.answer)) || b.askedAt.localeCompare(a.askedAt));
  const pending = questions.filter((q) => !q.answer).length;
  const isOverdue = (q) => !q.answer && now - new Date(q.askedAt) > OVERDUE_HOURS * 3600000;
  const overdue = questions.filter(isOverdue).length;
  const term = norm(query.trim());
  const filtered = sorted.filter((q) => (!status || statusOf(q) === status) && (!term || norm(`${q.text} ${q.product} ${q.buyer.name}`).includes(term)));
  const view = paginate(filtered, page, PAGE_SIZE);
  const imageOf = (q) => items.find((it) => it.id === q.itemId)?.images?.[0]?.src;

  const publish = (q, text) => {
    console.log('[Emprendedor] Responder pregunta:', { questionId: q.id, itemId: q.itemId, largo: text.length });
    answerQuestion(q.id, text);
    setToast(`Respuesta publicada en "${q.product}".`);
  };

  return (
    <SellerLayout crumbs={[{ label: 'Preguntas de Clientes' }]}>
      <SellerPageTitle title="Preguntas de Clientes Recibidas" subtitle="Gestiona las consultas públicas sobre tus productos publicados. Responde oportunamente para aumentar la confianza y mejorar tu conversión de ventas." />

      {pending > 0 && (
        <Box sx={{ mt: 3 }}>
          <ActionRequiredAlert title="Acción requerida: Consultas sin responder">
            Tienes <b>{pending} {pending === 1 ? 'pregunta pendiente' : 'preguntas pendientes'}</b>{overdue > 0 && <>, <b>{overdue} con más de {OVERDUE_HOURS} horas sin respuesta</b></>}. Responder antes de 24 horas mejora tu reputación en la vitrina comercial.
          </ActionRequiredAlert>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar por palabra clave o producto..."
          filter={{ label: 'Filtrar por Estado', icon: 'funnel', showValue: true, allLabel: 'Todas', options: FILTERS, value: status, onChange: (v) => { setStatus(v); setPage(1); } }}
          summary={<>Resultados: <b>Mostrando {view.rows.length} de {filtered.length} preguntas</b></>}
        />
      </Box>

      <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
        {view.rows.length === 0 && <Typography role="status" sx={{ ...card, p: 5, textAlign: 'center', color: colors.muted }}>No hay preguntas con ese filtro.</Typography>}
        {view.rows.map((q) => (
          <SellerRequestCard
            key={q.id}
            header={{ id: q.id, name: q.buyer.name, type: q.buyer.type, status: statusOf(q), tone: q.answer ? 'green' : 'yellow', flag: isOverdue(q) ? `Más de ${OVERDUE_HOURS} h sin respuesta` : null }}
            form={q.answer ? null : {
              label: 'Responder públicamente en TodoMart:',
              placeholder: 'Escribe tu respuesta clara, técnica y profesional aquí...',
              note: '* Esta respuesta será visible para todos los compradores en la tienda.',
              max: 500,
              actions: [{ label: 'Publicar respuesta', requireText: 'Escribe una respuesta antes de publicarla.', onClick: (text) => publish(q, text) }],
            }}
            resolved={q.answer && { title: 'Tu respuesta pública:', text: q.answer.text }}
          >
            <Box sx={{ display: 'flex', gap: 2 }}>
              <ItemThumb src={imageOf(q)} dashed />
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#6B7280' }}>Producto: {q.product}</Typography>
                <Typography sx={{ mt: 0.75, fontSize: 15.5, color: colors.ink, lineHeight: 1.5, overflowWrap: 'anywhere' }}>{q.text}</Typography>
                <Typography sx={{ mt: 0.75, fontSize: 11.5, color: '#9CA3AF' }}>Preguntado: {timeAgo(q.askedAt, now)}</Typography>
              </Box>
            </Box>
          </SellerRequestCard>
        ))}
        <Box sx={card}>
          <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} consultas registradas`} sx={{ px: 3 }} />
        </Box>
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
