import { Box, Button } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ClaimStatusBadge from '../atoms/ClaimStatusBadge';
import { colors } from '../../utils/theme';
import { formatShortDate } from '../../utils/dates';

const COLUMNS = 'minmax(170px, 1.4fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(130px, 1fr) minmax(110px, 0.8fr)';
const HEAD = ['N° de reclamo', 'Fecha de apertura', 'Orden de compra', 'Estado'];
const cell = { fontSize: 14, color: colors.text };

/** Tabla de reclamos. Se desplaza horizontalmente en pantallas angostas. */
export default function ClaimsTable({ claims, onView }) {
  return (
    <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 3, overflowX: 'auto' }}>
      <Box role="table" aria-label="Historial de reclamos" sx={{ minWidth: 720 }}>
        <Box role="row" sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', px: 3, height: 48, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', borderRadius: '12px 12px 0 0' }}>
          {HEAD.map((h) => (
            <Box role="columnheader" key={h} sx={{ ...cell, fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: colors.muted }}>{h}</Box>
          ))}
          <Box role="columnheader" sx={{ ...cell, fontSize: 11, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase', color: colors.muted, textAlign: 'right' }}>Acción</Box>
        </Box>
        {claims.map((c, i) => (
          <Box
            role="row"
            key={c.id}
            sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', px: 3, minHeight: 68, borderBottom: i < claims.length - 1 ? '1px solid #F0F0F0' : 'none' }}
          >
            <Box role="cell" sx={{ ...cell, fontWeight: 700 }}>{c.id}</Box>
            <Box role="cell" sx={{ ...cell, color: colors.muted }}>{formatShortDate(c.openedAt)}</Box>
            <Box role="cell" sx={{ ...cell, fontWeight: 600 }}>#{c.orderId}</Box>
            <Box role="cell"><ClaimStatusBadge status={c.status} /></Box>
            <Box role="cell" sx={{ textAlign: 'right' }}>
              <Button
                onClick={() => onView(c)}
                endIcon={<ChevronRightIcon />}
                aria-label={`Ver detalle del reclamo ${c.id}`}
                sx={{ fontFamily: 'inherit', fontSize: 13, fontWeight: 600, color: colors.primary, '&:hover': { bgcolor: '#FDECEF' } }}
              >
                Ver detalle
              </Button>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
