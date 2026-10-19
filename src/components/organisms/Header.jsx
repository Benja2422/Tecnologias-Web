import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../atoms/PageContainer';
import AppLink from '../atoms/AppLink';
import Logo from '../atoms/Logo';
import SearchBar from '../molecules/SearchBar';
import HeaderActions from '../molecules/HeaderActions';
import CategoryNav from '../molecules/CategoryNav';
import { useCart } from '../../contexts/CartContext';

/**
 * Si no se pasan handlers, navega por defecto (perfil, favoritos, carrito, búsqueda).
 * Si no se pasa cartCount, muestra la cantidad de líneas del carrito compartido.
 */
export default function Header({ user, cartCount, searchQuery = '', onSearch, onFavorites, onCart, onLogout }) {
  const navigate = useNavigate();
  const cart = useCart();

  return (
    <Box component="header" sx={{ position: 'sticky', top: 0, zIndex: 10, bgcolor: '#fff' }}>
      <Box sx={{ borderBottom: '1px solid #EEE' }}>
        <PageContainer sx={{ height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 3 }}>
          <AppLink href="/" aria-label="Ir al inicio" underline="none" sx={{ display: 'flex' }}>
            <Logo size={22} />
          </AppLink>
          <Box sx={{ flex: '0 1 500px', minWidth: 0, display: { xs: 'none', md: 'block' } }}>
            <SearchBar
              defaultValue={searchQuery}
              onSearch={onSearch ?? ((q) => {
                if (!q) return;
                console.log('[Búsqueda] Buscar:', { query: q });
                navigate(`/buscar?q=${encodeURIComponent(q)}`);
              })}
            />
          </Box>
          <HeaderActions
            user={user}
            cartCount={cartCount ?? cart.count}
            onFavorites={onFavorites ?? (() => navigate('/lista-deseos'))}
            onCart={onCart ?? (() => navigate('/carrito'))}
            onLogout={onLogout}
          />
        </PageContainer>
      </Box>
      <Box sx={{ bgcolor: '#F9F9FA', borderBottom: '1px solid #EEE' }}>
        <PageContainer>
          <CategoryNav />
        </PageContainer>
      </Box>
    </Box>
  );
}
