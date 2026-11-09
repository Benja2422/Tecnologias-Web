import { Avatar, Box, Typography } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ArchiveOutlinedIcon from '@mui/icons-material/ArchiveOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PercentOutlinedIcon from '@mui/icons-material/PercentOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import ChatBubbleOutlinedIcon from '@mui/icons-material/ChatBubbleOutlined';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import StarBorderOutlinedIcon from '@mui/icons-material/StarBorderOutlined';
import SidebarNav from '../molecules/SidebarNav';
import Wordmark from '../atoms/Wordmark';
import { useSeller } from '../../contexts/SellerContext';
import { SELLER } from '../../utils/seller';
import { getInitials } from '../../utils/format';
import { colors } from '../../utils/theme';

/** Avatar de la tienda (iniciales del nombre de la empresa). */
export const SellerAvatar = ({ name = SELLER.name, size = 36 }) => (
  <Avatar sx={{ width: size, height: size, bgcolor: '#F3F4F6', color: colors.ink, border: '1px solid #E5E7EB', fontSize: size * 0.36, fontWeight: 700 }}>
    {getInitials(name)}
  </Avatar>
);

/** Menú lateral del panel de emprendedor, con el número de pendientes en cotizaciones, preguntas y devoluciones. */
export default function SellerSidebar() {
  const { counts, profile } = useSeller();
  const items = [
    { label: 'Dashboard', to: '/emprendedor', icon: <GridViewOutlinedIcon />, exact: true },
    { label: 'Inventario General', to: '/emprendedor/inventario', icon: <ArchiveOutlinedIcon /> },
    { label: 'Productos y servicios', to: '/emprendedor/catalogo', icon: <Inventory2OutlinedIcon />, also: ['/emprendedor/productos', '/emprendedor/servicios'] },
    { label: 'Ofertas Activas', to: '/emprendedor/ofertas', icon: <PercentOutlinedIcon /> },
    { label: 'Pedidos Recibidos', to: '/emprendedor/pedidos', icon: <ShoppingCartOutlinedIcon /> },
    { label: 'Cotizaciones', to: '/emprendedor/cotizaciones', icon: <DescriptionOutlinedIcon />, badge: counts.quotations },
    { label: 'Preguntas', to: '/emprendedor/preguntas', icon: <ChatBubbleOutlinedIcon />, badge: counts.questions },
    { label: 'Devoluciones', to: '/emprendedor/devoluciones', icon: <SyncOutlinedIcon />, badge: counts.returns },
    { label: 'Calificaciones', to: '/emprendedor/calificaciones', icon: <StarBorderOutlinedIcon /> },
    { label: 'Perfil y Tienda', to: '/emprendedor/perfil', icon: <StorefrontOutlinedIcon /> },
  ];

  return (
    <Box component="aside" sx={{ width: { xs: '100%', md: 260 }, flexShrink: 0, bgcolor: '#fff', borderRight: { md: '1px solid #E5E7EB' }, borderBottom: { xs: '1px solid #E5E7EB', md: 'none' } }}>
      <Box sx={{ px: 2, py: { xs: 1.5, md: 4 }, display: 'flex', flexDirection: 'column', overflowX: { xs: 'auto', md: 'visible' }, position: { md: 'sticky' }, top: { md: 129 }, minHeight: { md: 'calc(100vh - 129px)' } }}>
        <Box sx={{ display: { xs: 'none', md: 'block' }, px: 0.5, mb: 4 }}>
          <Wordmark size={22} />
        </Box>

        <nav aria-label="Panel de emprendedor"><SidebarNav items={items} dense /></nav>

        <Box sx={{ flex: 1, display: { xs: 'none', md: 'block' } }} />
        <Box sx={{ display: { xs: 'none', md: 'block' }, px: 1, mt: 4 }}>
          <Typography sx={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', color: '#9CA3AF' }}>SESIÓN INICIADA COMO:</Typography>
          <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <SellerAvatar name={profile.company.name} />
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink, lineHeight: 1.3, overflowWrap: 'anywhere' }}>{profile.company.name}</Typography>
              <Typography sx={{ fontSize: 12, color: colors.muted }}>{SELLER.plan}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
