import { Box } from '@mui/material';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import SellerSidebar from '../organisms/SellerSidebar';
import SellerTopBar from '../organisms/SellerTopBar';
import { currentUser } from '../../utils/mockCatalog';
import { mockProfile } from '../../utils/mockProfile';

const SELLER_BG = '#F8F8FA';

/**
 * Layout del panel de emprendedor: header de la tienda + menú lateral + barra superior + contenido.
 * crumbs: ruta de navegación; action: botón a la derecha de la barra; aside: panel lateral derecho (p. ej. responder cotización).
 * plain: sin menú lateral ni barra (formularios de producto y servicio, con pie de página).
 */
export default function SellerLayout({ crumbs, action, aside, plain = false, children }) {
  const header = <Header user={{ ...currentUser, name: mockProfile.fullName }} />;

  if (plain) {
    return (
      <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: SELLER_BG, textAlign: 'left' }}>
        {header}
        <Box component="main" sx={{ flex: 1, width: '100%', maxWidth: 1440, mx: 'auto', px: { xs: 2, md: 10 }, pt: 4, pb: 10 }}>{children}</Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', textAlign: 'left' }}>
      {header}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <SellerSidebar />
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', bgcolor: SELLER_BG }}>
          <SellerTopBar crumbs={[{ label: 'Panel de Emprendedor', href: '/emprendedor' }, ...crumbs]} action={action} />
          <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, md: 5 }, pt: { xs: 3, md: 5 }, pb: 8 }}>
            <Box sx={{ maxWidth: 1400 }}>{children}</Box>
          </Box>
        </Box>
        {aside}
      </Box>
    </Box>
  );
}
