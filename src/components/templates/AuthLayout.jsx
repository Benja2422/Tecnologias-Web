import { Box, Container, Typography } from '@mui/material';
import Logo from '../atoms/Logo';
import { colors } from '../../utils/theme';

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#fff' }}>
      <Container maxWidth={false} component="main" sx={{ maxWidth: 600, flex: 1, pt: 7, pb: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Logo />
          <Typography component="h1" sx={{ mt: 5, fontSize: 32, fontWeight: 600, color: colors.text }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography sx={{ mt: 1.5, fontSize: 16, color: colors.muted }}>{subtitle}</Typography>
          )}
        </Box>
        {children}
      </Container>
      <Box component="footer" sx={{ height: 80, bgcolor: colors.footer }} />
    </Box>
  );
}
