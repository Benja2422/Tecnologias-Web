import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

/**
 * Tabla del panel hecha con grid (se desplaza horizontalmente en pantallas angostas).
 * columns: [{ key, header, width (fragmento de grid-template-columns), align?, render(row) }]
 * footer: contenido bajo las filas (p. ej. la paginación). empty: contenido si no hay filas.
 */
export default function SellerTable({ label, columns, rows, getKey, minWidth = 900, footer, empty, rowSx }) {
  const template = columns.map((c) => c.width).join(' ');
  return (
    <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', overflow: 'hidden' }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Box role="table" aria-label={label} sx={{ minWidth }}>
          <Box role="row" sx={{ display: 'grid', gridTemplateColumns: template, alignItems: 'center', columnGap: 2, px: 3, minHeight: 44, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
            {columns.map((c) => (
              <Box role="columnheader" key={c.key} sx={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#4B5563', textAlign: c.align ?? 'left' }}>{c.header}</Box>
            ))}
          </Box>
          {rows.map((row, i) => (
            <Box role="row" key={getKey(row)} sx={{ display: 'grid', gridTemplateColumns: template, alignItems: 'center', columnGap: 2, px: 3, py: 2, minHeight: 72, borderBottom: i < rows.length - 1 || footer ? '1px solid #EEF0F2' : 'none', ...(rowSx?.(row) ?? {}) }}>
              {columns.map((c) => (
                <Box role="cell" key={c.key} sx={{ minWidth: 0, fontSize: 14, color: colors.ink, textAlign: c.align ?? 'left' }}>{c.render(row)}</Box>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
      {rows.length === 0 && empty}
      {footer}
    </Box>
  );
}
