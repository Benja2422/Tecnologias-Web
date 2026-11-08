import { AddressesProvider } from './AddressesContext';
import { CartProvider } from './CartContext';
import { CheckoutProvider } from './CheckoutContext';
import { MessagesProvider } from './MessagesContext';
import { QuotationsProvider } from './QuotationsContext';
import { ReviewsProvider } from './ReviewsContext';
import { WishlistProvider } from './WishlistContext';

/** Estado compartido de la app: carrito, direcciones, cotizaciones, checkout, mensajes, reseñas y lista de deseos. */
export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <AddressesProvider>
        <QuotationsProvider>
          <CheckoutProvider>
            <MessagesProvider>
              <ReviewsProvider>
                <WishlistProvider>{children}</WishlistProvider>
              </ReviewsProvider>
            </MessagesProvider>
          </CheckoutProvider>
        </QuotationsProvider>
      </AddressesProvider>
    </CartProvider>
  );
}
