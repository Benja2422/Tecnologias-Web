// Datos de ejemplo. Reemplazar por llamadas a src/services cuando exista el backend.
import { featuredProducts } from './mockCatalog';
import sonyNegro from '../assets/products/sony-wh1000xm5-negro.png';
import sonyPlata from '../assets/products/sony-wh1000xm5-plata.png';
import sonyAzul from '../assets/products/sony-wh1000xm5-azul.png';
import sonyRojo from '../assets/products/sony-wh1000xm5-rojo.png';

/**
 * Forma de un producto:
 * {
 *   id, name, categories: string[], ageRestricted, price, originalPrice?,
 *   seller: { id, name }, freeShipping,
 *   variants?: [{ id, label, swatch, stock }]      // p. ej. colores; si no hay, se usa `stock`
 *   stock?,                                         // solo para productos sin variantes
 *   images: [{ id, src, alt, variantId? }]          // si está vacío se muestra un placeholder
 *   description, features: string[],
 *   questions: [{ id, question, answer }],
 *   reviews: [{ id, author, date (ISO), rating, comment }],
 *   rating, reviewCount,                            // promedio y cantidad (para productos sin reseñas cargadas)
 *   relatedIds: string[]
 * }
 */
const sony = {
  id: 'sony-wh-1000xm5',
  name: 'Audífonos Sony WH-1000XM5',
  categories: ['Tecnología', 'Audio'],
  ageRestricted: true,
  price: 249990,
  originalPrice: 329990,
  seller: { id: 'techstore', name: 'TechStore' },
  freeShipping: true,
  variants: [
    { id: 'negro', label: 'Negro', swatch: '#333333', stock: 67 },
    { id: 'plata', label: 'Plata', swatch: '#E5E7EB', stock: 69 },
    { id: 'azul', label: 'Azul', swatch: '#1E3A8A', stock: 12 },
  ],
  images: [
    { id: 'img-negro', src: sonyNegro, alt: 'Audífonos Sony WH-1000XM5 color negro', variantId: 'negro' },
    { id: 'img-rojo', src: sonyRojo, alt: 'Audífonos Sony WH-1000XM5 color rojo' },
    { id: 'img-plata', src: sonyPlata, alt: 'Audífonos Sony WH-1000XM5 color plata', variantId: 'plata' },
    { id: 'img-azul', src: sonyAzul, alt: 'Audífonos Sony WH-1000XM5 color azul', variantId: 'azul' },
  ],
  description:
    'Los audífonos de diadema inalámbricos Sony WH-1000XM5 redefinen la escucha sin distracciones y la claridad en las llamadas con dos procesadores que controlan 8 micrófonos, un optimizador de Noise Cancelling automático para optimizar de forma automática la cancelación de ruido según el entorno y las condiciones, y una unidad de diafragma especial.',
  features: [
    'Cancelación de ruido líder en el mercado optimizada automáticamente.',
    'Sonido excepcional diseñado para la perfección con el nuevo procesador integrado V1.',
    'Llamadas manos libres cristalinas con 4 micrófonos de formación de haz.',
    'Hasta 30 horas de duración de la batería para reproducción continua durante todo el día.',
  ],
  questions: [
    { id: 'q1', question: '¿Es compatible con iPhone?', answer: 'Sí, compatible con todos los dispositivos Bluetooth.' },
    { id: 'q2', question: '¿Cuántas horas dura la batería?', answer: 'Hasta 30 horas de reproducción continua.' },
  ],
  reviews: [
    { id: 'r1', author: 'Carlos M.', date: '2026-01-14', rating: 5, comment: 'La cancelación de ruido es simplemente de otro mundo. Cómodos y con una calidad de audio espectacular.' },
    { id: 'r2', author: 'Mariela P.', date: '2026-01-08', rating: 5, comment: 'Muy buena calidad de materiales, la batería dura muchísimo. Un poco costosos pero valen la pena si viajas mucho.' },
  ],
  relatedIds: ['jbl-bluetooth', 'sennheiser-hd450bt', 'bose-quietcomfort-45', 'sony-wh-ch720n'],
};

// Productos "compactos": sirven como tarjetas de relacionados y, con buildSimpleProduct, como página de detalle.
const compact = [
  { id: 'jbl-bluetooth', name: 'Audífonos Bluetooth JBL', imageLabel: 'JBL Audio', rating: 4.5, reviewCount: 127, price: 89990, originalPrice: 119990 },
  { id: 'sennheiser-hd450bt', name: 'Sennheiser HD 450BT', imageLabel: 'Sennheiser', rating: 4.2, reviewCount: 127, price: 149990 },
  { id: 'bose-quietcomfort-45', name: 'Bose QuietComfort 45', imageLabel: 'Bose Noise', rating: 4.8, reviewCount: 127, price: 299990, originalPrice: 349990 },
  { id: 'sony-wh-ch720n', name: 'Sony WH-CH720N', imageLabel: 'Sony Entry', rating: 4.3, reviewCount: 127, price: 79990 },
];

const buildSimpleProduct = (item) => ({
  id: item.id,
  name: item.name,
  categories: ['Tecnología'],
  ageRestricted: false,
  price: item.price,
  originalPrice: item.originalPrice,
  seller: { id: 'techstore', name: 'TechStore' },
  freeShipping: true,
  stock: item.stock ?? 25,
  images: item.image ? [{ id: `${item.id}-img`, src: item.image, alt: item.name }] : [],
  imageLabel: item.imageLabel,
  description: `${item.name}. Producto vendido y despachado por TechStore con garantía del vendedor.`,
  features: [],
  questions: [],
  reviews: [],
  rating: item.rating,
  reviewCount: item.reviewCount ?? 0,
  relatedIds: ['sony-wh-1000xm5', ...compact.map((c) => c.id)].filter((id) => id !== item.id).slice(0, 4),
});

const registry = new Map(
  [sony, ...compact.map(buildSimpleProduct), ...featuredProducts.map(buildSimpleProduct)].map((p) => [p.id, p]),
);

export const getProductById = (id) => registry.get(id) ?? null;

/** Promedio y cantidad de reseñas: usa la lista de reseñas si existe, si no los valores del producto. */
export const getRatingInfo = (product) => {
  if (product.reviews?.length) {
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    return { rating: sum / product.reviews.length, count: product.reviews.length };
  }
  return { rating: product.rating ?? 0, count: product.reviewCount ?? 0 };
};

/** Productos relacionados, ya con `rating` y `reviewCount` calculados para la tarjeta. */
export const getRelatedProducts = (product) =>
  (product.relatedIds ?? [])
    .map((id) => registry.get(id))
    .filter(Boolean)
    .map((p) => {
      const { rating, count } = getRatingInfo(p);
      return { ...p, rating, reviewCount: count };
    });
