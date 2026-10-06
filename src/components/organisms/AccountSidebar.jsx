import { Box, Button, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutlined';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ReplayIcon from '@mui/icons-material/Replay';
import LogoutIcon from '@mui/icons-material/Logout';
import SidebarNav from '../molecules/SidebarNav';
import { colors } from '../../utils/theme';

const ITEMS = [
  { label: 'Mi perfil', to: '/perfil', icon: <PersonOutlineIcon /> },
  { label: 'Mis direcciones', to: '/direcciones', icon: <PlaceOutlinedIcon /> },
  { label: 'Mis pedidos', to: '/pedidos', icon: <ShoppingBagOutlinedIcon /> },
  { label: 'Mis cotizaciones', to: '/cotizaciones', icon: <DescriptionOutlinedIcon /> },
  { label: 'Mensajes', to: '/mensajes', icon: <ChatBubbleOutlineIcon /> },
  { label: 'Mis reseñas', to: '/resenas', icon: <StarBorderIcon /> },
  { label: 'Mi lista de deseos', to: '/lista-deseos', icon: <FavoriteBorderIcon /> },
  { label: 'Devoluciones y reembolsos', to: '/devoluciones', icon: <ReplayIcon /> },
];

export default function AccountSidebar({ onLogout }) {
  const navigate = useNavigate();
  const logout = () => {
    // TODO: limpiar la sesión (src/contexts) antes de redirigir
    onLogout?.();
    navigate('/login');
  };

  return (
    <Box
      component="aside"
      sx={{
        width: { xs: '100%', md: 280 }, flexShrink: 0, p: 3, bgcolor: '#fff',
        borderRight: { md: '1px solid #EEE' }, borderBottom: { xs: '1px solid #EEE', md: 'none' },
        display: 'flex', flexDirection: { xs: 'row', md: 'column' }, alignItems: { xs: 'center', md: 'stretch' },
        overflowX: { xs: 'auto', md: 'visible' },
      }}
    >
      <nav aria-label="Mi cuenta"><SidebarNav items={ITEMS} /></nav>
      <Divider sx={{ my: 3, mx: { md: 0 }, display: { xs: 'none', md: 'block' } }} />
      <Button
        onClick={logout}
        startIcon={<LogoutIcon />}
        sx={{
          justifyContent: 'flex-start', px: 2, minHeight: 48, textTransform: 'none', fontFamily: 'inherit',
          fontSize: 15, fontWeight: 500, color: colors.primary, whiteSpace: 'nowrap', ml: { xs: 1, md: 0 },
          '& .MuiButton-startIcon': { mr: 2 },
        }}
      >
        Cerrar sesión
      </Button>
    </Box>
  );
}
