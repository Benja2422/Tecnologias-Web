import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';
import { formatShortDateTime } from '../../utils/dates';
import { TRACKING_STEPS } from '../../utils/orders';

const GREEN = '#2E7D32';

/** Seguimiento del pedido: un punto por hito (verde = cumplido) con su fecha y hora. timeline: { confirmado: iso, … } */
export default function OrderTimeline({ timeline = {} }) {
  return (
    <Box component="ol" aria-label="Seguimiento del pedido" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: `repeat(${TRACKING_STEPS.length}, 1fr)` }}>
      {TRACKING_STEPS.map((step, i) => {
        const date = timeline[step.key];
        const done = Boolean(date);
        const nextDone = Boolean(timeline[TRACKING_STEPS[i + 1]?.key]);
        return (
          <Box component="li" key={step.key} sx={{ position: 'relative', display: 'grid', justifyItems: 'center', textAlign: 'center', gap: 0.5, minWidth: 0 }}>
            {i < TRACKING_STEPS.length - 1 && (
              <Box aria-hidden sx={{ position: 'absolute', top: 11, left: 'calc(50% + 24px)', width: 'calc(100% - 48px)', height: 2, bgcolor: nextDone ? GREEN : '#D1D5DB' }} />
            )}
            <Box
              aria-hidden
              sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: done ? GREEN : '#fff', border: `2px solid ${done ? GREEN : '#D1D5DB'}` }}
            />
            <Typography sx={{ mt: 0.5, fontSize: 15, fontWeight: 600, color: done ? colors.text : colors.muted }}>
              {step.label}
              <Box component="span" sx={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{done ? ' (cumplido)' : ' (pendiente)'}</Box>
            </Typography>
            <Typography sx={{ fontSize: 12, color: colors.muted, minHeight: 18 }}>{done ? formatShortDateTime(date) : '—'}</Typography>
          </Box>
        );
      })}
    </Box>
  );
}
