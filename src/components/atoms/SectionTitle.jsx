import { Box, Divider, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { colors } from '../../utils/theme';

export default function SectionTitle({ children, onBack }) {
  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {onBack && (
          <IconButton
            onClick={onBack}
            aria-label="Volver"
            sx={{
              width: 32, height: 32, color: colors.text,
              border: `1px solid ${colors.border}`,
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: colors.text, textAlign: 'left' }}>
          {children}
        </Typography>
      </Box>
      <Divider sx={{ mt: 1, mb: 2.5, borderColor: colors.border }} />
    </>
  );
}