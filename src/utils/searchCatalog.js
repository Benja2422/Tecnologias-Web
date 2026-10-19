// Buscador de ejemplo sobre productos y servicios. Reemplazar por una llamada a src/services cuando exista el backend.
import { getAllProductItems } from './mockProducts';
import { getAllServiceItems } from './mockServices';
import { getCategoryPath } from './mockCategories';

/** Minúsculas y sin tildes: "Audífonos" → "audifonos". */
export const normalize = (text = '') =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const tokenize = (query) => normalize(query).split(/\s+/).filter(Boolean);

/**
 * Busca por nombre, palabras clave y nombres de categoría: cada palabra de la consulta debe aparecer.
 * Mantiene el orden original del catálogo: la relevancia real la calculará el backend.
 */
export function searchCatalog(query) {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  return [...getAllProductItems(), ...getAllServiceItems()]
    .map((item) => {
      const name = normalize(item.name);
      const rest = normalize(`${item.keywords} ${getCategoryPath(item.categoryId).map((c) => c.name).join(' ')}`);
      if (!tokens.every((t) => name.includes(t) || rest.includes(t))) return null;
      return item;
    })
    .filter(Boolean);
}
