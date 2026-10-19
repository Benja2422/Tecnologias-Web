import { useState } from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import FilterSection from '../molecules/FilterSection';
import TypeFilter from '../molecules/TypeFilter';
import PriceRangeFilter from '../molecules/PriceRangeFilter';
import RatingFilter from '../molecules/RatingFilter';
import { colors } from '../../utils/theme';

/**
 * Panel lateral de filtros de la búsqueda: tipo (productos / servicios / ambos), precio y rating mínimo.
 * min / max: texto con dígitos ('' = sin límite).
 */
export default function SearchFilters({ type, onTypeChange, min, max, onApplyPrice, minRating, onRatingChange, onClear }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box
      component="aside"
      aria-label="Filtros"
      sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, boxSizing: 'border-box', pr: { md: 3 }, borderRight: { md: '1px solid #EEE' }, alignSelf: 'flex-start' }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: { md: 3 }, borderBottom: { md: '1px solid #EEE' } }}>
        <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.text, pt: { md: 2.25 } }}>Filtros</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pt: { md: 2.25 } }}>
          <ButtonBase onClick={onClear} sx={{ fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: colors.primary, '&:hover': { textDecoration: 'underline' } }}>
            Limpiar
          </ButtonBase>
          <ButtonBase
            onClick={() => setMobileOpen((o) => !o)}
            aria-expanded={mobileOpen}
            aria-controls="search-filters-body"
            sx={{ display: { xs: 'inline-flex', md: 'none' }, gap: 0.5, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: colors.ink }}
          >
            <TuneIcon sx={{ fontSize: 18 }} /> {mobileOpen ? 'Ocultar' : 'Mostrar'}
          </ButtonBase>
        </Box>
      </Box>

      <Box id="search-filters-body" sx={{ display: { xs: mobileOpen ? 'block' : 'none', md: 'block' } }}>
        <FilterSection title="Tipo">
          <TypeFilter value={type} onChange={onTypeChange} />
        </FilterSection>
        <FilterSection title="Precio">
          <PriceRangeFilter min={min} max={max} onApply={onApplyPrice} />
        </FilterSection>
        <FilterSection title="Rating mínimo" divider={false}>
          <RatingFilter value={minRating} onChange={onRatingChange} />
        </FilterSection>
      </Box>
    </Box>
  );
}
