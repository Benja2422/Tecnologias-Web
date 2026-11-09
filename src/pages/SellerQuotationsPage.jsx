import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Drawer, Snackbar, Typography, useMediaQuery } from '@mui/material';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import ActionRequiredAlert from '../components/molecules/ActionRequiredAlert';
import SellerTable from '../components/organisms/SellerTable';
import SellerChip from '../components/atoms/SellerChip';
import ItemThumb from '../components/atoms/ItemThumb';
import PaginationBar from '../components/molecules/PaginationBar';
import QuoteResponsePanel from '../components/organisms/QuoteResponsePanel';
import { useSeller } from '../contexts/SellerContext';
import { effectiveStatus } from '../utils/quotations';
import { formatWhen, norm, paginate } from '../utils/seller';
import { btnOutlined, btnPrimary, btnSmall } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 5;
// Estado guardado → etiqueta para el vendedor
const LABEL = { Solicitada: 'Pendiente', Respondida: 'Respondida', Aceptada: 'Aceptada', Rechazada: 'Rechazada', Expirada: 'Expirada' };
const TONE = { Solicitada: 'yellow', Respondida: 'green', Aceptada: 'blue', Rechazada: 'red', Expirada: 'grey' };
const FILTERS = Object.entries(LABEL).map(([id, name]) => ({ id, name }));

