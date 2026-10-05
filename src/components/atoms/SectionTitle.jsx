import { Divider, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function SectionTitle({ children }) {
  return (
    <>
      <Typography variant="h6" sx={{ fontSize: 17, fontWeight: 600, color: colors.text }}>
        {children}
      </Typography>
      <Divider sx={{ mt: 1, mb: 2.5, borderColor: colors.border }} />
    </>
  );
}
