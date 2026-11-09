// Pedidos de otras tiendas de la plataforma (vista del administrador). Reemplazar por src/services.
const now = Date.now();
const HOUR = 3600000;
const DAY = 24 * HOUR;
const ago = (ms) => new Date(now - ms).toISOString();
const line = (name, quantity, unitPrice, kind = 'producto') => ({ name, quantity, unitPrice, kind });
const steps = (start, n) => Object.fromEntries(['confirmado', 'preparando', 'enviado', 'entregado'].slice(0, n).map((k, i) => [k, ago(start - i * 10 * HOUR)]));

export const platformOrders = [
  {
    id: 'TM-8840', createdAt: ago(3 * HOUR), buyer: 'Valentina Rojas', seller: 'Muebles del Sur',
    items: [line('Escritorio de Roble 120 cm', 1, 189990)], shippingName: 'Despacho estándar', shippingCost: 9990,
    address: 'Av. Alemania 0450, Temuco, La Araucanía', payment: { method: 'tarjeta', last4: '8812' },
    timeline: steps(3 * HOUR, 1), carrier: null, tracking: null, returns: [],
  },
  {
    id: 'TM-8833', createdAt: ago(DAY + 2 * HOUR), buyer: 'Tomás Herrera', seller: 'ElectroHogar SpA',
    items: [line('Hervidor Eléctrico 1,7 L', 2, 24990), line('Tostadora 2 rebanadas', 1, 19990)], shippingName: 'Despacho express', shippingCost: 5990,
    address: 'Los Leones 1200, Providencia, Metropolitana de Santiago', payment: { method: 'transferencia', code: 'TRF-2026-08833' },
    timeline: steps(DAY + 2 * HOUR, 2), carrier: null, tracking: null, returns: [],
  },
  {
    id: 'TM-8821', createdAt: ago(4 * DAY), buyer: 'Rodrigo Pizarro', seller: 'TecnoPlus Ltda.',
    items: [line('Notebook Lenovo IdeaPad 3', 1, 329990)], shippingName: 'Despacho estándar', shippingCost: 0,
    address: 'Baquedano 980, Antofagasta, Antofagasta', payment: { method: 'tarjeta', last4: '4471' },
    timeline: steps(4 * DAY, 3), carrier: 'Starken', tracking: 'STK-77120394', returns: [],
  },
  {
    id: 'TM-8807', createdAt: ago(9 * DAY), buyer: 'Fernanda Muñoz', seller: 'Libros Austral',
    items: [line('Saga Fundación (3 tomos)', 1, 38990), line('Marcapáginas de cuero', 2, 3990)], shippingName: 'Despacho estándar', shippingCost: 3990,
    address: 'General Lagos 1460, Valdivia, Los Ríos', payment: { method: 'tarjeta', last4: '0098' },
    timeline: steps(9 * DAY, 4), carrier: 'Correos de Chile', tracking: 'CC-1102934887', returns: [],
  },
  {
    id: 'TM-8795', createdAt: ago(14 * DAY), buyer: 'Ignacio Vera', seller: 'CleanPro SpA',
    items: [line('Limpieza profunda de hogar', 1, 48000, 'servicio')], shippingName: null, shippingCost: 0,
    address: 'Av. Ossa 2240, La Reina, Metropolitana de Santiago', payment: { method: 'transferencia', code: 'TRF-2026-08795' },
    timeline: steps(14 * DAY, 4), carrier: null, tracking: null, returns: [],
  },
  {
    id: 'TM-8781', createdAt: ago(18 * DAY), buyer: 'Camila Fuentes', seller: 'ElectroHogar SpA',
    items: [line('Aspiradora Robot S5', 1, 159990)], shippingName: 'Despacho express', shippingCost: 5990,
    address: 'Av. Libertad 560, Viña del Mar, Valparaíso', payment: { method: 'tarjeta', last4: '5523' },
    timeline: steps(18 * DAY, 4), carrier: 'Chilexpress', tracking: '99120044781',
    returns: [{ id: 'DEV-8781', product: 'Aspiradora Robot S5', reason: 'El equipo no carga la batería desde el primer día.', status: 'Aceptada', amount: 159990, at: ago(12 * DAY) }],
  },
  {
    id: 'TM-8760', createdAt: ago(27 * DAY), buyer: 'Matías Contreras', seller: 'TecnoPlus Ltda.',
    items: [line('Monitor 24" Full HD', 2, 119990)], shippingName: 'Despacho estándar', shippingCost: 6990,
    address: 'Caupolicán 330, Concepción, Biobío', payment: { method: 'tarjeta', last4: '7741' },
    timeline: steps(27 * DAY, 4), carrier: 'Blue Express', tracking: 'BX46601299',
    returns: [{ id: 'DEV-8760', product: 'Monitor 24" Full HD', reason: 'Uno de los monitores llegó con la pantalla trizada.', status: 'Aceptada', amount: 119990, at: ago(22 * DAY) }],
  },
  {
    id: 'TM-8742', createdAt: ago(40 * DAY), buyer: 'Josefa Araya', seller: 'Muebles del Sur',
    items: [line('Silla ergonómica Pro', 1, 129990)], shippingName: 'Despacho estándar', shippingCost: 9990,
    address: 'Av. Argentina 120, Valparaíso, Valparaíso', payment: { method: 'tarjeta', last4: '3109' },
    timeline: steps(40 * DAY, 1), carrier: null, tracking: null, returns: [], cancelled: { reason: 'Solicitud del cliente', note: '', at: ago(39 * DAY) },
  },
];
