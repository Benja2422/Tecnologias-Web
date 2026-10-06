import { Box } from '@mui/material';
import Header from '../organisms/Header';
import AdminSidebar from '../organisms/AdminSidebar';
import AdminTopBar from '../organisms/AdminTopBar';
import { colors } from '../../utils/theme';

/** Layout del panel de administración: header global + menú lateral + barra superior + contenido. */
export default function AdminLayout({ headerProps, crumbs, admin, children }) {
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', textAlign: 'left' }}>
      <Header {...headerProps} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <AdminSidebar />
        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <AdminTopBar crumbs={crumbs} admin={admin} />
          <Box component="main" sx={{ flex: 1, bgcolor: colors.surface, px: { xs: 2, md: 4 }, pt: 5, pb: 5 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
