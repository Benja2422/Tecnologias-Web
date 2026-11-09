// Cambios del administrador sobre el catálogo público de la plataforma (productos y servicios de las tiendas).
// Se guardan en el navegador hasta que exista el backend; utils/mockProducts y utils/mockServices los aplican.
// Claves: "p:<id>" producto, "s:<id>" servicio.
const STORAGE_KEY = 'todomart.catalogAdmin';
const EMPTY = { overrides: {}, suspended: {}, deleted: [], created: [] };

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved.overrides === 'object' && Array.isArray(saved.deleted) && Array.isArray(saved.created)) return { ...EMPTY, ...saved };
  } catch { /* sin almacenamiento o datos dañados */ }
  return EMPTY;
};

let state = load();
const listeners = new Set();

/** Para useSyncExternalStore. */
export const subscribeCatalogAdmin = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
export const getCatalogAdminState = () => state;

/** Aplica un cambio (fn recibe y devuelve el estado), lo guarda y avisa a las vistas suscritas. */
export function updateCatalogAdmin(fn) {
  state = fn(state);
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* sin almacenamiento */ }
  listeners.forEach((l) => l());
}

/** Datos editados por el administrador (nombre, precio, stock, categoría) sobre el ítem original. */
export function applyOverride(key, item) {
  const next = { ...item, ...state.overrides[key] };
  if (next.originalPrice && next.originalPrice <= next.price) delete next.originalPrice; // ya no sería una rebaja
  return next;
}

export const suspensionOf = (key) => state.suspended[key] ?? null;
export const isRemoved = (key) => state.deleted.includes(key);
/** ¿Se muestra en la tienda? (no suspendido ni dado de baja) */
export const isPublic = (key) => !state.suspended[key] && !isRemoved(key);
/** Publicaciones creadas por el administrador ('producto' | 'servicio'). */
export const createdOf = (kind) => state.created.filter((c) => c.kind === kind);

/** Destacados del inicio con los cambios del administrador (sin los suspendidos ni dados de baja). */
export const liveFeatured = (list, prefix) =>
  list.filter((it) => isPublic(`${prefix}:${it.id}`)).map((it) => {
    const { name, price } = state.overrides[`${prefix}:${it.id}`] ?? {};
    return { ...it, ...(name && { name }), ...(price && { price }) };
  });
