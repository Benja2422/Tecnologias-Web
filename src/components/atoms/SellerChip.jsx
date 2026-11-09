import { Box } from '@mui/material';

const TONES = {
  green: { color: '#15803D', bg: '#ECFDF3', border: '#BBF7D0' },
  yellow: { color: '#B45309', bg: '#FEF6DD', border: '#FDE68A' },
  orange: { color: '#C2410C', bg: '#FFF4E5', border: '#FED7AA' },
  red: { color: '#C00000', bg: '#FDECEF', border: '#FBCFD6' },
  blue: { color: '#1D4ED8', bg: '#EEF4FF', border: '#C7D7FE' },
  grey: { color: '#374151', bg: '#F3F4F6', border: '#E5E7EB' },
};

/** Etiqueta de estado del panel. tone: green | yellow | orange | red | blue | grey. dot: punto a la izquierda. caps: mayúsculas pequeñas. */
export default function SellerChip({ label, tone = 'grey', dot = false, caps = false, outlined = false }) {
  const t = TONES[tone] ?? TONES.grey;
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex', alignItems: 'center', gap: 0.75, px: 1.25, py: 0.4, borderRadius: caps ? 999 : '6px', whiteSpace: 'nowrap',
        color: t.color, bgcolor: t.bg, border: `1px solid ${outlined ? t.border : 'transparent'}`,
        fontSize: caps ? 10.5 : 12, fontWeight: 600, letterSpacing: caps ? '0.03em' : 0, textTransform: caps ? 'uppercase' : 'none', lineHeight: 1.5,
      }}
    >
      {dot && <Box component="span" aria-hidden sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'currentColor' }} />}
      {label}
    </Box>
  );
}
