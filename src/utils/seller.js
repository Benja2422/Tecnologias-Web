// Reglas y formatos del panel de emprendedor. Los precios incluyen IVA.
import { regions } from './chileDivisions';
import { getCategoryPath, getCategoryType } from './mockCategories';

/** Tienda con la que está trabajando el emprendedor (TODO: tomarla de la sesión en src/contexts). El nombre visible sale del perfil. */
export const SELLER = { id: 'comercial-spa', name: 'Comercial SpA', plan: 'Socio Pro', initials: 'CS' };

/**
 * Perfil con el formato actual: la empresa tiene una lista de tiendas físicas (vacía si vende solo en línea).
 * Convierte el formato anterior (hasStore + store).
 */
export function normalizeProfile(profile) {
  const company = { ...profile.company };
  if (!company.stores) company.stores = company.hasStore && company.store ? [{ id: 'tienda-1', name: '', ...company.store }] : [];
  delete company.hasStore;
  delete company.store;
  delete company.offers;
  return { ...profile, company };
}

/** Restricción de edad de los servicios (requerimiento 9). 0 = apto para todo público. */
export const AGE_RESTRICTIONS = [
  { id: 0, name: 'Sin restricción (todo público)' },
  { id: 14, name: 'Mayores de 14 años' },
  { id: 18, name: 'Solo mayores de 18 años' },
];
export const ageLabel = (age) => (age ? `+${age}` : 'Todo público');

// Categorías: los ítems guardan el id de una categoría del árbol que administra la plataforma (utils/mockCategories).
/** Categorías propias que usaba el panel antes de conectarse al árbol de la plataforma → categoría equivalente. */
export const LEGACY_CATEGORY = {
  herramientas: 'otros', iluminacion: 'hogar', construccion: 'hogar', electricidad: 'electronica-y-television', embalaje: 'utiles-y-libreria',
  instalaciones: 'serv-servicios-domesticos-limpieza-de-combustion-y-reparaciones-menores', climatizacion: 'serv-servicios-profesionales-otros',
  mantencion: 'serv-otros', asesorias: 'serv-servicios-profesionales-otros', capacitacion: 'serv-servicios-profesionales-servicios-educativos-otros',
};

export const SERVICE_MODALITIES = [
  { id: 'domicilio', name: 'A domicilio (Ubicación del cliente)' },
  { id: 'local', name: 'En el local del emprendedor' },
  { id: 'remoto', name: 'Remoto (en línea)' },
];

/** Árbol al que debe pertenecer la categoría de un ítem. */
export const categoryTypeOf = (item) => (item.kind === 'servicio' ? 'servicios' : 'productos');

/** ¿La categoría del ítem existe y es del árbol correcto? (el administrador pudo eliminarla o moverla). */
export const hasValidCategory = (item) => Boolean(item.category) && getCategoryType(item.category) === categoryTypeOf(item);

/** Nombre de la categoría para las tablas: la subcategoría elegida (o "Sin categoría" si ya no existe). */
export function categoryLabel(item) {
  return hasValidCategory(item) ? getCategoryPath(item.category).at(-1).name : 'Sin categoría';
}

/** Ruta completa: "Tecnología › Computación". */
export const categoryPathLabel = (item) => (hasValidCategory(item) ? getCategoryPath(item.category).map((c) => c.name).join(' › ') : 'Sin categoría');

/** Id de la categoría principal del ítem (para filtrar por categoría padre). */
export const categoryRootId = (item) => (hasValidCategory(item) ? getCategoryPath(item.category)[0].id : null);

// ---------- Catálogo e inventario ----------

/** Stock total de un producto (suma de sus variantes, si tiene). Los servicios no tienen stock. */
export const itemStock = (item) =>
  item.kind === 'servicio' ? null : item.variants?.length ? item.variants.reduce((s, v) => s + v.stock, 0) : item.stock;

/** Estado visible: Borrador (no publicado), Inactivo (producto sin stock: no se muestra en la tienda) o Activo. */
export function itemStatus(item) {
  if (item.suspended) return 'Suspendido';
  if (item.draft) return 'Borrador';
  if (item.kind === 'producto' && itemStock(item) === 0) return 'Inactivo';
  return 'Activo';
}

/** El enunciado alerta cuando una variante baja de 10 unidades: es el stock mínimo por defecto. */
export const CRITICAL_STOCK = 10;

/** Alerta de inventario: Bajo (bajo el mínimo), Límite alcanzado (igual al mínimo) o Suficiente. */
export function stockAlert(stock, minStock) {
  if (stock < minStock) return 'Bajo';
  if (stock === minStock) return 'Límite alcanzado';
  return 'Suficiente';
}

