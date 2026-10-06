import { Box, Button, Typography } from '@mui/material';
import { colors } from '../../utils/theme';
import { getPageItems } from '../../utils/pagination';

const btn = {
  minWidth: 32, height: 32, px: 1.5, borderRadius: '6px', border: '1px solid #E5E7EB', color: colors.ink,
  fontFamily: 'inherit', fontSize: 13, fontWeight: 500, textTransform: 'none', bgcolor: '#fff',
  '&:hover': { bgcolor: '#F3F4F6' },
  '&.Mui-disabled': { color: '#B0B5BC', borderColor: '#E5E7EB' },
};

const n = (v) => v.toLocaleString('en-US');

export default function PaginationBar({ page, pageSize, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center', justifyContent: 'space-between', px: 2.5, py: 2.5 }}>
      <Typography sx={{ fontSize: 13, color: '#4B5563' }}>
        Mostrando <b>{from}-{to}</b> de <b>{n(total)}</b> usuarios
      </Typography>
      <Box component="nav" aria-label="Paginación" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button sx={btn} disabled={page <= 1} onClick={() => onChange(page - 1)}>Anterior</Button>
        {getPageItems(page, totalPages).map((item, i) =>
          item === 'gap' ? (
            <Typography key={`gap-${i}`} aria-hidden sx={{ px: 0.5, color: '#9CA3AF' }}>…</Typography>
          ) : (
            <Button
              key={item}
              aria-current={item === page ? 'page' : undefined}
              onClick={() => onChange(item)}
              sx={{
                ...btn, minWidth: 32, px: 0,
                ...(item === page && { bgcolor: colors.primary, borderColor: colors.primary, color: '#fff', fontWeight: 700, '&:hover': { bgcolor: colors.primaryDark } }),
              }}
            >
              {item}
            </Button>
          ),
        )}
        <Button sx={btn} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Siguiente</Button>
      </Box>
    </Box>
  );
}
