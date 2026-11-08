// Reseñas de ejemplo (mismo contenido que el diseño). Reemplazar por src/services.
import soundbeat from '../assets/products/reviews/soundbeat-pro.png';
import lampara from '../assets/products/reviews/lampara-led.png';
import mochila from '../assets/products/reviews/mochila-urbana.png';
import cafetera from '../assets/products/reviews/cafetera-italiana.png';
import organizadores from '../assets/products/reviews/organizadores-escritorio.png';

const at = (y, m, d) => new Date(y, m - 1, d, 12, 0).toISOString();

// Productos comprados que aún no tienen opinión
export const initialPending = [
  { id: 'rv-soundbeat', name: 'Audífonos inalámbricos SoundBeat Pro', seller: 'TecnoMarket', image: soundbeat, purchasedAt: at(2026, 9, 14) },
  { id: 'rv-lampara', name: 'Lámpara de escritorio LED regulable', seller: 'Casa & Diseño', image: lampara, purchasedAt: at(2026, 9, 8) },
  { id: 'rv-mochila', name: 'Mochila urbana impermeable 25 L', seller: 'Ruta Norte', image: mochila, purchasedAt: at(2026, 9, 2) },
];

// Opiniones ya publicadas
export const initialDone = [
  {
    id: 'rv-cafetera', name: 'Cafetera italiana de aluminio 6 tazas', seller: 'Cocina Viva', image: cafetera,
    purchasedAt: at(2026, 8, 25), rating: 5, comment: 'Excelente calidad y llegó antes de lo esperado.', reviewedAt: at(2026, 8, 30),
  },
  {
    id: 'rv-organizadores', name: 'Set de organizadores para escritorio', seller: 'Ordena Chile', image: organizadores,
    purchasedAt: at(2026, 8, 11), rating: 4, comment: 'Muy práctico y tal como se muestra en las fotos.', reviewedAt: at(2026, 8, 16),
  },
];
