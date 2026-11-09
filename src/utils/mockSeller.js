// Datos de ejemplo del panel de emprendedor (tienda "Comercial SpA"). Reemplazar por src/services cuando exista el backend.
// Las fechas son relativas al momento de carga, para que "Hoy", "Hace 10 min" y las ofertas se vean bien.
import taladro from '../assets/products/wishlist/taladro-percutor.png';
import { CRITICAL_STOCK, defaultShippingRates } from './seller';

const now = Date.now();
const MIN = 60 * 1000;
const HOUR = 60 * MIN;
const DAY = 24 * HOUR;
const ago = (ms) => new Date(now - ms).toISOString();
const ahead = (ms) => new Date(now + ms).toISOString();

// Atributos físicos obligatorios de cada producto (requerimiento 8): tamaño, peso, color y material principal
const PHYSICAL = {
  'p-her-091': ['45 x 22 x 20 cm', 3.2, 'Rojo / Negro', 'Acero'],
  'p-amp-102': ['30 x 12 x 6 cm', 0.6, 'Blanco', 'Policarbonato'],
  'p-tal-042': ['25 x 8 x 22 cm', 1.8, 'Amarillo / Negro', 'Plástico ABS'],
  'p-sie-012': ['35 x 25 x 28 cm', 4.1, 'Azul', 'Aluminio'],
  'p-esc-502': ['160 x 48 x 10 cm', 6.5, 'Plateado', 'Aluminio'],
  'p-foc-150': ['33 x 33 x 15 cm', 2.4, 'Negro', 'Aluminio'],
  'p-rot-020': ['38 x 12 x 25 cm', 3.6, 'Verde / Negro', 'Plástico ABS'],
  'p-cin-048': ['12 x 12 x 5 cm', 0.3, 'Café', 'Polipropileno'],
  'p-gat-003': ['50 x 18 x 15 cm', 8.0, 'Rojo', 'Acero'],
  'p-bro-010': ['20 x 10 x 3 cm', 0.5, 'Plateado', 'Acero HSS'],
  'p-gen-001': ['60 x 45 x 48 cm', 38.0, 'Rojo', 'Acero / Cobre'],
  'p-lla-012': ['50 x 6 x 4 cm', 1.4, 'Cromado', 'Acero cromo-vanadio'],
};

// Stock mínimo por defecto: 10 unidades (alerta de inventario crítico del enunciado)
const product = (id, name, sku, category, price, stock, _minStock, extra = {}) => {
  const [size, weightKg, color, material] = PHYSICAL[id] ?? ['', 0, '', ''];
  return {
    id, kind: 'producto', name, sku, category, price, stock, minStock: CRITICAL_STOCK, size, weightKg, color, material,
    description: '', images: [], variants: [], related: [], offer: null, draft: false, ...extra,
  };
};
const service = (id, name, sku, category, price, extra = {}) => ({
  id, kind: 'servicio', name, sku, category, price, unit: 'Por visita', duration: '', modality: 'domicilio', ageRestriction: 0, description: '', images: [], offer: null, draft: false, ...extra,
});
const offer = (price, startsAt, endsAt) => ({ price, startsAt, endsAt, endedAt: null });

