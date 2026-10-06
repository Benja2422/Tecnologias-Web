import { Box } from '@mui/material';
import AppLink from '../atoms/AppLink';
import MenuIcon from '@mui/icons-material/Menu';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import { colors } from '../../utils/theme';

const ITEMS = [
  { label: 'Categorías', href: '/categorias', icon: <MenuIcon sx={{ fontSize: 18 }} /> },
  { label: 'Productos', href: '/productos' },
  { label: 'Servicios', href: '/servicios' },
  { label: 'Tecnologia', href: '/categorias/tecnologia' },
  { label: 'Hogar', href: '/categorias/hogar' },
  { label: 'Vender', href: '/vender', icon: <LocalOfferOutlinedIcon sx={{ fontSize: 18 }} /> },
];

export default function CategoryNav({ items = ITEMS }) {
  return (
    <Box component="nav" aria-label="Categorías" sx={{ display: 'flex', alignItems: 'center', gap: 4, height: 48, overflowX: 'auto', whiteSpace: 'nowrap' }}>
      {items.map(({ label, href, icon }) => (
        <AppLink
          key={label}
          href={href}
          underline="none"
          sx={{
            display: 'inline-flex', alignItems: 'center', gap: 1, fontSize: 14, fontFamily: 'inherit',
            color: colors.muted, '&:hover': { color: colors.primary },
          }}
        >
          {icon}
          {label}
        </AppLink>
      ))}
    </Box>
  );
}
