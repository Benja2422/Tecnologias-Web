import { AddressesProvider } from './AddressesContext';
import { CartProvider } from './CartContext';
import { CheckoutProvider } from './CheckoutContext';
import { MessagesProvider } from './MessagesContext';
import { ModerationProvider } from './ModerationContext';
import { QuotationsProvider } from './QuotationsContext';
import { ReviewsProvider } from './ReviewsContext';
import { SellerProvider } from './SellerContext';
import { WishlistProvider } from './WishlistContext';

/** Estado compartido de la app: carrito, direcciones, cotizaciones, checkout, mensajes, reseñas, lista de deseos, panel de emprendedor y moderación. */
export default function AppProviders({ children }) {
  return (
    <CartProvider>
      <AddressesProvider>
        <QuotationsProvider>
          <CheckoutProvider>
            <MessagesProvider>
              <ReviewsProvider>
                <WishlistProvider>
                  <SellerProvider>
                    <ModerationProvider>{children}</ModerationProvider>
                  </SellerProvider>
                </WishlistProvider>
              </ReviewsProvider>
            </MessagesProvider>
          </CheckoutProvider>
        </QuotationsProvider>
      </AddressesProvider>
    </CartProvider>
  );
}
