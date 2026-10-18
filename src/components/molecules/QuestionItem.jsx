import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

export default function QuestionItem({ question, answer, last = false }) {
  return (
    <Box sx={{ py: 2.25, borderBottom: last ? 'none' : '1px solid #EEE' }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#222' }}>P: {question}</Typography>
      <Typography sx={{ mt: 0.75, fontSize: 14, color: answer ? colors.muted : '#9A9A9A', fontStyle: answer ? 'normal' : 'italic' }}>
        R: {answer ?? 'Pendiente de respuesta del vendedor.'}
      </Typography>
    </Box>
  );
}
