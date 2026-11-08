import { Box, Typography } from '@mui/material';
import MainLayout from './MainLayout';
import AccountLayout from './AccountLayout';
import PageContainer from '../atoms/PageContainer';
import CheckoutStepper from '../molecules/CheckoutStepper';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { currentUser } from '../../utils/mockCatalog';
import { mockProfile } from '../../utils/mockProfile';
import { colors } from '../../utils/theme';

/**
 * Estructura del checkout: título, pasos y contenido. Con `aside` el contenido va a la izquierda
 * y el resumen a la derecha; sin `aside` el contenido queda centrado (confirmación).
 * Con `quotation` (pago de una cotización aceptada) se muestra dentro de "Mi cuenta", con un aviso de precios fijos;
 * `notice` agrega un aviso extra bajo ese (p. ej. falta de stock).
 */
export default function CheckoutLayout({ step, finished = false, title, aside, children, maxWidth, quotation = null, notice = null }) {
  if (quotation) {
    return (
      <AccountLayout compact maxWidth={1600} showFooter headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
        <CheckoutStepper current={step} finished={finished} />
        <Box role="note" sx={{ mt: 3, px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, bgcolor: '#F7F7F8', borderRadius: '6px', color: colors.muted, fontSize: 14 }}>
          <InfoOutlinedIcon aria-hidden sx={{ fontSize: 20 }} />
          Estás pagando la cotización {quotation.id}. Los precios quedan fijos hasta que completes el pago.
        </Box>
        {notice}
        <Box sx={{ mt: 4, display: 'grid', gap: 4, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 380px' } }}>
          <Box sx={{ minWidth: 0 }}>{children}</Box>
          {aside}
        </Box>
      </AccountLayout>
    );
  }

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
