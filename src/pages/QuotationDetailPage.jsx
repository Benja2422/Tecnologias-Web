import { useState } from 'react';
import { Link as RouterLink, Navigate, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import AccountLayout from '../components/templates/AccountLayout';
import Breadcrumb from '../components/molecules/Breadcrumb';
import QuotationStatusBadge from '../components/atoms/QuotationStatusBadge';
import QuotationTracker from '../components/molecules/QuotationTracker';
import QuotationItemRow from '../components/molecules/QuotationItemRow';
import QuotationDecisionDialog from '../components/organisms/QuotationDecisionDialog';
import QuotationRequestDialog from '../components/organisms/QuotationRequestDialog';
import { useQuotations } from '../contexts/QuotationsContext';
import { useMessages } from '../contexts/MessagesContext';
import { QUOTE_VALID_DAYS, daysLeft, effectiveStatus, formatDM, formatDMY, lastAdjustment, quoteLines, quoteTotals, validUntil, deleteOn } from '../utils/quotations';
import { formatPrice } from '../utils/format';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const card = { p: { xs: 2.5, sm: 3 }, border: '1px solid #E5E7EB', borderRadius: 3, bgcolor: '#fff' };
const h2 = { fontSize: 18, fontWeight: 600, color: colors.text };
const btn = { height: 42, px: 2.5, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none' };
const outlinedRed = { ...btn, color: colors.primary, borderColor: colors.primary, '&:hover': { borderColor: colors.primaryDark, bgcolor: '#FDECEF' } };
const outlinedNeutral = { ...btn, color: colors.text, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } };
const filled = { ...btn, height: 44, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } };

const Info = ({ label, value }) => (
  <Box sx={{ minWidth: 0 }}>
    <Typography sx={{ fontSize: 12, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ mt: 0.75, fontSize: 14, fontWeight: 600, color: colors.text }}>{value}</Typography>
  </Box>
);

