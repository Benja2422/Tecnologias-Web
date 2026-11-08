import { Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { colors } from '../../utils/theme';

/**
 * items: [{ label, to, icon, badge? }] — resalta el activo según la URL. badge: número rojo a la derecha (se oculta si es 0).
 * variant="tint": fondo rosado + borde izquierdo (Mi cuenta)
 * variant="outlined": borde rojo + barra a la derecha (panel admin)
 */
export default function SidebarNav({ items, variant = 'tint' }) {
  const { pathname } = useLocation();
  const outlined = variant === 'outlined';

  return (
    <Box sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1 }} component="ul">
      {items.map(({ label, to, icon, badge }) => {
        const active = pathname === to || pathname.startsWith(`${to}/`); // también activo en subpáginas (p. ej. /pedidos/:id)
        return (
          <li key={to}>
            <Box
              component={RouterLink}
              to={to}
              aria-current={active ? 'page' : undefined}
              sx={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: 2, minHeight: outlined ? 46 : 48, px: 2,
                borderRadius: 2, textDecoration: 'none', fontSize: 15, fontWeight: active ? 600 : 500, lineHeight: 1.4,
                color: active ? colors.primary : colors.text,
                bgcolor: active && !outlined ? '#FDECEF' : 'transparent',
                border: outlined ? `1px solid ${active ? colors.primary : 'transparent'}` : 'none',
                borderLeft: outlined ? undefined : `3px solid ${active ? colors.primary : 'transparent'}`,
                whiteSpace: { xs: 'nowrap', md: 'normal' },
                '& svg': { fontSize: 20, color: active ? colors.primary : colors.muted, flexShrink: 0 },
                '&:hover': { bgcolor: active ? (outlined ? 'transparent' : '#FDECEF') : '#F7F7F7' },
                ...(outlined && active && {
                  '&::after': {
                    content: '""', position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)',
                    width: 4, height: 16, borderRadius: 2, bgcolor: colors.primary,
                  },
                }),
              }}
            >
              {icon}
              {badge > 0 ? <Box component="span" sx={{ whiteSpace: 'nowrap' }}>{label}</Box> : label}
              {badge > 0 && (
                <Box component="span" aria-label={`${badge} pendientes`} sx={{ ml: 'auto', mr: -0.5, minWidth: 20, height: 20, px: 0.75, borderRadius: 999, bgcolor: colors.primary, color: '#fff', fontSize: 11, fontWeight: 700, display: 'grid', placeItems: 'center', lineHeight: 1 }}>
                  {badge}
                </Box>
              )}
            </Box>
          </li>
        );
      })}
    </Box>
  );
}