export const initialItems = [
  product('p-her-091', 'Caja de Herramientas Premium Pro', 'HER-091', 'herramientas', 45990, 0, 5, {
    description: 'Caja metálica de 3 niveles con bandejas desmontables, cierre con candado y asa reforzada. Incluye garantía de 12 meses.',
    variants: [
      { sku: 'HER-091-PRO-S', attributes: 'Talla S / Rojo', price: 45990, stock: 8, minStock: CRITICAL_STOCK },
      { sku: 'HER-091-PRO-M', attributes: 'Talla M / Negro', price: 47990, stock: 7, minStock: CRITICAL_STOCK },
    ],
    related: ['p-amp-102', 'p-esc-502'],
    offer: offer(34990, ago(4 * DAY), ahead(8 * HOUR)),
  }),
  product('p-amp-102', 'Pack 10 Ampolletas LED Inteligentes', 'AMP-102', 'iluminacion', 18500, 4, 4, {
    description: 'Ampolletas LED E27 de 9 W con control por aplicación y luz cálida o fría.',
    offer: offer(14990, ahead(3 * DAY), ahead(17 * DAY)),
  }),
  product('p-tal-042', 'Taladro Percutor Inalámbrico 18V', 'TAL-042', 'herramientas', 89990, 2, 5, {
    description: 'Taladro percutor de 18 V con 2 baterías de litio, cargador rápido y maletín.',
    images: [{ name: 'taladro.png', src: taladro }],
    offer: offer(69990, ago(8 * DAY), ahead(22 * DAY)),
  }),
  product('p-sie-012', 'Sierra Circular de Mano 1200W', 'SIE-CIRC-12', 'herramientas', 74990, 1, 3),
  product('p-esc-502', 'Escalera de Aluminio Tijera 5 Peldaños', 'ESC-502', 'construccion', 32400, 8, 5, {
    offer: offer(24990, ago(2 * DAY), ahead(12 * DAY)),
  }),
  product('p-foc-150', 'Foco LED Industrial 150W High Bay', 'FOC-150', 'iluminacion', 39990, 22, 10),
  product('p-rot-020', 'Rotomartillo Inalámbrico de Torque 20V', 'ROT-020', 'herramientas', 129990, 6, 4),
  product('p-cin-048', 'Cinta de Embalaje Industrial 48mm x 100m', 'CIN-048', 'embalaje', 2490, 300, 50),
  product('p-gat-003', 'Gato Hidráulico 3 Ton', 'GAT-003', 'herramientas', 54990, 0, 3),
  product('p-bro-010', 'Set de Brocas Escalonadas 10 piezas', 'BRO-010', 'herramientas', 9840, 18, 6),
  product('p-gen-001', 'Generador Eléctrico Monofásico de Inducción', 'GEN-001', 'electricidad', 459990, 3, 2),
  product('p-lla-012', 'Llave de Torque 1/2"', 'LLA-012', 'herramientas', 42990, 9, 3),
  service('s-ser-e01', 'Servicio de Instalación Eléctrica Domiciliaria', 'SER-E01', 'instalaciones', 65000, {
    duration: 'Media jornada', ageRestriction: 18, description: 'Instalación de enchufes, luminarias y tableros con certificación SEC.',
    offer: offer(49900, ago(6 * DAY), ahead(25 * DAY)),
  }),
  service('s-ser-c12', 'Asesoría Técnica de Climatización (por hora)', 'SER-C12', 'climatizacion', 25000, {
    unit: 'Por hora', duration: '1 hora', modality: 'remoto',
    offer: offer(19990, ago(10 * DAY), ahead(50 * DAY)),
  }),
  service('s-ser-m01', 'Mantenimiento Preventivo de Generadores', 'SER-M01', 'mantencion', 85000, { duration: '2 horas', ageRestriction: 18 }),
];

const line = (itemId, name, quantity, unitPrice, kind = 'producto') => ({ itemId, name, quantity, unitPrice, kind });
const address = (street, commune, region) => ({ street, commune, region });

