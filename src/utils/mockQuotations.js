// Cotizaciones de ejemplo (mismo contenido que el diseño). Reemplazar por src/services cuando exista el backend.
// Las fechas son relativas al momento de carga, para que la vigencia ("Vence en 10 días", "Venció el…") se vea bien.
import monitor from '../assets/products/quotes/monitor-24-fullhd.png';
import teclado from '../assets/products/quotes/teclado-compacto.png';

const now = new Date();
const at = (daysAgo, h = 10, m = 0) => new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysAgo, h, m).toISOString();

const sellers = {
  techstore: { id: 'techstore', name: 'TechStore', rut: '76.123.456-0' },
  hogar: { id: 'hogar-diseno', name: 'Hogar & Diseño', rut: '76.234.567-1' },
  tecnomarket: { id: 'tecnomarket', name: 'TecnoMarket', rut: '76.345.678-2' },
  papel: { id: 'papel-mas', name: 'Papel & Más', rut: '76.456.789-3' },
  oficina: { id: 'oficina-pro', name: 'Oficina Pro', rut: '76.567.890-4' },
  nordica: { id: 'casa-nordica', name: 'Casa Nórdica', rut: '76.678.901-5' },
};

// [nombre, detalle, cantidad, precio con IVA]
const item = ([name, detail, quantity, unitPrice, stock = 50], i) => ({
  productId: name.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `p${i}`,
  name, detail, quantity, unitPrice, stock, image: null,
});

const REPLY = 'Gracias por tu solicitud. Confirmamos los precios cotizados. Quedamos atentos a tus comentarios.';

/** quote(número, hace cuántos días, vendedor, productos, estado, extras) */
const quote = (num, daysAgo, seller, items, status, extra = {}) => {
  const responded = status !== 'Solicitada' ? at(daysAgo - 1) : null;
  const decided = status === 'Aceptada' || status === 'Rechazada' ? at(Math.max(0, daysAgo - 2)) : null;
  return {
    id: `COT-${String(num).padStart(5, '0')}`,
    createdAt: at(daysAgo),
    updatedAt: decided ?? responded ?? at(daysAgo),
    seller,
    status,
    items: items.map(item),
    message: '',
    reply: responded ? { text: REPLY, at: responded } : null,
    respondedAt: responded,
    decidedAt: decided,
    orderId: null,
    ...extra,
  };
};

// COT-00124: el ejemplo del diseño (monitores y teclados; solo hay 5 teclados en stock)
const monitorTeclado = [
  { productId: 'monitor-24-fullhd', name: 'Monitor 24 pulgadas Full HD', detail: 'Negro', quantity: 2, unitPrice: 119000, listPrice: 139990, stock: 40, image: monitor },
  { productId: 'teclado-compacto-inalambrico', name: 'Teclado compacto inalámbrico', detail: 'Español / Negro', quantity: 6, unitPrice: 11900, listPrice: null, stock: 5, image: teclado },
];
const MESSAGE_124 = 'Necesitamos equipar nuestra oficina con 2 monitores y 6 teclados. ¿Pueden confirmar la disponibilidad?';
const REPLY_124 = 'Gracias por tu solicitud. Confirmamos los precios cotizados. Actualmente tenemos 5 teclados disponibles; escríbenos para coordinar el resto.';

export const initialQuotations = [
  quote(129, 1, sellers.hogar, [['Silla de oficina ergonómica', 'Gris', 1, 119000], ['Cojín lumbar', 'Negro', 1, 59500]], 'Solicitada'),
  quote(128, 2, sellers.tecnomarket, [['Disco SSD 1 TB', 'NVMe', 1, 47600], ['Memoria RAM 16 GB', 'DDR4', 1, 59500], ['Cable SATA III', '50 cm', 1, 35700]], 'Respondida'),
  quote(127, 3, sellers.papel, [['Resma de papel carta', '500 hojas', 5, 4760], ['Sobres manila', 'Tamaño oficio', 10, 2380]], 'Aceptada'),
  quote(126, 4, sellers.oficina, [['Organizador de escritorio', 'Madera', 2, 11900]], 'Rechazada'),
  quote(125, 5, sellers.nordica, [['Lámpara de escritorio', 'Blanca', 1, 59500]], 'Solicitada', { message: '¿Tienen disponible para despacho a regiones?' }),
  {
    id: 'COT-00124', createdAt: at(5), updatedAt: at(4), seller: sellers.techstore, status: 'Respondida', items: monitorTeclado,
    message: MESSAGE_124, reply: { text: REPLY_124, at: at(4) }, respondedAt: at(4), decidedAt: null, orderId: null,
  },
  quote(123, 13, sellers.techstore, [['Mouse inalámbrico', 'Negro', 2, 11900], ['Alfombrilla de mouse', 'Grande', 1, 11900]], 'Solicitada'),
  quote(122, 14, sellers.nordica, [['Repisa de pared', 'Roble', 1, 83300]], 'Solicitada'),
  quote(121, 19, sellers.oficina, [['Archivador metálico', '4 cajones', 1, 89250], ['Etiquetas para archivador', 'Pack 100', 1, 29750]], 'Respondida'),
  quote(120, 21, sellers.tecnomarket, [['Hub USB-C multipuerto', '7 en 1', 1, 29750]], 'Solicitada'),
  // Más antiguas (se eliminan a los 45 días)
  quote(119, 22, sellers.techstore, [['Cargador USB-C 65 W', 'Blanco', 2, 24990]], 'Respondida'),
  quote(118, 24, sellers.nordica, [['Sofá de 2 cuerpos', 'Gris', 1, 289990]], 'Solicitada'),
  quote(117, 26, sellers.hogar, [['Cortinas blackout', '140 x 220 cm', 2, 39990]], 'Aceptada'),
  quote(116, 28, sellers.oficina, [['Silla ergonómica', 'Negra', 3, 99990]], 'Rechazada'),
  quote(115, 30, sellers.tecnomarket, [['Memoria RAM 16 GB', 'DDR4', 4, 45990]], 'Respondida'),
  quote(114, 32, sellers.papel, [['Cuaderno universitario', 'Pack 10', 6, 7990]], 'Solicitada'),
  quote(113, 34, sellers.hogar, [['Alfombra living', '160 x 230 cm', 1, 129990]], 'Aceptada'),
  quote(112, 36, sellers.techstore, [['Audífonos inalámbricos', 'Negro', 2, 59990]], 'Rechazada'),
  quote(111, 38, sellers.nordica, [['Mesa de centro', 'Nogal', 1, 109990]], 'Respondida'),
  quote(110, 40, sellers.oficina, [['Escritorio regulable', '140 cm', 1, 249990]], 'Solicitada'),
  quote(109, 41, sellers.tecnomarket, [['Router Wi-Fi 6', 'Doble banda', 3, 69990]], 'Respondida'),
  quote(108, 43, sellers.papel, [['Tóner láser', 'Negro', 2, 54990]], 'Aceptada'),
  // Ya cumplieron 45 días: el cliente no las ve y la limpieza automática las elimina
  quote(105, 47, sellers.hogar, [['Velador de madera', 'Natural', 2, 45990]], 'Solicitada'),
  quote(104, 52, sellers.techstore, [['Webcam Full HD', 'Negra', 4, 34990]], 'Respondida'),
  quote(107, 44, sellers.hogar, [['Velador', 'Blanco', 2, 34990]], 'Solicitada'),
];
