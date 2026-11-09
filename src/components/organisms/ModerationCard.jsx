import { Box, Typography } from '@mui/material';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import SellerChip from '../atoms/SellerChip';
import { formatWhen } from '../../utils/seller';
import { card } from '../../utils/sellerStyles';
import { colors } from '../../utils/theme';

/**
 * Tarjeta de un contenido a moderar (pregunta, conversación o reseña).
 * chips: [{ label, tone }]; context: línea superior ("Producto: … · Tienda: …"); author / at: quién y cuándo;
 * text: contenido; hidden: { reason, note, at } si está oculto; reply: { title, text }; alert: borde rojo; actions: botones.
 */
export default function ModerationCard({ id, chips = [], context, author, at, text, extra, hidden, reply, alert = false, actions }) {
  return (
    <Box component="article" aria-label={id} sx={{ ...card, p: { xs: 2, md: 2.5 }, borderLeft: alert ? `4px solid ${colors.primary}` : card.border }}>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
        <Typography sx={{ fontSize: 11.5, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#6B7280', overflowWrap: 'anywhere' }}>{context}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {chips.map((c) => <SellerChip key={c.label} label={c.label} tone={c.tone} dot={c.dot} />)}
        </Box>
      </Box>

      {hidden && (
        <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'flex-start', gap: 1, px: 1.5, py: 1, bgcolor: '#F3F4F6', borderRadius: '6px', fontSize: 12.5, color: '#4B5563' }}>
          <VisibilityOffOutlinedIcon sx={{ fontSize: 17, mt: 0.1 }} />
          <Box sx={{ minWidth: 0 }}>
            Oculto por moderación · <b>{hidden.reason}</b> · {formatWhen(hidden.at)}
            {hidden.note && <Box component="span" sx={{ display: 'block', color: '#6B7280' }}>Nota: {hidden.note}</Box>}
          </Box>
        </Box>
      )}

      <Box sx={{ opacity: hidden ? 0.55 : 1 }}>
        {text && <Typography sx={{ mt: 1.5, fontSize: 15, color: colors.ink, lineHeight: 1.55, overflowWrap: 'anywhere', whiteSpace: 'pre-wrap' }}>{text}</Typography>}
        {extra}
      </Box>
      <Typography sx={{ mt: 1, fontSize: 12, color: '#9CA3AF' }}>{author}{at && <> · {formatWhen(at)}</>}</Typography>

      {reply && (
        <Box sx={{ mt: 1.5, pl: 1.5, py: 0.5, borderLeft: '3px solid #BBF7D0' }}>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#15803D' }}>{reply.title}</Typography>
          <Typography sx={{ fontSize: 14, color: '#374151', lineHeight: 1.5, overflowWrap: 'anywhere' }}>{reply.text}</Typography>
        </Box>
      )}

      {actions && <Box sx={{ mt: 2, pt: 1.75, borderTop: '1px solid #F0F1F3', display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'flex-end' }}>{actions}</Box>}
    </Box>
  );
}
