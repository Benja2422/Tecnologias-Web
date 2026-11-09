import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Button, IconButton, Snackbar, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import SellerTable from '../components/organisms/SellerTable';
import SellerChip from '../components/atoms/SellerChip';
import ItemThumb from '../components/atoms/ItemThumb';
import PaginationBar from '../components/molecules/PaginationBar';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import ActionRequiredAlert from '../components/molecules/ActionRequiredAlert';
import { useSeller } from '../contexts/SellerContext';
import { useCategories } from '../contexts/CategoriesContext';
import { ageLabel, categoryLabel, categoryPathLabel, categoryRootId, hasValidCategory, itemStatus, itemStock, norm, paginate } from '../utils/seller';
import { formatPrice } from '../utils/format';
import { btnPrimary, iconBtn } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;
const STATUS_TONE = { Activo: 'green', Inactivo: 'grey', Borrador: 'yellow', Suspendido: 'red' };
const editPath = (item) => `/emprendedor/${item.kind === 'servicio' ? 'servicios' : 'productos'}/${item.id}/editar`;

/** "Mis Productos y Servicios": catálogo de la tienda con búsqueda, filtro por categoría, edición y eliminación. */
export default function SellerCatalogPage() {
  const navigate = useNavigate();
  const { items, deleteItem } = useSeller();
  const { trees } = useCategories();
  const suspended = items.filter((it) => it.suspended);
  // Categorías principales de productos (del árbol de la plataforma) + todos los servicios
  const FILTERS = [...trees.productos.map((c) => ({ id: c.id, name: c.name })), { id: 'servicios', name: 'Servicios' }];
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');

  const q = norm(query.trim());
  const filtered = items.filter((it) =>
    (!category || (category === 'servicios' ? it.kind === 'servicio' : it.kind === 'producto' && categoryRootId(it) === category))
    && (!q || norm(it.name).includes(q) || norm(it.sku).includes(q)));
  const view = paginate(filtered, page, PAGE_SIZE);
  const outOfStock = items.filter((it) => itemStock(it) === 0).length;

  const confirmDelete = () => {
    console.log('[Emprendedor] Retirar ítem del catálogo:', { itemId: deleting.id, sku: deleting.sku });
    deleteItem(deleting.id);
    setToast(`"${deleting.name}" se retiró del catálogo.`);
    setDeleting(null);
  };

  const columns = [
    { key: 'img', header: 'Imagen', width: '64px', render: (it) => <ItemThumb src={it.images?.[0]?.src} /> },
    {
      key: 'name', header: 'Nombre / SKU', width: 'minmax(200px, 2.2fr)', render: (it) => (
        <>
          <Typography title={it.name} sx={{ fontSize: 15, fontWeight: 600, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.name}</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 12, color: '#6B7280' }}>
            SKU: {it.sku}
            {it.kind === 'servicio' ? ` · ${it.duration || 'Duración por definir'} · ${ageLabel(it.ageRestriction)}` : it.weightKg ? ` · ${String(it.weightKg).replace('.', ',')} kg · ${it.material}` : ''}
          </Typography>
        </>
      ),
    },
    { key: 'cat', header: 'Categoría', width: 'minmax(120px, 1.1fr)', render: (it) => <Box component="span" title={categoryPathLabel(it)} sx={{ display: 'inline-block', px: 1, py: 0.4, border: `1px solid ${hasValidCategory(it) ? '#E5E7EB' : '#FBCFD6'}`, borderRadius: '4px', fontSize: 13, color: hasValidCategory(it) ? '#4B5563' : '#C00000', bgcolor: hasValidCategory(it) ? '#FAFAFA' : '#FDECEF' }}>{categoryLabel(it)}</Box> },
    {
      key: 'price', header: 'Precio', width: 'minmax(100px, 0.9fr)', render: (it) => (
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{formatPrice(it.price)}{it.kind === 'servicio' && it.unit ? <Box component="span" sx={{ display: 'block', fontSize: 11.5, fontWeight: 400, color: '#6B7280' }}>{it.unit}</Box> : null}</Typography>
      ),
    },
    {
      key: 'stock', header: 'Stock', width: 'minmax(90px, 0.8fr)', render: (it) => {
        const stock = itemStock(it);
        if (stock === null) return <Tooltip title="Los servicios no manejan stock"><Box component="span" sx={{ color: '#9CA3AF' }}>No aplica</Box></Tooltip>;
        return stock === 0 ? <Box component="span" sx={{ color: colors.primary, fontWeight: 500 }}>Sin stock</Box> : `${stock} und`;
      },
    },
    { key: 'status', header: 'Estado', width: 'minmax(100px, 0.8fr)', render: (it) => <Box component="span" title={it.suspended ? `Suspendido por la administración: ${it.suspended.reason}` : undefined}><SellerChip label={itemStatus(it)} tone={STATUS_TONE[itemStatus(it)]} dot /></Box> },
    {
      key: 'actions', header: 'Acciones', width: '100px', render: (it) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton aria-label={`Editar ${it.name}`} onClick={() => navigate(editPath(it))} sx={{ ...iconBtn, color: colors.ink }}><EditOutlinedIcon /></IconButton>
          <IconButton aria-label={`Retirar ${it.name}`} onClick={() => setDeleting(it)} sx={{ ...iconBtn, color: colors.primary }}><DeleteOutlinedIcon /></IconButton>
        </Box>
      ),
    },
  ];

  return (
    <SellerLayout crumbs={[{ label: 'Productos y servicios' }]}>
      <SellerPageTitle
        title="Mis Productos y Servicios"
        subtitle="Administra el inventario, precios y visibilidad de tu catálogo en TodoMart"
        actions={(
          <>
            <Button component={RouterLink} to="/emprendedor/servicios/nuevo" startIcon={<AddIcon />} sx={btnPrimary}>Nuevo servicio</Button>
            <Button component={RouterLink} to="/emprendedor/productos/nuevo" startIcon={<AddIcon />} sx={btnPrimary}>Nuevo producto</Button>
          </>
        )}
      />

      {suspended.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <ActionRequiredAlert title="Publicaciones suspendidas por la administración">
            {suspended.map((it, i) => <span key={it.id}>{i > 0 && '; '}<b>{it.name}</b> ({it.suspended.reason})</span>)}. No se muestran en la tienda. Corrige la publicación y escribe a soporte para que la reactiven.
          </ActionRequiredAlert>
        </Box>
      )}

      <Box sx={{ mt: 4 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar producto o servicio..."
          filter={{ label: 'Filtrar por Categoría', options: FILTERS, value: category, onChange: (v) => { setCategory(v); setPage(1); }, allLabel: 'Todas las categorías' }}
          summary={<>Total items: <b>{items.length}</b><Box component="span" sx={{ mx: 1.5, color: '#D1D5DB' }}>|</Box>Sin stock: <Box component="b" sx={{ color: `${colors.primary} !important` }}>{outOfStock}</Box></>}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerTable
          label="Productos y servicios"
          columns={columns}
          rows={view.rows}
          getKey={(it) => it.id}
          minWidth={900}
          empty={<Typography role="status" sx={{ p: 5, textAlign: 'center', color: colors.muted }}>No hay productos ni servicios que coincidan con tu búsqueda.</Typography>}
        />
        <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} resultados`} sx={{ px: 0 }} />
      </Box>

      {deleting && (
        <ConfirmDialog
          title={`¿Retirar ${deleting.kind === 'servicio' ? 'el servicio' : 'el producto'} del catálogo?`}
          message={`"${deleting.name}" dejará de mostrarse en TodoMart y se quitará de tus ofertas. Las ventas anteriores se conservan en tu historial.`}
          confirmLabel="Retirar"
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
