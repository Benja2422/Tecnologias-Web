import { Box } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { colors } from '../../utils/theme';

/**
 * items: [{ label, to, icon, badge?, exact?, also? }] — resalta el activo según la URL. badge: número rojo a la derecha (se oculta si es 0).
 * exact: activo solo en esa URL (no en subpáginas). also: otras rutas que también lo marcan como activo.
 * variant="tint": fondo rosado + borde izquierdo (Mi cuenta)
 * variant="outlined": borde rojo + barra a la derecha (panel admin)
 * dense: ícono más cerca del texto y fuente un poco menor (panel de emprendedor)
 */
export default function SidebarNav({ items, variant = 'tint', dense = false }) {
  const { pathname } = useLocation();
  const outlined = variant === 'outlined';

  return (
    <Box sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexDirection: { xs: 'row', md: 'column' }, gap: 1 }} component="ul">
      {items.map(({ label, to, icon, badge, exact = false, also = [] }) => {
        // también activo en subpáginas (p. ej. /pedidos/:id), salvo que sea exact
        const active = pathname === to || (!exact && pathname.startsWith(`${to}/`)) || also.some((p) => pathname.startsWith(p));
        return (
          <li key={to}>
            <Box
              component={RouterLink}
              to={to}
              aria-current={active ? 'page' : undefined}
              sx={{
                position: 'relative', display: 'flex', alignItems: 'center', gap: dense ? 1.5 : 2, minHeight: outlined || dense ? 44 : 48, px: dense ? 1.5 : 2,
                borderRadius: 2, textDecoration: 'none', fontSize: dense ? 14.5 : 15, fontWeight: active ? 600 : 500, lineHeight: 1.4,
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
