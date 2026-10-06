import { Box } from '@mui/material';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';

/** Layout de las pantallas autenticadas: header + contenido + footer. */
export default function MainLayout({ headerProps, children }) {
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', textAlign: 'left' }}>
      <Header {...headerProps} />
      <Box component="main" sx={{ flex: 1 }}>{children}</Box>
      <Footer />
    </Box>
  );
}