export const initialOrders = [
  { id: 'TM-9082', createdAt: ago(95 * MIN), buyer: { name: 'Distribuidora Andes', type: 'Empresa / Rut Frecuente' }, status: 'Recibido', address: address('Av. Vicuña Mackenna 1234', 'Santiago', 'Metropolitana de Santiago'), items: [line('p-her-091', 'Caja de Herramientas Premium Pro', 3, 45990), line('p-tal-042', 'Taladro Percutor Inalámbrico 18V', 1, 89990)], shipping: null },
  { id: 'TM-9081', createdAt: ago(4 * HOUR), buyer: { name: 'Construcciones Lautaro SpA', type: 'Cliente Corporativo' }, status: 'En preparación', address: address('Los Carrera 455', 'Concepción', 'Biobío'), items: [line('p-esc-502', 'Escalera de Aluminio Tijera 5 Peldaños', 2, 32400), line('p-bro-010', 'Set de Brocas Escalonadas 10 piezas', 5, 9840)], shipping: null },
  { id: 'TM-9080', createdAt: ago(5 * HOUR), buyer: { name: "Inmobiliaria O'Higgins", type: 'Corporativo' }, status: 'Recibido', address: address('Av. Brasil 120', 'Rancagua', "Libertador General Bernardo O'Higgins"), items: [line('p-gen-001', 'Generador Eléctrico Monofásico de Inducción', 1, 459990)], shipping: null },
  { id: 'TM-9079', createdAt: ago(DAY + 3 * HOUR), buyer: { name: 'Carlos Mendoza', type: 'Particular / Boleta' }, status: 'Enviado', address: address('Pasaje Los Olmos 88', 'Maipú', 'Metropolitana de Santiago'), items: [line('p-amp-102', 'Pack 10 Ampolletas LED Inteligentes', 1, 18500)], shipping: { method: 'estandar', cost: 3990, carrier: 'Starken', tracking: '981245563' } },
  { id: 'TM-9077', createdAt: ago(DAY + 8 * HOUR), buyer: { name: 'Hogar y Jardín Limitada', type: 'Empresa' }, status: 'En preparación', address: address('Camino Real 2200', 'Puente Alto', 'Metropolitana de Santiago'), items: [line('p-sie-012', 'Sierra Circular de Mano 1200W', 1, 74990)], shipping: null },
  { id: 'TM-9075', createdAt: ago(3 * DAY), buyer: { name: 'Taller Mecánico Central', type: 'Ferretería Afiliada' }, status: 'Entregado', address: address('Av. Matta 640', 'Santiago', 'Metropolitana de Santiago'), items: [line('p-gat-003', 'Gato Hidráulico 3 Ton', 1, 54990), line('p-lla-012', 'Llave de Torque 1/2"', 1, 42990)], shipping: { method: 'express', cost: 7990, carrier: 'Chilexpress', tracking: '7720 4419 2231' } },
  { id: 'TM-9070', createdAt: ago(4 * DAY), buyer: { name: 'Ingeniería Civil Lautaro', type: 'Socio Comercial' }, status: 'Entregado', address: address('Av. Alemania 0671', 'Temuco', 'La Araucanía'), items: [line('s-ser-c12', 'Asesoría Técnica de Climatización (por hora)', 4, 25000, 'servicio')], shipping: null },
  { id: 'TM-9068', createdAt: ago(6 * DAY), buyer: { name: 'Ferretería Central SpA', type: 'Socio Minorista' }, status: 'Entregado', address: address('Freire 1020', 'Valparaíso', 'Valparaíso'), items: [line('p-rot-020', 'Rotomartillo Inalámbrico de Torque 20V', 1, 129990)], shipping: { method: 'estandar', cost: 6990, carrier: 'Blue Express', tracking: 'BX48120375' } },
  { id: 'TM-9066', createdAt: ago(8 * DAY), buyer: { name: 'Constructora El Arrayán', type: 'Corporativo' }, status: 'Entregado', address: address('Av. Kennedy 9001', 'Las Condes', 'Metropolitana de Santiago'), items: [line('p-foc-150', 'Foco LED Industrial 150W High Bay', 10, 39990)], shipping: { method: 'estandar', cost: 3990, carrier: 'Blue Express', tracking: 'BX48120998' } },
  { id: 'TM-9063', createdAt: ago(12 * DAY), buyer: { name: 'Pedro G. Torres', type: 'Cliente Particular' }, status: 'Entregado', address: address('Los Aromos 33', 'La Florida', 'Metropolitana de Santiago'), items: [line('p-cin-048', 'Cinta de Embalaje Industrial 48mm x 100m', 4, 2490)], shipping: { method: 'estandar', cost: 3990, carrier: 'Blue Express', tracking: 'BX47933410' } },
  { id: 'TM-9055', createdAt: ago(20 * DAY), buyer: { name: 'Constructora del Maule Ltda.', type: 'Empresa' }, status: 'Entregado', address: address('1 Sur 1450', 'Talca', 'Maule'), items: [line('s-ser-e01', 'Servicio de Instalación Eléctrica Domiciliaria', 1, 65000, 'servicio')], shipping: null },
  { id: 'TM-9050', createdAt: ago(25 * DAY), buyer: { name: 'Ferretería San Juan', type: 'Cliente Frecuente (Pyme)' }, status: 'Entregado', address: address('San Martín 500', 'Rancagua', "Libertador General Bernardo O'Higgins"), items: [line('p-foc-150', 'Foco LED Industrial 150W High Bay', 20, 39990)], shipping: { method: 'estandar', cost: 6990, carrier: 'Blue Express', tracking: 'BX47561207' } },
  { id: 'TM-9045', createdAt: ago(31 * DAY), buyer: { name: 'Taller Mecánico Express', type: 'Pyme' }, status: 'Entregado', address: address('Av. Independencia 2100', 'Independencia', 'Metropolitana de Santiago'), items: [line('p-lla-012', 'Llave de Torque 1/2"', 2, 42990)], shipping: { method: 'estandar', cost: 3990, carrier: 'Blue Express', tracking: 'BX47012566' } },
];

