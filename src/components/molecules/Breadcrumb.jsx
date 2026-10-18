import { Box, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AppLink from '../atoms/AppLink';
import { colors } from '../../utils/theme';

/** items: [{ label, href? }]. El último es la página actual. */
export default function Breadcrumb({ items }) {
  return (
    <Box component="nav" aria-label="Ruta de navegación">
      <Box component="ol" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.5, listStyle: 'none', m: 0, p: 0 }}>
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <Box component="li" key={`${item.label}-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              {last || !item.href ? (
                <Typography
                  aria-current={last ? 'page' : undefined}
                  sx={{ fontSize: 14, color: last ? colors.ink : colors.muted, fontWeight: last ? 500 : 400 }}
                >
                  {item.label}
                </Typography>
              ) : (
                <AppLink href={item.href} underline="hover" sx={{ fontSize: 14, color: colors.muted, fontFamily: 'inherit' }}>
                  {item.label}
                </AppLink>
              )}
              {!last && <ChevronRightIcon sx={{ fontSize: 16, color: '#9A9A9A' }} />}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
