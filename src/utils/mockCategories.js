// Árbol de categorías según el enunciado (sección "Categorías"). Reemplazar por src/services cuando exista el backend.
// Cada categoría puede tener `children` a cualquier profundidad (categoría padre → subcategorías).
// El `id` es único en todo el árbol y se usa en la URL: /categorias/:categoryId.

// 2. Productos
export const productCategories = [
  {
    id: 'tecnologia',
    name: 'Tecnología',
    children: [
      { id: 'computacion', name: 'Computación' },
      { id: 'audio-y-musica', name: 'Audio y Música' },
      { id: 'juegos-y-consolas', name: 'Juegos y consolas' },
      { id: 'electronica-y-television', name: 'Electrónica y Televisión' },
      { id: 'otros-tecnologia', name: 'Otros' },
    ],
  },
  { id: 'celulares', name: 'Celulares' },
  { id: 'hogar', name: 'Hogar y Cocina' },
  { id: 'alimentacion', name: 'Alimentación' },
  { id: 'accesorios-para-vehiculos', name: 'Accesorios para vehículos' },
  { id: 'libros-e-instrumentos-musicales', name: 'Libros e instrumentos musicales' },
  { id: 'ropa-moda-y-calzado', name: 'Ropa, moda y calzado' },
  { id: 'juguetes-y-ninos', name: 'Juguetes y Niños' },
  { id: 'utiles-y-libreria', name: 'Útiles y librería' },
  { id: 'otros', name: 'Otros' },
];

// 1. Servicios (los ids se generan a partir del nombre; ver `withIds`)
const serviceNames = [
  ['Computación y Tecnología'],
  ['Servicios domésticos', [
    ['Aseo'],
    ['Trabajo de jardín'],
    ['Limpieza de combustión y reparaciones menores'],
    ['Cuidado de adultos'],
    ['Cuidado de niños'],
    ['Otros servicios domésticos'],
  ]],
  ['Servicios profesionales', [
    ['Computación'], // creación de páginas web, diseño, publicidad
    ['Abogados'],
    ['Contadores y Auditores'],
    ['Arquitecto'],
    ['Psicólogos'],
    ['Servicio de salud', [['Médico'], ['Dentista'], ['Enfermería'], ['Kinesiología'], ['Otros']]],
    ['Servicios educativos', [['Clases particulares'], ['Fonoaudiología'], ['Terapeuta Ocupacional'], ['Otros']]],
    ['Veterinarios'],
    ['Otros'],
  ]],
  ['Vehículos'], // reparación, pintura, compra venta, mecánica general, otros
  ['Confección de ropa y vestuario'],
  ['Servicio de banquetería, repostería y alimentación en general'],
  ['Otros'],
];

const slug = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const withIds = (entries, parentId = 'serv') =>
  entries.map(([name, children]) => {
    const id = `${parentId}-${slug(name)}`;
    return { id, name, ...(children && { children: withIds(children, id) }) };
  });

export const serviceCategories = withIds(serviceNames);

export const categoryTrees = { productos: productCategories, servicios: serviceCategories };

const index = new Map();
const walk = (nodes, type, path = []) =>
  nodes.forEach((category) => {
    const nodePath = [...path, category];
    index.set(category.id, { category, path: nodePath, type });
    if (category.children) walk(category.children, type, nodePath);
  });
Object.entries(categoryTrees).forEach(([type, nodes]) => walk(nodes, type));

export const getCategory = (id) => index.get(id)?.category ?? null;

/** 'productos' o 'servicios', según el árbol al que pertenece la categoría. */
export const getCategoryType = (id) => index.get(id)?.type ?? null;

/** Ruta desde la raíz hasta la categoría: [Tecnología, Computación]. */
export const getCategoryPath = (id) => index.get(id)?.path ?? [];

/** La categoría y todas sus descendientes (para listar una categoría padre completa). */
export const getCategoryScopeIds = (id) => {
  const collect = (category) => [category.id, ...(category.children ?? []).flatMap(collect)];
  const category = getCategory(id);
  return category ? collect(category) : [];
};

/** Primera categoría de cada árbol: destino al cambiar entre Productos y Servicios. */
export const getFirstCategoryId = (type) => categoryTrees[type]?.[0]?.id ?? null;
