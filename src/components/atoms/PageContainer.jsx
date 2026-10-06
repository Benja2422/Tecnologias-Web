import { Box } from '@mui/material';

/** Ancho máximo y márgenes laterales consistentes (80px en escritorio). */
export default function PageContainer({ children, sx }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 1440, mx: 'auto', px: { xs: 2, sm: 4, lg: 10 }, ...sx }}>
      {children}
    </Box>
  );
}
