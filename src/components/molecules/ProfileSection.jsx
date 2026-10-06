import { Box, Typography } from '@mui/material';
import SectionIcon from '../atoms/SectionIcon';
import { colors } from '../../utils/theme';

/** Bloque de la página de perfil: icono + título (+ subtítulo) y contenido. */
export default function ProfileSection({ icon, title, subtitle, divider = true, children }) {
  return (
    <Box
      component="section"
      sx={{ py: 5, borderTop: divider ? '1px solid #EEE' : 'none', ...(divider ? {} : { pt: 0 }) }}
    >
      <Box sx={{ display: 'flex', alignItems: subtitle ? 'flex-start' : 'center', gap: 1.5, mb: 3 }}>
        <SectionIcon>{icon}</SectionIcon>
        <Box>
          <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600, color: colors.text, lineHeight: '32px' }}>
            {title}
          </Typography>
          {subtitle && <Typography sx={{ fontSize: 13, color: colors.muted }}>{subtitle}</Typography>}
        </Box>
      </Box>
      {children}
    </Box>
  );
}