const qItem = (itemId, name, sku, quantity, unitPrice, stock) => ({ productId: itemId, name, detail: `SKU: ${sku}`, quantity, unitPrice, stock });

// Cotizaciones recibidas (solo productos). status: Solicitada | Respondida | Aceptada | Rechazada ("Expirada" se deduce de la fecha).
export const initialQuotations = [
  { id: 'COT-2045', createdAt: ago(2 * HOUR), buyer: { name: 'Constructora del Maule Ltda.', type: 'Empresa' }, status: 'Solicitada', items: [qItem('p-gen-001', 'Generador Eléctrico Monofásico de Inducción', 'GEN-001', 2, 459990, 3)], message: 'Necesitamos dos generadores para una faena en Talca. ¿Incluyen garantía y manual en español?', reply: null },
  { id: 'COT-2044', createdAt: ago(5 * HOUR), buyer: { name: 'Ferretería San Juan', type: 'Pyme' }, status: 'Solicitada', items: [qItem('p-foc-150', 'Foco LED Industrial 150W High Bay', 'FOC-150', 50, 39990, 22)], message: 'Cotizamos 50 focos para bodega. ¿Pueden despachar a Rancagua?', reply: null },
  { id: 'COT-2041', createdAt: ago(DAY + 2 * HOUR), buyer: { name: "Inmobiliaria O'Higgins", type: 'Corporativo' }, status: 'Respondida', items: [qItem('p-esc-502', 'Escalera de Aluminio Tijera 5 Peldaños', 'ESC-502', 6, 32400, 8), qItem('p-rot-020', 'Rotomartillo Inalámbrico de Torque 20V', 'ROT-020', 2, 129990, 6)], message: '', reply: { text: 'Confirmamos stock y precios. El despacho a Rancagua demora 2 días hábiles.', attachment: null, at: ago(20 * HOUR) } },
  { id: 'COT-2039', createdAt: ago(3 * DAY), buyer: { name: 'Hogar y Jardín Limitada', type: 'Empresa' }, status: 'Aceptada', items: [qItem('p-her-091', 'Caja de Herramientas Premium Pro', 'HER-091', 10, 45990, 15)], message: 'Para regalo corporativo de fin de año.', reply: { text: 'Gracias, tenemos disponibilidad para despacho inmediato.', attachment: null, at: ago(2 * DAY + 20 * HOUR) } },
  { id: 'COT-2035', createdAt: ago(6 * DAY), buyer: { name: 'Andrea Rojas', type: 'Persona' }, status: 'Rechazada', items: [qItem('p-tal-042', 'Taladro Percutor Inalámbrico 18V', 'TAL-042', 1, 89990, 2), qItem('p-bro-010', 'Set de Brocas Escalonadas 10 piezas', 'BRO-010', 2, 9840, 18)], message: '', reply: { text: 'Precios vigentes del catálogo. Quedamos atentos.', attachment: null, at: ago(5 * DAY) } },
  { id: 'COT-2030', createdAt: ago(20 * DAY), buyer: { name: 'Taller Mecánico Express', type: 'Pyme' }, status: 'Solicitada', items: [qItem('p-gat-003', 'Gato Hidráulico 3 Ton', 'GAT-003', 2, 54990, 0)], message: '', reply: null },
];

