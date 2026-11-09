import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, IconButton, InputAdornment, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import AdminLayout from '../components/templates/AdminLayout';
import StatCard from '../components/molecules/StatCard';
import PaginationBar from '../components/molecules/PaginationBar';
import SellerChip from '../components/atoms/SellerChip';
import TextInput from '../components/atoms/TextInput';
import SelectInput from '../components/atoms/SelectInput';
import OrderAdminDialog from '../components/organisms/OrderAdminDialog';
import HideContentDialog from '../components/organisms/HideContentDialog';
import { paymentLabel, useAdminOrders } from '../hooks/useAdminOrders';
import { ADMIN_ORDER_STATUSES, ORDER_STATUS_TONE, PERIODS, inPeriod } from '../utils/ordersAdmin';
import { downloadCsv } from '../utils/csv';
import { formatPrice } from '../utils/format';
import { formatWhen, norm, paginate } from '../utils/seller';
import { mockAdmin } from '../utils/mockUsers';
import { currentUser } from '../utils/mockCatalog';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;
const CRUMBS = [{ label: 'Panel de Administración', href: '/admin' }, { label: 'Pedidos y Ventas' }];
const CANCEL_REASONS = ['Solicitud del cliente', 'Pago rechazado o sospecha de fraude', 'Sin stock del vendedor', 'Pedido duplicado', 'Incumplimiento del vendedor', 'Otro motivo'].map((r) => ({ id: r, name: r }));
const COLUMNS = [
  { label: 'Pedido', width: 140 }, { label: 'Comprador', width: 170 }, { label: 'Tienda', width: 140 }, { label: 'Artículos', width: 220 },
  { label: 'Total y pago', width: 150, align: 'right' }, { label: 'Estado', width: 140 }, { label: 'Acciones', width: 90, align: 'right' },
];
const searchSx = { '& .MuiOutlinedInput-root': { height: 40 }, '& .MuiOutlinedInput-input': { py: 0, fontSize: 14 } };
const filterSx = {
  '& .MuiOutlinedInput-root': { height: 40 },
  '& .MuiOutlinedInput-input.MuiSelect-select': { display: 'block', height: 40, lineHeight: '40px', minHeight: 0, py: 0, pl: 1.75, pr: '36px !important', boxSizing: 'border-box', fontSize: 14 },
};
const action = { width: 32, height: 32, borderRadius: '8px', color: '#6B7280', '&:hover': { bgcolor: '#F3F4F6', color: colors.ink }, '& svg': { fontSize: 18 } };

