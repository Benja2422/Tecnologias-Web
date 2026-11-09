import { useState } from 'react';
import { Alert, Box, Button, ButtonBase, Snackbar, Typography } from '@mui/material';
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ForumOutlinedIcon from '@mui/icons-material/ForumOutlined';
import AdminLayout from '../components/templates/AdminLayout';
import StatCard from '../components/molecules/StatCard';
import TabBar from '../components/molecules/TabBar';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import ActionRequiredAlert from '../components/molecules/ActionRequiredAlert';
import PaginationBar from '../components/molecules/PaginationBar';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import RatingStars from '../components/atoms/RatingStars';
import ModerationCard from '../components/organisms/ModerationCard';
import HideContentDialog from '../components/organisms/HideContentDialog';
import ConversationAuditDialog from '../components/organisms/ConversationAuditDialog';
import { useModeration } from '../contexts/ModerationContext';
import { OVERDUE_HOURS, useModerationFeed } from '../hooks/useModerationFeed';
import { STATUS_TONE, elapsed } from '../utils/moderation';
import { formatWhen, norm, paginate } from '../utils/seller';
import { card } from '../utils/sellerStyles';
import { mockAdmin } from '../utils/mockUsers';
import { currentUser } from '../utils/mockCatalog';
import { colors } from '../utils/theme';

const PAGE_SIZE = 6;
const CRUMBS = [{ label: 'Panel de Administración', href: '/admin' }, { label: 'Moderación' }];
const FILTERS = {
  preguntas: [{ id: 'Alerta', name: `Alertas (+${OVERDUE_HOURS} h)` }, { id: 'Sin responder', name: 'Sin responder' }, { id: 'Respondida', name: 'Respondidas' }, { id: 'oculto', name: 'Ocultas' }],
  mensajes: [{ id: 'Alerta', name: `Alertas (+${OVERDUE_HOURS} h)` }, { id: 'Esperando respuesta', name: 'Esperando respuesta' }, { id: 'Al día', name: 'Al día' }, { id: 'oculto', name: 'Con mensajes ocultos' }],
  resenas: [{ id: 'baja', name: '2 estrellas o menos' }, { id: 'oculto', name: 'Ocultas' }],
};
const ORDER = { Alerta: 0, 'Sin responder': 1, 'Esperando respuesta': 1, Respondida: 2, 'Al día': 2 };
const btn = {
  height: 32, px: 1.5, borderRadius: '6px', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, textTransform: 'none', whiteSpace: 'nowrap',
  color: colors.ink, border: '1px solid #D1D5DB', bgcolor: '#fff', '& svg': { fontSize: 17 }, '&:hover': { bgcolor: '#F7F7F7', borderColor: '#9CA3AF' },
};
const btnDanger = { ...btn, color: colors.primary, borderColor: '#F1C4C4', '&:hover': { bgcolor: '#FDECEF', borderColor: colors.primary } };
const link = { fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: colors.primary, textDecoration: 'underline', verticalAlign: 'baseline' };
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

/**
 * Panel de mensajería interna y moderación: audita preguntas públicas, conversaciones privadas y reseñas,
 * con alertas para las consultas que superan 48 horas sin réplica del vendedor.
 */
