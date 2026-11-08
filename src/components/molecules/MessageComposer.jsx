import { useState } from 'react';
import { Box, Button } from '@mui/material';
import TextInput from '../atoms/TextInput';
import { MAX_MESSAGE_LENGTH } from '../../contexts/MessagesContext';
import { colors } from '../../utils/theme';

/** Caja para escribir: Enter o "Enviar" mandan el mensaje (no se envían mensajes vacíos). */
export default function MessageComposer({ onSend }) {
  const [text, setText] = useState('');
  const canSend = text.trim().length > 0;

  const submit = (e) => {
    e.preventDefault();
    if (!canSend) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <Box component="form" onSubmit={submit} sx={{ display: 'flex', gap: 1.5, px: { xs: 2, md: 3 }, py: 2.5, borderTop: '1px solid #EEE', bgcolor: '#fff' }}>
      <TextInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribe un mensaje..."
        inputProps={{ 'aria-label': 'Escribe un mensaje', maxLength: MAX_MESSAGE_LENGTH, autoComplete: 'off' }}
        sx={{ '& .MuiOutlinedInput-root': { bgcolor: '#F9FAFB' } }}
      />
      <Button
        type="submit"
        variant="contained"
        disableElevation
        disabled={!canSend}
        sx={{
          flexShrink: 0, height: 50, px: 4, borderRadius: '8px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, textTransform: 'none',
          bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark },
        }}
      >
        Enviar
      </Button>
    </Box>
  );
}