/** Filas del inventario: una por variante o, si el producto no tiene variantes, una por producto (sin servicios). */
export function inventoryRows(items) {
  return items
    .filter((it) => it.kind === 'producto' && !it.draft)
    .flatMap((it) =>
      it.variants?.length
        ? it.variants.map((v) => ({ key: `${it.id}:${v.sku}`, itemId: it.id, variantSku: v.sku, name: it.name, variant: v.attributes, sku: v.sku, stock: v.stock, minStock: v.minStock ?? it.minStock, image: it.images?.[0]?.src ?? null }))
        : [{ key: it.id, itemId: it.id, variantSku: null, name: it.name, variant: null, sku: it.sku, stock: it.stock, minStock: it.minStock, image: it.images?.[0]?.src ?? null }],
    );
}

// ---------- Ofertas ----------

const HOUR = 60 * 60 * 1000;

/** Estado de una oferta: Programada, Activa, Vence pronto (menos de 24 h) o Finalizada. */
export function offerStatus(offer, now = new Date()) {
  const start = new Date(offer.startsAt);
  const end = new Date(offer.endsAt);
  if (offer.endedAt || end <= now) return 'Finalizada';
  if (start > now) return 'Programada';
  if (end - now <= 24 * HOUR) return 'Vence pronto';
  return 'Activa';
}

/** "VENCE EN 8 HORAS" */
export function hoursLeft(offer, now = new Date()) {
  return Math.max(1, Math.ceil((new Date(offer.endsAt) - now) / HOUR));
}

// ---------- Pedidos ----------

/** Estados del pedido del enunciado (requerimiento 15). */
export const ORDER_STATUSES = ['Recibido', 'En preparación', 'Enviado', 'Entregado'];
/** Nombres anteriores, para convertir datos guardados en el navegador. */
export const LEGACY_ORDER_STATUS = { Confirmado: 'Recibido', Preparando: 'En preparación' };
/** Color de la etiqueta de cada estado de pedido. */
export const ORDER_TONE = { Recibido: 'blue', 'En preparación': 'orange', Enviado: 'red', Entregado: 'green', Anulado: 'grey' };
/** Pendientes de despacho: aún no salen de la tienda. */
export const isPendingDispatch = (o) => !o.cancelled && (o.status === 'Recibido' || o.status === 'En preparación');
/** Un pedido requiere despacho si tiene algún producto físico. */
export const needsShipping = (o) => o.items.some((i) => i.kind !== 'servicio');

/** Empresas de transporte para el seguimiento (requerimiento 20). */
export const CARRIERS = ['Chilexpress', 'Starken', 'Blue Express', 'Correos de Chile', 'Despacho propio'].map((c) => ({ id: c, name: c }));

export const orderSubtotal = (o) => o.items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

// ---------- Costos de envío por zona y peso (requerimiento 14) ----------

export const REGION_NAMES = regions.map((r) => r.name);
/** Comunas de una región (por nombre), ordenadas alfabéticamente. */
export const communesOf = (regionName) =>
  (regions.find((r) => r.name === regionName)?.provinces ?? []).flatMap((p) => p.communes.map((c) => c.name)).sort((a, b) => a.localeCompare(b, 'es'));

const FAR = ['Arica y Parinacota', 'Tarapacá', 'Antofagasta', 'Aysén del General Carlos Ibáñez del Campo', 'Magallanes y de la Antártica Chilena'];

/**
 * Tarifas de la tienda: precio estándar y express por región, excepciones por comuna, envío gratis y recargo por peso.
 * { regions: { [región]: { estandar, express } }, communes: [{ region, commune, estandar, express }], gratisDesde, kgIncluidos, porKgExtra }
 */
export function defaultShippingRates() {
  return {
    regions: Object.fromEntries(REGION_NAMES.map((r) => [r, r === 'Metropolitana de Santiago' ? { estandar: 3990, express: 7990 } : FAR.includes(r) ? { estandar: 9990, express: 15990 } : { estandar: 6990, express: 11990 }])),
    communes: [{ region: 'Metropolitana de Santiago', commune: 'Santiago', estandar: 2990, express: 5990 }],
    gratisDesde: 0,
    kgIncluidos: 5,
    porKgExtra: 500,
  };
}

