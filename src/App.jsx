import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './utils/theme';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LoginPage />
    </ThemeProvider>
  );
}
