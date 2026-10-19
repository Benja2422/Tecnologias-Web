// Pedido de ejemplo ya entregado (mismo contenido que el diseño). Reemplazar por src/services.
import sonyNegro from '../assets/products/sony-wh1000xm5-negro.png';
import { cableImage } from './mockCart';
import { mockProfile } from './mockProfile';
import { DEFAULT_SELLER, SHIPPING_METHODS, calcTotals } from './cart';

const at = (day, h, m) => new Date(2026, 8, day, h, m).toISOString();

const items = [
  { productId: 'sony-wh-1000xm5', kind: 'producto', name: 'Audífonos Sony WH-1000XM5', detail: 'Color: Negro', image: sonyNegro, quantity: 1, unitPrice: 249990, subtotal: 249990 },
  { productId: 'cable-usbc-premium-2m', kind: 'producto', name: 'Cable USB-C Premium 2m', detail: 'Color: Gris', image: cableImage, quantity: 2, unitPrice: 12990, subtotal: 25980 },
];
const standard = SHIPPING_METHODS.find((m) => m.id === 'estandar');

export const seedOrder = {
  id: 'TM-2024-00847',
  createdAt: at(21, 10, 30),
  status: 'activo',
  seller: DEFAULT_SELLER,
  recipient: mockProfile.fullName,
  phone: mockProfile.phones[0].value,
  items,
  shipping: { id: standard.id, name: standard.name, price: standard.price, eta: standard.eta },
  carrier: 'Chilexpress',
  tracking: 'CL-9876543210',
  address: { id: 'a-seed', street: 'Av. Providencia', number: '1234 Depto 501', commune: 'Providencia', province: 'Santiago', region: 'Metropolitana de Santiago' },
  estimatedDelivery: { from: at(25, 0, 0), to: at(28, 0, 0) },
  timeline: { confirmado: at(21, 10, 30), preparando: at(21, 14, 15), enviado: at(22, 9, 0), entregado: at(24, 16, 45) },
  totals: calcTotals(items.map((i) => ({ unitPrice: i.unitPrice, quantity: i.quantity })), standard),
  payment: { method: 'tarjeta', last4: '3456', holder: mockProfile.fullName, saved: true },
};