/** Convierte las tarifas antiguas (RM / regiones) al formato por zona. */
export function migrateShippingRates(rates) {
  if (rates?.regions) return rates;
  const base = defaultShippingRates();
  if (!rates) return base;
  return {
    ...base,
    regions: Object.fromEntries(REGION_NAMES.map((r) => [r, r === 'Metropolitana de Santiago' ? { estandar: rates.estandarRM, express: rates.expressRM } : { estandar: rates.estandarRegiones, express: rates.expressRegiones }])),
    gratisDesde: rates.gratisDesde ?? 0,
  };
}

/** Peso total de un pedido (kg), según el peso de cada producto del catálogo. */
export function orderWeight(order, items) {
  return order.items.reduce((sum, line) => {
    if (line.kind === 'servicio') return sum;
    const item = items.find((i) => i.id === line.itemId);
    return sum + (Number(item?.weightKg) || 0) * line.quantity;
  }, 0);
}

/**
 * Cotiza un despacho. method: 'estandar' | 'express' | 'retiro'.
 * Devuelve { cost, base, zone ('comuna' | 'región'), extraKg, extraCost, free }.
 */
export function shippingQuote(rates, { method, region, commune, subtotal, weightKg = 0 }) {
  if (method === 'retiro') return { cost: 0, base: 0, zone: null, extraKg: 0, extraCost: 0, free: false };
  const byCommune = rates.communes.find((c) => c.region === region && c.commune === commune);
  const zoneRates = byCommune ?? rates.regions[region] ?? rates.regions['Metropolitana de Santiago'];
  const base = method === 'express' ? zoneRates.express : zoneRates.estandar;
  const extraKg = Math.max(0, Math.ceil(weightKg - rates.kgIncluidos));
  const extraCost = extraKg * rates.porKgExtra;
  const free = method === 'estandar' && rates.gratisDesde > 0 && subtotal >= rates.gratisDesde;
  return { cost: free ? 0 : base + extraCost, base, zone: byCommune ? 'comuna' : 'región', extraKg, extraCost, free };
}

export const shippingCost = (rates, args) => shippingQuote(rates, args).cost;

export const SHIPPING_METHODS = [
  { id: 'estandar', name: 'Envío estándar' },
  { id: 'express', name: 'Envío express' },
  { id: 'retiro', name: 'Retiro en tienda' },
];

// ---------- Fechas ----------

const two = (n) => String(n).padStart(2, '0');
const SHORT = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const daysBetween = (a, b) => Math.round((startOfDay(b) - startOfDay(a)) / 86400000);

/** "Hoy, 14:32" · "Ayer, 18:45" · "15 Ene, 09:30" */
export function formatWhen(iso, now = new Date()) {
  const d = new Date(iso);
  const time = `${two(d.getHours())}:${two(d.getMinutes())}`;
  const diff = daysBetween(d, now);
  if (diff <= 0) return `Hoy, ${time}`;
  if (diff === 1) return `Ayer, ${time}`;
  return `${d.getDate()} ${SHORT[d.getMonth()]}, ${time}`;
}

/** "Hace 10 min" · "Hace 2 horas" · "Ayer" · "Hace 3 días" */
export function timeAgo(iso, now = new Date()) {
  const mins = Math.max(0, Math.round((now - new Date(iso)) / 60000));
  if (mins < 60) return `Hace ${Math.max(1, mins)} min`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  const days = daysBetween(new Date(iso), now);
  if (days <= 1) return 'Ayer';
  return `Hace ${days} días`;
}

/** "01 Nov 2026" */
export const formatDay = (iso) => { const d = new Date(iso); return `${two(d.getDate())} ${SHORT[d.getMonth()]} ${d.getFullYear()}`; };

/** Valor para <input type="datetime-local"> en hora local: "2026-11-09T23:59" */
export const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}T${two(d.getHours())}:${two(d.getMinutes())}`;
};

/** Paginación simple de una lista. */
export function paginate(list, page, size) {
  const totalPages = Math.max(1, Math.ceil(list.length / size));
  const current = Math.min(Math.max(1, page), totalPages);
  const from = list.length === 0 ? 0 : (current - 1) * size + 1;
  const to = Math.min(current * size, list.length);
  return { page: current, rows: list.slice((current - 1) * size, current * size), from, to, total: list.length };
}

/** Normaliza un texto para buscar sin tildes ni mayúsculas. */
export const norm = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

/** Lee un monto escrito por el usuario ("$ 1.200.000" → 1200000). Devuelve NaN si no hay dígitos. */
export const parseAmount = (text = '') => {
  const digits = String(text).replace(/\D/g, '');
  return digits ? Number(digits) : NaN;
};
