import { Fragment, useEffect, useRef } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContactAvatar from '../atoms/ContactAvatar';
import MessageBubble from '../molecules/MessageBubble';
import MessageComposer from '../molecules/MessageComposer';
import { colors } from '../../utils/theme';
import { dayKey, formatDayLabel } from '../../utils/messageDates';

/**
 * Conversación abierta: cabecera (volver, nombre, menú), mensajes agrupados por día y caja para escribir.
 * onBack vuelve a la bandeja; onSend(text).
 */
export default function ChatPanel({ conversation, onBack, onSend }) {
  const endRef = useRef(null);
  const { name, initials, role, messages } = conversation;

  // Al abrir o recibir/enviar un mensaje, se baja hasta el último
  useEffect(() => { endRef.current?.scrollIntoView?.({ block: 'end' }); }, [conversation.id, messages.length]);

  return (
    <Box component="section" aria-label={`Conversación con ${name}`} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, height: '100%', bgcolor: '#fff' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: { xs: 1.5, md: 3 }, py: 1.75, borderBottom: '1px solid #EEE' }}>
        <IconButton onClick={onBack} aria-label="Volver a la bandeja" sx={{ color: colors.text }}><ArrowBackIcon /></IconButton>
        <ContactAvatar initials={initials} size={44} />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h2" noWrap sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{name}</Typography>
          <Typography noWrap sx={{ fontSize: 13, color: colors.muted }}>{role}</Typography>
        </Box>
      </Box>

      <Box
        role="log"
        aria-label="Mensajes"
        aria-live="polite"
        tabIndex={0}
        sx={{ flex: 1, minHeight: 0, overflowY: 'auto', px: { xs: 2, md: 4 }, py: 3, display: 'grid', alignContent: 'start', gap: 2, bgcolor: '#FCFCFC' }}
      >
        {messages.map((m, i) => (
          <Fragment key={m.id}>
            {(i === 0 || dayKey(messages[i - 1].at) !== dayKey(m.at)) && (
              <Typography sx={{ textAlign: 'center', fontSize: 12, color: '#8A8A8A', py: 0.5 }}>{formatDayLabel(m.at)}</Typography>
            )}
            <MessageBubble message={m} />
          </Fragment>
        ))}
        <div ref={endRef} />
      </Box>

      <MessageComposer onSend={onSend} />
    </Box>
  );
}