const Row = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <Typography sx={{ fontSize: 15, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{value}</Typography>
  </Box>
);

const MessageCard = ({ title, author, at, text }) => (
  <Box component="section" aria-label={title} sx={{ ...card, mt: 3 }}>
    <Typography component="h2" sx={h2}>{title}</Typography>
    <Typography sx={{ mt: 1.5, fontSize: 12, color: '#9A9A9A' }}>{author} · {formatDMY(at)}</Typography>
    <Typography sx={{ mt: 1.75, fontSize: 15, color: colors.text, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{text}</Typography>
  </Box>
);

/** Franja de aviso según el estado de la cotización. */
function StatusNotice({ quotation, status, now }) {
  const base = { mt: 3, px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, borderRadius: '6px', fontSize: 14 };
  const until = formatDM(validUntil(quotation));
  const variants = {
    Solicitada: { sx: { bgcolor: '#F7F7F8', color: colors.muted }, icon: <InfoOutlinedIcon />, text: 'Esperando respuesta del vendedor' },
    Respondida: { sx: { bgcolor: '#FFF6DD', color: '#8A5A00' }, icon: <WarningAmberOutlinedIcon />, text: `El vendedor respondió. Tienes hasta el ${until} para aceptarla` },
    Aceptada: {
      sx: { bgcolor: '#E8F5EA', color: '#2E7D32' }, icon: <CheckCircleOutlineIcon />,
      text: quotation.orderId ? `Aceptaste la cotización ${quotation.id} y ya la pagaste en el pedido #${quotation.orderId}` : `Aceptaste la cotización ${quotation.id}`,
    },
    Rechazada: { sx: { bgcolor: '#FDECEF', color: '#C00000' }, icon: <InfoOutlinedIcon />, text: `Rechazaste esta cotización el ${formatDM(quotation.decidedAt)}` },
    Expirada: { sx: { bgcolor: '#F7F7F8', color: colors.muted }, icon: <InfoOutlinedIcon />, text: `Expiró el ${until}. Los precios se actualizan cada semana y ya no puedes aceptarla. Se eliminará el ${formatDM(deleteOn(quotation))}.` },
  };
  const v = variants[status];
  return (
    <Box role="status" sx={{ ...base, ...v.sx }}>
      <Box aria-hidden sx={{ display: 'flex', '& svg': { fontSize: 22 } }}>{v.icon}</Box>
      {v.text}
    </Box>
  );
}

/** Detalle de una cotización del cliente: seguimiento, productos, resumen y decisión (aceptar / rechazar). */
export default function QuotationDetailPage() {
  const { quotationId } = useParams();
  const navigate = useNavigate();
  const { getQuotation, acceptQuotation, rejectQuotation, requestQuotation } = useQuotations();
  const { startConversation } = useMessages();
  const [dialog, setDialog] = useState(null); // 'aceptar' | 'rechazar' | 'repetir'
  const [toast, setToast] = useState({ message: '', severity: 'success' });

  const quotation = getQuotation(quotationId);
  if (!quotation) return <Navigate to="/cotizaciones" replace />;

  const now = new Date();
  const status = effectiveStatus(quotation, now);
  const lines = quoteLines(quotation, now);
  const totals = quoteTotals(lines);
  const expired = status === 'Expirada';
  const left = daysLeft(quotation, now);
  const updatedAt = expired ? lastAdjustment(quotation, now) : quotation.updatedAt;
  const notify = (message, severity = 'success') => setToast({ message, severity });

  const confirmDecision = () => {
    const accept = dialog === 'aceptar';
    console.log(`[Cotizaciones] ${accept ? 'Aceptar' : 'Rechazar'} cotización:`, { quotationId: quotation.id, total: totals.total });
    const ok = accept ? acceptQuotation(quotation.id) : rejectQuotation(quotation.id);
    setDialog(null);
    if (ok) notify(accept ? 'Cotización aceptada. Ya puedes continuar al pago.' : 'Cotización rechazada.');
    else notify('Esta cotización ya no se puede modificar.', 'error');
  };

  const requestAgain = ({ items, message }) => {
    const created = requestQuotation({ seller: quotation.seller, items, message });
    console.log('[Cotizaciones] Solicitar nuevamente:', { desde: quotation.id, nueva: created?.id, items: items.length });
    setDialog(null);
    if (created) navigate(`/cotizaciones/${created.id}`);
  };

  const writeToSeller = () => {
    console.log('[Cotizaciones] Escribir al vendedor:', { quotationId: quotation.id, sellerId: quotation.seller.id });
    startConversation({ id: quotation.seller.id, name: quotation.seller.name });
    navigate(`/mensajes/${quotation.seller.id}`);
  };

  const pay = () => {
    console.log('[Cotizaciones] Continuar al pago:', { quotationId: quotation.id, total: totals.total });
    navigate(`/checkout/despacho?cotizacion=${quotation.id}`);
  };

  return (
    <AccountLayout compact maxWidth={1600} showFooter headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <Breadcrumb items={[{ label: 'Mis cotizaciones', href: '/cotizaciones' }, { label: quotation.id }]} />

      <Box sx={{ mt: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: { xs: 26, md: 34 }, fontWeight: 600, color: colors.text, overflowWrap: 'anywhere' }}>Cotización {quotation.id}</Typography>
          <Box sx={{ mt: 1.5 }}><QuotationStatusBadge status={status} size="large" /></Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
          <Button component={RouterLink} to={`/cotizaciones/${quotation.id}/documento`} variant="outlined" sx={outlinedRed}>Descargar PDF</Button>
          <Button onClick={writeToSeller} variant="outlined" sx={outlinedNeutral}>Escribir al vendedor</Button>
        </Box>
      </Box>

      <Box sx={{ mt: 3, px: 2.5, py: 2.25, bgcolor: '#F7F7F8', borderRadius: '6px', display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' } }}>
        <Info label="Solicitada el" value={formatDMY(quotation.createdAt)} />
        <Info label="Vigente hasta" value={`${formatDMY(validUntil(quotation))} · ${QUOTE_VALID_DAYS} días`} />
        <Info label="Vendedor" value={quotation.seller.name} />
        <Info label="Última actualización" value={formatDMY(updatedAt)} />
      </Box>

      <StatusNotice quotation={quotation} status={status} now={now} />

      <Box component="section" aria-labelledby="seguimiento" sx={{ ...card, mt: 3 }}>
        <Typography id="seguimiento" component="h2" sx={{ ...h2, mb: 2.5 }}>Seguimiento de la cotización</Typography>
        <QuotationTracker quotation={quotation} status={status} />
      </Box>

      <Box sx={{ mt: 3, display: 'grid', gap: 3, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 320px' } }}>
        <Box sx={{ minWidth: 0 }}>
          <Box component="section" aria-labelledby="productos" sx={card}>
            <Typography id="productos" component="h2" sx={h2}>Productos cotizados</Typography>
            {expired && (
              <Box sx={{ mt: 2, mb: 1.5, display: 'grid', gap: 1.25 }}>
                <Typography sx={{ fontSize: 12.5, color: colors.muted }}>Precio actual · Último reajuste {formatDMY(lastAdjustment(quotation, now))}</Typography>
                <Typography sx={{ fontSize: 12.5, color: colors.muted }}>El precio cotizado se muestra tachado.</Typography>
              </Box>
            )}
            <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: expired ? 2 : 2.5, p: 0 }}>
              {lines.map((line, i) => <QuotationItemRow key={`${line.productId}-${line.detail}-${i}`} line={line} />)}
            </Box>
          </Box>

          {quotation.message && <MessageCard title="Tu mensaje" author={mockProfile.fullName} at={quotation.createdAt} text={quotation.message} />}
          {quotation.reply && <MessageCard title="Respuesta del vendedor" author={quotation.seller.name} at={quotation.reply.at} text={quotation.reply.text} />}
        </Box>

        <Box component="aside" aria-label="Resumen de cotización" sx={{ ...card, position: { lg: 'sticky' }, top: { lg: 160 } }}>
          <Typography component="h2" sx={h2}>{expired ? 'Resumen actualizado' : 'Resumen de cotización'}</Typography>
          <Box sx={{ mt: 2.5, display: 'grid', gap: 1.5 }}>
            <Row label="Neto" value={formatPrice(totals.neto)} />
            <Row label="IVA (19%)" value={formatPrice(totals.iva)} />
          </Box>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Typography sx={{ fontSize: 17, fontWeight: 600, color: colors.text }}>Total</Typography>
            <Typography sx={{ fontSize: 26, fontWeight: 700, color: colors.primary }}>{formatPrice(totals.total)}</Typography>
          </Box>
          <Typography sx={{ mt: 2, fontSize: 12.5, color: colors.muted }}>El envío se calcula al pagar</Typography>

          {status === 'Solicitada' && <Typography sx={{ mt: 2, fontSize: 13, color: colors.muted }}>Podrás aceptarla cuando el vendedor responda.</Typography>}

          {status === 'Respondida' && (
            <>
              <Typography sx={{ mt: 2, fontSize: 12.5, color: colors.muted }}>{left === 0 ? 'Vence hoy' : `Vence en ${left} ${left === 1 ? 'día' : 'días'}`}</Typography>
              <Button fullWidth onClick={() => setDialog('aceptar')} variant="contained" disableElevation sx={{ ...filled, mt: 2.5 }}>Aceptar cotización</Button>
              <Button fullWidth onClick={() => setDialog('rechazar')} variant="outlined" sx={{ ...outlinedRed, mt: 1.5, height: 44 }}>Rechazar</Button>
            </>
          )}

          {status === 'Aceptada' && (
            <>
              <Typography sx={{ mt: 2, fontSize: 12.5, color: '#2E7D32' }}>Aceptada el {formatDMY(quotation.decidedAt)}</Typography>
              {quotation.orderId ? (
                <Button fullWidth component={RouterLink} to={`/pedidos/${quotation.orderId}`} variant="contained" disableElevation sx={{ ...filled, mt: 2.5 }}>Ver pedido</Button>
              ) : (
                <Button fullWidth onClick={pay} variant="contained" disableElevation sx={{ ...filled, mt: 2.5 }}>Continuar al pago</Button>
              )}
            </>
          )}

          {(status === 'Rechazada' || expired) && (
            <Button fullWidth onClick={() => setDialog('repetir')} variant="contained" disableElevation sx={{ ...filled, mt: 2.5 }}>Solicitar nuevamente</Button>
          )}
        </Box>
      </Box>

      {(dialog === 'aceptar' || dialog === 'rechazar') && <QuotationDecisionDialog mode={dialog} quotation={quotation} onConfirm={confirmDecision} onClose={() => setDialog(null)} />}
      {dialog === 'repetir' && (
        <QuotationRequestDialog
          seller={quotation.seller}
          lines={lines.map((l) => ({ productId: l.productId, name: l.name, detail: l.detail, image: l.image, quantity: l.quantity, unitPrice: l.unitPrice, listPrice: l.listPrice, stock: l.stock }))}
          onSubmit={requestAgain}
          onClose={() => setDialog(null)}
        />
      )}

      <Snackbar open={Boolean(toast.message)} autoHideDuration={3500} onClose={() => setToast((t) => ({ ...t, message: '' }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} variant="filled" onClose={() => setToast((t) => ({ ...t, message: '' }))} sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>
    </AccountLayout>
  );
}
