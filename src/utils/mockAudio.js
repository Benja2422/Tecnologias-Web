// Audífonos de ejemplo para las búsquedas ("audífonos bluetooth"). Reemplazar por src/services cuando exista el backend.
// Solo los 6 primeros tienen foto propia; el resto reutiliza esas fotos hasta que haya imágenes reales.
// `keywords` amplía lo que encuentra el buscador además del nombre y la categoría.
import sony from '../assets/products/audio/sony-wh-1000.png';
import airpods from '../assets/products/audio/airpods-pro-2.png';
import jbl from '../assets/products/audio/jbl-tune-770nc.png';
import buds from '../assets/products/audio/samsung-galaxy-buds.png';
import bose from '../assets/products/audio/bose-quietcomfort.png';
import sennheiser from '../assets/products/audio/sennheiser-hd-450.png';

const photos = [sony, airpods, jbl, buds, bose, sennheiser];
const BT = 'audífonos bluetooth inalámbricos';

// [id, nombre, rating, precio, categoría, keywords]
const rows = [
  ['sony-wh-1000', 'Audífonos Sony WH-1000', 4.9, 249990, 'audio-y-musica', BT],
  ['airpods-pro-2', 'AirPods Pro 2', 4.8, 199990, 'audio-y-musica', BT],
  ['jbl-tune-770nc', 'JBL Tune 770NC', 4.5, 89990, 'audio-y-musica', BT],
  ['samsung-galaxy-buds', 'Samsung Galaxy Buds', 4.6, 129990, 'audio-y-musica', BT],
  ['bose-quietcomfort', 'Bose QuietComfort', 4.9, 299990, 'audio-y-musica', BT],
  ['sennheiser-hd-450', 'Sennheiser HD 450', 4.4, 159990, 'audio-y-musica', BT],
  ['apple-airpods-max', 'Apple AirPods Max', 4.7, 549990, 'audio-y-musica', BT],
  ['jbl-tune-520bt', 'JBL Tune 520BT', 4.2, 39990, 'audio-y-musica', BT],
  ['anker-soundcore-q30', 'Anker Soundcore Q30', 4.4, 79990, 'audio-y-musica', BT],
  ['beats-studio-pro', 'Beats Studio Pro', 4.5, 349990, 'audio-y-musica', BT],
  ['hyperx-cloud-ii-wireless', 'HyperX Cloud II Wireless', 4.6, 129990, 'computacion', `${BT} gamer`],
  ['razer-kraken-bt', 'Razer Kraken BT', 4.1, 99990, 'juegos-y-consolas', `${BT} gamer`],
  ['skullcandy-hesh-anc', 'Skullcandy Hesh ANC', 3.8, 89990, 'audio-y-musica', BT],
  ['tws-deportivos', 'Audífonos TWS Deportivos', 3.5, 9990, 'audio-y-musica', BT],
  ['plegables-bt', 'Audífonos Plegables BT', 3.2, 12990, 'audio-y-musica', BT],
  ['studio-con-cable', 'Audífonos Studio con Cable', 4.3, 24990, 'audio-y-musica', 'audífonos cable'],
  ['in-ear-con-cable', 'Audífonos In-Ear con Cable', 4.0, 7990, 'audio-y-musica', 'audífonos cable'],
];

export const audioProducts = rows.map(([id, name, rating, price, categoryId, keywords], i) => ({
  id,
  name,
  rating,
  reviewCount: 15 + ((i * 53) % 220),
  price,
  categoryId,
  keywords,
  image: photos[i % photos.length],
}));
