import { Box, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { colors } from '../../utils/theme';

const GREEN = '#22C55E';
const STEPS = ['Dirección y envío', 'Pago', 'Confirmación'];

/**
 * Pasos del checkout. current: 1, 2 o 3. finished: la compra ya se confirmó (el último paso queda en verde).
 * Pasos anteriores: verde con ✓. Paso actual: contorno rojo. Siguientes: gris.
 */
export default function CheckoutStepper({ current, finished = false }) {
  return (
    <Box component="ol" aria-label="Pasos de la compra" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: { xs: 1, sm: 2 } }}>
      {STEPS.map((label, i) => {
        const n = i + 1;
        const done = n < current;
        const active = n === current && !finished;
        const lastDone = n === current && finished;
        return (
          <Box component="li" key={label} aria-current={n === current ? 'step' : undefined} sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              <Box
                aria-hidden
                sx={{
                  width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600,
                  ...(done || lastDone
                    ? { bgcolor: GREEN, color: '#fff' }
                    : active
                      ? { border: `2px solid ${colors.primary}`, color: colors.primary, bgcolor: '#fff' }
                      : { border: '1.5px solid #C4C4C4', color: '#8A8A8A', bgcolor: '#fff' }),
                }}
              >
                {done ? <CheckIcon sx={{ fontSize: 16 }} /> : n}
              </Box>
              <Typography sx={{ display: { xs: n === current ? 'block' : 'none', sm: 'block' }, fontSize: 15, fontWeight: done || active || lastDone ? 600 : 400, color: active ? colors.primary : done || lastDone ? colors.text : '#8A8A8A', whiteSpace: 'nowrap' }}>
                {label}
              </Typography>
            </Box>
            {n < STEPS.length && <Box aria-hidden sx={{ width: { xs: 24, sm: 80 }, height: 2, bgcolor: done ? GREEN : '#D9D9D9' }} />}
          </Box>
        );
      })}
    </Box>
  );
}
