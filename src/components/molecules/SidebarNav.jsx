import { Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { colors } from '../../utils/theme';

/** items: [{ label, to, icon }] — resalta el activo según la URL. */
export default function SidebarNav({ items }) {
  const { pathname } = useLocation();

  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1 }}>
      {items.map(({ label, to, icon }) => {
        const active = pathname === to;
        return (
          <li key={to}>
            <Box
              component={RouterLink}
              to={to}
              aria-current={active ? 'page' : undefined}
              sx={{
                display: 'flex', alignItems: 'center', gap: 2, minHeight: 48, px: 2, borderRadius: 2,
                textDecoration: 'none', fontSize: 15, fontWeight: active ? 600 : 500, lineHeight: 1.4,
                color: active ? colors.primary : colors.text,
                bgcolor: active ? '#FDECEF' : 'transparent',
                borderLeft: `3px solid ${active ? colors.primary : 'transparent'}`,
                whiteSpace: { xs: 'nowrap', md: 'normal' },
                '& svg': { fontSize: 20, color: active ? colors.primary : colors.muted, flexShrink: 0 },
                '&:hover': { bgcolor: active ? '#FDECEF' : '#F7F7F7' },
              }}
            >
              {icon}
              {label}
            </Box>
          </li>
        );
      })}
    </Box>
  );
}
