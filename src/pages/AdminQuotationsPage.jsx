import { useEffect, useMemo, useState } from 'react';
import { Alert, Box, Button, IconButton, InputAdornment, LinearProgress, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import AdminLayout from '../components/templates/AdminLayout';
import StatCard from '../components/molecules/StatCard';
import PaginationBar from '../components/molecules/PaginationBar';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import SellerChip from '../components/atoms/SellerChip';
import TextInput from '../components/atoms/TextInput';
import SelectInput from '../components/atoms/SelectInput';
import QuotationAdminDialog from '../components/organisms/QuotationAdminDialog';
import { LIFECYCLE_EVERY_DAYS, readLifecycle, useAdminQuotations } from '../hooks/useAdminQuotations';
import { QUOTE_ADMIN_STATUSES, QUOTE_STATUS_TONE } from '../utils/quotationsAdmin';
import { QUOTE_ADJUST_RATE, QUOTE_DELETE_DAYS, QUOTE_VALID_DAYS, formatDM, formatDMY } from '../utils/quotations';
import { downloadCsv } from '../utils/csv';
import { formatPrice } from '../utils/format';
import { formatWhen, norm, paginate } from '../utils/seller';
import { card } from '../utils/sellerStyles';
import { mockAdmin } from '../utils/mockUsers';
import { currentUser } from '../utils/mockCatalog';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;
const DAY = 86400000;
const CRUMBS = [{ label: 'Panel de Administración', href: '/admin' }, { label: 'Cotizaciones' }];
const COLUMNS = [
  { label: 'Cotización', width: 140 }, { label: 'Cliente', width: 170 }, { label: 'Tienda', width: 150 }, { label: 'Productos', width: 210 },
  { label: 'Monto', width: 120, align: 'right' }, { label: 'Ciclo', width: 150 }, { label: 'Estado', width: 130 }, { label: 'Acciones', width: 90, align: 'right' },
];
const searchSx = { '& .MuiOutlinedInput-root': { height: 40 }, '& .MuiOutlinedInput-input': { py: 0, fontSize: 14 } };
const filterSx = {
  '& .MuiOutlinedInput-root': { height: 40 },
  '& .MuiOutlinedInput-input.MuiSelect-select': { display: 'block', height: 40, lineHeight: '40px', minHeight: 0, py: 0, pl: 1.75, pr: '36px !important', boxSizing: 'border-box', fontSize: 14 },
};
const action = { width: 32, height: 32, borderRadius: '8px', color: '#6B7280', '&:hover': { bgcolor: '#F3F4F6', color: colors.ink }, '& svg': { fontSize: 18 } };
const rule = { display: 'block', px: 1.5, py: 1, bgcolor: '#F9FAFB', border: '1px solid #EEF0F2', borderRadius: '8px', fontSize: 13, color: colors.ink };

/** Texto de vigencia para la tabla. */
function validity(r) {
  if (r.status === 'Por eliminar') return { text: 'Se elimina en la próxima limpieza', tone: colors.primary };
  if (r.status === 'Expirada') return { text: `Venció el ${formatDM(r.validUntil)} · se elimina el ${formatDM(r.deleteOn)}`, tone: '#B45309' };
  if (r.status === 'Solicitada' || r.status === 'Respondida') return { text: r.daysLeft <= 0 ? 'Vence hoy' : `Vence en ${r.daysLeft} ${r.daysLeft === 1 ? 'día' : 'días'}`, tone: r.daysLeft <= 3 ? colors.primary : '#6B7280' };
  return { text: `Se elimina el ${formatDM(r.deleteOn)}`, tone: '#6B7280' };
}

/**
 * Cotizaciones de toda la plataforma: seguimiento, cambio de estado, renovación, eliminación y la gestión automática
 * del ciclo de vida (vigencia de 15 días, reajuste semanal de precios tras vencer y eliminación a los 45 días).
 */
export default function AdminQuotationsPage() {
  const { rows, setStatus, renew, remove, purge } = useAdminQuotations();
  const [query, setQuery] = useState('');
  const [store, setStore] = useState('');
  const [status, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [openKey, setOpenKey] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [purging, setPurging] = useState(false);
  const [lastRun, setLastRun] = useState(readLifecycle);
  const [toast, setToast] = useState('');

  // Limpieza automática semanal: si ya pasaron 7 días desde la última, corre al abrir el panel
  useEffect(() => {
    if (Date.now() - new Date(lastRun.at) >= LIFECYCLE_EVERY_DAYS * DAY) {
      const run = purge(true);
      console.log('[Admin/Cotizaciones] Limpieza automática:', run);
      setLastRun(run); // eslint-disable-line react-hooks/set-state-in-effect
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const now = new Date();
  const stores = useMemo(() => [...new Set(rows.map((r) => r.seller))].sort((a, b) => a.localeCompare(b, 'es')), [rows]);
  const live = rows.filter((r) => r.status !== 'Por eliminar');
  const decided = live.filter((r) => ['Aceptada', 'Rechazada', 'Expirada'].includes(r.status));
  const accepted = live.filter((r) => r.status === 'Aceptada').length;
  const stats = {
    open: live.filter((r) => r.status === 'Solicitada').length,
    answered: live.filter((r) => r.status === 'Respondida').length,
    conversion: decided.length ? Math.round((accepted / decided.length) * 100) : 0,
    expiring: live.filter((r) => (r.status === 'Solicitada' || r.status === 'Respondida') && r.daysLeft <= 3).length,
    expired: live.filter((r) => r.status === 'Expirada').length,
  };
  const toPurge = rows.filter((r) => r.status === 'Por eliminar').length;
  const nextRun = new Date(new Date(lastRun.at).getTime() + LIFECYCLE_EVERY_DAYS * DAY);

  const term = norm(query.trim());
  const filtered = rows.filter((r) => (!store || r.seller === store) && (!status || r.status === status)
    && (!term || norm(`${r.id} ${r.buyer} ${r.seller} ${r.lines.map((l) => l.name).join(' ')}`).includes(term)));
  const view = paginate(filtered, page, PAGE_SIZE);
  const open = openKey ? rows.find((r) => r.key === openKey) : null;
  const reset = (fn) => (e) => { fn(e.target.value); setPage(1); };

  // ---------- Acciones ----------
  const runPurge = () => {
    const run = purge(false);
    console.log('[Admin/Cotizaciones] Limpieza manual:', run);
    setLastRun(run);
    setPurging(false);
    setToast(run.removed ? `Se eliminaron ${run.removed} ${run.removed === 1 ? 'cotización' : 'cotizaciones'} con ${QUOTE_DELETE_DAYS} días o más.` : 'No había cotizaciones por eliminar.');
  };
  const onStatus = (next) => { console.log('[Admin/Cotizaciones] Cambiar estado:', { key: open.key, antes: open.stored, despues: next }); setStatus(open, next); setToast(`Cotización ${open.id}: ${next}.`); };
  const onRenew = (row) => { console.log('[Admin/Cotizaciones] Renovar vigencia:', { key: row.key }); renew(row); setToast(`Cotización ${row.id} renovada: vence en ${QUOTE_VALID_DAYS} días.`); };
  const confirmDelete = () => {
    console.log('[Admin/Cotizaciones] Eliminar:', { key: deleting.key });
    remove(deleting);
    if (openKey === deleting.key) setOpenKey(null);
    setToast(`Cotización ${deleting.id} eliminada.`);
    setDeleting(null);
  };

  const exportCsv = () => downloadCsv('cotizaciones-todomart.csv', filtered, [
    { header: 'Cotización', value: (r) => r.id },
    { header: 'Emisión', value: (r) => formatDMY(r.createdAt) },
    { header: 'Cliente', value: (r) => r.buyer },
    { header: 'Tienda', value: (r) => r.seller },
    { header: 'Productos', value: (r) => r.lines.map((l) => `${l.quantity}x ${l.name}`).join('; ') },
    { header: 'Total cotizado', value: (r) => r.quotedTotal },
    { header: 'Total vigente', value: (r) => r.total },
    { header: 'Vence', value: (r) => formatDMY(r.validUntil) },
    { header: 'Se elimina', value: (r) => formatDMY(r.deleteOn) },
    { header: 'Estado', value: (r) => r.status },
  ]);

  return (
    <AdminLayout headerProps={{ user: currentUser }} crumbs={CRUMBS} admin={mockAdmin}>
      <Box sx={{ mb: 3 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.ink }}>Cotizaciones</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.muted }}>Solicitudes de cotización de toda la plataforma y su ciclo de vida.</Typography>
      </Box>

      <Box component="section" aria-labelledby="lifecycle-title" sx={{ ...card, borderRadius: 3, p: { xs: 2, md: 2.5 }, mb: 3, display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) auto' }, alignItems: 'center' }}>
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ScheduleOutlinedIcon sx={{ fontSize: 20, color: colors.primary }} />
            <Typography id="lifecycle-title" component="h2" sx={{ fontSize: 16, fontWeight: 600, color: colors.ink }}>Gestión automática del ciclo de vida</Typography>
          </Box>
          <Box sx={{ mt: 1.5, display: 'grid', gap: 1, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))' } }}>
            <Box sx={rule}><b>{QUOTE_VALID_DAYS} días</b> de vigencia; luego queda Expirada</Box>
            <Box sx={rule}>Precios <b>+{Math.round(QUOTE_ADJUST_RATE * 100)} % semanal</b> tras vencer</Box>
            <Box sx={rule}>Eliminación física a los <b>{QUOTE_DELETE_DAYS} días</b></Box>
          </Box>
          <Typography sx={{ mt: 1.25, fontSize: 12.5, color: colors.muted }}>
            Última limpieza: {formatWhen(lastRun.at, now)}{lastRun.auto ? ' (automática)' : ' (manual)'} · {lastRun.removed} eliminadas · Próxima automática: {formatDMY(nextRun)}
          </Typography>
        </Box>
        <Button onClick={() => setPurging(true)} startIcon={<AutorenewIcon />} variant={toPurge ? 'contained' : 'outlined'} disableElevation
          sx={{ height: 40, px: 2.5, borderRadius: '6px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', whiteSpace: 'nowrap', ...(toPurge ? { bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } } : { color: colors.ink, borderColor: '#D1D5DB' }) }}>
          Ejecutar limpieza ahora{toPurge ? ` (${toPurge})` : ''}
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(5, minmax(0, 1fr))' } }}>
        <StatCard label="Por responder" value={stats.open} color="#1D4ED8" />
        <StatCard label="Esperando al cliente" value={stats.answered} color="#C2410C" />
        <StatCard label="Tasa de conversión" value={`${stats.conversion} %`} color="#15803D" />
        <StatCard label="Vencen en 3 días" value={stats.expiring} color={colors.primary} />
        <StatCard label="Expiradas" value={stats.expired} color="#4B5563" />
      </Box>

      <Box component="section" aria-labelledby="quotes-title" sx={{ mt: 3, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2.5, pt: 2.5, pb: 2 }}>
          <Typography id="quotes-title" component="h2" sx={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>Listado de cotizaciones</Typography>
          <Button onClick={exportCsv} startIcon={<FileDownloadOutlinedIcon />} variant="outlined" sx={{ height: 30, px: 1.5, borderRadius: '6px', borderColor: '#D1D5DB', color: colors.ink, textTransform: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', '& svg': { fontSize: 16 } }}>
            Exportar CSV
          </Button>
        </Box>
        <Box sx={{ display: 'grid', gap: 1.25, px: 2.5, pb: 2, borderBottom: '1px solid #E5E7EB', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'minmax(0, 1.4fr) repeat(2, minmax(0, 1fr))' } }}>
          <Box sx={{ gridColumn: { sm: '1 / -1', lg: 'auto' } }}>
            <TextInput value={query} onChange={reset(setQuery)} placeholder="Buscar cotización, cliente o producto..." inputProps={{ 'aria-label': 'Buscar cotización' }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9CA3AF' }} /></InputAdornment> }} sx={searchSx} />
          </Box>
          <SelectInput options={[{ id: '', name: 'Todas las tiendas' }, ...stores.map((s) => ({ id: s, name: s }))]} value={store} onChange={reset(setStore)} ariaLabel="Filtrar por tienda" sx={filterSx} />
          <SelectInput options={[{ id: '', name: 'Todos los estados' }, ...QUOTE_ADMIN_STATUSES.map((s) => ({ id: s, name: s }))]} value={status} onChange={reset(setStatusFilter)} ariaLabel="Filtrar por estado" sx={filterSx} />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1080 }} aria-label="Listado de cotizaciones">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                {COLUMNS.map((c) => <TableCell key={c.label} align={c.align} sx={{ width: c.width, py: 1.5, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}>{c.label}</TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {view.rows.length === 0 && <TableRow><TableCell colSpan={COLUMNS.length} sx={{ py: 6, textAlign: 'center', color: colors.muted }}>No hay cotizaciones con esos filtros.</TableCell></TableRow>}
              {view.rows.map((r) => {
                const cell = { py: 1.5, fontSize: 14, color: colors.ink, borderBottom: '1px solid #F0F1F3' };
                const v = validity(r);
                const adjusted = r.total !== r.quotedTotal;
                return (
                  <TableRow key={r.key} hover>
                    <TableCell sx={cell}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{r.id}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>{formatDMY(r.createdAt)}</Typography>
                    </TableCell>
                    <TableCell sx={cell}>{r.buyer}</TableCell>
                    <TableCell sx={cell}>{r.seller}</TableCell>
                    <TableCell sx={cell}>
                      <Typography sx={{ fontSize: 13.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 210 }} title={r.lines.map((l) => `${l.quantity}x ${l.name}`).join(', ')}>
                        {r.lines[0]?.name}{r.lines.length > 1 ? ` +${r.lines.length - 1}` : ''}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: v.tone }}>{v.text}</Typography>
                    </TableCell>
                    <TableCell sx={cell} align="right">
                      <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{formatPrice(r.total)}</Typography>
                      {adjusted && <Typography sx={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'line-through' }}>{formatPrice(r.quotedTotal)}</Typography>}
                    </TableCell>
                    <TableCell sx={cell}>
                      <LinearProgress variant="determinate" value={(r.cycleDay / QUOTE_DELETE_DAYS) * 100} aria-label={`Día ${r.cycleDay} de ${QUOTE_DELETE_DAYS}`}
                        sx={{ height: 6, borderRadius: 3, bgcolor: '#F3F4F6', '& .MuiLinearProgress-bar': { bgcolor: r.cycleDay >= QUOTE_DELETE_DAYS ? colors.primary : r.cycleDay > QUOTE_VALID_DAYS ? '#F59E0B' : '#16A34A' } }} />
                      <Typography sx={{ mt: 0.5, fontSize: 12, color: '#6B7280' }}>Día {r.cycleDay} de {QUOTE_DELETE_DAYS}{r.renewedAt ? ' · renovada' : ''}</Typography>
                    </TableCell>
                    <TableCell sx={cell}><SellerChip label={r.status} tone={QUOTE_STATUS_TONE[r.status]} dot /></TableCell>
                    <TableCell sx={cell} align="right">
                      <Box sx={{ display: 'inline-flex', gap: 0.25 }}>
                        <Tooltip title="Ver detalle"><IconButton onClick={() => setOpenKey(r.key)} aria-label={`Ver detalle de la cotización ${r.id}`} sx={action}><VisibilityOutlinedIcon /></IconButton></Tooltip>
                        <Tooltip title="Eliminar"><IconButton onClick={() => setDeleting(r)} aria-label={`Eliminar la cotización ${r.id}`} sx={{ ...action, '&:hover': { bgcolor: '#FEF2F2', color: colors.primary } }}><DeleteOutlinedIcon /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} cotizaciones`} sx={{ px: 2.5, borderTop: '1px solid #E5E7EB' }} />
      </Box>

      {open && <QuotationAdminDialog key={`${open.key}-${open.stored}-${open.renewedAt}`} row={open} onStatus={onStatus} onRenew={() => onRenew(open)} onDelete={() => setDeleting(open)} onClose={() => setOpenKey(null)} />}

      {deleting && (
        <ConfirmDialog
          title={`Eliminar cotización ${deleting.id}`}
          message={`Se eliminará de forma permanente para el cliente (${deleting.buyer}) y para la tienda (${deleting.seller}).${deleting.orderId ? ` El pedido ${deleting.orderId} no se ve afectado.` : ''}`}
          confirmLabel="Eliminar"
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      {purging && (
        <ConfirmDialog
          title="Ejecutar limpieza ahora"
          message={toPurge ? `Se eliminarán ${toPurge} ${toPurge === 1 ? 'cotización que cumplió' : 'cotizaciones que cumplieron'} ${QUOTE_DELETE_DAYS} días. Esta acción no se puede deshacer.` : `No hay cotizaciones con ${QUOTE_DELETE_DAYS} días o más. Igual se registrará la ejecución.`}
          confirmLabel="Ejecutar"
          onConfirm={runPurge}
          onClose={() => setPurging(false)}
        />
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AdminLayout>
  );
}
