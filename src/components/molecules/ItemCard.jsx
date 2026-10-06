import { Box, Button, Typography } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import FavoriteButton from '../atoms/FavoriteButton';
import RatingStars from '../atoms/RatingStars';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';

/** Tarjeta de producto o servicio. Cambia solo el texto/acción del botón. */
export default function ItemCard({ item, actionLabel, onAction, isFavorite = false, onToggleFavorite }) {
  const { name, image, rating, price, priceSuffix = '' } = item;

  return (
    <Box
      component="article"
      sx={{
        display: 'flex', flexDirection: 'column', gap: 1, p: 2, bgcolor: '#fff',
        border: '1px solid #EEE', borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      <Box sx={{ position: 'relative', height: 140, mb: 1, borderRadius: 2, overflow: 'hidden', bgcolor: '#F4F4F4' }}>
        {image ? (
          <Box component="img" src={image} alt={name} loading="lazy" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', color: '#C8C8C8' }}>
            <ImageOutlinedIcon sx={{ fontSize: 48 }} />
          </Box>
        )}
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <FavoriteButton active={isFavorite} onClick={() => onToggleFavorite?.(item)} />
        </Box>
      </Box>

      <Typography component="h3" sx={{ fontSize: 16, fontWeight: 500, color: colors.text }}>{name}</Typography>
      <RatingStars value={rating} />
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#222', mb: 1 }}>
        {formatPrice(price)}{priceSuffix}
      </Typography>

      <Button
        fullWidth
        variant="outlined"
        onClick={() => onAction?.(item)}
        sx={{
          height: 46, borderRadius: 999, borderWidth: 1.5, borderColor: colors.primary, color: colors.primary,
          textTransform: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
          '&:hover': { borderWidth: 1.5, borderColor: colors.primaryDark, bgcolor: '#FFF5F5' },
        }}
      >
        {actionLabel}
      </Button>
    </Box>
  );
}
