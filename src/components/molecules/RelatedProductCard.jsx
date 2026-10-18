import { Box, Button, Typography } from '@mui/material';
import AppLink from '../atoms/AppLink';
import RatingStars from '../atoms/RatingStars';
import PriceDisplay from './PriceDisplay';
import { colors } from '../../utils/theme';

/** Tarjeta de producto relacionado: etiqueta/imagen, nombre (enlace), estrellas, precio y botón. */
export default function RelatedProductCard({ product, onAddToCart }) {
  const { id, name, rating, reviewCount, price, originalPrice, images = [], imageLabel } = product;
  const image = images[0];

  return (
    <Box
      component="article"
      sx={{
        display: 'flex', flexDirection: 'column', gap: 1.5, p: 2, bgcolor: '#fff',
        border: '1px solid #EEE', borderRadius: 3, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}
    >
      {image ? (
        <Box component="img" src={image.src} alt={image.alt} loading="lazy" sx={{ width: '100%', height: 140, objectFit: 'contain' }} />
      ) : (
        <Box sx={{ height: 24, borderRadius: '6px', bgcolor: '#E5E7EB', color: '#9CA3AF', fontSize: 13, display: 'grid', placeItems: 'center' }}>
          {imageLabel ?? 'Sin imagen'}
        </Box>
      )}
      <AppLink href={`/producto/${id}`} underline="none" sx={{ color: colors.ink, fontFamily: 'inherit' }}>
        <Typography component="h3" sx={{ fontSize: 16, fontWeight: 600, '&:hover': { color: colors.primary } }}>{name}</Typography>
      </AppLink>
      <RatingStars value={rating} reviewCount={reviewCount} outlined />
      <PriceDisplay price={price} originalPrice={originalPrice} size="sm" />
      <Button
        fullWidth
        variant="outlined"
        onClick={() => onAddToCart?.(product)}
        sx={{
          mt: 0.5, height: 46, borderRadius: 999, borderWidth: 1.5, borderColor: colors.primary, color: colors.primary,
          fontFamily: 'inherit', fontSize: 14, fontWeight: 700,
          '&:hover': { borderWidth: 1.5, borderColor: colors.primaryDark, bgcolor: '#FFF5F5' },
        }}
      >
        Añadir al carrito
      </Button>
    </Box>
  );
}
