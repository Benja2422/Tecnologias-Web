import { AddressesProvider } from './AddressesContext';
import { CartProvider } from './CartContext';
import { CheckoutProvider } from './CheckoutContext';

/** Estado compartido de la app: carrito, direcciones y checkout. */
export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <AddressesProvider>
        <CheckoutProvider>{children}</CheckoutProvider>
      </AddressesProvider>
    </CartProvider>
  );
}
