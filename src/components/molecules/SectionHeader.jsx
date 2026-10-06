import { Box, Typography } from '@mui/material';
import AppLink from '../atoms/AppLink';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors } from '../../utils/theme';

export default function SectionHeader({ title, href, linkLabel = 'Ver todos' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4.5 }}>
      <Typography component="h2" sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 600, color: colors.text }}>
        {title}
      </Typography>
      {href && (
        <AppLink
          href={href}
          underline="none"
          sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, color: colors.primary, fontWeight: 600, fontSize: 15, fontFamily: 'inherit' }}
        >
          {linkLabel} <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </AppLink>
      )}
    </Box>
  );
}
