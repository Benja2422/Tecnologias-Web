import { useSyncExternalStore } from 'react';
import { getCategoryTrees, setCategoryTrees, subscribeCategories } from '../utils/mockCategories';

/**
 * Árbol de categorías vigente ({ productos, servicios }). Se vuelve a renderizar cuando el
 * administrador lo cambia. No necesita proveedor: el estado vive en utils/mockCategories.
 */
export function useCategories() {
  const trees = useSyncExternalStore(subscribeCategories, getCategoryTrees, getCategoryTrees);
  return { trees, saveTrees: setCategoryTrees };
}
