import { Avatar, Box, Breadcrumbs, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import AppLink from '../atoms/AppLink';
import { colors } from '../../utils/theme';

/** crumbs: [{ label, href? }] — el último es la página actual. */
export default function AdminTopBar({ crumbs, admin }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, minHeight: 77, px: { xs: 2, md: 5 }, bgcolor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 16 }} />} aria-label="Ruta de navegación" sx={{ fontSize: 15, '& .MuiBreadcrumbs-separator': { color: '#9CA3AF' } }}>
        {crumbs.map(({ label, href }, i) =>
          i < crumbs.length - 1 ? (
            <AppLink key={label} href={href ?? '#'} underline="hover" sx={{ color: colors.muted, fontFamily: 'inherit', fontSize: 15 }}>{label}</AppLink>
          ) : (
            <Typography key={label} aria-current="page" sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{label}</Typography>
          ),
        )}
      </Breadcrumbs>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, pl: 3, borderLeft: '1px solid #E5E7EB' }}>
        <Avatar sx={{ width: 38, height: 38, bgcolor: '#F3F4F6', color: '#9CA3AF', border: '1px solid #E5E7EB' }}>
          <PersonOutlineIcon fontSize="small" />
        </Avatar>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink, lineHeight: 1.3 }}>{admin.name}</Typography>
          <Typography sx={{ fontSize: 12, color: colors.muted }}>{admin.role}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
