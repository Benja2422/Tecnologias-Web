import { useEffect, useState } from 'react';
import { InputBase, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { colors } from '../../utils/theme';

/** defaultValue: texto inicial (p. ej. la búsqueda actual); se actualiza si cambia. */
export default function SearchBar({ onSearch, defaultValue = '', placeholder = 'Buscar productos y servicios...' }) {
  const [query, setQuery] = useState(defaultValue);
  useEffect(() => { setQuery(defaultValue); }, [defaultValue]);

  return (
    <Box
      component="form"
      role="search"
      onSubmit={(e) => { e.preventDefault(); onSearch?.(query.trim()); }}
      sx={{
        display: 'flex', alignItems: 'center', gap: 1.5, width: '100%', height: 40, px: 2,
        bgcolor: '#F5F5F5', border: `1px solid ${colors.border}`, borderRadius: 999,
        '&:focus-within': { borderColor: colors.primary, bgcolor: '#fff' },
      }}
    >
      <SearchIcon sx={{ fontSize: 20, color: colors.muted }} />
      <InputBase
        fullWidth
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        inputProps={{ 'aria-label': 'Buscar productos y servicios' }}
        sx={{ fontSize: 14, fontFamily: 'inherit' }}
      />
    </Box>
  );
}
