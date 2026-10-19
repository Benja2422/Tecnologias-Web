// Notebooks de ejemplo para la categoría "Computación" (24 productos).
// Solo los 6 primeros tienen foto propia; el resto reutiliza esas fotos hasta que haya imágenes reales.
import macbook from '../assets/products/laptops/macbook-air-m3.png';
import thinkpad from '../assets/products/laptops/lenovo-thinkpad.png';
import hp from '../assets/products/laptops/hp-pavilion-15.png';
import dell from '../assets/products/laptops/dell-xps-13.png';
import asus from '../assets/products/laptops/asus-zenbook.png';
import acer from '../assets/products/laptops/acer-swift-go.png';

const photos = [macbook, thinkpad, hp, dell, asus, acer];

const rows = [
  ['macbook-air-m3', 'MacBook Air M3', 4.0, 899990],
  ['lenovo-thinkpad', 'Lenovo ThinkPad', 4.0, 649990],
  ['hp-pavilion-15', 'HP Pavilion 15', 4.0, 549990],
  ['dell-xps-13', 'Dell XPS 13', 4.0, 1199990],
  ['asus-zenbook', 'ASUS ZenBook', 4.0, 799990],
  ['acer-swift-go', 'Acer Swift Go', 4.0, 499990],
  ['macbook-pro-14', 'MacBook Pro 14', 4.8, 1799990],
  ['lenovo-ideapad-3', 'Lenovo IdeaPad 3', 3.8, 329990],
  ['hp-envy-x360', 'HP Envy x360', 4.4, 749990],
  ['dell-inspiron-15', 'Dell Inspiron 15', 4.1, 459990],
  ['asus-vivobook-15', 'ASUS Vivobook 15', 4.2, 389990],
  ['acer-aspire-5', 'Acer Aspire 5', 4.3, 429990],
  ['msi-modern-14', 'MSI Modern 14', 4.0, 519990],
  ['huawei-matebook-d14', 'Huawei MateBook D14', 4.1, 479990],
  ['samsung-galaxy-book3', 'Samsung Galaxy Book3', 4.5, 899990],
  ['lg-gram-16', 'LG Gram 16', 4.6, 1349990],
  ['surface-laptop-5', 'Microsoft Surface Laptop 5', 4.5, 1249990],
  ['lenovo-legion-5', 'Lenovo Legion 5', 4.7, 999990],
  ['hp-victus-16', 'HP Victus 16', 4.3, 849990],
  ['asus-tuf-f15', 'ASUS TUF Gaming F15', 4.4, 779990],
  ['razer-blade-14', 'Razer Blade 14', 4.7, 2199990],
  ['dell-latitude-5440', 'Dell Latitude 5440', 4.2, 959990],
  ['gigabyte-aero-14', 'Gigabyte Aero 14', 4.5, 1099990],
];

export const laptops = rows.map(([id, name, rating, price], i) => ({
  id,
  name,
  rating,
  reviewCount: 20 + ((i * 37) % 180),
  price,
  image: photos[i % photos.length],
  categoryId: 'computacion',
}));
