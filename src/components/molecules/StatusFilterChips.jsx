import { Box, ButtonBase } from '@mui/material';
import { colors } from '../../utils/theme';

/**
 * Filtros en forma de píldora (uno activo a la vez). options: ['Pendiente', …]; value: null = "Todos".
 * compact: versión pequeña con contorno (bandeja de mensajes).
 */
export default function StatusFilterChips({ options, value, onChange, allLabel = 'Todos', label = 'Filtrar por estado', compact = false }) {
  const items = [{ key: null, text: allLabel }, ...options.map((o) => ({ key: o, text: o }))];
  return (
    <Box role="group" aria-label={label} sx={{ display: 'flex', flexWrap: 'wrap', gap: compact ? 1 : 1.5 }}>
      {items.map(({ key, text }) => {
        const active = value === key;
        return (
          <ButtonBase
            key={text}
            aria-pressed={active}
            onClick={() => onChange(key)}
            sx={{
              borderRadius: 999, fontFamily: 'inherit', border: `1px solid ${active ? colors.primary : '#E3E3E3'}`,
              ...(compact
                ? { height: 30, px: 1.75, fontSize: 12, fontWeight: 600, color: active ? colors.primary : colors.text, bgcolor: '#fff', '&:hover': { bgcolor: active ? '#FDECEF' : '#F7F7F7' } }
                : { height: 38, px: 2.25, fontSize: 15, fontWeight: active ? 600 : 400, color: active ? '#fff' : colors.text, bgcolor: active ? colors.primary : '#fff', '&:hover': { bgcolor: active ? colors.primaryDark : '#F7F7F7' } }),
            }}
          >
            {text}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
