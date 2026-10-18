import { Box } from '@mui/material';
import SectionHeader from '../molecules/SectionHeader';
import RelatedProductCard from '../molecules/RelatedProductCard';

export default function RelatedProductsSection({ products, onAddToCart, seeMoreHref = '/productos' }) {
  if (!products.length) return null;
  return (
    <Box component="section" aria-label="Productos relacionados">
      <SectionHeader title="Productos relacionados" href={seeMoreHref} linkLabel="Ver más" />
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' } }}>
        {products.map((p) => (
          <RelatedProductCard key={p.id} product={p} onAddToCart={onAddToCart} />
        ))}
      </Box>
    </Box>
  );
}
