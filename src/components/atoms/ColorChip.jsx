import { Box, ButtonBase } from '@mui/material';
import { colors } from '../../utils/theme';

/** Opción de variante (color): píldora con punto de color. */
export default function ColorChip({ label, color, selected = false, disabled = false, onClick }) {
  return (
    <ButtonBase
      onClick={onClick}
      disabled={disabled}
      role="radio"
      aria-checked={selected}
      sx={{
        height: 38, px: 2, gap: 1, borderRadius: 999, fontFamily: 'inherit', fontSize: 14,
        color: selected ? colors.ink : colors.muted, fontWeight: selected ? 600 : 400,
        border: selected ? `2px solid ${colors.primary}` : '1px solid #555',
        opacity: disabled ? 0.45 : 1,
        '&:hover': { borderColor: selected ? colors.primary : colors.ink },
        '&.Mui-focusVisible': { outline: `2px solid ${colors.link}`, outlineOffset: 2 },
      }}
    >
      <Box component="span" sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
      {label}
    </ButtonBase>
  );
}