/** Pedidos y ventas de toda la plataforma: seguimiento, cambio de estado, despacho, anulación, comprobantes e historial. */
export default function AdminOrdersPage() {
  const { rows, setStatus, setShipping, cancel, restore } = useAdminOrders();
  const [query, setQuery] = useState('');
  const [store, setStore] = useState('');
  const [status, setStatusFilter] = useState('');
  const [period, setPeriod] = useState('30');
  const [page, setPage] = useState(1);
  const [openKey, setOpenKey] = useState(null);
  const [cancelling, setCancelling] = useState(null);
  const [toast, setToast] = useState('');

  const now = new Date();
  const stores = useMemo(() => [...new Set(rows.map((r) => r.seller))].sort((a, b) => a.localeCompare(b, 'es')), [rows]);
  const scoped = rows.filter((r) => inPeriod(r.createdAt, period, now) && (!store || r.seller === store));
  const valid = scoped.filter((r) => !r.cancelled);
  const sales = valid.reduce((s, r) => s + r.total, 0);
  const stats = {
    sales,
    orders: valid.length,
    pending: valid.filter((r) => r.status === 'Recibido' || r.status === 'En preparación').length,
    ticket: valid.length ? Math.round(sales / valid.length) : 0,
    refunded: valid.reduce((s, r) => s + r.refunded, 0),
  };

  const term = norm(query.trim());
  const filtered = scoped.filter((r) => (!status || r.status === status) && (!term || norm(`${r.id} ${r.buyer} ${r.seller} ${r.items.map((i) => i.name).join(' ')}`).includes(term)));
  const view = paginate(filtered, page, PAGE_SIZE);
  const open = openKey ? rows.find((r) => r.key === openKey) : null;
  const reset = (fn) => (e) => { fn(e.target.value); setPage(1); };
  const reportHref = `/admin/pedidos/historial?periodo=${period}${store ? `&tienda=${encodeURIComponent(store)}` : ''}`;

  // ---------- Acciones ----------
  const onStatus = (next) => { console.log('[Admin/Pedidos] Cambiar estado:', { key: open.key, antes: open.status, despues: next }); setStatus(open, next); setToast(`Pedido ${open.id}: ${next}.`); };
  const onShipping = (shipping) => { console.log('[Admin/Pedidos] Guardar despacho:', { key: open.key, ...shipping }); setShipping(open, shipping); setToast(`Despacho del pedido ${open.id} guardado.`); };
  const onCancel = (reason, note) => {
    console.log('[Admin/Pedidos] Anular pedido:', { key: cancelling.key, reason, note });
    cancel(cancelling, reason, note);
    setToast(`Pedido ${cancelling.id} anulado.`);
    setCancelling(null);
  };
  const onRestore = () => { console.log('[Admin/Pedidos] Deshacer anulación:', { key: open.key }); restore(open); setToast(`Se deshizo la anulación del pedido ${open.id}.`); };

  const exportCsv = () => downloadCsv('pedidos-todomart.csv', filtered, [
    { header: 'Pedido', value: (r) => r.id },
    { header: 'Fecha', value: (r) => new Date(r.createdAt).toLocaleString('es-CL') },
    { header: 'Comprador', value: (r) => r.buyer },
    { header: 'Tienda', value: (r) => r.seller },
    { header: 'Artículos', value: (r) => r.items.map((i) => `${i.quantity}x ${i.name}`).join('; ') },
    { header: 'Neto', value: (r) => r.neto },
    { header: 'IVA', value: (r) => r.iva },
    { header: 'Total', value: (r) => r.total },
    { header: 'Pago', value: (r) => paymentLabel(r.payment) },
    { header: 'Transporte', value: (r) => r.carrier ?? '' },
    { header: 'Seguimiento', value: (r) => r.tracking ?? '' },
    { header: 'Estado', value: (r) => r.status },
    { header: 'Reembolsado', value: (r) => r.refunded },
  ]);

  return (
    <AdminLayout headerProps={{ user: currentUser }} crumbs={CRUMBS} admin={mockAdmin}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.ink }}>Pedidos y Ventas</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.muted }}>Todas las compras de la plataforma, con su estado, despacho y comprobante.</Typography>
        </Box>
        <Button component={RouterLink} to={reportHref} startIcon={<SummarizeOutlinedIcon />} variant="contained" disableElevation sx={{ height: 40, px: 2.5, borderRadius: '6px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>
          Historial transaccional
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(5, minmax(0, 1fr))' } }}>
        <StatCard label="Ventas del período" value={formatPrice(stats.sales)} />
        <StatCard label="Pedidos" value={stats.orders} color="#4B5563" />
        <StatCard label="Por despachar" value={stats.pending} color="#C2410C" />
        <StatCard label="Ticket promedio" value={formatPrice(stats.ticket)} color="#4B5563" />
        <StatCard label="Reembolsado" value={formatPrice(stats.refunded)} color={colors.primary} />
      </Box>

      <Box component="section" aria-labelledby="orders-title" sx={{ mt: 3, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2.5, pt: 2.5, pb: 2 }}>
          <Typography id="orders-title" component="h2" sx={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>Listado de pedidos</Typography>
          <Button onClick={exportCsv} startIcon={<FileDownloadOutlinedIcon />} variant="outlined" sx={{ height: 30, px: 1.5, borderRadius: '6px', borderColor: '#D1D5DB', color: colors.ink, textTransform: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', '& svg': { fontSize: 16 } }}>
            Exportar CSV
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gap: 1.25, px: 2.5, pb: 2, borderBottom: '1px solid #E5E7EB', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'minmax(0, 1.3fr) repeat(3, minmax(0, 1fr))' } }}>
          <TextInput
            value={query}
            onChange={reset(setQuery)}
            placeholder="Buscar pedido, comprador o producto..."
            inputProps={{ 'aria-label': 'Buscar pedido' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9CA3AF' }} /></InputAdornment> }}
            sx={searchSx}
          />
          <SelectInput options={PERIODS} value={period} onChange={reset(setPeriod)} ariaLabel="Período" sx={filterSx} />
          <SelectInput options={[{ id: '', name: 'Todas las tiendas' }, ...stores.map((s) => ({ id: s, name: s }))]} value={store} onChange={reset(setStore)} ariaLabel="Filtrar por tienda" sx={filterSx} />
          <SelectInput options={[{ id: '', name: 'Todos los estados' }, ...[...ADMIN_ORDER_STATUSES, 'Anulado'].map((s) => ({ id: s, name: s }))]} value={status} onChange={reset(setStatusFilter)} ariaLabel="Filtrar por estado" sx={filterSx} />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1000 }} aria-label="Listado de pedidos">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                {COLUMNS.map((c) => (
                  <TableCell key={c.label} align={c.align} sx={{ width: c.width, py: 1.5, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}>{c.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {view.rows.length === 0 && (
                <TableRow><TableCell colSpan={COLUMNS.length} sx={{ py: 6, textAlign: 'center', color: colors.muted }}>No hay pedidos con esos filtros.</TableCell></TableRow>
              )}
              {view.rows.map((r) => {
                const cell = { py: 1.5, fontSize: 14, color: colors.ink, borderBottom: '1px solid #F0F1F3' };
                const units = r.items.reduce((s, i) => s + i.quantity, 0);
                return (
                  <TableRow key={r.key} hover>
                    <TableCell sx={cell}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{r.id}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>{formatWhen(r.createdAt, now)}</Typography>
                    </TableCell>
                    <TableCell sx={cell}>{r.buyer}</TableCell>
                    <TableCell sx={cell}>{r.seller}</TableCell>
                    <TableCell sx={cell}>
                      <Typography sx={{ fontSize: 13.5, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }} title={r.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}>
                        {r.items[0].name}{r.items.length > 1 ? ` +${r.items.length - 1}` : ''}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>{units} {units === 1 ? 'unidad' : 'unidades'}</Typography>
                    </TableCell>
                    <TableCell sx={cell} align="right">
                      <Typography sx={{ fontSize: 14, fontWeight: 700, textDecoration: r.cancelled ? 'line-through' : 'none', color: r.cancelled ? '#9CA3AF' : colors.ink }}>{formatPrice(r.total)}</Typography>
                      <Typography sx={{ fontSize: 12, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{r.payment?.method === 'transferencia' ? 'Transferencia' : `Tarjeta ···· ${r.payment?.last4 ?? ''}`}</Typography>
                    </TableCell>
                    <TableCell sx={cell}>
                      <SellerChip label={r.status} tone={ORDER_STATUS_TONE[r.status]} dot />
                      {r.refunded > 0 && <Typography sx={{ mt: 0.5, fontSize: 11.5, color: colors.primary }}>Reembolso {formatPrice(r.refunded)}</Typography>}
                    </TableCell>
                    <TableCell sx={cell} align="right">
                      <Box sx={{ display: 'inline-flex', gap: 0.25 }}>
                        <Tooltip title="Ver detalle"><IconButton onClick={() => setOpenKey(r.key)} aria-label={`Ver detalle del pedido ${r.id}`} sx={action}><VisibilityOutlinedIcon /></IconButton></Tooltip>
                        <Tooltip title="Comprobante"><IconButton component={RouterLink} to={`/admin/pedidos/${r.id}/comprobante`} aria-label={`Comprobante del pedido ${r.id}`} sx={action}><ReceiptLongOutlinedIcon /></IconButton></Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} pedidos`} sx={{ px: 2.5, borderTop: '1px solid #E5E7EB' }} />
      </Box>

      {open && (
        <OrderAdminDialog
          key={open.key}
          row={open}
          onStatus={onStatus}
          onShipping={onShipping}
          onCancel={() => setCancelling(open)}
          onRestore={onRestore}
          onClose={() => setOpenKey(null)}
        />
      )}

      {cancelling && (
        <HideContentDialog
          title={`Anular pedido ${cancelling.id}`}
          subtitle="El pedido deja de contar como venta. El comprador y la tienda verán el motivo."
          preview={`${cancelling.buyer} · ${cancelling.seller} · ${formatPrice(cancelling.total)}`}
          reasons={CANCEL_REASONS}
          confirmLabel="Anular pedido"
          onConfirm={onCancel}
          onClose={() => setCancelling(null)}
        />
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AdminLayout>
  );
}
