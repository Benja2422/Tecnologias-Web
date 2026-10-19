import { Box, Typography } from '@mui/material';
import MainLayout from './MainLayout';
import PageContainer from '../atoms/PageContainer';
import CheckoutStepper from '../molecules/CheckoutStepper';
import { currentUser } from '../../utils/mockCatalog';
import { colors } from '../../utils/theme';

/**
 * Estructura del checkout: título, pasos y contenido. Con `aside` el contenido va a la izquierda
 * y el resumen a la derecha; sin `aside` el contenido queda centrado (confirmación).
 */
export default function CheckoutLayout({ step, finished = false, title, aside, children, maxWidth }) {
  return (
    <MainLayout headerProps={{ user: currentUser }}>
      <PageContainer sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 6, md: 10 } }}>
        {title && (
          <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, color: colors.text, textAlign: 'left' }}>
            {title}
          </Typography>
        )}
        <Box sx={{ mt: title ? 4 : 0 }}><CheckoutStepper current={step} finished={finished} /></Box>

        {aside ? (
          <Box sx={{ mt: 5, display: 'grid', gap: 4, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 420px' } }}>
            <Box sx={{ minWidth: 0 }}>{children}</Box>
            {aside}
          </Box>
        ) : (
          <Box sx={{ mt: 5, mx: 'auto', maxWidth: maxWidth ?? 1000 }}>{children}</Box>
        )}
      </PageContainer>
    </MainLayout>
  );
}
