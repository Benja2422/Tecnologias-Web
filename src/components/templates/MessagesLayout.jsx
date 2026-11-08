import { Box } from '@mui/material';
import Header from '../organisms/Header';
import Footer from '../organisms/Footer';
import AccountSidebar from '../organisms/AccountSidebar';

const LIST_WIDTH = 340;

/**
 * Layout de Mensajes: header + menú de cuenta + bandeja (columna) + panel de conversación + footer.
 * En pantallas angostas solo se ve uno de los dos paneles: la bandeja o la conversación (`showChat`).
 */
export default function MessagesLayout({ headerProps, list, chat, showChat }) {
  return (
    <Box sx={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#fff', textAlign: 'left' }}>
      <Header {...headerProps} />
      <Box sx={{ flex: 1, display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
        <AccountSidebar />
        <Box
          component="main"
          sx={{
            flex: 1, minWidth: 0, display: 'flex',
            // Altura fija para que cada panel haga su propio scroll
            height: { xs: 'calc(100dvh - 190px)', md: 'calc(100vh - 130px)' }, minHeight: 520,
          }}
        >
          <Box sx={{ width: { xs: '100%', md: LIST_WIDTH }, flexShrink: 0, display: { xs: showChat ? 'none' : 'block', md: 'block' }, borderRight: { md: '1px solid #EEE' }, minHeight: 0 }}>
            {list}
          </Box>
          <Box sx={{ flex: 1, minWidth: 0, display: { xs: showChat ? 'block' : 'none', md: 'block' }, minHeight: 0 }}>
            {chat}
          </Box>
        </Box>
      </Box>
      <Footer />
    </Box>
  );
}
