import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MainLayout from '../components/templates/MainLayout';
import PageContainer from '../components/atoms/PageContainer';
import PrimaryButton from '../components/atoms/PrimaryButton';
import CartSellerGroup from '../components/organisms/CartSellerGroup';
import CartSummary from '../components/organisms/CartSummary';
import { useCart } from '../contexts/CartContext';
import { currentUser } from '../utils/mockCatalog';
import { colors } from '../utils/theme';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, count, total, groups, setQuantity, removeItem } = useCart();
  const [toast, setToast] = useState('');

  const changeQuantity = (line, quantity) => {
    console.log('[Carrito] Cambiar cantidad:', { lineId: line.lineId, name: line.name, quantity });
    setQuantity(line.lineId, quantity);
  };

  const remove = (line) => {
    console.log('[Carrito] Eliminar producto:', { lineId: line.lineId, name: line.name });
    removeItem(line.lineId);
    setToast(`${line.name} se quitó del carrito`);
  };

  // Se compra de a un vendedor
  const continueWith = (seller) => {
    const group = groups.find((g) => g.seller.id === seller.id);
    console.log('[Carrito] Continuar compra:', { sellerId: seller.id, seller: seller.name, items: group.items.map((l) => ({ productId: l.productId, quantity: l.quantity })), subtotal: group.subtotal });
    navigate(`/checkout/despacho?vendedor=${seller.id}`);
  };

  return (
    <MainLayout headerProps={{ user: currentUser }}>
      <PageContainer sx={{ pt: { xs: 4, md: 5 }, pb: { xs: 6, md: 10 } }}>
        <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, color: colors.text }}>
          Mi Carrito{count > 0 && ` (${count} ${count === 1 ? 'producto' : 'productos'})`}
        </Typography>

        {count === 0 ? (
          <Box sx={{ py: 10, display: 'grid', justifyItems: 'center', gap: 1.5, textAlign: 'center' }}>
            <ShoppingCartOutlinedIcon sx={{ fontSize: 56, color: '#C8C8C8' }} />
            <Typography component="h2" sx={{ fontSize: 20, fontWeight: 600, color: colors.text }}>Tu carrito está vacío</Typography>
            <Typography sx={{ color: colors.muted }}>Agrega productos para empezar tu compra.</Typography>
            <Box sx={{ mt: 1.5, minWidth: 240 }}><PrimaryButton component={RouterLink} to="/">Explorar productos</PrimaryButton></Box>
          </Box>
        ) : (
          <>
            {groups.length > 1 && (
              <Box
                role="status"
                sx={{
                  mt: 4, px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5,
                  bgcolor: '#FFFBEB', border: '1px solid #F2C14E', borderRadius: '4px', color: '#B45309', fontSize: 14,
                }}
              >
                <WarningAmberOutlinedIcon sx={{ fontSize: 22 }} />
                Tienes productos de más de un vendedor. Debes completar una compra por vendedor.
              </Box>
            )}

            <Box sx={{ mt: 4, display: 'grid', gap: 4, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1fr) 420px' } }}>
              <Box sx={{ display: 'grid', gap: 3, minWidth: 0 }}>
                {groups.map((g) => (
                  <CartSellerGroup
                    key={g.seller.id}
                    seller={g.seller}
                    items={g.items}
                    subtotal={g.subtotal}
                    onQuantityChange={changeQuantity}
                    onRemove={remove}
                    onContinue={continueWith}
                  />
                ))}
              </Box>
              <CartSummary count={items.length} total={total} />
            </Box>
          </>
        )}
      </PageContainer>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </MainLayout>
  );
}
