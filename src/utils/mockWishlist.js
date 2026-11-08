// Lista de deseos de ejemplo (mismo contenido que el diseño). Reemplazar por src/services.
import soundbeat from '../assets/products/wishlist/soundbeat-pro.png';
import lampara from '../assets/products/wishlist/lampara-led.png';
import limpieza from '../assets/products/wishlist/limpieza-profunda.png';
import mochila from '../assets/products/wishlist/mochila-urbana.png';
import armado from '../assets/products/wishlist/armado-muebles.png';
import taladro from '../assets/products/wishlist/taladro-percutor.png';

// kind: 'producto' | 'servicio' (los servicios muestran "Desde $X"). href: ficha del producto, si existe.
export const initialWishlist = [
  { id: 'wl-soundbeat', kind: 'producto', name: 'Audífonos inalámbricos SoundBeat Pro', price: 89990, image: soundbeat, href: null },
  { id: 'wl-lampara', kind: 'producto', name: 'Lámpara de escritorio LED regulable', price: 34990, image: lampara, href: null },
  { id: 'wl-limpieza', kind: 'servicio', name: 'Limpieza profunda de hogar', price: 45000, image: limpieza, href: null },
  { id: 'wl-mochila', kind: 'producto', name: 'Mochila urbana impermeable 25 L', price: 52990, image: mochila, href: null },
  { id: 'wl-armado', kind: 'servicio', name: 'Armado de muebles a domicilio', price: 28000, image: armado, href: null },
  { id: 'wl-taladro', kind: 'producto', name: 'Taladro percutor inalámbrico 20 V', price: 74990, image: taladro, href: null },
];
