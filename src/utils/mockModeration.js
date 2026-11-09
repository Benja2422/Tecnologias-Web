// Contenido de otros usuarios y tiendas de la plataforma para el panel de moderación del administrador.
// Se suma a lo que generan las vistas de cliente y emprendedor. Reemplazar por src/services cuando exista el backend.
const now = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms) => new Date(now - ms).toISOString();

/** Preguntas públicas en productos de otras tiendas. */
export const platformQuestions = [
  { id: 'PREG-7990', askedAt: ago(3 * DAY + 4 * HOUR), buyer: 'Valentina Rojas', seller: 'Muebles del Sur', product: 'Escritorio de Roble 120 cm', text: '¿El escritorio viene armado o hay que armarlo? ¿Incluye las herramientas?', answer: null },
  { id: 'PREG-7984', askedAt: ago(2 * DAY + 2 * HOUR), buyer: 'Tomás Herrera', seller: 'ElectroHogar SpA', product: 'Hervidor Eléctrico 1,7 L', text: '¿Tiene apagado automático cuando se queda sin agua?', answer: null },
  { id: 'PREG-7979', askedAt: ago(5 * HOUR), buyer: 'cliente_9921', seller: 'ElectroHogar SpA', product: 'Hervidor Eléctrico 1,7 L', text: 'COMPRA MÁS BARATO EN mi-tienda-externa.cl !!! escríbeme al +56 9 8765 4321, mismo producto a mitad de precio', answer: null },
  { id: 'PREG-7962', askedAt: ago(4 * DAY), buyer: 'Fernanda Muñoz', seller: 'Libros Austral', product: 'Saga Fundación (3 tomos)', text: '¿Los libros son nuevos o usados?', answer: { text: 'Hola Fernanda, son nuevos y vienen sellados.', at: ago(4 * DAY - 5 * HOUR) } },
  { id: 'PREG-7955', askedAt: ago(6 * DAY), buyer: 'Ignacio Vera', seller: 'CleanPro SpA', product: 'Limpieza profunda de hogar', text: '¿Llevan sus propios productos de limpieza?', answer: { text: 'Sí, todos los materiales están incluidos en el valor.', at: ago(6 * DAY - 2 * HOUR) } },
];

const msg = (id, from, text, msAgo) => ({ id, from, text, at: ago(msAgo) });

/** Conversaciones privadas entre otros clientes y tiendas. from: 'client' | 'seller'. */
export const platformConversations = [
  {
    id: 'pc-101', client: 'Valentina Rojas', seller: 'Muebles del Sur', sellerRole: 'Emprendedor',
    messages: [
      msg('pc101-1', 'client', 'Hola, compré el escritorio hace una semana y aún no tengo número de seguimiento.', 4 * DAY),
      msg('pc101-2', 'seller', 'Hola Valentina, lo revisamos y te avisamos hoy mismo.', 4 * DAY - 3 * HOUR),
      msg('pc101-3', 'client', 'Siguen sin responderme. ¿Me pueden indicar cuándo llega el pedido?', 3 * DAY),
    ],
  },
  {
    id: 'pc-102', client: 'Tomás Herrera', seller: 'ElectroHogar SpA', sellerRole: 'Empresa',
    messages: [
      msg('pc102-1', 'client', '¿Hacen factura a nombre de empresa?', 6 * HOUR),
    ],
  },
  {
    id: 'pc-103', client: 'Rodrigo Pizarro', seller: 'TecnoPlus Ltda.', sellerRole: 'Empresa',
    messages: [
      msg('pc103-1', 'client', '¿El notebook tiene garantía en Chile?', 2 * DAY + 5 * HOUR),
      msg('pc103-2', 'seller', 'Sí, 12 meses. Pero si me transfieres directo a mi cuenta RUT 12.345.678-9 te hago un 20% de descuento, así no pagas comisión de la plataforma.', 2 * DAY + 3 * HOUR),
      msg('pc103-3', 'client', 'Prefiero pagar por TodoMart, gracias.', 2 * DAY + 2 * HOUR),
      msg('pc103-4', 'seller', 'Como quieras, entonces queda con el precio normal.', 2 * DAY),
    ],
  },
];

/** Reseñas de otras tiendas. */
export const platformReviews = [
  { id: 'RES-650', createdAt: ago(1 * DAY), buyer: 'Rodrigo Pizarro', seller: 'TecnoPlus Ltda.', target: 'Notebook Lenovo IdeaPad 3', rating: 1, comment: 'Vendedor estafador, son unos ladrones y unos inútiles. No compren aquí.' },
  { id: 'RES-644', createdAt: ago(2 * DAY), buyer: 'Fernanda Muñoz', seller: 'Libros Austral', target: 'Saga Fundación (3 tomos)', rating: 5, comment: 'Llegaron impecables y antes de lo esperado.' },
  { id: 'RES-631', createdAt: ago(5 * DAY), buyer: 'promo_ofertas', seller: 'ElectroHogar SpA', target: 'Hervidor Eléctrico 1,7 L', rating: 5, comment: 'Excelente!! visita ofertas-increibles.cl para descuentos en toda la tienda' },
  { id: 'RES-622', createdAt: ago(9 * DAY), buyer: 'Ignacio Vera', seller: 'CleanPro SpA', target: 'Limpieza profunda de hogar', rating: 4, comment: 'Muy prolijos, solo llegaron 20 minutos tarde.' },
];
