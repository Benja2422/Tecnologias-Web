import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, GlobalStyles } from '@mui/material';
import { colors } from '../../utils/theme';

const btn = { height: 40, px: 2.5, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none' };
const outlined = { ...btn, color: colors.text, borderColor: '#E3E3E3', '&:hover': { borderColor: '#B0B0B0', bgcolor: '#FAFAFA' } };

/**
 * Hoja imprimible (comprobantes y reportes): barra con Volver / Imprimir / Descargar PDF y una "hoja" blanca.
 * "Imprimir" y "Descargar PDF" usan el diálogo de impresión del navegador. fileName: nombre sugerido para el PDF.
 */
export default function DocumentLayout({ backTo, fileName, label, wide = false, children }) {
  const print = (action) => {
    console.log(`[Documento] ${action}:`, { fileName });
    const previous = document.title;
    document.title = fileName;
    window.print();
    document.title = previous;
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flow-root', bgcolor: '#EDEDEF', textAlign: 'left' }}>
      <GlobalStyles styles={{ '@media print': { 'body, html': { background: '#fff !important' }, '.no-print': { display: 'none !important' }, '.paper': { boxShadow: 'none !important', margin: '0 !important', width: '100% !important', padding: '0 !important', minHeight: '0 !important' } }, '@page': { margin: '14mm' } }} />
      <Box className="no-print" component="header" sx={{ bgcolor: '#fff', minHeight: 80, px: { xs: 2, md: 10 }, py: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
        <Button component={RouterLink} to={backTo} variant="outlined" sx={outlined}>← Volver</Button>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={() => print('Imprimir')} variant="outlined" sx={outlined}>Imprimir</Button>
          <Button onClick={() => print('Descargar PDF')} variant="contained" disableElevation sx={{ ...btn, bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>Descargar PDF</Button>
        </Box>
      </Box>
      <Box className="paper" component="article" aria-label={label} sx={{ bgcolor: '#fff', boxShadow: '0 1px 6px rgba(0,0,0,.08)', width: { xs: 'calc(100% - 32px)', md: wide ? 1000 : 816 }, maxWidth: 'calc(100% - 32px)', mx: 'auto', my: { xs: 2, md: 5 }, px: { xs: 2.5, md: 6 }, pt: { xs: 3, md: 7 }, pb: { xs: 3, md: 6 } }}>
        {children}
      </Box>
    </Box>
  );
}
