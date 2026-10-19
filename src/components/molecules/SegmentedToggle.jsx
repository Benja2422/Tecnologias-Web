import { Box, ButtonBase } from '@mui/material';
import { colors } from '../../utils/theme';

/** Interruptor de dos o más opciones (Productos / Servicios). options: [{ id, label }]. */
export default function SegmentedToggle({ options, value, onChange, label }) {
  return (
    <Box role="group" aria-label={label} sx={{ display: 'flex', gap: 1 }}>
      {options.map((option) => {
        const selected = option.id === value;
        return (
          <ButtonBase
            key={option.id}
            aria-pressed={selected}
            onClick={() => onChange(option.id)}
            sx={{
              flex: 1, height: 32, borderRadius: '6px', fontFamily: 'inherit', fontSize: 13, fontWeight: selected ? 600 : 500,
              bgcolor: selected ? colors.primary : 'transparent', color: selected ? '#fff' : colors.ink,
              '&:hover': { bgcolor: selected ? colors.primaryDark : '#EEF0F3' },
              '&.Mui-focusVisible': { outline: `2px solid ${colors.link}`, outlineOffset: 2 },
            }}
          >
            {option.label}
          </ButtonBase>
        );
      })}
    </Box>
  );
}
