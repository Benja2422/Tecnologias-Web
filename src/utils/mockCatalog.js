// Datos de ejemplo. Reemplazar por llamadas a src/services cuando exista el backend.
// `image`: URL o import desde src/assets (si es null se muestra un placeholder).
export const featuredProducts = [
  { id: 'p1', name: 'Audífonos Bluetooth', rating: 4.5, price: 29990, image: null },
  { id: 'p2', name: 'Zapatillas Running', rating: 4.8, price: 45990, image: null },
  { id: 'p3', name: 'Mochila Urbana', rating: 4.2, price: 19990, image: null },
  { id: 'p4', name: 'Smartwatch Pro', rating: 4.6, price: 89990, image: null },
];

export const featuredServices = [
  { id: 's1', name: 'Clases de Yoga', rating: 4.9, price: 15000, priceSuffix: '/hr', image: null },
  { id: 's2', name: 'Reparación PC', rating: 4.7, price: 25000, image: null },
  { id: 's3', name: 'Diseño Gráfico', rating: 4.5, price: 35000, image: null },
  { id: 's4', name: 'Limpieza Hogar', rating: 4.8, price: 20000, image: null },
];

// roles: 'entrepreneur' y 'admin' habilitan los paneles en el menú del usuario
export const currentUser = {
  name: 'Juan Pérez',
  email: 'juan.perez@ejemplo.cl',
  roles: ['entrepreneur', 'admin'],
};
