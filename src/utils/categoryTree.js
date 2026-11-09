// Operaciones puras sobre el árbol de categorías ([{ id, name, children? }]) para el panel de administración.
// Nunca modifican el árbol recibido: devuelven uno nuevo.

/** Minúsculas, sin tildes ni símbolos: "Hogar y Cocina" → "hogar-y-cocina". */
export const slugify = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const withChildren = (node, children) => {
  const { children: _old, ...rest } = node;
  void _old;
  return children.length ? { ...rest, children } : rest;
};

/** Lista plana en orden de lectura: [{ node, depth, parentId, path: [nombres] }]. */
export function flatten(nodes, depth = 0, parentId = null, path = []) {
  return nodes.flatMap((node) => [
    { node, depth, parentId, path: [...path, node.name] },
    ...flatten(node.children ?? [], depth + 1, node.id, [...path, node.name]),
  ]);
}

export const findNode = (nodes, id) => flatten(nodes).find((e) => e.node.id === id) ?? null;

/** Ids de la categoría y de todas sus descendientes. */
export const subtreeIds = (node) => [node.id, ...(node.children ?? []).flatMap(subtreeIds)];

/** Hijos directos de un padre (null = categorías principales). */
export const childrenOf = (nodes, parentId) => (parentId ? findNode(nodes, parentId)?.node.children ?? [] : nodes);

/** Profundidad máxima (1 = solo categorías principales). */
export const maxDepth = (nodes) => (nodes.length ? 1 + Math.max(...nodes.map((n) => maxDepth(n.children ?? []))) : 0);

/** Agrega `node` al final de los hijos de `parentId` (null = como categoría principal). */
export function insertNode(nodes, parentId, node) {
  if (!parentId) return [...nodes, node];
  return nodes.map((n) => (n.id === parentId ? withChildren(n, [...(n.children ?? []), node]) : n.children ? withChildren(n, insertNode(n.children, parentId, node)) : n));
}

/** Quita la categoría (con sus descendientes). */
export function removeNode(nodes, id) {
  return nodes.filter((n) => n.id !== id).map((n) => (n.children ? withChildren(n, removeNode(n.children, id)) : n));
}

/** Cambia el nombre (u otros datos) sin tocar sus subcategorías. */
export function updateNode(nodes, id, patch) {
  return nodes.map((n) => (n.id === id ? { ...n, ...patch } : n.children ? withChildren(n, updateNode(n.children, id, patch)) : n));
}

/** Mueve la categoría (con todo su subárbol) bajo otro padre, al final de la lista. */
export function moveNode(nodes, id, parentId) {
  const entry = findNode(nodes, id);
  if (!entry || entry.parentId === (parentId ?? null)) return nodes;
  if (parentId && subtreeIds(entry.node).includes(parentId)) throw new Error('Una categoría no puede quedar dentro de sí misma.');
  return insertNode(removeNode(nodes, id), parentId, entry.node);
}

/** Sube (-1) o baja (+1) una categoría entre sus hermanas. */
export function shiftNode(nodes, id, delta) {
  const i = nodes.findIndex((n) => n.id === id);
  if (i >= 0) {
    const j = i + delta;
    if (j < 0 || j >= nodes.length) return nodes;
    const next = [...nodes];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  }
  return nodes.map((n) => (n.children ? withChildren(n, shiftNode(n.children, id, delta)) : n));
}

/** Id nuevo y único en todos los árboles: prefijo del padre + nombre ("tecnologia-drones"). */
export function uniqueId(name, parentId, takenIds) {
  const base = [parentId, slugify(name) || 'categoria'].filter(Boolean).join('-');
  let id = base;
  for (let i = 2; takenIds.has(id); i += 1) id = `${base}-${i}`;
  return id;
}

const plain = (text) => slugify(text).replace(/-/g, ' ');
/** ¿Hay una hermana con el mismo nombre (sin distinguir mayúsculas ni tildes)? */
export const nameTaken = (siblings, name, ignoreId) => siblings.some((s) => s.id !== ignoreId && plain(s.name) === plain(name));

/** Ítems directos por categoría: Map(categoryId → cantidad). */
export function countByCategory(items) {
  const counts = new Map();
  items.forEach((it) => counts.set(it.categoryId, (counts.get(it.categoryId) ?? 0) + 1));
  return counts;
}
