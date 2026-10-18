import { Box, Button, Divider, Link, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AgeRestrictionBadge from '../atoms/AgeRestrictionBadge';
import RatingStars from '../atoms/RatingStars';
import StockStatus from '../atoms/StockStatus';
import PrimaryButton from '../atoms/PrimaryButton';
import PriceDisplay from '../molecules/PriceDisplay';
import ColorSelector from '../molecules/ColorSelector';
import QuantityStepper from '../molecules/QuantityStepper';
import { colors } from '../../utils/theme';

const labelSx = { fontSize: 16, fontWeight: 600, color: colors.ink };

/** Columna derecha de la ficha: título, precio, variantes, cantidad y acciones. */
export default function ProductPurchasePanel({
  product, rating, reviewCount, variantId, onVariantChange, quantity, onQuantityChange, stock,
  isWishlisted, onToggleWishlist, onAddToCart, onOpenSeller,
}) {
  const { name, ageRestricted, price, originalPrice, variants, freeShipping, seller } = product;
  const available = stock > 0;

  return (
    <Box sx={{ minWidth: 0 }}>
      {ageRestricted && <Box sx={{ mb: 1.5 }}><AgeRestrictionBadge /></Box>}

      <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.text, lineHeight: 1.25 }}>
        {name}
      </Typography>
      <Box sx={{ mt: 1.5 }}><RatingStars value={rating} reviewCount={reviewCount} outlined /></Box>

      <Divider sx={{ my: 3, borderColor: '#EEE' }} />

      <PriceDisplay price={price} originalPrice={originalPrice} />
      <Box sx={{ mt: 1.5 }}><StockStatus available={available} /></Box>

      <Divider sx={{ my: 3, borderColor: '#EEE' }} />

      {variants?.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <ColorSelector variants={variants} selectedId={variantId} onSelect={onVariantChange} />
        </Box>
      )}
      {!variants?.length && available && (
        <Typography sx={{ mb: 3, fontSize: 13, color: '#9A9A9A' }}>Stock: {stock} {stock === 1 ? 'unidad' : 'unidades'}</Typography>
      )}

      <Typography id="quantity-label" sx={{ ...labelSx, mb: 1.5 }}>Cantidad</Typography>
      <QuantityStepper value={quantity} max={stock} onChange={onQuantityChange} disabled={!available} />

      <Box sx={{ mt: 3, display: 'grid', gap: 1.5 }}>
        <PrimaryButton disabled={!available} onClick={onAddToCart} sx={{ height: 56, py: 0, fontSize: 17, fontWeight: 700 }}>
          {available ? 'Añadir al carrito' : 'Sin stock'}
        </PrimaryButton>
        <Button
          fullWidth
          variant="outlined"
          onClick={onToggleWishlist}
          aria-pressed={isWishlisted}
          startIcon={isWishlisted ? <FavoriteIcon sx={{ color: colors.primary }} /> : <FavoriteBorderIcon />}
          sx={{
            height: 52, borderRadius: 999, fontFamily: 'inherit', fontSize: 16, fontWeight: 600,
            color: '#555', borderColor: colors.border,
            '&:hover': { borderColor: colors.text, bgcolor: 'transparent' },
          }}
        >
          {isWishlisted ? 'Quitar de lista de deseos' : 'Añadir a lista de deseos'}
        </Button>
      </Box>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 3, p: 0, display: 'grid', gap: 1.25, fontSize: 13, color: colors.muted }}>
        {freeShipping && <li>✓ Envío gratis a todo el país</li>}
        <li>
          ✓ Vendido por:{' '}
          <Link
            component="button"
            type="button"
            onClick={() => onOpenSeller?.(seller)}
            underline="always"
            sx={{ fontSize: 13, fontFamily: 'inherit', color: colors.link, verticalAlign: 'baseline' }}
          >
            {seller.name}
          </Link>
        </li>
      </Box>
    </Box>
  );
}
