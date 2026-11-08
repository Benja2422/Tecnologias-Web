import { Box } from '@mui/material';
import { QUOTE_STATUS_LABEL } from '../../utils/quotations';

const STYLES = {
  Solicitada: { color: '#555555', bg: '#EDEDED' },
  Respondida: { color: '#92600A', bg: '#FEF3C7' },
  Aceptada: { color: '#2E7D32', bg: '#E3F5EA' },
  Rechazada: { color: '#C00000', bg: '#FDE8EC' },
  Expirada: { color: '#FFFFFF', bg: '#555555' },
};

/** Estado visible de una cotización. size="large" para el título del detalle. */
export default function QuotationStatusBadge({ status, size = 'small' }) {
  const { color, bg } = STYLES[status] ?? { color: '#555', bg: '#EEE' };
  const large = size === 'large';
  return (
    <Box component="span" sx={{ display: 'inline-block', color, bgcolor: bg, fontSize: large ? 13 : 12.5, fontWeight: 600, px: large ? 1.5 : 1.25, py: large ? 0.5 : 0.35, borderRadius: 999, whiteSpace: 'nowrap' }}>
      {QUOTE_STATUS_LABEL[status] ?? status}
    </Box>
  );
}
