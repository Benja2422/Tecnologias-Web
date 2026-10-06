// Datos de ejemplo (1.245 usuarios). Reemplazar por src/services cuando exista el backend.
import { cleanRut, formatRut } from './validators';

const FIRST = ['Alejandro', 'Carolina', 'Martín', 'Daniela', 'Esteban', 'Sofía', 'Felipe', 'Valentina', 'Matías', 'Camila', 'Ignacio', 'Francisca', 'Sebastián', 'Javiera', 'Nicolás', 'Constanza'];
const LAST = ['Silva', 'Fuentes', 'Carrasco', 'Oyarzún', 'Morales', 'Valenzuela', 'Rojas', 'Muñoz', 'Soto', 'Contreras', 'Pizarro', 'Vargas', 'Sepúlveda', 'Tapia', 'Araya', 'Núñez'];
const DOMAINS = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'ulagos.cl'];
const TYPES = ['Cliente', 'Cliente', 'Emprendedor', 'Cliente/Emprendedor'];

const slug = (t) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const pad = (n) => String(n).padStart(2, '0');

const checkDigit = (body) => {
  let sum = 0;
  let mul = 2;
  for (const d of String(body).split('').reverse()) {
    sum += Number(d) * mul;
    mul = mul === 7 ? 2 : mul + 1;
  }
  const r = 11 - (sum % 11);
  return r === 11 ? '0' : r === 10 ? 'K' : String(r);
};

const explicit = [
  { firstName: 'Alejandro', lastName: 'Silva', rut: '15.432.189-K', email: 'a.silva@outlook.com', accountType: 'Cliente', status: 'Activo', birthDate: '14/03/1988' },
  { firstName: 'Carolina', lastName: 'Fuentes', rut: '18.902.543-2', email: 'caro.fuentes@emprende.cl', accountType: 'Emprendedor', status: 'Activo', birthDate: '02/09/1992' },
  { firstName: 'Martín', lastName: 'Carrasco', rut: '12.765.890-4', email: 'martin.carrasco@gmail.com', accountType: 'Cliente/Emprendedor', status: 'Suspendido', birthDate: '21/11/1985' },
  { firstName: 'Daniela', lastName: 'Oyarzún', rut: '20.124.789-9', email: 'daniela.oyarzun@yahoo.com', accountType: 'Cliente', status: 'Activo', birthDate: '30/05/1999' },
  { firstName: 'Esteban', lastName: 'Morales', rut: '16.890.312-7', email: 'contacto@moralesdigital.cl', accountType: 'Emprendedor', status: 'Suspendido', birthDate: '08/01/1990' },
  { firstName: 'Sofía', lastName: 'Valenzuela', rut: '17.453.910-1', email: 'sofia.val@ambos.cl', accountType: 'Cliente/Emprendedor', status: 'Activo', birthDate: '17/07/1993' },
];

// Los RUT del diseño no tienen dígito verificador válido: se recalcula para que pasen la validación
const withValidRut = (u) => {
  const body = cleanRut(u.rut).slice(0, -1);
  return { ...u, rut: formatRut(`${body}${checkDigit(body)}`) };
};

export const mockUsers = Array.from({ length: 1245 }, (_, i) => {
  const id = `#${1000 + i}`;
  if (i < explicit.length) return { id, ...withValidRut(explicit[i]) };

  const firstName = FIRST[(i * 7) % FIRST.length];
  const lastName = LAST[(i * 5 + 3) % LAST.length];
  const body = 10_000_000 + ((i * 7919) % 12_000_000);
  return {
    id,
    firstName,
    lastName,
    rut: formatRut(`${body}${checkDigit(body)}`),
    email: `${slug(firstName)}.${slug(lastName)}${i}@${DOMAINS[i % DOMAINS.length]}`,
    accountType: TYPES[i % TYPES.length],
    status: i % 32 === 5 ? 'Suspendido' : 'Activo',
    birthDate: `${pad(1 + (i % 28))}/${pad(1 + (i % 12))}/${1960 + ((i * 3) % 40)}`,
  };
});

export const mockAdmin = { name: 'Admin_TodoMart', role: 'Super Administrador' };
