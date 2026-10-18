import { Box, Typography } from '@mui/material';
import ColorChip from '../atoms/ColorChip';
import { colors } from '../../utils/theme';

/** variants: [{ id, label, swatch, stock }] */
export default function ColorSelector({ variants, selectedId, onSelect, label = 'Color' }) {
  const selected = variants.find((v) => v.id === selectedId);
  return (
    <Box>
      <Typography id="variant-label" sx={{ fontSize: 16, fontWeight: 600, color: colors.ink, mb: 1.5 }}>{label}</Typography>
      <Box role="radiogroup" aria-labelledby="variant-label" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
        {variants.map((v) => (
          <ColorChip
            key={v.id}
            label={v.label}
            color={v.swatch}
            selected={v.id === selectedId}
            disabled={v.stock <= 0}
            onClick={() => onSelect(v.id)}
          />
        ))}
      </Box>
      {selected && (
        <Typography sx={{ mt: 1.5, fontSize: 13, color: '#9A9A9A' }}>
          Stock: {selected.stock} {selected.stock === 1 ? 'unidad' : 'unidades'}
        </Typography>
      )}
    </Box>
  );
}
