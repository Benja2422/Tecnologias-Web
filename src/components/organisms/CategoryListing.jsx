import { Box, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import Breadcrumb from '../molecules/Breadcrumb';
import SortSelect from '../molecules/SortSelect';
import PaginationBar from '../molecules/PaginationBar';
import ItemGrid from './ItemGrid';
import { colors } from '../../utils/theme';

/**
 * Cabecera (breadcrumb, título, total, orden) + grilla de tarjetas + paginación.
 * `items` ya viene recortado a la página actual; `total` es la cantidad de todos los resultados.
 */
export default function CategoryListing({
  breadcrumb, title, countLabel, sortOptions, sort, onSortChange,
  items, total, page, pageSize, onPageChange, paginationLabel,
  actionLabel, onAction, favoriteIds, onToggleFavorite, emptyMessage,
}) {
  return (
    <Box>
      <Breadcrumb items={breadcrumb} />

      <Box sx={{ mt: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, lineHeight: 1.3, color: colors.text }}>
          {title}
        </Typography>
        <SortSelect options={sortOptions} value={sort} onChange={onSortChange} />
      </Box>
      <Typography aria-live="polite" sx={{ mt: 2.5, mb: 3, fontSize: 15, color: colors.muted }}>{countLabel}</Typography>

      {items.length === 0 ? (
        <Box sx={{ py: 10, display: 'grid', justifyItems: 'center', gap: 1.5, textAlign: 'center', color: colors.muted }}>
          <Inventory2OutlinedIcon sx={{ fontSize: 48, color: '#C8C8C8' }} />
          <Typography>{emptyMessage}</Typography>
        </Box>
      ) : (
        <ItemGrid
          items={items}
          imageHeight={160}
          outlinedStars
          actionLabel={actionLabel}
          onAction={onAction}
          favoriteIds={favoriteIds}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {total > pageSize && (
        <PaginationBar page={page} pageSize={pageSize} total={total} onChange={onPageChange} itemLabel={paginationLabel} sx={{ px: 0, mt: 2 }} />
      )}
    </Box>
  );
}
