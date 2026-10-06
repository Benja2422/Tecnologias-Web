import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#1F2323', minHeight: 120, display: 'grid', placeItems: 'center', px: 2 }}>
      <Typography sx={{ fontSize: 14, color: '#BDBDBD', textAlign: 'center' }}>
        © {new Date().getFullYear()} TodoMart. Todos los derechos reservados.
      </Typography>
    </Box>
  );
}
