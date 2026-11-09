import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SellerChip from '../atoms/SellerChip';
import TextInput from '../atoms/TextInput';
import { colors } from '../../utils/theme';

const textarea = { '& .MuiOutlinedInput-root.MuiInputBase-multiline': { height: 'auto', py: 1.5, px: 1.5, alignItems: 'flex-start' }, '& textarea': { height: 'auto', padding: '0 !important', fontSize: 14 } };

/**
 * Tarjeta de una pregunta o devolución recibida.
 * header: { id, name, type, status, tone, flag? } (flag: aviso rojo adicional, p. ej. "Más de 48 h sin respuesta"); children: cuerpo (producto, texto…).
 * Si está pendiente (form) muestra un campo de texto y acciones; si no, `resolved` = { title, text, tone }.
 * form: { label, placeholder, note, max, actions: [{ label, variant: 'primary' | 'outlined', requireText, onClick(text) }] }
 */
export default function SellerRequestCard({ header, children, form, resolved }) {
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const inputId = `resp-${header.id}`;

  const run = (action) => {
    if (action.requireText && !text.trim()) { setError(action.requireText); return; }
    setError('');
    action.onClick(text.trim());
  };

  return (
    <Box component="article" aria-labelledby={`${inputId}-title`} sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', p: { xs: 2, sm: 2.5 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography id={`${inputId}-title`} component="h2" sx={{ fontSize: 14, fontWeight: 700, color: colors.primary, pr: 2, borderRight: '1px solid #E5E7EB' }}>#{header.id}</Typography>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{header.name}</Typography>
          <Typography sx={{ fontSize: 11.5, color: '#9CA3AF' }}>{header.type}</Typography>
        </Box>
        {header.flag && <SellerChip label={header.flag} tone="red" outlined />}
        <SellerChip label={header.status} tone={header.tone} />
      </Box>

      <Box sx={{ mt: 2.5, pb: 2.5, borderBottom: '1px solid #EEF0F2' }}>{children}</Box>

      {form ? (
        <Box sx={{ mt: 2.5 }}>
          <Typography component="label" htmlFor={inputId} sx={{ display: 'block', mb: 1.25, fontSize: 13, fontWeight: 600, color: colors.ink }}>{form.label}</Typography>
          <TextInput id={inputId} multiline minRows={2} value={text} onChange={(e) => { setText(e.target.value.slice(0, form.max)); if (error) setError(''); }} placeholder={form.placeholder} error={error} sx={textarea} />
          <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
            <Typography sx={{ fontSize: 11.5, color: '#9CA3AF' }}>{form.note} · {text.length} / {form.max}</Typography>
            <Box sx={{ display: 'flex', gap: 1.25 }}>
              {form.actions.map((a) => (
                <Button
                  key={a.label}
                  onClick={() => run(a)}
                  sx={a.variant === 'outlined'
                    ? { height: 38, px: 2, borderRadius: '6px', border: `1px solid ${colors.primary}`, color: colors.primary, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: '#FDECEF' } }
                    : { height: 38, px: 2, borderRadius: '6px', bgcolor: colors.primary, color: '#fff', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, '&:hover': { bgcolor: colors.primaryDark } }}
                >
                  {a.label}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      ) : resolved && (
        <Box sx={{ mt: 2, p: 1.75, bgcolor: '#F7F7F8', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: resolved.tone === 'red' ? colors.primary : '#15803D' }}>{resolved.title}</Typography>
          <Typography sx={{ mt: 0.75, fontSize: 14, color: colors.ink, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{resolved.text}</Typography>
        </Box>
      )}
    </Box>
  );
}
