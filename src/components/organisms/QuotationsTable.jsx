import { Link as RouterLink } from 'react-router-dom';
import { Box, IconButton, Typography } from '@mui/material';
import SimCardDownloadOutlinedIcon from '@mui/icons-material/SimCardDownloadOutlined';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import QuotationStatusBadge from '../atoms/QuotationStatusBadge';
import { colors } from '../../utils/theme';
import { formatPrice } from '../../utils/format';
import { describeProducts, describeValidity, effectiveStatus, formatDMY, getQuoteTotals } from '../../utils/quotations';

const COLUMNS = 'minmax(100px, 0.9fr) minmax(110px, 1fr) minmax(130px, 1.2fr) minmax(190px, 2fr) minmax(100px, 0.9fr) minmax(130px, 1.1fr) minmax(170px, 1.5fr) 96px';
const HEAD = ['Nº', 'Solicitada el', 'Vendedor', 'Productos', 'Total', 'Vigencia', 'Estado'];
const cell = { fontSize: 14, color: colors.text };

/** Tabla de cotizaciones. Las que esperan decisión del cliente se resaltan. Se desplaza horizontalmente en pantallas angostas. */
export default function QuotationsTable({ quotations, onOpen, onDocument }) {
  const now = new Date();
  return (
    <Box sx={{ border: '1px solid #E5E7EB', borderRadius: 3, overflowX: 'auto' }}>
      <Box role="table" aria-label="Mis cotizaciones" sx={{ minWidth: 1020 }}>
        <Box role="row" sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', px: 2, height: 50, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', borderRadius: '12px 12px 0 0' }}>
          {HEAD.map((h) => <Box role="columnheader" key={h} sx={{ ...cell, fontWeight: 600, pr: 1 }}>{h}</Box>)}
          <Box role="columnheader" aria-label="Acciones" />
        </Box>
        {quotations.map((q, i) => {
          const status = effectiveStatus(q, now);
          const decision = status === 'Respondida';
          const validity = describeValidity(q, now);
          const products = describeProducts(q);
          return (
            <Box
              role="row"
              key={q.id}
              data-status={status}
              sx={{
                display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', px: 2, minHeight: 74,
                borderBottom: decision ? `1px solid ${colors.primary}` : i < quotations.length - 1 ? '1px solid #F0F0F0' : 'none',
                ...(decision && { bgcolor: '#F7F7F8', boxShadow: `inset 2px 0 0 ${colors.primary}` }),
              }}
            >
              <Box role="cell" sx={{ ...cell, fontWeight: 700, pr: 1 }}>
                <Box component={RouterLink} to={`/cotizaciones/${q.id}`} sx={{ color: 'inherit', textDecoration: 'none', '&:hover': { color: colors.primary } }}>{q.id}</Box>
              </Box>
              <Box role="cell" sx={{ ...cell, color: colors.muted, pr: 1 }}>{formatDMY(q.createdAt)}</Box>
              <Box role="cell" sx={{ ...cell, pr: 1 }}>{q.seller.name}</Box>
              <Box role="cell" sx={{ pr: 1, minWidth: 0 }}>
                <Typography sx={{ ...cell, overflowWrap: 'anywhere' }}>{products.name}</Typography>
                <Typography sx={{ fontSize: 12, color: colors.muted }}>{products.more}</Typography>
              </Box>
              <Box role="cell" sx={{ ...cell, fontWeight: 700, pr: 1 }}>{formatPrice(getQuoteTotals(q, now).total)}</Box>
              <Box role="cell" sx={{ pr: 1 }}>
                <Typography sx={{ fontSize: 13, color: validity.urgent ? '#92600A' : colors.muted, fontWeight: validity.urgent ? 700 : 400 }}>{validity.text}</Typography>
                {validity.note && <Typography sx={{ fontSize: 11, color: '#9A9A9A' }}>{validity.note}</Typography>}
              </Box>
              <Box role="cell" sx={{ pr: 1 }}>
                <QuotationStatusBadge status={status} />
                {decision && <Typography sx={{ mt: 0.5, fontSize: 11.5, color: colors.primary }}>Requiere tu decisión</Typography>}
              </Box>
              <Box role="cell" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                <IconButton onClick={() => onDocument(q)} aria-label={`Descargar documento de la cotización ${q.id}`} sx={{ color: colors.muted }}>
                  <SimCardDownloadOutlinedIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <IconButton onClick={() => onOpen(q)} aria-label={`Ver detalle de la cotización ${q.id}`} sx={{ color: colors.primary }}>
                  <ArrowForwardIosIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
