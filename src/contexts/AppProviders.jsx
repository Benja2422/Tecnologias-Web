import { AddressesProvider } from './AddressesContext';
import { CartProvider } from './CartContext';
import { CheckoutProvider } from './CheckoutContext';
import { MessagesProvider } from './MessagesContext';

/** Estado compartido de la app: carrito, direcciones, checkout y mensajes. */
export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <AddressesProvider>
        <CheckoutProvider>
          <MessagesProvider>{children}</MessagesProvider>
        </CheckoutProvider>
      </AddressesProvider>
    </CartProvider>
  );
}
