import { Box, ButtonBase } from '@mui/material';
import { colors } from '../../utils/theme';

/** Pestañas de texto con subrayado rojo. tabs: [{ id, label }]. */
export default function TabBar({ tabs, value, onChange, label = 'Información del producto' }) {
  const onKeyDown = (e) => {
    const i = tabs.findIndex((t) => t.id === value);
    const next = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : null;
    if (next === null) return;
    e.preventDefault();
    onChange(tabs[next].id);
    document.getElementById(`tab-${tabs[next].id}`)?.focus();
  };

  return (
    <Box role="tablist" aria-label={label} onKeyDown={onKeyDown} sx={{
        display: 'flex', gap: { xs: 3, md: 5 }, boxShadow: 'inset 0 -1px 0 #E5E5E5',
        // En pantallas muy angostas las pestañas se desplazan, pero sin mostrar barras de scroll
        overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', '&::-webkit-scrollbar': { display: 'none' },
      }}>
      {tabs.map((tab) => {
        const selected = tab.id === value;
        return (
          <ButtonBase
            key={tab.id}
            id={`tab-${tab.id}`}
            role="tab"
            aria-selected={selected}
            aria-controls={`panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            sx={{
              py: 1.75, fontFamily: 'inherit', fontSize: 16, whiteSpace: 'nowrap',
              fontWeight: selected ? 600 : 400, color: selected ? colors.primary : colors.muted,
              borderBottom: `2px solid ${selected ? colors.primary : 'transparent'}`,
              '&:hover': { color: selected ? colors.primary : colors.text },
              '&.Mui-focusVisible': { outline: `2px solid ${colors.link}`, outlineOffset: -2 },
            }}
          >
            {tab.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
