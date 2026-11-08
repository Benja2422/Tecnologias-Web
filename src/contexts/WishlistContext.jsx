import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialWishlist } from '../utils/mockWishlist';

const STORAGE_KEY = 'todomart.wishlist';

// Sin proveedor, el contexto responde con una lista vacía (así los componentes no fallan en pruebas aisladas)
const WishlistContext = createContext({ items: [], count: 0, ids: new Set(), has: () => false, toggle: () => false, remove: () => {} });

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch { /* sin almacenamiento o datos dañados: se usa la lista de ejemplo */ }
  return initialWishlist;
};

/** Convierte un producto o servicio de cualquier listado en un ítem de la lista de deseos. */
export function toWishlistItem(item, kind) {
  const k = kind ?? item.kind ?? 'producto';
  return {
    id: item.id,
    kind: k,
    name: item.name,
    price: item.price,
    priceSuffix: item.priceSuffix ?? '',
    image: item.image ?? item.images?.[0]?.src ?? null,
    href: item.href ?? (k === 'producto' ? `/producto/${item.id}` : null),
    ...(item.seller && { seller: item.seller }),
  };
}

/**
 * Lista de deseos compartida por toda la app (corazones de los listados, ficha de producto y página "Lista de deseos").
 * Cada ítem: { id, kind, name, price, priceSuffix?, image, href, seller? }, el más reciente primero.
 * toggle(item) agrega o quita y devuelve true si quedó agregado. Se guarda en localStorage (solo es una comodidad).
 */
export function WishlistProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignorar */ }
  }, [items]);

  const ids = useMemo(() => new Set(items.map((i) => i.id)), [items]);

  // TODO: conectar con src/services
  const toggle = useCallback((item, kind) => {
    const adding = !ids.has(item.id);
    setItems((prev) => (prev.some((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [toWishlistItem(item, kind), ...prev]));
    return adding;
  }, [ids]);

  const remove = useCallback((id) => setItems((prev) => prev.filter((i) => i.id !== id)), []);
  const has = useCallback((id) => ids.has(id), [ids]);

  const value = useMemo(() => ({ items, count: items.length, ids, has, toggle, remove }), [items, ids, has, toggle, remove]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
