import { Box, Button, Typography } from '@mui/material';
import PageContainer from '../atoms/PageContainer';
import { colors } from '../../utils/theme';

export default function HeroBanner({ onCta }) {
  return (
    <Box component="section" sx={{ bgcolor: '#E6E7EB' }}>
      <PageContainer sx={{ minHeight: { xs: 320, md: 380 }, display: 'flex', alignItems: 'center' }}>
        <Box sx={{ maxWidth: 620 }}>
          <Typography component="h1" sx={{ fontSize: { xs: 28, md: 36 }, lineHeight: 1.35, fontWeight: 600, color: colors.text }}>
            Descubre los mejores productos y servicios locales en{' '}
            <Box component="span" sx={{ color: colors.primary, fontWeight: 700 }}>TodoMart</Box>
          </Typography>
          <Typography sx={{ mt: 2, fontSize: { xs: 16, md: 20 }, color: colors.muted }}>
            Los mejores productos y servicios locales
          </Typography>
          <Button
            variant="contained"
            disableElevation
            onClick={onCta}
            sx={{
              mt: 3, height: 46, px: 3, borderRadius: 999, textTransform: 'none', fontFamily: 'inherit',
              fontSize: 15, fontWeight: 600, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark },
            }}
          >
            Ver catálogo
          </Button>
        </Box>
      </PageContainer>
    </Box>
  );
}
