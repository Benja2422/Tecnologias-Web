import { useState } from 'react';
import { Box, Button, InputBase, Menu, MenuItem, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import CheckIcon from '@mui/icons-material/Check';
import { colors } from '../../utils/theme';

/**
 * Barra de búsqueda + filtro + resumen del panel.
 * filter: { label, options: [{ id, name }], value (id o null = todos), onChange, allLabel, icon: 'tune' | 'funnel', showValue }
 * summary: texto a la derecha (p. ej. "Filtrado: <b>Mostrando 6 items</b>").
 */
export default function SellerFilterBar({ query, onQuery, placeholder, filter, summary }) {
  const [anchor, setAnchor] = useState(null);
  const selected = filter?.options.find((o) => o.id === filter.value);
  const buttonLabel = filter && (filter.showValue ? `${filter.label}: ${selected?.name ?? filter.allLabel ?? 'Todos'}` : selected ? `${filter.label}: ${selected.name}` : filter.label);
  const pick = (id) => { filter.onChange(id); setAnchor(null); };

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.5, p: 2, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: '1 1 240px', maxWidth: 320, height: 36, px: 1.5, border: '1px solid #9CA3AF', borderRadius: '6px', bgcolor: '#fff', '&:focus-within': { borderColor: colors.primary } }}>
        <SearchIcon aria-hidden sx={{ fontSize: 18, color: '#9CA3AF' }} />
        <InputBase fullWidth value={query} onChange={(e) => onQuery(e.target.value)} placeholder={placeholder} inputProps={{ 'aria-label': placeholder }} sx={{ fontSize: 13.5, fontFamily: 'inherit' }} />
      </Box>
      {filter && (
        <>
          <Button
            onClick={(e) => setAnchor(e.currentTarget)}
            aria-haspopup="menu"
            aria-expanded={Boolean(anchor)}
            startIcon={filter.icon === 'funnel' ? <FilterAltOutlinedIcon /> : <TuneOutlinedIcon />}
            sx={{ height: 36, px: 1.5, border: '1px solid #E5E7EB', borderRadius: '6px', color: colors.ink, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, bgcolor: filter.value ? '#FDECEF' : '#fff', borderColor: filter.value ? colors.primary : '#E5E7EB', '&:hover': { bgcolor: '#F7F7F7' } }}
          >
            {buttonLabel}
          </Button>
          <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
            {[{ id: null, name: filter.allLabel ?? 'Todos' }, ...filter.options].map((o) => (
              <MenuItem key={o.id ?? 'all'} selected={o.id === filter.value} onClick={() => pick(o.id)} sx={{ fontSize: 14, gap: 1, minWidth: 200 }}>
                <CheckIcon aria-hidden sx={{ fontSize: 16, visibility: o.id === filter.value ? 'visible' : 'hidden', color: colors.primary }} />
                {o.name}
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
      <Typography sx={{ ml: 'auto', fontSize: 13.5, color: '#4B5563', '& b': { color: colors.ink, fontWeight: 700 } }}>{summary}</Typography>
    </Box>
  );
}
