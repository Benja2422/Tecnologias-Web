import { Box } from '@mui/material';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';

/** Layout del listado por categoría: header + menú lateral + contenido + footer. */
export default function CategoryLayout({ headerProps, sidebar, children }) {
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', textAlign: 'left' }}>
      <Header {...headerProps} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        {sidebar}
        <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, sm: 3, md: 5 }, pt: { xs: 2, sm: 3, md: 3.5 }, pb: { xs: 4, md: 6 } }}>
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
