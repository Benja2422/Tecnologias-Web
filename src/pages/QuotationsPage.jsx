import { Link as RouterLink, useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ManageSearchOutlinedIcon from '@mui/icons-material/ManageSearchOutlined';
import AccountLayout from '../components/templates/AccountLayout';
import StatusFilterChips from '../components/molecules/StatusFilterChips';
import QuotationsTable from '../components/organisms/QuotationsTable';
import PaginationBar from '../components/molecules/PaginationBar';
import { useQuotations } from '../contexts/QuotationsContext';
import { QUOTE_DELETE_DAYS, QUOTE_STATUSES, QUOTE_VALID_DAYS, effectiveStatus } from '../utils/quotations';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;
const slug = (s) => s.toLowerCase();

/** "Mis cotizaciones": lista con filtro por estado (?estado=respondida) y paginación (?pagina=2). */
export default function QuotationsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const { quotations } = useQuotations();

  const now = new Date();
  const status = QUOTE_STATUSES.find((s) => slug(s) === params.get('estado')) ?? null;
  const filtered = status ? quotations.filter((q) => effectiveStatus(q, now) === status) : quotations;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get('pagina')) || 1), totalPages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const from = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, filtered.length);

  const setFilter = (next) => {
    console.log('[Cotizaciones] Filtrar por estado:', { estado: next ?? 'Todas' });
    setParams(next ? { estado: slug(next) } : {});
  };
  const setPage = (p) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set('pagina', String(p)); else next.delete('pagina');
    setParams(next);
  };

  return (
    <AccountLayout compact maxWidth={1600} showFooter headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <Typography component="h1" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 600, color: colors.text }}>Mis cotizaciones</Typography>
      <Typography sx={{ mt: 1.5, fontSize: 16, color: colors.muted }}>Revisa el estado y la vigencia de las cotizaciones que solicitaste.</Typography>

      <Box role="note" sx={{ mt: 3, px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#F7F7F8', borderRadius: '6px', color: colors.muted, fontSize: 14 }}>
        <InfoOutlinedIcon aria-hidden sx={{ fontSize: 20 }} />
        Las cotizaciones duran {QUOTE_VALID_DAYS} días. Después expiran y se eliminan a los {QUOTE_DELETE_DAYS} días.
      </Box>

      <Box sx={{ mt: 3 }}>
        <StatusFilterChips options={QUOTE_STATUSES} value={status} onChange={setFilter} allLabel="Todas" label="Filtrar por estado" />
      </Box>

      <Box sx={{ mt: 3 }}>
        {filtered.length === 0 ? (
          <Box role="status" sx={{ minHeight: 430, display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 1.25, textAlign: 'center', border: '1px solid #E5E7EB', borderRadius: 3, px: 2 }}>
            <ManageSearchOutlinedIcon aria-hidden sx={{ fontSize: 48, color: '#9A9A9A' }} />
            <Typography component="h2" sx={{ fontSize: 24, fontWeight: 600, color: colors.text }}>
              {status ? `No tienes cotizaciones ${slug(status)}s` : 'Aún no has solicitado cotizaciones'}
            </Typography>
            <Typography sx={{ color: colors.muted }}>
              {status ? 'Prueba con otro estado para ver el resto.' : 'Explora el catálogo y solicita los productos que necesitas.'}
            </Typography>
            {!status && (
              <Button component={RouterLink} to="/" variant="contained" disableElevation sx={{ mt: 1.5, height: 42, px: 3, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>
                Explorar productos
              </Button>
            )}
          </Box>
        ) : (
          <>
            <QuotationsTable
              quotations={visible}
              onOpen={(q) => { console.log('[Cotizaciones] Ver detalle:', { quotationId: q.id }); navigate(`/cotizaciones/${q.id}`); }}
              onDocument={(q) => { console.log('[Cotizaciones] Ver documento:', { quotationId: q.id }); navigate(`/cotizaciones/${q.id}/documento`); }}
            />
            <PaginationBar page={page} pageSize={PAGE_SIZE} total={filtered.length} onChange={setPage} arrows summary={`Mostrando ${from}–${to} de ${filtered.length}`} sx={{ px: 0 }} />
          </>
        )}
      </Box>
    </AccountLayout>
  );
}
