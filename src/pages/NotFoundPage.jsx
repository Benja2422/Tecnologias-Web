import { Box, Typography } from '@mui/material';
import AppLink from '../components/atoms/AppLink';
import Logo from '../components/atoms/Logo';
import { colors } from '../utils/theme';

export default function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', textAlign: 'center', p: 3 }}>
      <Box>
        <Logo />
        <Typography component="h1" sx={{ mt: 4, fontSize: 28, fontWeight: 600, color: colors.text }}>
          Esta página aún no existe
        </Typography>
        <AppLink href="/" sx={{ display: 'inline-block', mt: 2, color: colors.link, fontFamily: 'inherit' }}>
          Volver al inicio
        </AppLink>
      </Box>
    </Box>
  );
}
