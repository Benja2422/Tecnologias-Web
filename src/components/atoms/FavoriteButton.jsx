import { IconButton } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { colors } from '../../utils/theme';

/** variant="card": círculo blanco con borde (sobre la imagen). variant="plain": solo icono (header). */
export default function FavoriteButton({ active = false, onClick, variant = 'card', label }) {
  const Icon = active ? FavoriteIcon : FavoriteBorderIcon;
  const isCard = variant === 'card';
  return (
    <IconButton
      onClick={onClick}
      aria-pressed={active}
      aria-label={label ?? (active ? 'Quitar de favoritos' : 'Agregar a favoritos')}
      sx={{
        color: isCard ? colors.primary : colors.muted,
        ...(isCard && {
          width: 30, height: 30, bgcolor: '#fff', border: '1px solid #EEE',
          '&:hover': { bgcolor: '#FFF5F5' },
        }),
      }}
    >
      <Icon sx={{ fontSize: isCard ? 18 : 28 }} />
    </IconButton>
  );
}
