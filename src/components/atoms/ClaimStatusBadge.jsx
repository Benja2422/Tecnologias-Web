import { Box } from '@mui/material';

const STYLES = {
  Pendiente: { color: '#B45309', bg: '#FEF3C7' },
  'En análisis': { color: '#1D4ED8', bg: '#DBEAFE' },
  Resuelto: { color: '#2E7D32', bg: '#E3F5EA' },
  // Estados de cada ítem reclamado
  'Aprobado - Reembolso Emitido': { color: '#2E7D32', bg: '#E3F5EA' },
  'En revisión': { color: '#B45309', bg: '#FEF3C7' },
  'Esperando devolución': { color: '#1D4ED8', bg: '#DBEAFE' },
};

/** Estado de un reclamo o de uno de sus ítems, con punto de color. */
export default function ClaimStatusBadge({ status }) {
  const { color, bg } = STYLES[status] ?? { color: '#555', bg: '#EEE' };
  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color, bgcolor: bg, fontSize: 12, fontWeight: 600, px: 1.5, py: 0.5, borderRadius: 999, whiteSpace: 'nowrap' }}>
      <Box component="span" aria-hidden sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color }} />
      {status}
    </Box>
  );
}
