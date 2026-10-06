import { Box } from '@mui/material';
import Header from '../organisms/Header';
import AccountSidebar from '../organisms/AccountSidebar';

/** Layout de "Mi cuenta": header + menú lateral + contenido. */
export default function AccountLayout({ headerProps, children }) {
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', textAlign: 'left' }}>
      <Header {...headerProps} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <AccountSidebar />
        <Box component="main" sx={{ flex: 1, minWidth: 0, px: { xs: 2, md: 8 }, pt: 5, pb: 10, pr: { md: 10 } }}>
          <Box sx={{ maxWidth: 1100 }}>{children}</Box>
        </Box>
      </Box>
    </Box>
  );
}