export const initialQuestions = [
  { id: 'PREG-8041', askedAt: ago(10 * MIN), buyer: { name: 'Carlos Mendoza', type: 'Ferretería Maipú (Pyme)' }, itemId: 'p-foc-150', product: 'Foco LED Industrial 150W High Bay', text: '¿Tienen disponibilidad de despacho inmediato para 50 unidades de ampolletas LED industriales? ¿Vienen con algún certificado de garantía?', answer: null },
  { id: 'PREG-8039', askedAt: ago(2 * HOUR), buyer: { name: "Inmobiliaria O'Higgins", type: 'Corporativo' }, itemId: 'p-gen-001', product: 'Generador Eléctrico Monofásico de Inducción', text: '¿El motor de inducción monofásico incluye cable de conexión a tierra de fábrica y switch térmico de seguridad?', answer: null },
  { id: 'PREG-8036', askedAt: ago(2 * DAY + 6 * HOUR), buyer: { name: 'Daniela Soto', type: 'Cliente Particular' }, itemId: 'p-esc-502', product: 'Escalera de Aluminio Tijera 5 Peldaños', text: '¿Cuál es la carga máxima que soporta la escalera?', answer: null },
  { id: 'PREG-8032', askedAt: ago(DAY + HOUR), buyer: { name: 'Ferretería Central SpA', type: 'Socio Minorista' }, itemId: 'p-rot-020', product: 'Rotomartillo Inalámbrico de Torque 20V', text: 'Estimados, ¿el kit de herramientas de torque inalámbrico incluye maletín rígido protector o caja de cartón estándar?', answer: { text: 'Hola estimad@, el kit incluye un maletín rígido protector de alta densidad de color negro, además de dos baterías de repuesto y cargador rápido.', at: ago(DAY) } },
  { id: 'PREG-8028', askedAt: ago(3 * DAY), buyer: { name: 'Eduardo Pérez', type: 'Cliente Particular' }, itemId: 'p-cin-048', product: 'Cinta de Embalaje Industrial 48mm x 100m', text: 'Hola, quería saber si venden por cajas cerradas de 36 unidades y si hacen envíos a regiones por pagar a través de Starken.', answer: { text: 'Sí Eduardo, contamos con formato caja de 36 unidades con un descuento preferencial del 10%. Realizamos despachos a todo Chile por Starken o Chilexpress por pagar.', at: ago(3 * DAY - 2 * HOUR) } },
  { id: 'PREG-8020', askedAt: ago(5 * DAY), buyer: { name: 'Taller Mecánico Central', type: 'Ferretería Afiliada' }, itemId: 'p-lla-012', product: 'Llave de Torque 1/2"', text: '¿La llave viene calibrada de fábrica?', answer: { text: 'Sí, cada llave incluye su certificado de calibración de fábrica.', at: ago(5 * DAY - 3 * HOUR) } },
];

export const initialReturns = [
  { id: 'DEV-9051', createdAt: ago(25 * MIN), buyer: { name: 'Ferretería San Juan', type: 'Cliente Frecuente (Pyme)' }, orderId: 'TM-9050', product: 'Foco LED Industrial 150W High Bay', reason: 'El producto presenta una falla en el encendido tras 2 horas de uso continuo. Se solicita cambio o reembolso.', status: 'Pendiente', resolution: null },
  { id: 'DEV-9048', createdAt: ago(18 * HOUR), buyer: { name: 'Constructora El Arrayán', type: 'Corporativo' }, orderId: 'TM-9066', product: 'Rotomartillo Inalámbrico de Torque 20V', reason: 'Caja llegó abierta y falta el cargador rápido de baterías indicado en la descripción de la compra.', status: 'Pendiente', resolution: null },
  { id: 'DEV-9039', createdAt: ago(3 * DAY), buyer: { name: 'Pedro G. Torres', type: 'Cliente Particular' }, orderId: 'TM-9063', product: 'Cinta de Embalaje Industrial 48mm x 100m', reason: 'Compré el tamaño equivocado por error de medida. El producto está sellado en su empaque original.', status: 'Aceptada', resolution: { comment: 'Hola Pedro, hemos aprobado tu solicitud. Procederemos con la devolución del dinero una vez recibido el producto de vuelta en nuestra bodega.', at: ago(2 * DAY) } },
  { id: 'DEV-9030', createdAt: ago(9 * DAY), buyer: { name: 'Taller Mecánico Central', type: 'Ferretería Afiliada' }, orderId: 'TM-9075', product: 'Gato Hidráulico 3 Ton', reason: 'El gato pierde presión después de varios usos.', status: 'Rechazada', resolution: { comment: 'Revisamos el equipo y presenta daño por sobrecarga (uso sobre 3 toneladas), que no cubre la garantía.', at: ago(7 * DAY) } },
];

