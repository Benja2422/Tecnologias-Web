// Datos de ejemplo del perfil. Reemplazar por src/services cuando exista el backend.
export const mockProfile = {
  fullName: 'Juan Pérez',
  rut: '12.345.678-9',
  emails: [
    { id: 'e1', value: 'juan@email.com', type: 'Personal', isPrincipal: true },
    { id: 'e2', value: 'juan.trabajo@email.com', type: 'Trabajo', isPrincipal: false },
    { id: 'e3', value: 'juan.personal@email.com', type: 'Personal', isPrincipal: false },
  ],
  phones: [
    { id: 'p1', value: '+56 9 8490 3838', type: 'Móvil', isPrincipal: true },
    { id: 'p2', value: '+56 9 8765 4321', type: 'Trabajo', isPrincipal: false },
    { id: 'p3', value: '+56 2 2345 6789', type: 'Fijo', isPrincipal: false },
  ],
};
