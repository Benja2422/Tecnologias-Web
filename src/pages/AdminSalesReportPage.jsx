import { useSearchParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import DocumentLayout from '../components/templates/DocumentLayout';
import Logo from '../components/atoms/Logo';
import { paymentLabel, useAdminOrders } from '../hooks/useAdminOrders';
import { PERIODS, inPeriod } from '../utils/ordersAdmin';
import { formatPrice } from '../utils/format';
import { colors } from '../utils/theme';

const day = (iso) => new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
const h2 = { mt: 4.5, mb: 1.5, fontSize: 16, fontWeight: 700, color: colors.text };
const th = { px: 1, py: 1, fontSize: 11.5, fontWeight: 700, color: colors.text, bgcolor: '#F8F8F9', textAlign: 'left', borderBottom: '1px solid #E5E7EB' };
const td = { px: 1, py: 0.9, fontSize: 12.5, color: colors.text, borderBottom: '1px solid #F0F0F0', verticalAlign: 'top' };

function SimpleTable({ label, head, rows, empty }) {
  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Box component="table" aria-label={label} sx={{ width: '100%', minWidth: 620, borderCollapse: 'collapse' }}>
        <thead><tr>{head.map((h) => <Box component="th" key={h.label} sx={{ ...th, textAlign: h.align ?? 'left' }}>{h.label}</Box>)}</tr></thead>
        <tbody>
          {rows.length === 0 && <tr><Box component="td" colSpan={head.length} sx={{ ...td, textAlign: 'center', color: colors.muted, py: 2 }}>{empty}</Box></tr>}
          {rows.map((r, i) => <tr key={i}>{r.map((c, j) => <Box component="td" key={j} sx={{ ...td, textAlign: head[j].align ?? 'left', whiteSpace: head[j].nowrap ? 'nowrap' : 'normal' }}>{c}</Box>)}</tr>)}
        </tbody>
      </Box>
    </Box>
  );
}

/**
 * Historial transaccional (reporte imprimible): compras del período, devoluciones aprobadas con su motivo
 * por cliente y el desglose del capital reintegrado. ?periodo=7|30|90|todo &tienda=Nombre
 */
export default function AdminSalesReportPage() {
  const [params] = useSearchParams();
  const period = PERIODS.some((p) => p.id === params.get('periodo')) ? params.get('periodo') : '30';
  const store = params.get('tienda') ?? '';
  const { rows } = useAdminOrders();
  const now = new Date();

  const scoped = rows.filter((r) => inPeriod(r.createdAt, period, now) && (!store || r.seller === store)).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const valid = scoped.filter((r) => !r.cancelled);
  const gross = valid.reduce((s, r) => s + r.total, 0);
  const returns = valid.flatMap((r) => r.returns.filter((d) => d.status === 'Aceptada').map((d) => ({ ...d, order: r })));
  const refunded = returns.reduce((s, d) => s + d.amount, 0);
  const byBuyer = Object.values(returns.reduce((acc, d) => {
    const b = (acc[d.order.buyer] ??= { buyer: d.order.buyer, count: 0, amount: 0, reasons: [] });
    b.count += 1; b.amount += d.amount; b.reasons.push(d.reason);
    return acc;
  }, {})).sort((a, b) => b.amount - a.amount);

  const summary = [
    ['Pedidos válidos', String(valid.length)], ['Ventas brutas', formatPrice(gross)], ['Pedidos anulados', String(scoped.length - valid.length)],
    ['Devoluciones aprobadas', String(returns.length)], ['Capital reintegrado', formatPrice(refunded)], ['Ventas netas', formatPrice(gross - refunded)],
  ];

  return (
    <DocumentLayout backTo="/admin/pedidos" fileName={`Historial-transaccional-${now.toISOString().slice(0, 10)}`} label="Historial transaccional" wide>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, pb: 3, borderBottom: '1px solid #E5E7EB' }}>
        <Logo size={24} />
        <Box sx={{ textAlign: 'right' }}>
          <Typography component="h1" sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 600, color: colors.text }}>Historial transaccional</Typography>
          <Typography sx={{ mt: 0.75, fontSize: 13, color: colors.muted }}>{PERIODS.find((p) => p.id === period).name} · {store || 'Todas las tiendas'}</Typography>
          <Typography sx={{ fontSize: 13, color: colors.muted }}>Generado el {day(now.toISOString())}</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 3, display: 'grid', gap: 1.5, gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(3, minmax(0, 1fr))' } }}>
        {summary.map(([label, value]) => (
          <Box key={label} sx={{ border: '1px solid #E5E7EB', borderRadius: '6px', px: 1.75, py: 1.25 }}>
            <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: colors.muted, textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 18, fontWeight: 700, color: colors.text }}>{value}</Typography>
          </Box>
        ))}
      </Box>

      <Typography component="h2" sx={h2}>1. Flujo de compras ({scoped.length})</Typography>
      <SimpleTable
        label="Flujo de compras"
        head={[{ label: 'Fecha', nowrap: true }, { label: 'Pedido', nowrap: true }, { label: 'Cliente' }, { label: 'Tienda' }, { label: 'Medio de pago' }, { label: 'Estado' }, { label: 'Total', align: 'right' }]}
        rows={scoped.map((r) => [day(r.createdAt), r.id, r.buyer, r.seller, paymentLabel(r.payment), r.status, r.cancelled ? <s>{formatPrice(r.total)}</s> : formatPrice(r.total)])}
        empty="No hay compras en el período."
      />

      <Typography component="h2" sx={h2}>2. Devoluciones aprobadas ({returns.length})</Typography>
      <SimpleTable
        label="Devoluciones aprobadas"
        head={[{ label: 'Fecha', nowrap: true }, { label: 'Devolución', nowrap: true }, { label: 'Pedido', nowrap: true }, { label: 'Cliente' }, { label: 'Producto' }, { label: 'Motivo' }, { label: 'Reintegro', align: 'right' }]}
        rows={returns.map((d) => [day(d.at), d.id, d.order.id, d.order.buyer, d.product, d.reason, formatPrice(d.amount)])}
        empty="No hay devoluciones aprobadas en el período."
      />

      <Typography component="h2" sx={h2}>3. Capital reintegrado por cliente</Typography>
      <SimpleTable
        label="Capital reintegrado por cliente"
        head={[{ label: 'Cliente' }, { label: 'Devoluciones', align: 'right' }, { label: 'Motivos' }, { label: 'Monto reintegrado', align: 'right' }]}
        rows={[
          ...byBuyer.map((b) => [b.buyer, b.count, b.reasons.join(' / '), formatPrice(b.amount)]),
          ...(byBuyer.length ? [[<b key="t">Total</b>, returns.length, '', <b key="m">{formatPrice(refunded)}</b>]] : []),
        ]}
        empty="Sin reintegros en el período."
      />

      <Typography sx={{ mt: 5, pt: 2, borderTop: '1px solid #EEE', fontSize: 12, color: colors.muted }}>
        Montos en pesos chilenos con IVA incluido. Los pedidos anulados no se suman a las ventas.
      </Typography>
    </DocumentLayout>
  );
}