export default function AdminModerationPage() {
  const { questions, conversations, reviews } = useModerationFeed();
  const { hidden, reminders, hide, restore, remove, remind } = useModeration();
  const [tab, setTab] = useState('preguntas');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(null);
  const [page, setPage] = useState(1);
  const [hiding, setHiding] = useState(null); // { key, what, preview }
  const [deleting, setDeleting] = useState(null); // { key, what, preview }
  const [auditId, setAuditId] = useState(null);
  const [toast, setToast] = useState('');

  const now = new Date();
  const isHidden = (key) => Boolean(hidden[key]);
  const convHidden = (c) => c.messages.filter((m) => isHidden(m.key)).length;
  const alertQuestions = questions.filter((q) => q.status === 'Alerta' && !isHidden(q.key));
  const alertConversations = conversations.filter((c) => c.status === 'Alerta');
  const stats = {
    pending: questions.filter((q) => q.status !== 'Respondida' && !isHidden(q.key)).length,
    alerts: alertQuestions.length + alertConversations.length,
    waiting: conversations.filter((c) => c.status !== 'Al día').length,
    hidden: Object.keys(hidden).length,
  };

  const go = (nextTab, nextFilter = null) => { setTab(nextTab); setFilter(nextFilter); setQuery(''); setPage(1); };
  const term = norm(query.trim());
  const matches = (text) => !term || norm(text).includes(term);

  let rows = [];
  if (tab === 'preguntas') {
    rows = questions
      .filter((q) => (!filter || (filter === 'oculto' ? isHidden(q.key) : q.status === filter)) && matches(`${q.text} ${q.product} ${q.seller} ${q.buyer} ${q.id}`))
      .sort((a, b) => (ORDER[a.status] - ORDER[b.status]) || b.askedAt.localeCompare(a.askedAt));
  } else if (tab === 'mensajes') {
    rows = conversations
      .filter((c) => (!filter || (filter === 'oculto' ? convHidden(c) > 0 : c.status === filter)) && matches(`${c.client} ${c.seller} ${c.messages.map((m) => m.text).join(' ')}`))
      .sort((a, b) => (ORDER[a.status] - ORDER[b.status]) || b.lastAt.localeCompare(a.lastAt));
  } else {
    rows = reviews
      .filter((r) => (!filter || (filter === 'oculto' ? isHidden(r.key) : r.rating <= 2)) && matches(`${r.comment} ${r.target} ${r.seller} ${r.buyer}`))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }
  const view = paginate(rows, page, PAGE_SIZE);
  const audited = auditId ? conversations.find((c) => c.id === auditId) : null;

  // ---------- Acciones ----------
  const confirmHide = (reason, note) => {
    // TODO: registrar vía src/services
    console.log('[Admin/Moderación] Ocultar:', { key: hiding.key, reason, note });
    hide(hiding.key, reason, note);
    setToast(`${hiding.what[0].toUpperCase()}${hiding.what.slice(1)} quedó ${hiding.what.startsWith('la ') ? 'oculta' : 'oculto'}.`);
    setHiding(null);
  };
  const doRestore = (key, what) => { console.log('[Admin/Moderación] Restaurar:', { key }); restore(key); setToast(`Se restauró ${what}.`); };
  const confirmDelete = () => { console.log('[Admin/Moderación] Eliminar:', { key: deleting.key }); remove(deleting.key); setToast(`Se eliminó ${deleting.what}.`); setDeleting(null); };
  const doRemind = (key, seller) => { console.log('[Admin/Moderación] Recordatorio al vendedor:', { key, seller }); remind(key); setToast(`Recordatorio enviado a ${seller}.`); };

  const hideOrRestore = (key, what, preview) => (isHidden(key)
    ? <Button onClick={() => doRestore(key, what)} startIcon={<VisibilityOutlinedIcon />} sx={btn}>Restaurar</Button>
    : <Button onClick={() => setHiding({ key, what, preview })} startIcon={<VisibilityOffOutlinedIcon />} sx={btn}>Ocultar</Button>);
  const remindButton = (key, seller) => (reminders[key]
    ? <Button disabled startIcon={<NotificationsActiveOutlinedIcon />} sx={btn}>Recordado {formatWhen(reminders[key]).toLowerCase()}</Button>
    : <Button onClick={() => doRemind(key, seller)} startIcon={<NotificationsActiveOutlinedIcon />} sx={btn}>Recordar al vendedor</Button>);

  const tabs = [
    { id: 'preguntas', label: `Preguntas públicas (${questions.length})` },
    { id: 'mensajes', label: `Mensajería privada (${conversations.length})` },
    { id: 'resenas', label: `Reseñas (${reviews.length})` },
  ];
  const noun = { preguntas: ['pregunta', 'preguntas'], mensajes: ['conversación', 'conversaciones'], resenas: ['reseña', 'reseñas'] }[tab];

  return (
    <AdminLayout headerProps={{ user: currentUser }} crumbs={CRUMBS} admin={mockAdmin}>
      <Box sx={{ mb: 3 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.ink }}>Moderación</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.muted }}>Audita las preguntas públicas, la mensajería privada y las reseñas de toda la plataforma.</Typography>
      </Box>

      {stats.alerts > 0 && (
        <Box sx={{ mb: 3 }}>
          <ActionRequiredAlert title={`Alertas de control: más de ${OVERDUE_HOURS} horas sin réplica del vendedor`}>
            {alertQuestions.length > 0 && <><b>{plural(alertQuestions.length, 'pregunta pública', 'preguntas públicas')}</b> (<ButtonBase onClick={() => go('preguntas', 'Alerta')} sx={link}>ver</ButtonBase>)</>}
            {alertQuestions.length > 0 && alertConversations.length > 0 && ' y '}
            {alertConversations.length > 0 && <><b>{plural(alertConversations.length, 'conversación', 'conversaciones')}</b> (<ButtonBase onClick={() => go('mensajes', 'Alerta')} sx={link}>ver</ButtonBase>)</>}
            {' '}siguen sin respuesta. Puedes enviar un recordatorio al vendedor desde cada una.
          </ActionRequiredAlert>
        </Box>
      )}

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr)', lg: 'repeat(4, minmax(0, 1fr))' } }}>
        <StatCard label="Preguntas sin responder" value={stats.pending} />
        <StatCard label={`Alertas +${OVERDUE_HOURS} h`} value={stats.alerts} color={stats.alerts ? colors.primary : colors.ink} />
        <StatCard label="Chats esperando respuesta" value={stats.waiting} color="#4B5563" />
        <StatCard label="Contenido oculto" value={stats.hidden} color="#4B5563" />
      </Box>

      <Box sx={{ mt: 3, ...card, borderRadius: 3, px: { xs: 2, md: 2.5 } }}>
        <TabBar label="Tipo de contenido" tabs={tabs} value={tab} onChange={(t) => go(t)} />
      </Box>

      <Box id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`}>
        <Box sx={{ mt: 2.5 }}>
          <SellerFilterBar
            query={query}
            onQuery={(v) => { setQuery(v); setPage(1); }}
            placeholder={tab === 'resenas' ? 'Buscar por comentario, producto, tienda o cliente...' : 'Buscar por texto, producto, tienda o cliente...'}
            filter={{ label: 'Estado', icon: 'funnel', showValue: true, allLabel: 'Todos', options: FILTERS[tab], value: filter, onChange: (v) => { setFilter(v); setPage(1); } }}
            summary={<>Resultados: <b>{plural(rows.length, ...noun)}</b></>}
          />
        </Box>

        <Box sx={{ mt: 2.5, display: 'grid', gap: 2 }}>
          {view.rows.length === 0 && <Typography role="status" sx={{ ...card, p: 5, textAlign: 'center', color: colors.muted }}>No hay {noun[1]} con ese filtro.</Typography>}

          {tab === 'preguntas' && view.rows.map((q) => (
            <ModerationCard
              key={q.key}
              id={`Pregunta ${q.id}`}
              alert={q.status === 'Alerta' && !isHidden(q.key)}
              context={<>{q.id} · Producto: {q.product} · Tienda: {q.seller}</>}
              chips={[
                { label: q.status === 'Alerta' ? `Sin respuesta hace ${elapsed(q.askedAt, now)}` : q.status, tone: STATUS_TONE[q.status], dot: true },
                ...(isHidden(q.key) ? [{ label: 'Oculta', tone: 'grey' }] : []),
              ]}
              hidden={hidden[q.key]}
              text={q.text}
              author={<>Preguntó <b>{q.buyer}</b></>}
              at={q.askedAt}
              reply={q.answer && { title: `Respuesta de ${q.seller}`, text: q.answer.text }}
              actions={<>
                {!q.answer && remindButton(q.key, q.seller)}
                {hideOrRestore(q.key, 'la pregunta', q.text)}
                <Button onClick={() => setDeleting({ key: q.key, what: 'la pregunta', preview: q.text })} startIcon={<DeleteOutlinedIcon />} sx={btnDanger}>Eliminar</Button>
              </>}
            />
          ))}

          {tab === 'mensajes' && view.rows.map((c) => {
            const last = c.messages.at(-1);
            const hiddenCount = convHidden(c);
            return (
              <ModerationCard
                key={c.key}
                id={`Conversación ${c.client} y ${c.seller}`}
                alert={c.status === 'Alerta'}
                context={<>Conversación privada · {c.messages.length} {c.messages.length === 1 ? 'mensaje' : 'mensajes'}</>}
                chips={[
                  { label: c.status === 'Alerta' ? `Sin respuesta hace ${elapsed(c.waitingSince, now)}` : c.status === 'Esperando respuesta' ? `Esperando hace ${elapsed(c.waitingSince, now)}` : c.status, tone: STATUS_TONE[c.status], dot: true },
                  ...(hiddenCount ? [{ label: plural(hiddenCount, 'mensaje oculto', 'mensajes ocultos'), tone: 'grey' }] : []),
                ]}
                text={null}
                extra={<>
                  <Typography sx={{ mt: 1.25, fontSize: 16, fontWeight: 600, color: colors.ink, overflowWrap: 'anywhere' }}>{c.client} <Box component="span" sx={{ color: '#9CA3AF', fontWeight: 400 }}>(cliente) ↔</Box> {c.seller} <Box component="span" sx={{ color: '#9CA3AF', fontWeight: 400 }}>({c.sellerRole.toLowerCase()})</Box></Typography>
                  <Typography sx={{ mt: 0.75, fontSize: 14, color: '#4B5563', lineHeight: 1.5, overflowWrap: 'anywhere', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    <b>{last.from === 'client' ? c.client : c.seller}:</b> {isHidden(last.key) ? <i>Mensaje oculto por moderación</i> : last.text}
                  </Typography>
                </>}
                author="Último mensaje"
                at={c.lastAt}
                actions={<>
                  {c.status !== 'Al día' && remindButton(c.key, c.seller)}
                  <Button onClick={() => setAuditId(c.id)} startIcon={<ForumOutlinedIcon />} sx={btn}>Ver conversación</Button>
                </>}
              />
            );
          })}

          {tab === 'resenas' && view.rows.map((r) => (
            <ModerationCard
              key={r.key}
              id={`Reseña ${r.id}`}
              context={<>{r.id} · {r.target} · Tienda: {r.seller}</>}
              chips={[
                ...(r.rating <= 2 ? [{ label: 'Calificación baja', tone: 'orange' }] : []),
                ...(isHidden(r.key) ? [{ label: 'Oculta', tone: 'grey' }] : []),
              ]}
              hidden={hidden[r.key]}
              extra={<Box sx={{ mt: 1.25 }}><RatingStars value={r.rating} size={18} /></Box>}
              text={r.comment || 'Sin comentario.'}
              author={<>Reseña de <b>{r.buyer}</b></>}
              at={r.createdAt}
              actions={<>
                {hideOrRestore(r.key, 'la reseña', r.comment || `${r.rating} estrellas`)}
                <Button onClick={() => setDeleting({ key: r.key, what: 'la reseña', preview: r.comment })} startIcon={<DeleteOutlinedIcon />} sx={btnDanger}>Eliminar</Button>
              </>}
            />
          ))}

          <Box sx={card}>
            <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} ${noun[1]}`} sx={{ px: 3 }} />
          </Box>
        </Box>
      </Box>

      {hiding && <HideContentDialog what={hiding.what} preview={hiding.preview} onConfirm={confirmHide} onClose={() => setHiding(null)} />}

      {deleting && (
        <ConfirmDialog
          title={`Eliminar ${deleting.what}`}
          message={`Se eliminará de forma permanente${deleting.preview ? `: “${deleting.preview.length > 120 ? `${deleting.preview.slice(0, 120)}…` : deleting.preview}”` : '.'} Si solo quieres sacarla de la vista pública, usa Ocultar.`}
          confirmLabel="Eliminar"
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      {audited && (
        <ConversationAuditDialog
          conversation={audited}
          hiddenOf={(key) => hidden[key] ?? null}
          onHide={(m) => setHiding({ key: m.key, what: 'el mensaje', preview: m.text })}
          onRestore={(m) => doRestore(m.key, 'el mensaje')}
          onClose={() => setAuditId(null)}
        />
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AdminLayout>
  );
}
