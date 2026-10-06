// Datos de ejemplo del perfil. Reemplazar por src/services cuando exista el backend.
export const mockProfile = {
  fullName: 'Juan Pérez',
  rut: '12.345.678-9',
  emails: [
    { id: 'e1', value: 'juan@email.com', isPrincipal: true },
    { id: 'e2', value: 'juan.trabajo@email.com', isPrincipal: false },
    { id: 'e3', value: 'juan.personal@email.com', isPrincipal: false },
  ],
  phones: [
    { id: 'p1', value: '+56 9 8490 3838', isPrincipal: true },
    { id: 'p2', value: '+56 9 8765 4321', isPrincipal: false },
    { id: 'p3', value: '+56 2 2345 6789', isPrincipal: false },
  ],
};
