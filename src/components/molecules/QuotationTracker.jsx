import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';
import { formatDMY, validUntil } from '../../utils/quotations';

const GREEN = '#2E7D32';
const RED = '#D32F2F';
const GREY = '#EDEDED';

/**
 * "Seguimiento de la cotización": Solicitada → Respondida → Aceptada.
 * status: estado visible. Si fue rechazada o expiró, el último paso se tacha y explica qué pasó.
 */
export default function QuotationTracker({ quotation, status }) {
  const responded = Boolean(quotation.respondedAt);
  const accepted = status === 'Aceptada';
  const rejected = status === 'Rechazada';
  const expired = status === 'Expirada';

  const steps = [
    { label: 'Solicitada', sub: formatDMY(quotation.createdAt), dot: GREEN },
    { label: 'Respondida', sub: responded ? formatDMY(quotation.respondedAt) : 'Pendiente', dot: responded ? GREEN : GREY },
    {
      label: 'Aceptada',
      sub: accepted ? formatDMY(quotation.decidedAt) : rejected ? `Rechazada · ${formatDMY(quotation.decidedAt)}` : expired ? `Expiró · ${formatDMY(validUntil(quotation))}` : 'Pendiente',
      dot: accepted ? GREEN : rejected ? RED : GREY,
      struck: rejected || expired,
      labelColor: rejected ? RED : undefined,
    },
  ];
  // Cada tramo se pinta de verde cuando se llegó al paso siguiente
  const lines = [responded, accepted];

  return (
    <Box component="ol" aria-label="Seguimiento de la cotización" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
      {steps.map((step, i) => (
        <Box
          component="li"
          key={step.label}
          aria-current={i === steps.findLastIndex((s) => s.dot === GREEN) ? 'step' : undefined}
          sx={{
            position: 'relative', display: 'grid', justifyItems: 'center', gap: 0.75, textAlign: 'center',
            ...(i < 2 && {
              '&::after': {
                content: '""', position: 'absolute', top: 12, height: 2, left: { xs: 'calc(50% + 40px)', md: 'calc(50% + 110px)' }, width: { xs: 'calc(100% - 80px)', md: 'calc(100% - 220px)' },
                bgcolor: lines[i] ? GREEN : '#E0E0E0',
              },
            }),
          }}
        >
          <Box aria-hidden sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: step.dot, mb: 0.5 }} />
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: step.labelColor ?? colors.text, textDecoration: step.struck ? 'line-through' : 'none' }}>{step.label}</Typography>
          <Typography sx={{ fontSize: 12, color: colors.muted }}>{step.sub}</Typography>
        </Box>
      ))}
    </Box>
  );
}
