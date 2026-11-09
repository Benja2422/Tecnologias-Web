import { AddressesProvider } from './AddressesContext';
import { CartProvider } from './CartContext';
import { CheckoutProvider } from './CheckoutContext';
import { MessagesProvider } from './MessagesContext';
import { QuotationsProvider } from './QuotationsContext';
import { ReviewsProvider } from './ReviewsContext';
import { SellerProvider } from './SellerContext';
import { WishlistProvider } from './WishlistContext';

/** Estado compartido de la app: carrito, direcciones, cotizaciones, checkout, mensajes, reseñas, lista de deseos y panel de emprendedor. */
export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <AddressesProvider>
        <QuotationsProvider>
          <CheckoutProvider>
            <MessagesProvider>
              <ReviewsProvider>
                <WishlistProvider>
                  <SellerProvider>{children}</SellerProvider>
                </WishlistProvider>
              </ReviewsProvider>
            </MessagesProvider>
          </CheckoutProvider>
        </QuotationsProvider>
      </AddressesProvider>
    </CartProvider>
  );
}
