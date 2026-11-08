import { AddressesProvider } from './AddressesContext';
import { CartProvider } from './CartContext';
import { CheckoutProvider } from './CheckoutContext';
import { MessagesProvider } from './MessagesContext';
import { ReviewsProvider } from './ReviewsContext';
import { WishlistProvider } from './WishlistContext';

/** Estado compartido de la app: carrito, direcciones, checkout, mensajes, reseñas y lista de deseos. */
export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <AddressesProvider>
        <CheckoutProvider>
          <MessagesProvider>
            <ReviewsProvider>
              <WishlistProvider>{children}</WishlistProvider>
            </ReviewsProvider>
          </MessagesProvider>
        </CheckoutProvider>
      </AddressesProvider>
    </CartProvider>
  );
}
