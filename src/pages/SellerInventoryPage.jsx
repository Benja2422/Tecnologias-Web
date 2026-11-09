import { useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerStatCard from '../components/molecules/SellerStatCard';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import SellerTable from '../components/organisms/SellerTable';
import SellerChip from '../components/atoms/SellerChip';
import ItemThumb from '../components/atoms/ItemThumb';
import PaginationBar from '../components/molecules/PaginationBar';
import StockAdjustDialog from '../components/organisms/StockAdjustDialog';
import { useSeller } from '../contexts/SellerContext';
import { formatWhen, inventoryRows, norm, paginate, stockAlert } from '../utils/seller';
import { btnOutlined, btnOutlinedRed, btnPrimary, btnSmall } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 6;
const ALERTS = [{ id: 'bajo', name: 'Bajo' }, { id: 'limite', name: 'Límite alcanzado' }, { id: 'suficiente', name: 'Suficiente' }];
const TONE = { Bajo: 'red', 'Límite alcanzado': 'orange', Suficiente: 'green' };

/** Control de inventario: stock por producto o variante, alertas bajo el mínimo y ajuste rápido de stock. */
export default function SellerInventoryPage() {
  const [params] = useSearchParams();
  const { items, adjustStock, stockUpdatedAt } = useSeller();
  const [query, setQuery] = useState('');
  const [alert, setAlert] = useState(ALERTS.some((a) => a.id === params.get('alerta')) ? params.get('alerta') : null);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [toast, setToast] = useState('');

  const rows = inventoryRows(items);
  const critical = rows.filter((r) => r.stock < r.minStock).length;
  const q = norm(query.trim());
  const alertName = ALERTS.find((a) => a.id === alert)?.name;
  const filtered = rows.filter((r) => (!alertName || stockAlert(r.stock, r.minStock) === alertName) && (!q || norm(`${r.name} ${r.variant ?? ''}`).includes(q) || norm(r.sku).includes(q)));
  const view = paginate(filtered, page, PAGE_SIZE);

  const save = ({ stock, minStock, mode, quantity, note }) => {
    console.log('[Emprendedor] Ajustar stock:', { itemId: editing.itemId, sku: editing.sku, antes: editing.stock, despues: stock, minStock, mode, quantity, note });
    adjustStock(editing.itemId, editing.variantSku, { stock, minStock });
    setToast(`Stock de ${editing.sku} actualizado a ${stock} unidades.`);
    setEditing(null);
  };

  const columns = [
    { key: 'img', header: 'Imagen', width: '56px', render: (r) => <ItemThumb src={r.image} size={40} /> },
    {
      key: 'name', header: 'Producto / SKU / Variante', width: 'minmax(220px, 2.4fr)', render: (r) => (
        <>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink, overflowWrap: 'anywhere' }}>{r.name}</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 12, color: '#6B7280' }}>SKU: <Box component="b" sx={{ color: colors.ink }}>{r.sku}</Box>{r.variant && <> · Variante: {r.variant}</>}</Typography>
        </>
      ),
    },
    { key: 'stock', header: 'Stock actual', width: 'minmax(110px, 1fr)', render: (r) => <Typography sx={{ fontSize: 15, fontWeight: 700, color: r.stock < r.minStock ? colors.primary : colors.ink }}>{r.stock} {r.stock === 1 ? 'unidad' : 'unidades'}</Typography> },
    { key: 'min', header: 'Stock mínimo', width: 'minmax(110px, 1fr)', render: (r) => <Box sx={{ color: '#4B5563' }}>{r.minStock} unidades</Box> },
    { key: 'alert', header: 'Estado / Alerta', width: 'minmax(140px, 1.1fr)', render: (r) => { const a = stockAlert(r.stock, r.minStock); return <SellerChip label={a} tone={TONE[a]} dot outlined />; } },
    {
      key: 'action', header: 'Acción rápida', width: '150px', render: (r) => (
        <Button onClick={() => setEditing(r)} startIcon={<EditOutlinedIcon />} aria-label={`Ajustar stock de ${r.sku}`} sx={{ ...(r.stock < r.minStock ? btnOutlinedRed : btnOutlined), ...btnSmall, height: 34, width: '100%', fontWeight: 500 }}>Ajustar stock</Button>
      ),
    },
  ];

  return (
    <SellerLayout crumbs={[{ label: 'Inventario de Productos' }]} action={<Button component={RouterLink} to="/emprendedor/productos/nuevo" sx={{ ...btnPrimary, height: 38 }}>+ Añadir Producto</Button>}>
      <SellerPageTitle title="Control de Inventario y Alertas" subtitle="Monitorea tus existencias, revisa alertas críticas y ajusta el stock actual de tus variantes." />

      <Box sx={{ mt: 3, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' } }}>
        <SellerStatCard label="Total ítems monitoreados" value={`${rows.length} ${rows.length === 1 ? 'ítem' : 'ítems'}`} />
        <SellerStatCard label="Productos con stock crítico" value={`${critical} ${critical === 1 ? 'Alerta activa' : 'Alertas activas'}`} alert={critical > 0} />
        <SellerStatCard label="Última actualización" value={`${formatWhen(stockUpdatedAt)} hrs`} />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar por producto o SKU..."
          filter={{ label: 'Filtrar Alertas', options: ALERTS, value: alert, onChange: (v) => { setAlert(v); setPage(1); }, allLabel: 'Todas las alertas' }}
          summary={<>Filtrado: <b>Mostrando {filtered.length} {filtered.length === 1 ? 'ítem' : 'ítems'}</b></>}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerTable
          label="Inventario"
          columns={columns}
          rows={view.rows}
          getKey={(r) => r.key}
          minWidth={900}
          empty={<Typography role="status" sx={{ p: 5, textAlign: 'center', color: colors.muted }}>No hay productos que coincidan con el filtro.</Typography>}
          footer={<PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} ítems registrados`} sx={{ px: 3 }} />}
        />
      </Box>

      {editing && <StockAdjustDialog row={editing} onSave={save} onClose={() => setEditing(null)} />}
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
