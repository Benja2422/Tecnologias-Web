import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LogoutIcon from '@mui/icons-material/Logout';
import SidebarNav from '../molecules/SidebarNav';
import Wordmark from '../atoms/Wordmark';
import AdminBadge from '../atoms/AdminBadge';
import { colors } from '../../utils/theme';

// Dashboard se agregará más adelante
const ITEMS = [
  { label: 'Usuarios', to: '/admin/usuarios', icon: <PeopleOutlineIcon /> },
  { label: 'Categorías', to: '/admin/categorias', icon: <Inventory2OutlinedIcon /> },
];

export default function AdminSidebar() {
  const navigate = useNavigate();
  const logout = () => {
    // TODO: limpiar la sesión (src/contexts) antes de redirigir
    navigate('/login');
  };

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: '100%', md: 260 }, flexShrink: 0, bgcolor: '#fff', p: 3,
        borderRight: { md: '1px solid #E5E7EB' }, borderBottom: { xs: '1px solid #E5E7EB', md: 'none' },
        display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: { xs: 'center', md: 'stretch' },
        overflowX: { xs: 'auto', md: 'visible' },
      }}
    >
      <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1.25, mb: 4.5, mt: 0.5 }}>
        <Wordmark size={24} />
        <AdminBadge />
      </Box>
      <Typography sx={{ display: { xs: 'none', md: 'block' }, mb: 1.5, fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', color: '#9CA3AF' }}>
        MENÚ PRINCIPAL
      </Typography>

      <nav aria-label="Administración"><SidebarNav items={ITEMS} variant="outlined" /></nav>

      <Box sx={{ flex: 1 }} />
      <Button
        onClick={logout}
        startIcon={<LogoutIcon />}
        sx={{
          justifyContent: 'flex-start', px: 2, minHeight: 46, textTransform: 'none', fontFamily: 'inherit',
          fontSize: 15, fontWeight: 500, color: colors.muted, whiteSpace: 'nowrap', ml: { xs: 1, md: 0 },
          '& .MuiButton-startIcon': { mr: 2 },
        }}
      >
        Cerrar Sesión
      </Button>
    </Box>
  );
}
