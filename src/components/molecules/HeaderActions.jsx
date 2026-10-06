import { Badge, Box, IconButton, Typography } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteButton from '../atoms/FavoriteButton';
import UserAvatar from '../atoms/UserAvatar';
import { colors } from '../../utils/theme';

export default function HeaderActions({ userName, cartCount = 0, onFavorites, onCart, onUser }) {
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
      <Box
        component="button"
        onClick={onUser}
        aria-label="Menú de usuario"
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, ml: 1, fontFamily: 'inherit' }}
      >
        <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 15, fontWeight: 500, color: colors.text }}>
          {userName}
        </Typography>
        <UserAvatar name={userName} />
      </Box>
    </Box>
  );
}
