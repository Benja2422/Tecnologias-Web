import { Badge, Box, IconButton } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteButton from '../atoms/FavoriteButton';
import UserMenu from './UserMenu';
import { colors } from '../../utils/theme';

export default function HeaderActions({ user, cartCount = 0, onFavorites, onCart, onLogout }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 } }}>
      <FavoriteButton variant="plain" label="Ver favoritos" onClick={onFavorites} />
      <IconButton onClick={onCart} aria-label={`Carrito, ${cartCount} productos`} sx={{ color: colors.muted }}>
        <Badge
          badgeContent={cartCount}
          color="primary"
          sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16, fontWeight: 700 } }}
        >
          <ShoppingCartOutlinedIcon sx={{ fontSize: 28 }} />
        </Badge>
      </IconButton>
      <UserMenu user={user} onLogout={onLogout} />
    </Box>
  );
}
