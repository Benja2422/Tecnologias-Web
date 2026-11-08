import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Button, InputBase, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import AccountLayout from '../components/templates/AccountLayout';
import TabBar from '../components/molecules/TabBar';
import StatusFilterChips from '../components/molecules/StatusFilterChips';
import ClaimsTable from '../components/organisms/ClaimsTable';
import ReturnPolicyPanel from '../components/organisms/ReturnPolicyPanel';
import PaginationBar from '../components/molecules/PaginationBar';
import { CLAIM_STATUSES } from '../utils/claims';
import { mockClaims } from '../utils/mockClaims';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const PAGE_SIZE = 10;
const TABS = [
  { id: 'reclamos', label: 'Reclamos' },
  { id: 'politicas', label: 'Políticas de devolución' },
];
const slug = (s) => s.toLowerCase();

/** "Devoluciones y reembolsos": historial de reclamos (filtro ?estado=pendiente, paginación ?pagina=2) y políticas. */
export default function ClaimsPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const tab = params.get('tab') === 'politicas' ? 'politicas' : 'reclamos';
  const setTab = (id) => setParams(id === 'politicas' ? { tab: 'politicas' } : {});
  const [query, setQuery] = useState('');
  const claims = mockClaims; // TODO: reemplazar por datos reales (src/services)

  const status = CLAIM_STATUSES.find((s) => slug(s) === params.get('estado')) ?? null;
  const q = query.trim().toLowerCase();
  const filtered = claims.filter((c) =>
    (!status || c.status === status) && (!q || c.id.toLowerCase().includes(q) || c.orderId.toLowerCase().includes(q)),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, Number(params.get('pagina')) || 1), totalPages);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const setFilter = (next) => {
    console.log('[Reclamos] Filtrar por estado:', { estado: next ?? 'Todos' });
    setParams(next ? { estado: slug(next) } : {});
  };
  const setPage = (p) => {
    const next = new URLSearchParams(params);
    if (p > 1) next.set('pagina', String(p)); else next.delete('pagina');
    setParams(next);
  };

  return (
    <AccountLayout maxWidth={1100} showFooter headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <TabBar tabs={TABS} value={tab} onChange={setTab} label="Devoluciones y reembolsos" />

      <Box role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} sx={{ mt: 4 }}>
        {tab === 'politicas' ? (
          <ReturnPolicyPanel />
        ) : (
          <>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <Box>
                <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, color: colors.text }}>Historial de reclamos</Typography>
                <Typography sx={{ mt: 1, fontSize: 14, color: colors.muted }}>Consulta el estado y seguimiento de tus solicitudes.</Typography>
              </Box>
              <Button
                variant="contained"
                disableElevation
                endIcon={<AddIcon />}
                onClick={() => console.log('[Reclamos] Iniciar nuevo reclamo')} // TODO: abrir formulario de nuevo reclamo
                sx={{ height: 42, px: 2.5, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14 }}
              >
                Iniciar Nuevo Reclamo
              </Button>
            </Box>

            <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: '1 1 280px', maxWidth: 420, height: 40, px: 2, bgcolor: '#fff', border: `1px solid ${colors.border}`, borderRadius: '8px', '&:focus-within': { borderColor: colors.primary } }}>
                <SearchIcon sx={{ fontSize: 20, color: colors.muted }} />
                <InputBase
                  fullWidth
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); if (params.get('pagina')) setPage(1); }}
                  placeholder="Buscar por N° de reclamo o ID de orden"
                  inputProps={{ 'aria-label': 'Buscar reclamos' }}
                  sx={{ fontSize: 14, fontFamily: 'inherit' }}
                />
              </Box>
              <StatusFilterChips options={CLAIM_STATUSES} value={status} onChange={setFilter} label="Filtrar reclamos por estado" compact />
            </Box>

            <Box sx={{ mt: 3 }}>
              {filtered.length === 0 ? (
                <Box role="status" sx={{ py: 8, textAlign: 'center', border: '1px dashed #D9D9D9', borderRadius: 3 }}>
                  <Typography sx={{ fontSize: 16, color: colors.muted }}>
                    {status || q ? 'No hay reclamos que coincidan con tu búsqueda.' : 'Aún no has iniciado reclamos.'}
                  </Typography>
                </Box>
              ) : (
                <>
                  <ClaimsTable
                    claims={visible}
                    onView={(c) => {
                      console.log('[Reclamos] Ver detalle:', { claimId: c.id });
                      navigate(`/devoluciones/${c.id}`);
                    }}
                  />
                  <PaginationBar
                    page={page}
                    pageSize={PAGE_SIZE}
                    total={filtered.length}
                    onChange={setPage}
                    arrows
                    summary={`Mostrando ${filtered.length} ${filtered.length === 1 ? 'reclamo histórico' : 'reclamos históricos'}`}
                    sx={{ px: 0 }}
                  />
                </>
              )}
            </Box>
          </>
        )}
      </Box>
    </AccountLayout>
  );
}
