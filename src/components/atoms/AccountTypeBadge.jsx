import { Box } from '@mui/material';

const STYLES = {
  Cliente: { color: '#4B5563', bg: '#F0F0F0' },
  Emprendedor: { color: '#2755B8', bg: '#E8EEFB' },
  'Cliente/Emprendedor': { color: '#B3123F', bg: '#FDE8EE' },
};

export default function AccountTypeBadge({ type }) {
  const { color, bg } = STYLES[type] ?? STYLES.Cliente;
  return (
    <Box component="span" sx={{ display: 'inline-block', color, bgcolor: bg, fontSize: 12, fontWeight: 600, px: 1, py: 0.5, borderRadius: 1, whiteSpace: 'nowrap' }}>
      {type}
    </Box>
  );
}
