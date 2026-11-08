import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';
import { formatClock } from '../../utils/messageDates';

/** Mensaje de una conversación. Los propios van a la derecha con fondo rosado; los de la otra parte, a la izquierda en gris. */
export default function MessageBubble({ message }) {
  const mine = message.from === 'me';
  return (
    <Box sx={{ display: 'flex', justifyContent: mine ? 'flex-end' : 'flex-start' }}>
      <Box
        sx={{
          maxWidth: { xs: '88%', md: 430 }, minWidth: 120, px: 2, py: 1.5, borderRadius: 2,
          bgcolor: mine ? '#FBECEC' : '#F0F0F1', border: `1px solid ${mine ? '#F1D5D5' : '#E6E6E8'}`,
        }}
      >
        <Typography sx={{ fontSize: 15, lineHeight: 1.45, color: colors.text, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{message.text}</Typography>
        <Typography component="time" dateTime={message.at} sx={{ display: 'block', mt: 1.25, fontSize: 11, color: '#8A8A8A', textAlign: 'right' }}>
          {formatClock(message.at)}
        </Typography>
      </Box>
    </Box>
  );
}
