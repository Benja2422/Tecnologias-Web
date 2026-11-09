import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Button, ButtonBase, Typography } from '@mui/material';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import SellerLayout from '../components/templates/SellerLayout';
import SellerStatCard from '../components/molecules/SellerStatCard';
import SellerTable from '../components/organisms/SellerTable';
import SellerChip from '../components/atoms/SellerChip';
import { useSeller } from '../contexts/SellerContext';
import { ORDER_TONE, formatWhen, inventoryRows, isPendingDispatch, orderSubtotal, timeAgo } from '../utils/seller';
import { effectiveStatus } from '../utils/quotations';
import { formatPrice } from '../utils/format';
import { btnPrimary, card } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const sameMonth = (iso, ref) => { const d = new Date(iso); return d.getMonth() === ref.getMonth() && d.getFullYear() === ref.getFullYear(); };
const pct = (v) => `${v >= 0 ? '+' : ''}${v.toLocaleString('es-CL', { maximumFractionDigits: 1 })}%`;

const Badge = ({ children, tone = 'green' }) => (
  <Box component="span" sx={{ display: 'inline-block', mr: 1, px: 0.75, py: 0.25, borderRadius: '4px', fontSize: 11, fontWeight: 700, color: tone === 'green' ? '#15803D' : colors.primary, bgcolor: tone === 'green' ? '#ECFDF3' : '#FDECEF' }}>{children}</Box>
);