// Calificaciones y reseñas que los clientes dejaron a la tienda y a sus productos o servicios (solo lectura para el emprendedor)
const review = (id, daysAgo, buyer, target, rating, comment, itemId = null) => ({ id, createdAt: ago(daysAgo * DAY + 3 * HOUR), buyer, target, itemId, rating, comment });
export const initialReviews = [
  review('RES-311', 1, 'Carlos Mendoza', 'Pack 10 Ampolletas LED Inteligentes', 5, 'Llegaron bien embaladas y funcionan perfecto con la aplicación.', 'p-amp-102'),
  review('RES-309', 2, 'Taller Mecánico Central', 'Tienda', 4, 'Buena atención y despacho rápido. El gato hidráulico llegó con un pequeño golpe en la caja.'),
  review('RES-305', 4, 'Ingeniería Civil Lautaro', 'Asesoría Técnica de Climatización (por hora)', 5, 'El técnico resolvió todas nuestras dudas sobre el sistema de ventilación de la obra.', 's-ser-c12'),
  review('RES-301', 6, 'Ferretería Central SpA', 'Rotomartillo Inalámbrico de Torque 20V', 4, 'Muy buena potencia; la batería dura menos de lo esperado.', 'p-rot-020'),
  review('RES-296', 8, 'Constructora El Arrayán', 'Foco LED Industrial 150W High Bay', 3, 'Iluminan bien, pero uno llegó sin el soporte de montaje.', 'p-foc-150'),
  review('RES-290', 12, 'Pedro G. Torres', 'Tienda', 5, 'Me ayudaron con el cambio de producto sin problemas.'),
  review('RES-284', 20, 'Constructora del Maule Ltda.', 'Servicio de Instalación Eléctrica Domiciliaria', 5, 'Trabajo limpio y con certificación SEC al día.', 's-ser-e01'),
  review('RES-277', 25, 'Ferretería San Juan', 'Tienda', 2, 'El despacho a Rancagua se atrasó una semana y nadie avisó.'),
  review('RES-270', 31, 'Taller Mecánico Express', 'Llave de Torque 1/2"', 5, 'Precisa y bien terminada.', 'p-lla-012'),
];

// Perfil del emprendedor y su empresa (requerimiento 1, 7 y 18)
export const initialProfile = {
  company: {
    name: 'Comercial SpA', rut: '76.123.456-0', email: 'contacto@comercialspa.cl', website: 'www.comercialspa.cl',
    phones: ['2 2345 6789', '9 8765 4321'],
    stores: [{ id: 'tienda-1', name: 'Casa matriz', street: 'Av. Matta', number: '1150', region: 'Metropolitana de Santiago', commune: 'Santiago' }],
    description: 'Ferretería e insumos eléctricos para empresas y particulares. Instalación y asesoría técnica.',
  },
  owner: {
    name: 'Juan Pérez González', run: '12.345.678-5', email: 'juan.perez@comercialspa.cl', phones: ['9 1234 5678'],
    address: { street: 'Los Alerces', number: '245', region: 'Metropolitana de Santiago', commune: 'Ñuñoa' },
  },
};

/** Último cambio de stock (para "Última actualización" del inventario). */
export const initialStockUpdatedAt = ago(3 * HOUR);

export const initialShippingRates = defaultShippingRates();
