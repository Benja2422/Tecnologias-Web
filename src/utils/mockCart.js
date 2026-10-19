// Carrito de ejemplo con el que parte la app (mismo contenido que el diseño). Reemplazar por src/services.
import sonyNegro from '../assets/products/sony-wh1000xm5-negro.png';
import cable from '../assets/products/cart/cable-usbc-premium.png';
import limpieza from '../assets/products/cart/limpieza-profunda-hogar.png';
import alfombras from '../assets/products/cart/lavado-alfombras.png';
import planchado from '../assets/products/cart/planchado-lavado.png';

export { cable as cableImage, limpieza as limpiezaImage, alfombras as alfombrasImage, planchado as planchadoImage };

const techstore = { id: 'techstore', name: 'TechStore' };
const cleanpro = { id: 'cleanpro', name: 'CleanPro SpA' };

export const initialCart = [
  { lineId: 'sony-wh-1000xm5:negro', productId: 'sony-wh-1000xm5', kind: 'producto', name: 'Audífonos Sony WH-1000XM5', image: sonyNegro, detail: 'Color: Negro', unitPrice: 249990, quantity: 1, maxQuantity: 67, seller: techstore, href: '/producto/sony-wh-1000xm5' },
  { lineId: 'cable-usbc-premium-2m', productId: 'cable-usbc-premium-2m', kind: 'producto', name: 'Cable USB-C Premium 2m', image: cable, detail: 'Color: Gris', unitPrice: 12990, quantity: 2, maxQuantity: 40, seller: techstore, href: '/producto/cable-usbc-premium-2m' },
  { lineId: 'limpieza-profunda-hogar', productId: 'limpieza-profunda-hogar', kind: 'servicio', name: 'Limpieza Profunda de Hogar', image: limpieza, detail: 'Servicio a domicilio', unitPrice: 45000, quantity: 1, maxQuantity: 99, seller: cleanpro, href: null },
  { lineId: 'lavado-alfombras', productId: 'lavado-alfombras', kind: 'servicio', name: 'Lavado de Alfombras', image: alfombras, detail: 'Por metro cuadrado', unitPrice: 15000, quantity: 2, maxQuantity: 99, seller: cleanpro, href: null },
  { lineId: 'planchado-lavado', productId: 'planchado-lavado', kind: 'servicio', name: 'Planchado y Lavado', image: planchado, detail: 'Por hora', unitPrice: 16000, quantity: 1, maxQuantity: 99, seller: cleanpro, href: null },
];
