import { Box } from '@mui/material';

const STYLES = {
  Activo: { color: '#0B6B3A', bg: '#E3F5EA' },
  Suspendido: { color: '#B00020', bg: '#FDE8EC' },
};

export default function StatusBadge({ status }) {
  const { color, bg } = STYLES[status] ?? { color: '#555', bg: '#EEE' };
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.6, color, bgcolor: bg, fontSize: 12, fontWeight: 600, px: 1, py: 0.5, borderRadius: 1 }}>
      <Box component="span" aria-hidden sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
      {status}
    </Box>
  );
}
