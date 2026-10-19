import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { initialCart } from '../utils/mockCart';
import { groupBySeller, sumLines } from '../utils/cart';

const STORAGE_KEY = 'todomart.cart';

// Sin proveedor, el contexto responde con un carrito vacío (así los componentes no fallan en pruebas aisladas)
const CartContext = createContext({
  items: [], count: 0, total: 0, groups: [],
  addItem: () => {}, setQuantity: () => {}, removeItem: () => {}, removeSeller: () => {}, clear: () => {},
});

const load = () => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch { /* sin almacenamiento o datos dañados: se usa el carrito de ejemplo */ }
  return initialCart;
};

/**
 * Carrito compartido por toda la app. Cada línea: { lineId, productId, kind, name, image, detail, unitPrice,
 * quantity, maxQuantity, seller: { id, name }, href }. Se guarda en localStorage (solo es una comodidad).
 * `count` es la cantidad de líneas (lo que muestra el ícono del carrito).
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(load);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* ignorar */ }
  }, [items]);

  // TODO: conectar con src/services
  const addItem = useCallback((line) => {
    setItems((prev) => {
      const existing = prev.find((l) => l.lineId === line.lineId);
      if (!existing) return [...prev, { ...line, quantity: Math.min(line.quantity, line.maxQuantity) }];
      return prev.map((l) => (l.lineId === line.lineId ? { ...l, quantity: Math.min(l.quantity + line.quantity, l.maxQuantity) } : l));
    });
  }, []);

  const setQuantity = useCallback((lineId, quantity) => {
    setItems((prev) => prev.map((l) => (l.lineId === lineId ? { ...l, quantity: Math.max(1, Math.min(quantity, l.maxQuantity)) } : l)));
  }, []);

  const removeItem = useCallback((lineId) => setItems((prev) => prev.filter((l) => l.lineId !== lineId)), []);
  const removeSeller = useCallback((sellerId) => setItems((prev) => prev.filter((l) => l.seller.id !== sellerId)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({ items, count: items.length, total: sumLines(items), groups: groupBySeller(items), addItem, setQuantity, removeItem, removeSeller, clear }),
    [items, addItem, setQuantity, removeItem, removeSeller, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
