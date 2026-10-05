import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './utils/theme';
import RegisterPage from './pages/RegisterPage';

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RegisterPage />
    </ThemeProvider>
  );
}
