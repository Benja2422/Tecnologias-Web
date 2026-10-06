/** Devuelve p. ej. [1, 2, 3, 'gap', 208]. 'gap' se muestra como "…". */
export function getPageItems(current, total) {
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

  const set = new Set([1, total, current - 1, current, current + 1]);
  if (current <= 2) set.add(3);
  if (current >= total - 1) set.add(total - 2);

  const pages = [...set].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  return pages.flatMap((p, i) => (i > 0 && p - pages[i - 1] > 1 ? ['gap', p] : [p]));
}
