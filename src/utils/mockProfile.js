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
  // Las direcciones guardan nombres e IDs de la base de datos (ver utils/chileDivisions.js)
  addresses: [
    { id: 'a1', label: 'Casa', isPrincipal: true, street: "Av. Libertador Bernardo O'Higgins", number: '1234', regionId: 13, region: 'Metropolitana de Santiago', provinceId: 131, province: 'Santiago', communeId: 13101, commune: 'Santiago' },
    { id: 'a2', label: 'Oficina', isPrincipal: false, street: 'Avenida Vitacura', number: '5432, Oficina 801', regionId: 13, region: 'Metropolitana de Santiago', provinceId: 131, province: 'Santiago', communeId: 13132, commune: 'Vitacura' },
    { id: 'a3', label: 'Casa de mamá', isPrincipal: false, street: 'Calle Las Lilas', number: '789', regionId: 13, region: 'Metropolitana de Santiago', provinceId: 131, province: 'Santiago', communeId: 13123, commune: 'Providencia' },
  ],
};
