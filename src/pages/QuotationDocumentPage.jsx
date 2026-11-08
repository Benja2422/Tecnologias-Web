import { Link as RouterLink, Navigate, useParams } from 'react-router-dom';
import { Box, Button, GlobalStyles, Typography } from '@mui/material';
import Logo from '../components/atoms/Logo';
import QuotationStatusBadge from '../components/atoms/QuotationStatusBadge';
import { useQuotations } from '../contexts/QuotationsContext';
import { QUOTE_VALID_DAYS, effectiveStatus, formatDMY, quoteLines, quoteTotals, validUntil } from '../utils/quotations';
import { formatPrice } from '../utils/format';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const COLUMNS = '40px minmax(0, 1fr) 80px 110px 110px';
const head = { fontSize: 12, fontWeight: 600, color: colors.text };
const btn = { height: 40, px: 2.5, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none' };

const Party = ({ title, name, idLabel, idValue }) => (
  <Box>
    <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{title}</Typography>
    <Typography sx={{ mt: 1.5, fontSize: 15, color: colors.text }}>{name}</Typography>
    <Typography sx={{ mt: 1, fontSize: 12, color: colors.muted }}>{idLabel}: {idValue}</Typography>
  </Box>
);

const Total = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
    <Typography sx={{ fontSize: 14, color: colors.muted }}>{label}</Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.text }}>{value}</Typography>
  </Box>
);

