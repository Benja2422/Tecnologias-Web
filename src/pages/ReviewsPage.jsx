import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import AccountLayout from '../components/templates/AccountLayout';
import TabBar from '../components/molecules/TabBar';
import ReviewItemRow from '../components/molecules/ReviewItemRow';
import ReviewDialog from '../components/organisms/ReviewDialog';
import ReviewDetailDialog from '../components/organisms/ReviewDetailDialog';
import { useReviews } from '../contexts/ReviewsContext';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const TABS = [{ id: 'pendientes', label: 'Pendientes' }, { id: 'realizadas', label: 'Realizadas' }];

const COPY = {
  pendientes: {
    title: 'Mis reseñas',
    subtitle: 'Comparte tu experiencia y revisa las opiniones que ya publicaste.',
    heading: 'Pendientes',
    count: (n) => `${n} ${n === 1 ? 'producto' : 'productos'} por calificar`,
    empty: 'No tienes productos pendientes por calificar.',
  },
  realizadas: {
    title: 'Mis reseñas realizadas',
    subtitle: 'Revisa las opiniones que ya publicaste y consulta tu historial de reseñas.',
    heading: 'Realizadas',
    count: (n) => `${n} ${n === 1 ? 'opinión publicada' : 'opiniones publicadas'}`,
    empty: 'Aún no has publicado opiniones.',
  },
};

/** "Mis reseñas": pestañas Pendientes / Realizadas (?tab=realizadas) y modal para dejar una opinión. */
export default function ReviewsPage() {
  const [params, setParams] = useSearchParams();
  const { pending, done, publishReview } = useReviews();
  const [reviewing, setReviewing] = useState(null); // producto pendiente abierto en el modal
  const [viewing, setViewing] = useState(null); // opinión publicada abierta en el modal de detalle
  const [toast, setToast] = useState('');

  const tab = params.get('tab') === 'realizadas' ? 'realizadas' : 'pendientes';
  const copy = COPY[tab];
  const items = tab === 'pendientes' ? pending : done;

  const submit = ({ rating, comment }) => {
    console.log('[Reseñas] Publicar reseña:', { id: reviewing.id, producto: reviewing.name, rating, comment });
    publishReview(reviewing, { rating, comment });
    setReviewing(null);
    setToast('¡Gracias! Tu reseña fue publicada.');
  };

  return (
    <AccountLayout maxWidth={1600} showFooter headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, color: colors.text }}>{copy.title}</Typography>
      <Typography sx={{ mt: 1.5, fontSize: 15, color: colors.muted }}>{copy.subtitle}</Typography>

      <Box sx={{ mt: 4 }}>
        <TabBar tabs={TABS} value={tab} onChange={(id) => setParams(id === 'pendientes' ? {} : { tab: id })} label="Mis reseñas" />
      </Box>

      <Box role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} sx={{ mt: 4, border: '1px solid #E5E7EB', borderRadius: 3, bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', px: { xs: 2, sm: 3 }, pt: 3, pb: 1.5 }}>
          <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600, color: colors.text }}>{copy.heading}</Typography>
          <Typography role="status" sx={{ fontSize: 13, color: colors.muted }}>{copy.count(items.length)}</Typography>
        </Box>

        {items.length === 0 ? (
          <Typography sx={{ px: 3, py: 6, textAlign: 'center', fontSize: 15, color: colors.muted }}>{copy.empty}</Typography>
        ) : (
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0 }}>
            {items.map((item, i) => (
              <Box component="li" key={item.id} sx={{ borderTop: i === 0 ? 'none' : '1px solid #EEE', ...(i === 0 && { mt: 1 }) }}>
                <ReviewItemRow item={item} onReview={setReviewing} onOpen={(it) => { console.log('[Reseñas] Ver detalle:', { id: it.id, producto: it.name }); setViewing(it); }} />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {viewing && <ReviewDetailDialog key={viewing.id} item={viewing} onClose={() => setViewing(null)} />}
      {reviewing && <ReviewDialog key={reviewing.id} item={reviewing} onSubmit={submit} onClose={() => setReviewing(null)} />}

      <Snackbar open={Boolean(toast)} autoHideDuration={3500} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AccountLayout>
  );
}
