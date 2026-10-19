export const SORT_OPTIONS = [
  { id: 'relevancia', name: 'Relevancia' },
  { id: 'precio-asc', name: 'Precio: menor a mayor' },
  { id: 'precio-desc', name: 'Precio: mayor a menor' },
  { id: 'calificacion', name: 'Mejor calificados' },
  { id: 'nombre', name: 'Nombre (A-Z)' },
];

export const DEFAULT_SORT = 'relevancia';

/** Devuelve una copia ordenada. "relevancia" conserva el orden original. */
export function sortItems(items, sortId) {
  const list = [...items];
  switch (sortId) {
    case 'precio-asc': return list.sort((a, b) => a.price - b.price);
    case 'precio-desc': return list.sort((a, b) => b.price - a.price);
    case 'calificacion': return list.sort((a, b) => b.rating - a.rating);
    case 'nombre': return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
    default: return list;
  }
}
