// Servicios de ejemplo agrupados por categoría (pestaña "Servicios" del listado).
import { featuredServices } from './mockCatalog';
import { getCategoryScopeIds } from './mockCategories';

const categoryByServiceId = {
  s1: 'serv-otros',
  s2: 'serv-computacion-y-tecnologia',
  s3: 'serv-servicios-profesionales-computacion',
  s4: 'serv-servicios-domesticos-aseo',
};

const extra = [
  { id: 's5', name: 'Mantención de Jardines', rating: 4.6, price: 30000, categoryId: 'serv-servicios-domesticos-trabajo-de-jardin' },
  { id: 's6', name: 'Cuidado de Niños', rating: 4.8, price: 8000, priceSuffix: '/hr', categoryId: 'serv-servicios-domesticos-cuidado-de-ninos' },
  { id: 's7', name: 'Asesoría Legal', rating: 4.7, price: 60000, categoryId: 'serv-servicios-profesionales-abogados' },
  { id: 's8', name: 'Clases de Matemáticas', rating: 4.9, price: 12000, priceSuffix: '/hr', categoryId: 'serv-servicios-profesionales-servicios-educativos-clases-particulares' },
  { id: 's9', name: 'Consulta Kinesiológica', rating: 4.5, price: 25000, categoryId: 'serv-servicios-profesionales-servicio-de-salud-kinesiologia' },
  { id: 's10', name: 'Mecánica General', rating: 4.4, price: 40000, categoryId: 'serv-vehiculos' },
  { id: 's11', name: 'Banquetería para Eventos', rating: 4.8, price: 150000, categoryId: 'serv-servicio-de-banqueteria-reposteria-y-alimentacion-en-general' },
].map((s) => ({ image: null, ...s }));

const services = [
  ...featuredServices.map((s) => ({ ...s, categoryId: categoryByServiceId[s.id] ?? 'serv-otros' })),
  ...extra,
];

/** Servicios de una categoría (incluye sus subcategorías si es una categoría padre). */
export const getServicesByCategory = (categoryId) => {
  const ids = new Set(getCategoryScopeIds(categoryId));
  return services.filter((s) => ids.has(s.categoryId)).map((s) => ({ ...s, kind: 'servicio' }));
};

/** Todos los servicios como tarjetas (para el buscador). */
export const getAllServiceItems = () => services.map((s) => ({ ...s, kind: 'servicio', reviewCount: 0, keywords: '' }));