/** Dashboard del panel de emprendedor: indicadores del mes, pedidos recientes e interacciones pendientes. */
export default function SellerDashboardPage() {
  const navigate = useNavigate();
  const { orders, items, quotations, questions, profile } = useSeller();
  const now = new Date();
  const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

  const salesNow = orders.filter((o) => sameMonth(o.createdAt, now)).reduce((s, o) => s + orderSubtotal(o), 0);
  const salesPrev = orders.filter((o) => sameMonth(o.createdAt, prevMonth)).reduce((s, o) => s + orderSubtotal(o), 0);
  const pending = orders.filter(isPendingDispatch).length;
  const lowStock = new Set(inventoryRows(items).filter((r) => r.stock < r.minStock).map((r) => r.itemId)).size;
  const openQuotes = quotations.filter((q) => effectiveStatus(q, now) === 'Solicitada');
  const newQuotes = openQuotes.filter((q) => now - new Date(q.createdAt) < 7 * 86400000).length;

  const recent = [...orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  const interactions = [
    ...questions.filter((q) => !q.answer).map((q) => ({ key: q.id, kind: 'Pregunta', at: q.askedAt, who: `${q.buyer.name} - ${q.buyer.type.replace(/\s*\(.*\)/, '')}`, text: q.text, to: '/emprendedor/preguntas' })),
    ...openQuotes.map((q) => ({ key: q.id, kind: 'Cotización', at: q.createdAt, who: q.buyer.name, text: q.message || `Solicita cotización de ${q.items.map((i) => `${i.quantity} × ${i.name}`).join(', ')}.`, to: `/emprendedor/cotizaciones?responder=${q.id}` })),
  ].sort((a, b) => b.at.localeCompare(a.at)).slice(0, 3);

  const columns = [
    { key: 'id', header: 'ID Pedido', width: 'minmax(90px, 0.8fr)', render: (o) => <Box sx={{ color: colors.primary, fontWeight: 600 }}>#{o.id}</Box> },
    { key: 'buyer', header: 'Cliente', width: 'minmax(170px, 2fr)', render: (o) => <Box sx={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.buyer.name}</Box> },
    { key: 'date', header: 'Fecha', width: 'minmax(100px, 1fr)', render: (o) => <Box sx={{ color: '#4B5563' }}>{formatWhen(o.createdAt, now)}</Box> },
    { key: 'total', header: 'Total', width: 'minmax(100px, 1fr)', align: 'right', render: (o) => <Box sx={{ fontWeight: 700 }}>{formatPrice(orderSubtotal(o))}</Box> },
    { key: 'status', header: 'Estado', width: 'minmax(110px, 1fr)', align: 'right', render: (o) => <SellerChip label={o.status} tone={ORDER_TONE[o.status]} /> },
  ];

  return (
    <SellerLayout crumbs={[{ label: 'Dashboard General' }]}>
      <Box sx={{ ...card, p: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0, flex: '1 1 420px' }}>
          <Typography component="h1" sx={{ fontSize: { xs: 20, md: 23 }, fontWeight: 700, color: colors.ink }}>¡Bienvenido a tu Panel de Emprendedor, {profile.company.name}!</Typography>
          <Typography sx={{ mt: 1, fontSize: 14, color: '#4B5563' }}>Monitorea el inventario, procesa las cotizaciones entrantes de TodoMart y gestiona tus pedidos hoy.</Typography>
        </Box>
        <Button component={RouterLink} to="/emprendedor/productos/nuevo" sx={btnPrimary}>+ Agregar Producto</Button>
      </Box>

      <Box sx={{ mt: 4, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' } }}>
        <SellerStatCard variant="icon" label="Ventas del mes" value={formatPrice(salesNow)} icon={<AttachMoneyOutlinedIcon />}
          hint={salesPrev > 0 ? <><Badge tone={salesNow >= salesPrev ? 'green' : 'red'}>{pct(((salesNow - salesPrev) / salesPrev) * 100)}</Badge>vs. mes anterior</> : 'Primer mes con ventas'} />
        <SellerStatCard variant="icon" label="Pedidos pendientes" value={`${pending} ${pending === 1 ? 'orden' : 'órdenes'}`} icon={<ScheduleOutlinedIcon />} hint="Recibidos o en preparación" />
        <SellerStatCard variant="icon" label="Stock bajo" value={`${lowStock} ${lowStock === 1 ? 'producto' : 'productos'}`} icon={<WarningAmberOutlinedIcon />} hint={<Box component={RouterLink} to="/emprendedor/inventario?alerta=bajo" sx={{ color: colors.primary, fontWeight: 600, textDecoration: 'none' }}>Revisar inventario</Box>} />
        <SellerStatCard variant="icon" label="Cotizaciones pendientes" value={`${openQuotes.length} ${openQuotes.length === 1 ? 'solicitud' : 'solicitudes'}`} icon={<DescriptionOutlinedIcon />} hint={<><Badge>{newQuotes} {newQuotes === 1 ? 'nueva' : 'nuevas'}</Badge>esta semana</>} />
      </Box>

      <Box sx={{ mt: 4, display: 'grid', gap: 3, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 380px' } }}>
        <Box sx={{ ...card, overflow: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2.5, py: 2.5 }}>
            <Typography component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 17, fontWeight: 600, color: colors.ink }}>
              <ShoppingCartOutlinedIcon aria-hidden sx={{ color: colors.primary, fontSize: 22 }} /> Pedidos Recibidos Recientemente
            </Typography>
            <Box component={RouterLink} to="/emprendedor/pedidos" sx={{ fontSize: 13, fontWeight: 600, color: colors.primary, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Ver todos los pedidos</Box>
          </Box>
          <Box sx={{ '& > div': { border: 'none', borderTop: '1px solid #E5E7EB', borderRadius: 0 } }}>
            <SellerTable label="Pedidos recientes" columns={columns} rows={recent} getKey={(o) => o.id} minWidth={640} rowSx={() => ({ minHeight: 52, py: 1.25 })} />
          </Box>
        </Box>

        <Box component="section" aria-labelledby="interacciones" sx={{ ...card, p: 2.5 }}>
          <Typography id="interacciones" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 17, fontWeight: 600, color: colors.ink }}>
            <ChatBubbleOutlinedIcon aria-hidden sx={{ color: colors.primary, fontSize: 21 }} /> Interacciones Pendientes
          </Typography>
          <Box sx={{ mt: 2.5, display: 'grid', gap: 1.5 }}>
            {interactions.length === 0 && <Typography sx={{ fontSize: 14, color: colors.muted }}>No tienes preguntas ni cotizaciones por responder.</Typography>}
            {interactions.map((it) => (
              <ButtonBase key={it.key} onClick={() => navigate(it.to)} sx={{ display: 'block', textAlign: 'left', p: 2, border: '1px solid #E5E7EB', borderRadius: '8px', fontFamily: 'inherit', '&:hover': { borderColor: '#D1D5DB', bgcolor: '#FAFAFA' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                  <SellerChip label={it.kind} tone={it.kind === 'Pregunta' ? 'red' : 'yellow'} caps />
                  <Typography sx={{ fontSize: 11.5, color: '#9CA3AF' }}>{timeAgo(it.at, now)}</Typography>
                </Box>
                <Typography sx={{ mt: 1.25, fontSize: 14, fontWeight: 600, color: colors.ink }}>{it.who}</Typography>
                <Typography sx={{ mt: 0.5, fontSize: 13, color: '#4B5563', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{it.text}</Typography>
              </ButtonBase>
            ))}
          </Box>
        </Box>
      </Box>
    </SellerLayout>
  );
}
