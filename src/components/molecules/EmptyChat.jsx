import { Box, Typography } from '@mui/material';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import { colors } from '../../utils/theme';

/** Panel derecho cuando no hay una conversación abierta. */
export default function EmptyChat() {
  return (
    <Box sx={{ height: '100%', display: 'grid', placeItems: 'center', bgcolor: '#F9F9FA', px: 3 }}>
      <Box sx={{ display: 'grid', justifyItems: 'center', textAlign: 'center' }}>
        <Box aria-hidden sx={{ width: 64, height: 64, borderRadius: '50%', bgcolor: '#F0F0F1', border: '1px solid #E0E0E2', display: 'grid', placeItems: 'center', color: '#888' }}>
          <MailOutlinedIcon sx={{ fontSize: 30 }} />
        </Box>
        <Typography sx={{ mt: 3, fontSize: 18, fontWeight: 600, color: colors.text, textAlign: 'center' }}>Selecciona una conversación</Typography>
        <Typography sx={{ mt: 1, fontSize: 15, color: colors.muted, textAlign: 'center' }}>Elige una conversación del panel izquierdo para ver los mensajes</Typography>
      </Box>
    </Box>
  );
}
