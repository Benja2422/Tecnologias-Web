import { useState } from 'react';
import { Box, Button } from '@mui/material';
import TextInput, { FIELD_HEIGHT } from '../atoms/TextInput';

/** Campo "Escribe tu pregunta…" + botón Enviar. onSubmit(texto). */
export default function QuestionForm({ onSubmit }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const question = text.trim();
    if (question.length < 5) return setError('Escribe tu pregunta (mínimo 5 caracteres)');
    onSubmit(question);
    setText('');
    setError('');
  };

  return (
    <Box component="form" onSubmit={submit} noValidate sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
      <TextInput
        placeholder="Escribe tu pregunta..."
        value={text}
        onChange={(e) => { setText(e.target.value); setError(''); }}
        error={error}
        slotProps={{ htmlInput: { 'aria-label': 'Escribe tu pregunta', maxLength: 300 } }}
      />
      <Button
        type="submit"
        variant="contained"
        disableElevation
        sx={{
          height: FIELD_HEIGHT, px: 3.5, flexShrink: 0, borderRadius: '6px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600,
          bgcolor: '#2B2B2B', '&:hover': { bgcolor: '#111' },
        }}
      >
        Enviar
      </Button>
    </Box>
  );
}
