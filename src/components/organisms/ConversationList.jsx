import { useState } from 'react';
import { Box, InputBase, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import StatusFilterChips from '../molecules/StatusFilterChips';
import ConversationItem from '../molecules/ConversationItem';
import { colors } from '../../utils/theme';
import { normalize } from '../../utils/searchCatalog';

/**
 * Bandeja de mensajes: título con total de no leídas, buscador, filtro (Todos / No leídos) y la lista.
 * El buscador filtra por nombre de la otra parte o por texto de algún mensaje.
 */
export default function ConversationList({ conversations, unreadCount, selectedId, onSelect }) {
  const [query, setQuery] = useState('');
  const [onlyUnread, setOnlyUnread] = useState(false);

  const q = normalize(query.trim());
  const visible = conversations.filter((c) => {
    if (onlyUnread && !c.unread) return false;
    if (!q) return true;
    return normalize(c.name).includes(q) || c.messages.some((m) => normalize(m.text).includes(q));
  });

  return (
    <Box component="section" aria-label="Conversaciones" sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', bgcolor: '#fff' }}>
      <Box sx={{ px: 2.5, pt: 3, pb: 2, display: 'grid', gap: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography component="h1" sx={{ fontSize: 22, fontWeight: 600, color: colors.text }}>Mensajes</Typography>
          {unreadCount > 0 && (
            <Box component="span" role="status" aria-label={`${unreadCount} conversaciones sin leer`} sx={{ minWidth: 24, height: 24, px: 0.75, borderRadius: 999, bgcolor: colors.primary, color: '#fff', fontSize: 12, fontWeight: 700, display: 'grid', placeItems: 'center' }}>
              {unreadCount}
            </Box>
          )}
        </Box>
        <Box
          role="search"
          sx={{ display: 'flex', alignItems: 'center', gap: 1, height: 36, px: 1.5, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: '8px', '&:focus-within': { borderColor: colors.primary, bgcolor: '#fff' } }}
        >
          <SearchIcon sx={{ fontSize: 18, color: colors.muted }} />
          <InputBase
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar conversación..."
            inputProps={{ 'aria-label': 'Buscar conversación' }}
            sx={{ fontSize: 13, fontFamily: 'inherit' }}
          />
        </Box>
        <StatusFilterChips
          compact
          label="Filtrar conversaciones"
          options={['No leídos']}
          allLabel="Todos"
          value={onlyUnread ? 'No leídos' : null}
          onChange={(v) => setOnlyUnread(v === 'No leídos')}
        />
      </Box>

      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, flex: 1, overflowY: 'auto', borderTop: '1px solid #EEE' }}>
        {visible.map((c) => (
          <li key={c.id}><ConversationItem conversation={c} selected={c.id === selectedId} onSelect={() => onSelect(c.id)} /></li>
        ))}
        {visible.length === 0 && (
          <Typography role="status" sx={{ p: 3, fontSize: 14, color: colors.muted, textAlign: 'center' }}>
            {conversations.length === 0 ? 'No tienes conversaciones.' : 'No se encontraron conversaciones.'}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
