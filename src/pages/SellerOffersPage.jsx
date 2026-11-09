import { useState } from 'react';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import SellerStatCard from '../components/molecules/SellerStatCard';
import SellerFilterBar from '../components/molecules/SellerFilterBar';
import SellerTable from '../components/organisms/SellerTable';
import SellerChip from '../components/atoms/SellerChip';
import ItemThumb from '../components/atoms/ItemThumb';
import PaginationBar from '../components/molecules/PaginationBar';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import OfferDialog from '../components/organisms/OfferDialog';
import { useSeller } from '../contexts/SellerContext';
import { useCategories } from '../contexts/CategoriesContext';
import { categoryLabel, categoryPathLabel, categoryRootId, hasValidCategory, formatDay, hoursLeft, norm, offerStatus, paginate } from '../utils/seller';
import { formatPrice } from '../utils/format';
import { btnPrimary, btnSmall } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;

/** Ofertas vigentes y programadas del catálogo, con creación, edición y término anticipado. */
export default function SellerOffersPage() {
  const { items, saveOffer, endOffer } = useSeller();
  const { trees } = useCategories();
  const FILTERS = [{ id: 'producto', name: 'Productos' }, { id: 'servicio', name: 'Servicios' }, ...trees.productos.map((c) => ({ id: c.id, name: c.name }))];
  const [query, setQuery] = useState('');
  const [type, setType] = useState(null);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null); // { item } para editar, { item: null } para crear
  const [ending, setEnding] = useState(null);
  const [toast, setToast] = useState('');

  const now = new Date();
  const offers = items.filter((it) => it.offer && !it.draft && offerStatus(it.offer, now) !== 'Finalizada');
  const statusOf = (it) => offerStatus(it.offer, now);
  const active = offers.filter((it) => ['Activa', 'Vence pronto'].includes(statusOf(it))).length;
  const expiring = offers.filter((it) => statusOf(it) === 'Vence pronto').length;
  const scheduled = offers.filter((it) => statusOf(it) === 'Programada').length;

  const q = norm(query.trim());
  const filtered = offers.filter((it) =>
    (!type || it.kind === type || (it.kind === 'producto' && categoryRootId(it) === type)) && (!q || norm(it.name).includes(q) || norm(it.sku).includes(q)));
  const view = paginate(filtered, page, PAGE_SIZE);
  const candidates = items.filter((it) => !it.draft && (!it.offer || offerStatus(it.offer, now) === 'Finalizada'));

  const save = (itemId, offer) => {
    console.log('[Emprendedor] Guardar oferta:', { itemId, ...offer });
    saveOffer(itemId, offer);
    setToast(dialog.item ? 'Oferta actualizada.' : 'Oferta creada.');
    setDialog(null);
  };
  const confirmEnd = () => {
    console.log('[Emprendedor] Finalizar oferta:', { itemId: ending.id });
    endOffer(ending.id);
    setToast(`La oferta de "${ending.name}" terminó. Vuelve a su precio normal.`);
    setEnding(null);
  };

  const statusChip = (it) => {
    const s = statusOf(it);
    if (s === 'Vence pronto') return <SellerChip label={`Vence en ${hoursLeft(it.offer, now)} ${hoursLeft(it.offer, now) === 1 ? 'hora' : 'horas'}`} tone="orange" dot caps outlined />;
    if (s === 'Programada') return <SellerChip label="Programada" tone="blue" dot caps outlined />;
    return <SellerChip label="Activa" tone="green" dot caps outlined />;
  };

  const columns = [
    { key: 'img', header: 'Imagen', width: '56px', render: (it) => <ItemThumb src={it.images?.[0]?.src} /> },
    {
      key: 'name', header: 'Nombre de producto o servicio / SKU', width: 'minmax(190px, 2fr)', render: (it) => (
        <>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink, overflowWrap: 'anywhere' }}>{it.name}</Typography>
          <Typography sx={{ mt: 0.25, fontSize: 12, color: '#6B7280' }}>SKU: {it.sku}</Typography>
        </>
      ),
    },
    { key: 'cat', header: 'Categoría', width: 'minmax(110px, 1fr)', render: (it) => <Box component="span" title={categoryPathLabel(it)} sx={{ display: 'inline-block', px: 1, py: 0.4, border: `1px solid ${hasValidCategory(it) ? '#E5E7EB' : '#FBCFD6'}`, borderRadius: '4px', fontSize: 13, color: hasValidCategory(it) ? '#4B5563' : '#C00000', bgcolor: hasValidCategory(it) ? '#FAFAFA' : '#FDECEF' }}>{categoryLabel(it)}</Box> },
    {
      key: 'price', header: 'P. normal / Oferta', width: 'minmax(110px, 1fr)', render: (it) => (
        <>
          <Typography sx={{ fontSize: 12, color: '#9CA3AF', textDecoration: 'line-through' }}>{formatPrice(it.price)}</Typography>
          <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.primary }}>{formatPrice(it.offer.price)}</Typography>
        </>
      ),
    },
    {
      key: 'dates', header: 'Vigencia temporal', width: 'minmax(130px, 1.1fr)', render: (it) => (
        <Box sx={{ fontSize: 13, color: '#4B5563', lineHeight: 1.7, '& b': { color: colors.ink } }}>
          <div><b>Ini:</b> {formatDay(it.offer.startsAt)}</div>
          <div><b>Fin:</b> {formatDay(it.offer.endsAt)}</div>
        </Box>
      ),
    },
    { key: 'status', header: 'Estado campaña', width: 'minmax(150px, 1.2fr)', render: statusChip },
    {
      key: 'actions', header: 'Acciones rápidas', width: '190px', align: 'right', render: (it) => (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button onClick={() => setDialog({ item: it })} startIcon={<EditOutlinedIcon />} aria-label={`Editar oferta de ${it.name}`} sx={{ ...btnSmall, height: 32, px: 1.25, border: '1px solid #D1D5DB', borderRadius: '6px', color: colors.ink, fontWeight: 500, '& .MuiButton-startIcon': { mr: 0.5 }, '& svg': { fontSize: 16 } }}>Editar</Button>
          <Button onClick={() => setEnding(it)} startIcon={<HighlightOffOutlinedIcon />} aria-label={`Finalizar oferta de ${it.name}`} sx={{ ...btnSmall, height: 32, px: 1.25, border: '1px solid #F5B5B5', borderRadius: '6px', color: colors.primary, bgcolor: '#FFF5F5', '&:hover': { bgcolor: '#FDECEF' }, '& .MuiButton-startIcon': { mr: 0.5 }, '& svg': { fontSize: 16 } }}>Finalizar</Button>
        </Box>
      ),
    },
  ];

  return (
    <SellerLayout crumbs={[{ label: 'Gestión de Ofertas' }]} action={<Button onClick={() => setDialog({ item: null })} startIcon={<AddIcon />} sx={{ ...btnPrimary, height: 38 }}>Crear Nueva Oferta</Button>}>
      <SellerPageTitle title="Catálogo de Ofertas y Promociones Activas" subtitle="Monitorea, edita y finaliza las promociones con descuento activo aplicadas a tus productos y servicios." />

      <Box sx={{ mt: 3, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } }}>
        <SellerStatCard label="Total de ofertas" value={`${offers.length} ${offers.length === 1 ? 'Promoción' : 'Promociones'}`} hint="Registradas en el sistema" />
        <SellerStatCard label="Campañas activas" value={`${active} ${active === 1 ? 'Activa' : 'Activas'} hoy`} hint="Visibles en el catálogo público" />
        <SellerStatCard label="Por vencer (24h)" value={`${expiring} ${expiring === 1 ? 'Alerta' : 'Alertas'}`} hint={expiring ? 'Requiere tu atención rápida' : 'Nada vence en las próximas 24 h'} alert={expiring > 0} />
        <SellerStatCard label="Próximas campañas" value={`${scheduled} ${scheduled === 1 ? 'Programada' : 'Programadas'}`} hint="Inicio automático agendado" />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerFilterBar
          query={query}
          onQuery={(v) => { setQuery(v); setPage(1); }}
          placeholder="Buscar por oferta, SKU o servicio..."
          filter={{ label: 'Filtrar por Categoría / Tipo', options: FILTERS, value: type, onChange: (v) => { setType(v); setPage(1); }, allLabel: 'Todas' }}
          summary={<>Filtrado: <b>Mostrando {filtered.length} {filtered.length === 1 ? 'ítem' : 'ítems'} con descuento</b></>}
        />
      </Box>

      <Box sx={{ mt: 3 }}>
        <SellerTable
          label="Ofertas"
          columns={columns}
          rows={view.rows}
          getKey={(it) => it.id}
          minWidth={1060}
          empty={<Typography role="status" sx={{ p: 5, textAlign: 'center', color: colors.muted }}>No hay ofertas vigentes con ese filtro.</Typography>}
        />
        <PaginationBar page={view.page} pageSize={PAGE_SIZE} total={view.total} onChange={setPage} summary={`Mostrando ${view.from}-${view.to} de ${view.total} campañas registradas`} sx={{ px: 0 }} />
      </Box>

      {dialog && <OfferDialog item={dialog.item} candidates={candidates} onSave={save} onClose={() => setDialog(null)} />}
      {ending && <ConfirmDialog title="¿Finalizar esta oferta?" message={`"${ending.name}" volverá a su precio normal (${formatPrice(ending.price)}) de inmediato.`} confirmLabel="Finalizar oferta" onConfirm={confirmEnd} onClose={() => setEnding(null)} />}
      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
