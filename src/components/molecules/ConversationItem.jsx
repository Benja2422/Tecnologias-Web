import { Box, ButtonBase, Typography } from '@mui/material';
import ContactAvatar from '../atoms/ContactAvatar';
import { colors } from '../../utils/theme';
import { formatListTime } from '../../utils/messageDates';
import { useModeration } from '../../contexts/ModerationContext';

/** Fila de la bandeja: avatar, nombre, hora, extracto del último mensaje y punto azul si no está leída. */
export default function ConversationItem({ conversation, selected, onSelect }) {
  const { name, initials, unread, messages } = conversation;
  const { isHidden, isDeleted } = useModeration();
  const last = messages.filter((m) => !isDeleted(`m:${m.id}`)).at(-1);
  return (
    <ButtonBase
      onClick={onSelect}
      aria-current={selected ? 'true' : undefined}
      aria-label={`${name}${unread ? ', sin leer' : ''}`}
      sx={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 1.5, px: 2.5, py: 1.75, textAlign: 'left', fontFamily: 'inherit',
        borderBottom: '1px solid #EEE', borderLeft: `3px solid ${selected ? colors.primary : 'transparent'}`,
        bgcolor: selected ? '#FBF0F0' : '#fff', '&:hover': { bgcolor: selected ? '#FBF0F0' : '#FAFAFA' },
      }}
    >
      <ContactAvatar initials={initials} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
          <Typography noWrap sx={{ fontSize: 15, fontWeight: unread ? 600 : 500, color: colors.text }}>{name}</Typography>
          <Typography sx={{ fontSize: 12, color: '#8A8A8A', flexShrink: 0 }}>{last && formatListTime(last.at)}</Typography>
        </Box>
        <Box sx={{ mt: 0.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography noWrap sx={{ flex: 1, fontSize: 13, color: unread ? '#555' : '#8A8A8A' }}>{last && isHidden(`m:${last.id}`) ? 'Mensaje ocultado por moderación' : last?.text}</Typography>
          {unread && <Box aria-hidden sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colors.link, flexShrink: 0 }} />}
        </Box>
      </Box>
    </ButtonBase>
  );
}
