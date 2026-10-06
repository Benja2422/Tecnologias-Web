import { Box } from '@mui/material';
import { colors } from '../../utils/theme';

export default function SectionIcon({ children }) {
  return (
    <Box
      sx={{
        width: 32, height: 32, flexShrink: 0, borderRadius: 2, bgcolor: '#FDECEF', color: colors.primary,
        display: 'grid', placeItems: 'center', '& svg': { fontSize: 18 },
      }}
    >
      {children}
    </Box>
  );
}