/** Cotizaciones recibidas: lista con filtros y panel lateral para responder (precios del catálogo, vigencia fija de 15 días). */
export default function SellerQuotationsPage() {
  const [params, setParams] = useSearchParams();
  const { quotations, respondQuotation } = useSeller();
  const wide = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState(null);
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ message: '', severity: 'success' });

  const now = new Date();
  const statusOf = (qt) => effectiveStatus(qt, now);
  const sorted = [...quotations].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const pending = sorted.filter((qt) => statusOf(qt) === 'Solicitada').length;
  const q = norm(query.trim());
  const filtered = sorted.filter((qt) => (!status || statusOf(qt) === status) && (!q || norm(`${qt.id} ${qt.buyer.name} ${qt.items.map((i) => i.name).join(' ')}`).includes(q)));
  const view = paginate(filtered, page, PAGE_SIZE);

  const openId = params.get('responder');
  const open = openId ? quotations.find((qt) => qt.id === openId) : null;
  const openPanel = (id) => setParams(id ? { responder: id } : {});

  const send = ({ text, attachment }) => {
    const ok = respondQuotation(open.id, { text, attachment });
    console.log('[Emprendedor] Responder cotización:', { quotationId: open.id, ok, adjunto: attachment?.name ?? null, largo: text.length });
    setToast(ok ? { message: `Cotización #${open.id} enviada a ${open.buyer.name}.`, severity: 'success' } : { message: 'Esta cotización ya no se puede responder.', severity: 'error' });
    openPanel(null);
  };

  const columns = [
    {
      key: 'buyer', header: 'ID / Comprador', width: 'minmax(160px, 1.4fr)', render: (qt) => (
        <>
          <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.primary }}>#{qt.id}</Typography>
          <Box sx={{ mt: 0.5, display: 'flex', gap: 1.25, alignItems: 'center' }}>
            <ItemThumb size={28} dashed />
            <Box sx={{ minWidth: 0 }}>
              <Typography title={qt.buyer.name} sx={{ fontSize: 15, fontWeight: 600, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{qt.buyer.name}</Typography>
              <Typography sx={{ fontSize: 11.5, color: '#9CA3AF' }}>{qt.buyer.type}</Typography>
            </Box>
          </Box>
        </>
      ),
    },
    {
      key: 'items', header: 'Productos solicitados', width: 'minmax(150px, 1.5fr)', render: (qt) => (
        <Box sx={{ fontSize: 14, color: colors.ink, lineHeight: 1.45 }}>
          {qt.items[0].quantity} × {qt.items[0].name}
          {qt.items.length > 1 && <Box component="span" sx={{ display: 'block', fontSize: 12, color: '#6B7280' }}>+{qt.items.length - 1} más</Box>}
        </Box>
      ),
    },
    { key: 'date', header: 'Fecha', width: 'minmax(90px, 0.8fr)', render: (qt) => <Box sx={{ color: '#4B5563' }}>{formatWhen(qt.createdAt, now)}</Box> },
    { key: 'status', header: 'Estado', width: 'minmax(100px, 0.8fr)', render: (qt) => <SellerChip label={LABEL[statusOf(qt)]} tone={TONE[statusOf(qt)]} /> },
    {
      key: 'action', header: 'Acción', width: '110px', render: (qt) => statusOf(qt) === 'Solicitada'
        ? <Button onClick={() => openPanel(qt.id)} aria-label={`Responder cotización ${qt.id}`} sx={{ ...btnPrimary, ...btnSmall, height: 34, width: '100%' }}>Responder</Button>
        : <Button onClick={() => openPanel(qt.id)} aria-label={`Ver cotización ${qt.id}`} sx={{ ...btnOutlined, ...btnSmall, height: 34, width: '100%', fontWeight: 500 }}>Ver</Button>,
    },
  ];

  const panel = open && <QuoteResponsePanel key={open.id} quotation={open} onSend={send} onClose={() => openPanel(null)} />;
  const aside = open && wide ? (
    <Box component="aside" aria-label="Responder cotización" sx={{ width: 380, flexShrink: 0, bgcolor: '#fff', borderLeft: '1px solid #E5E7EB' }}>
      <Box sx={{ position: 'sticky', top: 129, maxHeight: 'calc(100vh - 129px)', overflowY: 'auto' }}>{panel}</Box>
    </Box>
  ) : null;

  return (
    <SellerLayout crumbs={[{ label: 'Solicitudes de Cotización' }]} aside={aside}>
      <SellerPageTitle title="Solicitudes de Cotización Recibidas" subtitle="Revisa y responde las cotizaciones que los compradores de TodoMart te han solicitado. Confirma disponibilidad y condiciones antes de que venzan: cada cotización dura 15 días." />

      {pending > 0 && (
        <Box sx={{ mt: 3 }}>
          <ActionRequiredAlert title="Acción requerida: Cotizaciones pendientes">
            Tienes <b>{pending} {pending === 1 ? 'solicitud nueva sin responder' : 'solicitudes nuevas sin responder'}</b>. El tiempo promedio de respuesta influye en tu posicionamiento dentro de la vitrina TodoMart.
          </ActionRequiredAlert>
        </Box>
      )}

      <Box sx={{ mt: 3 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar por cliente o producto..."
          filter={{ label: 'Filtrar por Estado', icon: 'funnel', options: FILTERS, value: status, onChange: (v) => { setStatus(v); setPage(1); } }}
          summary={<>Filtrado: <b>Mostrando {view.rows.length} de {filtered.length} solicitudes</b></>}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerTable
          label="Cotizaciones recibidas"
          columns={columns}
          rows={view.rows}
          getKey={(qt) => qt.id}
          minWidth={700}
          rowSx={(qt) => (qt.id === openId ? { bgcolor: '#FFF7F7' } : {})}
          empty={<Typography role="status" sx={{ p: 5, textAlign: 'center', color: colors.muted }}>No hay cotizaciones con ese filtro.</Typography>}
          footer={<PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} solicitudes registradas`} sx={{ px: 3 }} />}
        />
      </Box>

      {!wide && <Drawer anchor="right" open={Boolean(open)} onClose={() => openPanel(null)} slotProps={{ paper: { sx: { width: { xs: '100%', sm: 420 } } } }}>{panel}</Drawer>}
      <Snackbar open={Boolean(toast.message)} autoHideDuration={3500} onClose={() => setToast((t) => ({ ...t, message: '' }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" onClose={() => setToast((t) => ({ ...t, message: '' }))}>{toast.message}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
