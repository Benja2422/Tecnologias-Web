import { Box, Typography } from '@mui/material';
import { colors } from '../../utils/theme';

// Texto de ejemplo: reemplazar por las políticas reales de TodoMart.
const POLICIES = [
  { title: 'Plazo para reclamar', text: 'Puedes iniciar un reclamo dentro de los 10 días corridos posteriores a la entrega del producto o a la prestación del servicio.' },
  { title: 'Motivos aceptados', text: 'Producto dañado o defectuoso, producto distinto al publicado, producto incompleto, pedido no recibido o servicio no prestado como se acordó.' },
  { title: 'Cómo funciona', text: 'Inicia el reclamo indicando el pedido y el motivo. El vendedor y el equipo de TodoMart lo revisan (estado "En análisis") y te responden con una solución.' },
  { title: 'Reembolsos', text: 'Si el reclamo es aprobado, el reembolso se hace por el mismo medio de pago utilizado en la compra. El plazo depende de tu banco o emisor de tarjeta.' },
];

/** Contenido de la pestaña "Políticas de devolución". */
export default function ReturnPolicyPanel() {
  return (
    <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
      {POLICIES.map(({ title, text }) => (
        <Box key={title} sx={{ p: 3, border: '1px solid #E5E7EB', borderRadius: 3 }}>
          <Typography component="h3" sx={{ fontSize: 16, fontWeight: 600, color: colors.text }}>{title}</Typography>
          <Typography sx={{ mt: 1, fontSize: 14, lineHeight: 1.6, color: colors.muted }}>{text}</Typography>
        </Box>
      ))}
    </Box>
  );
}
