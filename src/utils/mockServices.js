// Servicios de ejemplo agrupados por categoría (pestaña "Servicios" del listado).
import { featuredServices } from './mockCatalog';
import { getCategoryScopeIds } from './mockCategories';
import { applyOverride, createdOf, isPublic } from './catalogAdmin';

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

// Proveedor de cada servicio de ejemplo
const sellerByServiceId = {
  s1: 'Bienestar Activo', s2: 'ElectroFix Chile', s3: 'Estudio Creativo', s4: 'CleanPro SpA', s5: 'VerdeVivo SpA', s6: 'Cuidado Feliz',
  s7: 'Lex Asesorías', s8: 'Profe en Casa', s9: 'KineSalud', s10: 'Taller Mecánico Central', s11: 'Banquetería Doña Rosa',
};
const sellerOf = (id) => ({ id: (sellerByServiceId[id] ?? 'servicios').toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: sellerByServiceId[id] ?? 'Proveedor de servicios' });

const services = [
  ...featuredServices.map((s) => ({ ...s, categoryId: categoryByServiceId[s.id] ?? 'serv-otros' })),
  ...extra,
].map((s) => ({ ...s, seller: sellerOf(s.id) }));

// Catálogo vigente: el de ejemplo + lo creado por el administrador, con sus cambios (ver utils/catalogAdmin)
const allServices = () => [...services, ...createdOf('servicio').map((s) => ({ image: null, rating: 0, ...s }))].map((s) => applyOverride(`s:${s.id}`, s));
const publicServices = () => allServices().filter((s) => isPublic(`s:${s.id}`));

/** Todos los servicios, incluso suspendidos o dados de baja (panel de administración). */
export const getAdminServices = () => allServices();

/** Servicios de una categoría (incluye sus subcategorías si es una categoría padre). */
export const getServicesByCategory = (categoryId) => {
  const ids = new Set(getCategoryScopeIds(categoryId));
  return publicServices().filter((s) => ids.has(s.categoryId)).map((s) => ({ ...s, kind: 'servicio' }));
};

/** Todos los servicios como tarjetas (para el buscador). */
export const getAllServiceItems = () => publicServices().map((s) => ({ ...s, kind: 'servicio', reviewCount: 0, keywords: '' }));
