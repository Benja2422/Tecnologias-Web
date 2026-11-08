// Reclamos de ejemplo con productos que ya existen en la web. Reemplazar por src/services.
import sonyNegro from '../assets/products/sony-wh1000xm5-negro.png';
import cable from '../assets/products/cart/cable-usbc-premium.png';
import mochila from '../assets/products/wishlist/mochila-urbana.png';
import lampara from '../assets/products/wishlist/lampara-led.png';
import taladro from '../assets/products/wishlist/taladro-percutor.png';
import soundbeat from '../assets/products/wishlist/soundbeat-pro.png';

const at = (month, day) => new Date(2026, month, day, 10, 0).toISOString();

// status de cada ítem: 'Aprobado - Reembolso Emitido' | 'En revisión' | 'Esperando devolución'
export const mockClaims = [
  {
    id: 'RCL-2026-00482', openedAt: at(8, 18), orderId: 'TM-849302', status: 'Pendiente',
    items: [
      { id: 'i1', name: 'Audífonos Sony WH-1000XM5', quantity: 1, reason: 'Producto roto', image: sonyNegro, status: 'Aprobado - Reembolso Emitido' },
      { id: 'i2', name: 'Cable USB-C Premium 2m', quantity: 2, reason: 'No llegó', image: cable, status: 'En revisión' },
      { id: 'i3', name: 'Mochila urbana impermeable 25 L', quantity: 1, reason: 'Llegó un modelo distinto', image: mochila, status: 'Esperando devolución' },
    ],
  },
  {
    id: 'RCL-2026-00451', openedAt: at(8, 11), orderId: 'TM-846177', status: 'Pendiente',
    items: [{ id: 'i1', name: 'Lámpara de escritorio LED regulable', quantity: 1, reason: 'Llegó con una falla', image: lampara, status: 'En revisión' }],
  },
  {
    id: 'RCL-2026-00398', openedAt: at(7, 28), orderId: 'TM-839540', status: 'Resuelto',
    items: [{ id: 'i1', name: 'Taladro percutor inalámbrico 20 V', quantity: 1, reason: 'Producto roto', image: taladro, status: 'Aprobado - Reembolso Emitido' }],
  },
  {
    id: 'RCL-2026-00312', openedAt: at(7, 6), orderId: 'TM-828905', status: 'Resuelto',
    items: [{ id: 'i1', name: 'Audífonos inalámbricos SoundBeat Pro', quantity: 1, reason: 'No coincide con la descripción', image: soundbeat, status: 'Aprobado - Reembolso Emitido' }],
  },
];

export const getClaim = (id) => mockClaims.find((c) => c.id === id) ?? null;
