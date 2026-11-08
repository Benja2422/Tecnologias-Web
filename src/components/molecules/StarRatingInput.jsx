import { Box, ButtonBase, Typography } from '@mui/material';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import { colors } from '../../utils/theme';

const LABELS = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

/**
 * Calificación de 1 a 5 con estrellas en recuadros. value 0 = sin calificar.
 * Es un grupo de opciones: se navega con las flechas y se anuncia como "N de 5".
 */
export default function StarRatingInput({ value, onChange, label = 'Calificación' }) {
  const onKeyDown = (e) => {
    const next = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 }[e.key];
    if (!next) return;
    e.preventDefault();
    const n = Math.min(5, Math.max(1, (value || (next > 0 ? 0 : 6)) + next));
    onChange(n);
    document.getElementById(`star-${n}`)?.focus();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, flexWrap: 'wrap' }}>
      <Box role="radiogroup" aria-label={label} onKeyDown={onKeyDown} sx={{ display: 'flex', gap: 1.25 }}>
        {[1, 2, 3, 4, 5].map((n) => {
          const filled = n <= value;
          return (
            <ButtonBase
              key={n}
              id={`star-${n}`}
              role="radio"
              aria-checked={n === value}
              aria-label={`${n} de 5 · ${LABELS[n - 1]}`}
              tabIndex={n === (value || 1) ? 0 : -1}
              onClick={() => onChange(n)}
              sx={{
                width: 44, height: 44, borderRadius: '8px', border: `1px solid ${filled ? '#F5C400' : '#D9D9D9'}`,
                bgcolor: filled ? '#FFF8DB' : '#fff', color: filled ? '#F5B800' : '#8A8A8A',
                '&:hover': { borderColor: '#F5C400' },
                '&.Mui-focusVisible': { outline: `2px solid ${colors.link}`, outlineOffset: 2 },
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 26 }} />
            </ButtonBase>
          );
        })}
      </Box>
      <Typography aria-live="polite" sx={{ fontSize: 13, color: colors.muted }}>
        {value ? `${value} de 5` : 'Selecciona una calificación'}
      </Typography>
    </Box>
  );
}
