import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import AccountLayout from '../components/templates/AccountLayout';
import StatusFilterChips from '../components/molecules/StatusFilterChips';
import OrdersTable from '../components/organisms/OrdersTable';
import PaginationBar from '../components/molecules/PaginationBar';
import { useCheckout } from '../contexts/CheckoutContext';
import { ORDER_STATUSES, getOrderStatus } from '../utils/orders';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;
const slug = (s) => s.toLowerCase();

/** "Mis pedidos": historial con filtro por estado (?estado=enviado) y paginación (?pagina=2). */
export default function OrdersPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { orders } = useCheckout();

  const status = ORDER_STATUSES.find((s) => slug(s) === params.get('estado')) ?? null;
  const filtered = status ? orders.filter((o) => getOrderStatus(o) === status) : orders;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get('pagina')) || 1), totalPages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setFilter = (next) => {
    console.log('[Pedidos] Filtrar por estado:', { estado: next ?? 'Todos' });
    setParams(next ? { estado: slug(next) } : {});
  };
  const setPage = (p) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set('pagina', String(p)); else next.delete('pagina');
    setParams(next);
  };

  return (
    <AccountLayout maxWidth={1600} headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <Typography component="h1" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 600, color: colors.text }}>Mis Pedidos</Typography>
      <Typography sx={{ mt: 1.5, fontSize: 16, color: colors.muted }}>Visualiza y gestiona el historial de tus compras y contrataciones</Typography>

      <Box sx={{ mt: 4 }}>
        <StatusFilterChips options={ORDER_STATUSES} value={status} onChange={setFilter} />
      </Box>

      <Box sx={{ mt: 4 }}>
        {filtered.length === 0 ? (
          <Box role="status" sx={{ py: 8, textAlign: 'center', border: '1px dashed #D9D9D9', borderRadius: 3 }}>
            <Typography sx={{ fontSize: 16, color: colors.muted }}>
              {status ? `No tienes pedidos con estado "${status}".` : 'Aún no has hecho pedidos.'}
            </Typography>
          </Box>
        ) : (
          <>
            <OrdersTable
              orders={visible}
              onView={(o) => {
                console.log('[Pedidos] Ver detalle:', { orderId: o.id });
                navigate(`/pedidos/${o.id}`);
              }}
            />
            <PaginationBar
              page={page}
              pageSize={PAGE_SIZE}
              total={filtered.length}
              onChange={setPage}
              arrows
              summary={`Mostrando ${filtered.length} ${filtered.length === 1 ? 'pedido' : 'pedidos'}`}
              sx={{ px: 0 }}
            />
          </>
        )}
      </Box>
    </AccountLayout>
  );
}