/** Documento de cotización (hoja imprimible). "Imprimir" y "Descargar PDF" usan el diálogo de impresión del navegador. */
export default function QuotationDocumentPage() {
  const { quotationId } = useParams();
  const { getQuotation } = useQuotations();
  const quotation = getQuotation(quotationId);
  if (!quotation) return <Navigate to="/cotizaciones" replace />;

  const now = new Date();
  const status = effectiveStatus(quotation, now);
  const lines = quoteLines(quotation, now);
  const totals = quoteTotals(lines);

  const print = (action) => {
    console.log(`[Cotizaciones] ${action}:`, { quotationId: quotation.id });
    const previous = document.title;
    document.title = `Cotizacion-${quotation.id}`; // nombre sugerido al guardar como PDF
    window.print();
    document.title = previous;
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flow-root', bgcolor: '#EDEDEF', textAlign: 'left' }}>
      <GlobalStyles styles={{ '@media print': { 'body, html': { background: '#fff !important' }, '.no-print': { display: 'none !important' }, '.paper': { boxShadow: 'none !important', margin: '0 !important', width: '100% !important' } }, '@page': { margin: '14mm' } }} />

      <Box className="no-print" component="header" sx={{ bgcolor: '#fff', height: 80, px: { xs: 2, md: 10 }, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Button component={RouterLink} to={`/cotizaciones/${quotation.id}`} variant="outlined" sx={{ ...btn, color: colors.text, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } }}>← Volver</Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={() => print('Imprimir documento')} variant="outlined" sx={{ ...btn, color: colors.text, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } }}>Imprimir</Button>
          <Button onClick={() => print('Descargar PDF')} variant="contained" disableElevation sx={{ ...btn, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Descargar PDF</Button>
        </Box>
      </Box>

      <Box className="paper" component="article" aria-label={`Documento de cotización ${quotation.id}`} sx={{ bgcolor: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,.08)', width: { xs: 'calc(100% - 32px)', md: 816 }, maxWidth: '100%', mx: 'auto', my: { xs: 2, md: 5 }, px: { xs: 3, md: 6 }, pt: { xs: 4, md: 9 }, pb: { xs: 4, md: 7 }, minHeight: { md: 1056 }, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, pb: 4, borderBottom: '1px solid #E5E7EB' }}>
          <Logo size={24} />
          <Box sx={{ textAlign: 'right' }}>
            <Typography component="h1" sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 600, color: colors.text }}>Documento de cotización</Typography>
            <Typography sx={{ mt: 1.25, fontSize: 15, fontWeight: 700, color: colors.text }}>{quotation.id}</Typography>
            <Typography sx={{ mt: 0.75, fontSize: 13, color: colors.muted }}>Emisión: {formatDMY(quotation.createdAt)}</Typography>
            <Box sx={{ mt: 1 }}><QuotationStatusBadge status={status} /></Box>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
          <Party title="Cliente" name={mockProfile.fullName} idLabel="RUN" idValue={mockProfile.rut} />
          <Party title="Vendedor" name={quotation.seller.name} idLabel="RUT" idValue={quotation.seller.rut ?? '—'} />
        </Box>

        <Box sx={{ mt: 4, overflowX: 'auto' }}>
          <Box role="table" aria-label="Productos cotizados" sx={{ minWidth: 560 }}>
            <Box role="row" sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'center', px: 1.5, height: 44, bgcolor: '#F8F8F9' }}>
              <Box role="columnheader" sx={head}>Ítem</Box>
              <Box role="columnheader" sx={head}>Descripción / variante</Box>
              <Box role="columnheader" sx={head}>Cantidad</Box>
              <Box role="columnheader" sx={head}>Precio unitario</Box>
              <Box role="columnheader" sx={head}>Subtotal</Box>
            </Box>
            {lines.map((l, i) => {
              const struck = l.adjusted ? l.quotedPrice : l.listPrice;
              return (
                <Box role="row" key={`${l.productId}-${i}`} sx={{ display: 'grid', gridTemplateColumns: COLUMNS, alignItems: 'start', px: 1.5, py: 2.25, borderBottom: '1px solid #EEE' }}>
                  <Box role="cell" sx={{ fontSize: 12, color: colors.text }}>{i + 1}</Box>
                  <Box role="cell" sx={{ pr: 1, minWidth: 0 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.text, overflowWrap: 'anywhere' }}>{l.name}</Typography>
                    {l.detail && <Typography sx={{ mt: 0.75, fontSize: 12, color: colors.muted }}>{l.detail}</Typography>}
                  </Box>
                  <Box role="cell" sx={{ fontSize: 12.5, color: colors.text }}>{l.quantity}</Box>
                  <Box role="cell">
                    <Typography sx={{ fontSize: 12.5, color: colors.text }}>{formatPrice(l.unitPrice)}</Typography>
                    {struck ? <Typography sx={{ mt: 0.5, fontSize: 11, color: '#9A9A9A', textDecoration: 'line-through' }}>{formatPrice(struck)}</Typography> : null}
                  </Box>
                  <Box role="cell" sx={{ fontSize: 12.5, fontWeight: 700, color: colors.text }}>{formatPrice(l.subtotal)}</Box>
                </Box>
              );
            })}
          </Box>
        </Box>

        <Box sx={{ mt: 4, ml: 'auto', width: { xs: '100%', sm: 290 } }}>
          <Box sx={{ display: 'grid', gap: 1.5, pb: 1.5, borderBottom: '1px solid #E5E7EB' }}>
            <Total label="Neto" value={formatPrice(totals.neto)} />
            <Total label="IVA (19%)" value={formatPrice(totals.iva)} />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: colors.text }}>Total</Typography>
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: colors.primary }}>{formatPrice(totals.total)}</Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 4, display: 'grid', gap: 1.75 }}>
          <Typography sx={{ fontSize: 12.5, color: colors.muted }}>Precios unitarios y subtotales incluyen IVA.</Typography>
          <Typography sx={{ fontSize: 12.5, color: colors.muted }}>El envío se calcula al pagar.</Typography>
        </Box>

        <Box sx={{ mt: 'auto', pt: 8 }}>
          <Box sx={{ pt: 2, borderTop: '1px solid #E5E7EB' }}>
            <Typography sx={{ fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>
              Válida hasta el {formatDMY(validUntil(quotation))} ({QUOTE_VALID_DAYS} días desde su emisión). Pasada esa fecha, los precios se reajustan semanalmente y la cotización no puede aceptarse.
            </Typography>
            <Typography sx={{ mt: 1.5, fontSize: 10.5, color: '#9A9A9A' }}>TodoMart · {quotation.id}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
