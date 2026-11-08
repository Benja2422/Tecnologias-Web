import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountLayout from '../components/templates/AccountLayout';
import TabBar from '../components/molecules/TabBar';
import ClaimItemCard from '../components/organisms/ClaimItemCard';
import { getClaim } from '../utils/mockClaims';
import { formatShortDate } from '../utils/dates';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const TABS = [
  { id: 'reclamos', label: 'Reclamos' },
  { id: 'politicas', label: 'Políticas de devolución' },
];

const label = { fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: colors.muted };
const value = { mt: 0.75, fontSize: 14, fontWeight: 600, color: colors.text };

/** Detalle de un reclamo (/devoluciones/:claimId): resumen e ítems reclamados con su estado. */
export default function ClaimDetailPage() {
  const { claimId } = useParams();
  const navigate = useNavigate();
  const claim = getClaim(claimId); // TODO: reemplazar por datos reales (src/services)

  const summary = claim && [
    ['N° de reclamo', claim.id],
    ['Fecha de solicitud', formatShortDate(claim.openedAt)],
    ['Orden original', `#${claim.orderId}`],
    ['Estado global', claim.status],
  ];

  return (
    <AccountLayout maxWidth={1100} showFooter headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <TabBar
        tabs={TABS}
        value="reclamos"
        onChange={(id) => navigate(id === 'politicas' ? '/devoluciones?tab=politicas' : '/devoluciones')}
        label="Devoluciones y reembolsos"
      />

      <Box component={RouterLink} to="/devoluciones" sx={{ mt: 3, display: 'inline-flex', alignItems: 'center', gap: 0.75, color: colors.primary, fontSize: 13, fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
        <ArrowBackIcon sx={{ fontSize: 16 }} /> Volver al historial
      </Box>

      {!claim ? (
        <Box role="status" sx={{ mt: 4, py: 8, textAlign: 'center', border: '1px dashed #D9D9D9', borderRadius: 3 }}>
          <Typography sx={{ fontSize: 16, color: colors.muted }}>No encontramos el reclamo {claimId}.</Typography>
        </Box>
      ) : (
        <>
          <Typography component="h1" sx={{ mt: 3, fontSize: { xs: 26, md: 32 }, fontWeight: 600, color: colors.text }}>Detalle del reclamo</Typography>
          <Typography sx={{ mt: 1, fontSize: 14, color: colors.muted }}>Revisa el estado de cada producto incluido en tu solicitud.</Typography>

          <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 3, p: 3, border: '1px solid #E5E7EB', borderRadius: 3 }}>
            {summary.map(([l, v]) => (
              <Box key={l}>
                <Typography sx={label}>{l}</Typography>
                <Typography sx={value}>{v}</Typography>
              </Box>
            ))}
          </Box>

          <Typography component="h2" sx={{ mt: 4, fontSize: 18, fontWeight: 600, color: colors.text }}>Ítems reclamados</Typography>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 2, p: 0, display: 'grid', gap: 2 }}>
            {claim.items.map((item) => (
              <li key={item.id}><ClaimItemCard item={item} /></li>
            ))}
          </Box>
        </>
      )}
    </AccountLayout>
  );
}
