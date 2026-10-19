import { Box } from '@mui/material';
import ItemCard from '../molecules/ItemCard';

/**
 * Grilla de tarjetas (1 / 2 / `columns` columnas según el ancho).
 * actionLabel puede ser un texto o una función (item) => texto, para mezclar productos y servicios.
 */
export default function ItemGrid({ items, actionLabel, onAction, favoriteIds, onToggleFavorite, columns = 3, ...cardProps }) {
  return (
    <Box
      component="ul"
      sx={{
        listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 3,
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: `repeat(${columns}, 1fr)` },
      }}
    >
      {items.map((item) => (
        <li key={item.id}>
          <ItemCard
            item={item}
            actionLabel={typeof actionLabel === 'function' ? actionLabel(item) : actionLabel}
            onAction={onAction}
            isFavorite={favoriteIds?.has(item.id)}
            onToggleFavorite={onToggleFavorite}
            {...cardProps}
          />
        </li>
      ))}
    </Box>
  );
}
