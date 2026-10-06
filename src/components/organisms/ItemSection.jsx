import { Box } from '@mui/material';
import PageContainer from '../atoms/PageContainer';
import SectionHeader from '../molecules/SectionHeader';
import ItemCard from '../molecules/ItemCard';

/** Sección con encabezado + grilla de tarjetas (productos o servicios destacados). */
export default function ItemSection({ title, seeAllHref, items, actionLabel, onAction, favoriteIds, onToggleFavorite }) {
  return (
    <Box component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <PageContainer>
        <SectionHeader title={title} href={seeAllHref} />
        <Box
          sx={{
            display: 'grid', gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          }}
        >
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              actionLabel={actionLabel}
              onAction={onAction}
              isFavorite={favoriteIds?.has(item.id)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </Box>
      </PageContainer>
    </Box>
  );
}
