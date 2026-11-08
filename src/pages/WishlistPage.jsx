import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Alert, Box, Button, Snackbar, Typography } from '@mui/material';
import AccountLayout from '../components/templates/AccountLayout';
import StatusFilterChips from '../components/molecules/StatusFilterChips';
import WishlistCard from '../components/molecules/WishlistCard';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { toCartLine } from '../utils/cart';
import { currentUser } from '../utils/mockCatalog';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const FILTERS = { Productos: 'producto', Servicios: 'servicio' };

/** "Lista de deseos": productos y servicios guardados, filtrables por tipo, con añadir al carrito y quitar de la lista. */
export default function WishlistPage() {
  const { items, remove } = useWishlist();
  const { addItem } = useCart();
  const [filter, setFilter] = useState(null); // null = Todos
  const [toast, setToast] = useState('');

  const visible = filter ? items.filter((i) => i.kind === FILTERS[filter]) : items;

  // TODO: conectar con src/services (carrito y lista de deseos)
  const addToCart = (item) => {
    const line = { ...toCartLine(item), href: item.href ?? null };
    console.log('[Lista de deseos] Añadir al carrito:', { id: item.id, name: item.name, tipo: item.kind, unitPrice: line.unitPrice });
    addItem(line);
    setToast(`${item.name} añadido al carrito`);
  };
  const removeFromList = (item) => {
    console.log('[Lista de deseos] Quitar:', { id: item.id, name: item.name, tipo: item.kind });
    remove(item.id);
    setToast(`${item.name} quitado de tu lista de deseos`);
  };

  return (
    <AccountLayout maxWidth={1600} showFooter headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 600, color: colors.text }}>Lista de deseos</Typography>
      <Typography role="status" sx={{ mt: 2.5, fontSize: 13, color: colors.muted }}>{items.length} {items.length === 1 ? 'artículo' : 'artículos'}</Typography>

      {items.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <StatusFilterChips options={Object.keys(FILTERS)} value={filter} onChange={setFilter} label="Filtrar por tipo" />
        </Box>
      )}

      {items.length === 0 ? (
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography sx={{ fontSize: 16, color: colors.muted }}>Tu lista de deseos está vacía.</Typography>
          <Button component={RouterLink} to="/" variant="contained" disableElevation sx={{ mt: 2.5, height: 42, px: 3, borderRadius: '8px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', bgcolor: colors.primary, '&:hover': { bgcolor: colors.primaryDark } }}>
            Explorar productos y servicios
          </Button>
        </Box>
      ) : visible.length === 0 ? (
        <Typography sx={{ mt: 6, textAlign: 'center', fontSize: 16, color: colors.muted }}>No tienes {filter?.toLowerCase()} en tu lista de deseos.</Typography>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 3, p: 0, display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' } }}>
          {visible.map((item) => (
            <Box component="li" key={item.id} sx={{ display: 'flex', '& > article': { flex: 1 } }}>
              <WishlistCard item={item} onAddToCart={addToCart} onRemove={removeFromList} />
            </Box>
          ))}
        </Box>
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AccountLayout>
  );
}
