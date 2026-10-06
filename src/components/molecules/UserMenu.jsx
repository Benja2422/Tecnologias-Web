import { useState } from 'react';
import { Box, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import UserAvatar from '../atoms/UserAvatar';
import { colors } from '../../utils/theme';

const ACCOUNT_LINKS = [
  { label: 'Mi perfil', to: '/perfil' },
  { label: 'Mis direcciones', to: '/direcciones' },
  { label: 'Mis pedidos', to: '/pedidos' },
  { label: 'Mis cotizaciones', to: '/cotizaciones' },
];

// Cada panel solo se muestra si el usuario tiene el rol correspondiente
const PANEL_LINKS = [
  { label: 'Panel emprendedor', to: '/emprendedor', role: 'entrepreneur' },
  { label: 'Panel administrador', to: '/admin/usuarios', role: 'admin' },
];

const itemSx = {
  minHeight: 44, px: 2.5, fontFamily: 'inherit', fontSize: 15, color: '#222',
  '&:hover, &.Mui-focusVisible': { bgcolor: '#F7F7F7' },
};

/**
 * Nombre + avatar del usuario que abren un menú desplegable.
 * user: { name, email, roles?: ('entrepreneur' | 'admin')[] }
 * roles: [] oculta los paneles; si no se define, se muestran todos (ver TODO abajo).
 */
export default function UserMenu({ user, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);
  const close = () => setAnchorEl(null);

  // TODO: cuando exista la sesión real (src/contexts), user.roles siempre vendrá definido.
  // Mientras no lo esté, se muestran todos los paneles para poder navegar durante el desarrollo.
  const roles = user?.roles ?? PANEL_LINKS.map((p) => p.role);
  const panels = PANEL_LINKS.filter((p) => roles.includes(p.role));

  const logout = () => {
    close();
    onLogout?.(); // TODO: limpiar la sesión (src/contexts)
    navigate('/login');
  };

  const link = ({ label, to }) => (
    <MenuItem key={to} component={RouterLink} to={to} onClick={close} sx={itemSx}>
      {label}
    </MenuItem>
  );

  return (
    <>
      <Box
        component="button"
        id="user-menu-button"
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : undefined}
        aria-controls={open ? 'user-menu' : undefined}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ display: 'flex', alignItems: 'center', gap: 1.5, border: 0, bgcolor: 'transparent', cursor: 'pointer', p: 0, ml: 1, fontFamily: 'inherit' }}
      >
        <Typography sx={{ display: { xs: 'none', sm: 'block' }, fontSize: 15, fontWeight: 500, color: colors.text }}>
          {user?.name}
        </Typography>
        <UserAvatar name={user?.name} />
      </Box>

      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        MenuListProps={{ 'aria-labelledby': 'user-menu-button', disablePadding: true }}
        sx={{
          mt: 1,
          '& .MuiPaper-root': {
            minWidth: 290, borderRadius: '12px', overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: '1px solid #EEE',
          },
        }}
      >
        <Box component="li" role="presentation" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 2.25, listStyle: 'none' }}>
          <UserAvatar name={user?.name} />
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap sx={{ fontSize: 16, fontWeight: 600, color: '#222', lineHeight: 1.3 }}>{user?.name}</Typography>
            {user?.email && (
              <Typography noWrap sx={{ fontSize: 13, color: '#9A9A9A' }}>{user.email}</Typography>
            )}
          </Box>
        </Box>
        <Divider component="li" sx={{ my: 0 }} />

        {ACCOUNT_LINKS.map(link)}

        {panels.length > 0 && [
          <Divider key="panels-divider" component="li" sx={{ my: 0 }} />,
          ...panels.map(link),
        ]}

        <Divider component="li" sx={{ my: 0 }} />
        <MenuItem onClick={logout} sx={{ ...itemSx, color: colors.primary, fontWeight: 500 }}>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  );
}