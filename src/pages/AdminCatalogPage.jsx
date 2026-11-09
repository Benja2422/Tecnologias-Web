import { useMemo, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, IconButton, InputAdornment, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import RestoreIcon from '@mui/icons-material/Restore';
import AdminLayout from '../components/templates/AdminLayout';
import StatCard from '../components/molecules/StatCard';
import PaginationBar from '../components/molecules/PaginationBar';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import SellerChip from '../components/atoms/SellerChip';
import ItemThumb from '../components/atoms/ItemThumb';
import TextInput from '../components/atoms/TextInput';
import SelectInput from '../components/atoms/SelectInput';
import PrimaryButton from '../components/atoms/PrimaryButton';
import CatalogItemDialog from '../components/organisms/CatalogItemDialog';
import HideContentDialog from '../components/organisms/HideContentDialog';
import { useCategories } from '../contexts/CategoriesContext';
import { useAdminCatalog } from '../hooks/useAdminCatalog';
import { getCategoryPath, getCategoryType } from '../utils/mockCategories';
import { downloadCsv } from '../utils/csv';
import { formatPrice } from '../utils/format';
import { norm, paginate } from '../utils/seller';
import { mockAdmin } from '../utils/mockUsers';
import { currentUser } from '../utils/mockCatalog';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;
const CRUMBS = [{ label: 'Panel de Administración', href: '/admin' }, { label: 'Productos y Servicios' }];
const STATUS_TONE = { Publicado: 'green', 'Sin stock': 'orange', Borrador: 'yellow', Suspendido: 'red', 'Dado de baja': 'grey' };
const STATUSES = ['Publicado', 'Sin stock', 'Borrador', 'Suspendido', 'Dado de baja'];
const SUSPEND_REASONS = [
  'Producto prohibido o restringido', 'Información falsa o engañosa', 'Infracción de propiedad intelectual',
  'Precio abusivo o fraudulento', 'Fotos o contenido inapropiado', 'Solicitud del emprendedor', 'Otro motivo',
].map((r) => ({ id: r, name: r }));
const COLUMNS = [
  { label: 'Publicación', width: 300 }, { label: 'Tienda', width: 150 }, { label: 'Categoría', width: 170 },
  { label: 'Precio', width: 120, align: 'right' }, { label: 'Stock', width: 90, align: 'right' }, { label: 'Estado', width: 130 },
  { label: 'Acciones', width: 170, align: 'right' },
];
const searchSx = { '& .MuiOutlinedInput-root': { height: 40 }, '& .MuiOutlinedInput-input': { py: 0, fontSize: 14 } };
const filterSx = {
  '& .MuiOutlinedInput-root': { height: 40 },
  '& .MuiOutlinedInput-input.MuiSelect-select': { display: 'block', height: 40, lineHeight: '40px', minHeight: 0, py: 0, pl: 1.75, pr: '36px !important', boxSizing: 'border-box', fontSize: 14 },
};
const action = { width: 32, height: 32, borderRadius: '8px', color: '#6B7280', '&:hover': { bgcolor: '#F3F4F6', color: colors.ink }, '& svg': { fontSize: 18 } };
const n = (v) => v.toLocaleString('es-CL');

const categoryName = (row) => {
  const type = row.kind === 'servicio' ? 'servicios' : 'productos';
  return getCategoryType(row.categoryId) === type ? getCategoryPath(row.categoryId).map((c) => c.name) : null;
};

/** Catálogo completo de la plataforma: ver, crear, editar, suspender y dar de baja productos y servicios de todas las tiendas. */
export default function AdminCatalogPage() {
  const { rows, save, suspend, reactivate, remove, restore } = useAdminCatalog();
  const { trees } = useCategories();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('');
  const [store, setStore] = useState('');
  const [root, setRoot] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null); // { row: row | null }
  const [suspending, setSuspending] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [toast, setToast] = useState('');

  const stores = useMemo(() => [...new Set(rows.map((r) => r.seller))].sort((a, b) => a.localeCompare(b, 'es')), [rows]);
  const live = rows.filter((r) => !r.removed);
  const stats = {
    active: live.filter((r) => ['Publicado', 'Sin stock'].includes(r.status)).length,
    products: live.filter((r) => r.kind === 'producto').length,
    services: live.filter((r) => r.kind === 'servicio').length,
    noStock: live.filter((r) => r.status === 'Sin stock').length,
    suspended: live.filter((r) => r.status === 'Suspendido').length,
  };

  const rootOptions = [
    { id: '', name: 'Todas las categorías' },
    ...trees.productos.map((c) => ({ id: c.id, name: c.name })),
    ...trees.servicios.map((c) => ({ id: c.id, name: `${c.name} (servicios)` })),
    { id: '__none__', name: 'Sin categoría válida' },
  ];

  const term = norm(query.trim());
  const filtered = rows
    .filter((r) => (!kind || r.kind === kind) && (!store || r.seller === store) && (!status || r.status === status)
      && (!root || (root === '__none__' ? !categoryName(r) : getCategoryPath(r.categoryId)[0]?.id === root))
      && (!term || norm(`${r.name} ${r.sku} ${r.seller}`).includes(term)))
    .sort((a, b) => (a.removed - b.removed) || a.name.localeCompare(b.name, 'es'));
  const view = paginate(filtered, page, PAGE_SIZE);
  const reset = (fn) => (e) => { fn(e.target.value); setPage(1); };

  // ---------- Acciones ----------
  const onSave = (values) => {
    // TODO: guardar vía src/services
    console.log(`[Admin/Catálogo] ${editing.row ? 'Actualizar' : 'Crear'} publicación:`, { id: editing.row?.id ?? null, ...values });
    save(editing.row, values);
    setToast(editing.row ? 'Publicación actualizada' : 'Publicación creada');
    setEditing(null);
  };
  const onSuspend = (reason, note) => {
    console.log('[Admin/Catálogo] Suspender:', { key: suspending.key, reason, note });
    suspend(suspending, reason, note);
    setToast(`"${suspending.name}" quedó suspendida y no se muestra en la tienda.`);
    setSuspending(null);
  };
  const onRemove = () => {
    console.log('[Admin/Catálogo] Dar de baja:', { key: removing.key });
    remove(removing);
    setToast(`"${removing.name}" fue dada de baja.`);
    setRemoving(null);
  };
  const doReactivate = (row) => { console.log('[Admin/Catálogo] Reactivar:', { key: row.key }); reactivate(row); setToast(`"${row.name}" volvió a publicarse.`); };
  const doRestore = (row) => { console.log('[Admin/Catálogo] Restaurar baja:', { key: row.key }); restore(row); setToast(`"${row.name}" fue restaurada.`); };

  const exportCsv = () => downloadCsv('publicaciones-todomart.csv', filtered, [
    { header: 'ID / SKU', value: (r) => r.sku },
    { header: 'Tipo', value: (r) => r.kind },
    { header: 'Nombre', value: (r) => r.name },
    { header: 'Tienda', value: (r) => r.seller },
    { header: 'Categoría', value: (r) => categoryName(r)?.join(' > ') ?? 'Sin categoría' },
    { header: 'Precio', value: (r) => r.price },
    { header: 'Stock', value: (r) => r.stock ?? '' },
    { header: 'Estado', value: (r) => r.status },
    { header: 'Motivo suspensión', value: (r) => r.suspended?.reason ?? '' },
  ]);

  return (
    <AdminLayout headerProps={{ user: currentUser }} crumbs={CRUMBS} admin={mockAdmin}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.ink }}>Productos y Servicios</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.muted }}>Catálogo completo de todas las tiendas de la plataforma.</Typography>
        </Box>
        <PrimaryButton fullWidth={false} onClick={() => setEditing({ row: null })} sx={{ height: 40, px: 2.5, py: 0, fontSize: 14, borderRadius: '6px' }}>
          Crear publicación
        </PrimaryButton>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr)', md: 'repeat(3, minmax(0, 1fr))', lg: 'repeat(5, minmax(0, 1fr))' } }}>
        <StatCard label="Publicaciones activas" value={n(stats.active)} />
        <StatCard label="Productos" value={n(stats.products)} color="#4B5563" />
        <StatCard label="Servicios" value={n(stats.services)} color="#4B5563" />
        <StatCard label="Sin stock" value={n(stats.noStock)} color="#C2410C" />
        <StatCard label="Suspendidas" value={n(stats.suspended)} color={colors.primary} />
      </Box>

      <Box component="section" aria-labelledby="catalog-title" sx={{ mt: 3, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2.5, pt: 2.5, pb: 2 }}>
          <Typography id="catalog-title" component="h2" sx={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>Listado de publicaciones</Typography>
          <Button onClick={exportCsv} startIcon={<FileDownloadOutlinedIcon />} variant="outlined" sx={{ height: 30, px: 1.5, borderRadius: '6px', borderColor: '#D1D5DB', color: colors.ink, textTransform: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', '& svg': { fontSize: 16 } }}>
            Exportar CSV
          </Button>
        </Box>

        <Box sx={{ display: 'grid', gap: 1.25, px: 2.5, pb: 2, borderBottom: '1px solid #E5E7EB', gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'minmax(0, 1.1fr) repeat(4, minmax(0, 1fr))' } }}>
          <TextInput
            value={query}
            onChange={reset(setQuery)}
            placeholder="Buscar nombre, SKU o tienda..."
            inputProps={{ 'aria-label': 'Buscar publicación' }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9CA3AF' }} /></InputAdornment> }}
            sx={searchSx}
          />
          <SelectInput options={[{ id: '', name: 'Todos los tipos' }, { id: 'producto', name: 'Solo productos' }, { id: 'servicio', name: 'Solo servicios' }]} value={kind} onChange={reset(setKind)} ariaLabel="Filtrar por tipo" sx={filterSx} />
          <SelectInput options={[{ id: '', name: 'Todas las tiendas' }, ...stores.map((s) => ({ id: s, name: s }))]} value={store} onChange={reset(setStore)} ariaLabel="Filtrar por tienda" sx={filterSx} />
          <SelectInput options={rootOptions} value={root} onChange={reset(setRoot)} ariaLabel="Filtrar por categoría" sx={filterSx} />
          <SelectInput options={[{ id: '', name: 'Todos los estados' }, ...STATUSES.map((s) => ({ id: s, name: s }))]} value={status} onChange={reset(setStatus)} ariaLabel="Filtrar por estado" sx={filterSx} />
        </Box>

        <TableContainer>
          <Table sx={{ minWidth: 1080 }} aria-label="Listado de publicaciones">
            <TableHead>
              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                {COLUMNS.map((c) => (
                  <TableCell key={c.label} align={c.align} sx={{ width: c.width, py: 1.5, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}>{c.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {view.rows.length === 0 && (
                <TableRow><TableCell colSpan={COLUMNS.length} sx={{ py: 6, textAlign: 'center', color: colors.muted }}>No hay publicaciones con esos filtros.</TableCell></TableRow>
              )}
              {view.rows.map((r) => {
                const path = categoryName(r);
                const cell = { py: 1.5, fontSize: 14, color: colors.ink, borderBottom: '1px solid #F0F1F3', opacity: r.removed ? 0.6 : 1 };
                return (
                  <TableRow key={r.key} hover>
                    <TableCell sx={cell}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <ItemThumb src={r.image} size={44} />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink, lineHeight: 1.35, overflowWrap: 'anywhere' }}>{r.name}</Typography>
                          <Typography sx={{ fontSize: 12, color: '#9CA3AF' }}>{r.kind === 'servicio' ? 'Servicio' : 'Producto'} · {r.sku}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={cell}>{r.seller}</TableCell>
                    <TableCell sx={cell} title={path?.join(' › ')}>
                      {path ? path.at(-1) : <SellerChip label="Sin categoría" tone="red" />}
                    </TableCell>
                    <TableCell sx={cell} align="right">
                      <Box sx={{ fontWeight: 600 }}>{formatPrice(r.price)}</Box>
                      {r.originalPrice && <Box sx={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'line-through' }}>{formatPrice(r.originalPrice)}</Box>}
                    </TableCell>
                    <TableCell sx={{ ...cell, color: r.stock === 0 ? colors.primary : colors.ink, fontWeight: r.stock === 0 ? 600 : 400 }} align="right">
                      {r.stock == null ? '—' : n(r.stock)}
                      {r.hasVariants && <Box sx={{ fontSize: 11, color: '#9CA3AF', fontWeight: 400 }}>variantes</Box>}
                    </TableCell>
                    <TableCell sx={cell}>
                      <Box component="span" title={r.suspended ? `${r.suspended.reason}${r.suspended.note ? ` — ${r.suspended.note}` : ''}` : undefined}>
                        <SellerChip label={r.status} tone={STATUS_TONE[r.status]} dot />
                      </Box>
                      {r.suspended && <Typography sx={{ mt: 0.5, fontSize: 11.5, color: '#6B7280', lineHeight: 1.3 }}>{r.suspended.reason}</Typography>}
                    </TableCell>
                    <TableCell sx={{ ...cell, opacity: 1 }} align="right">
                      <Box sx={{ display: 'inline-flex', gap: 0.25 }}>
                        {r.removed ? (
                          <Tooltip title="Restaurar"><IconButton onClick={() => doRestore(r)} aria-label={`Restaurar ${r.name}`} sx={action}><RestoreIcon /></IconButton></Tooltip>
                        ) : (
                          <>
                            {r.href && r.status !== 'Suspendido' && (
                              <Tooltip title="Ver en la tienda"><IconButton component={RouterLink} to={r.href} aria-label={`Ver ${r.name} en la tienda`} sx={action}><OpenInNewIcon /></IconButton></Tooltip>
                            )}
                            <Tooltip title="Editar"><IconButton onClick={() => setEditing({ row: r })} aria-label={`Editar ${r.name}`} sx={action}><EditOutlinedIcon /></IconButton></Tooltip>
                            {r.suspended ? (
                              <Tooltip title="Reactivar"><IconButton onClick={() => doReactivate(r)} aria-label={`Reactivar ${r.name}`} sx={{ ...action, color: '#15803D' }}><PlayCircleOutlinedIcon /></IconButton></Tooltip>
                            ) : (
                              <Tooltip title="Suspender"><IconButton onClick={() => setSuspending(r)} aria-label={`Suspender ${r.name}`} sx={action}><BlockOutlinedIcon /></IconButton></Tooltip>
                            )}
                            <Tooltip title="Dar de baja"><IconButton onClick={() => setRemoving(r)} aria-label={`Dar de baja ${r.name}`} sx={{ ...action, '&:hover': { bgcolor: '#FEF2F2', color: colors.primary } }}><DeleteOutlinedIcon /></IconButton></Tooltip>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} publicaciones`} sx={{ px: 2.5, borderTop: '1px solid #E5E7EB' }} />
      </Box>

      {editing && <CatalogItemDialog key={editing.row?.key ?? 'new'} row={editing.row} stores={stores} onSave={onSave} onClose={() => setEditing(null)} />}

      {suspending && (
        <HideContentDialog
          title="Suspender publicación"
          subtitle="Dejará de mostrarse en la tienda hasta que la reactives. El emprendedor verá el motivo."
          preview={suspending.name}
          reasons={SUSPEND_REASONS}
          confirmLabel="Suspender"
          onConfirm={onSuspend}
          onClose={() => setSuspending(null)}
        />
      )}

      {removing && (
        <ConfirmDialog
          title="Dar de baja publicación"
          message={`"${removing.name}" dejará de mostrarse en la tienda. Se conserva en el historial de ventas y puedes restaurarla después desde el filtro "Dado de baja".`}
          confirmLabel="Dar de baja"
          onConfirm={onRemove}
          onClose={() => setRemoving(null)}
        />
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AdminLayout>
  );
}
