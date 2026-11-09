import { Box, Breadcrumbs, Typography } from '@mui/material';
import AppLink from '../atoms/AppLink';
import { SellerAvatar } from './SellerSidebar';
import { useSeller } from '../../contexts/SellerContext';
import { SELLER } from '../../utils/seller';
import { colors } from '../../utils/theme';

/** Barra superior del panel: ruta de navegación y, a la derecha, una acción principal o la tienda. crumbs: [{ label, href? }] */
export default function SellerTopBar({ crumbs, action }) {
  const { profile } = useSeller();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, minHeight: 77, px: { xs: 2, md: 5 }, py: 1.5, bgcolor: '#fff', borderBottom: '1px solid #E5E7EB' }}>
      <Breadcrumbs separator="/" aria-label="Ruta de navegación" sx={{ fontSize: 15, '& .MuiBreadcrumbs-separator': { color: '#9CA3AF', mx: 1.25 } }}>
        {crumbs.map(({ label, href }, i) =>
          i < crumbs.length - 1 ? (
            <AppLink key={label} href={href ?? '/emprendedor'} underline="hover" sx={{ color: '#9CA3AF', fontFamily: 'inherit', fontSize: 15 }}>{label}</AppLink>
          ) : (
            <Typography key={label} aria-current="page" sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{label}</Typography>
          ),
        )}
      </Breadcrumbs>

      {action ?? (
        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1.5, pl: 3, borderLeft: '1px solid #E5E7EB' }}>
          <SellerAvatar name={profile.company.name} />
          <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink, lineHeight: 1.3 }}>{profile.company.name}</Typography>
            <Typography sx={{ fontSize: 12, color: colors.muted }}>{SELLER.plan}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
}
