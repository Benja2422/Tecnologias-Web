import { useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useParams } from 'react-router-dom';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import MainLayout from '../components/templates/MainLayout';
import PageContainer from '../components/atoms/PageContainer';
import PrimaryButton from '../components/atoms/PrimaryButton';
import Breadcrumb from '../components/molecules/Breadcrumb';
import ProductGallery from '../components/molecules/ProductGallery';
import ProductPurchasePanel from '../components/organisms/ProductPurchasePanel';
import ProductTabsSection from '../components/organisms/ProductTabsSection';
import RelatedProductsSection from '../components/organisms/RelatedProductsSection';
import { useCart } from '../contexts/CartContext';
import { toCartLine } from '../utils/cart';
import { currentUser } from '../utils/mockCatalog';
import { getProductById, getProductCategories, getRatingInfo, getRelatedProducts } from '../utils/mockProducts';
import { colors } from '../utils/theme';

function ProductNotFound() {
  return (
    <PageContainer sx={{ py: 10, textAlign: 'center' }}>
      <Typography component="h1" sx={{ fontSize: 28, fontWeight: 700, color: colors.text }}>Producto no encontrado</Typography>
      <Typography sx={{ mt: 1.5, mb: 4, color: colors.muted }}>Es posible que el producto ya no esté disponible.</Typography>
      <Box sx={{ maxWidth: 280, mx: 'auto' }}>
        <PrimaryButton component={RouterLink} to="/">Volver al inicio</PrimaryButton>
      </Box>
    </PageContainer>
  );
}

/** Contenido de la ficha. Se remonta (key) al cambiar de producto para reiniciar su estado. */
function ProductDetail({ product }) {
  const { rating, count } = getRatingInfo(product);
  const firstAvailable = product.variants?.find((v) => v.stock > 0) ?? product.variants?.[0];

  const [variantId, setVariantId] = useState(firstAvailable?.id ?? null);
  const [activeImageId, setActiveImageId] = useState(
    () => product.images.find((i) => i.variantId === firstAvailable?.id)?.id ?? product.images[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const { addItem } = useCart();
  const [questions, setQuestions] = useState(product.questions ?? []);
  const [toast, setToast] = useState('');

  const variant = product.variants?.find((v) => v.id === variantId) ?? null;
  const stock = variant ? variant.stock : product.stock ?? 0;

  // La miniatura del color elegido va primero; el resto conserva su orden
  const galleryImages = useMemo(() => {
    const first = product.images.find((i) => i.variantId === variantId);
    return first ? [first, ...product.images.filter((i) => i !== first)] : product.images;
  }, [product.images, variantId]);

  const chooseVariant = (id) => {
    setVariantId(id);
    setQuantity(1);
    const image = product.images.find((i) => i.variantId === id);
    if (image) setActiveImageId(image.id);
  };

  const chooseImage = (id) => {
    setActiveImageId(id);
    const image = product.images.find((i) => i.id === id);
    if (image?.variantId && image.variantId !== variantId) {
      setVariantId(image.variantId);
      setQuantity(1);
    }
  };

  // TODO: conectar con src/services (carrito, lista de deseos, preguntas)
  const addToCart = (item = product, qty = quantity, chosenVariant = variant) => {
    const line = {
      productId: item.id,
      name: item.name,
      variantId: chosenVariant?.id ?? null,
      variant: chosenVariant?.label ?? null,
      quantity: qty,
      unitPrice: item.price,
    };
    console.log('[Carrito] Añadir producto:', line);
    addItem(toCartLine(item, { quantity: qty, variant: chosenVariant, image: item === product ? galleryImages[0]?.src : undefined }));
    setToast(`${qty > 1 ? `${qty} unidades de ` : ''}${item.name} añadido al carrito`);
  };

  const toggleWishlist = () => {
    const next = !wishlisted;
    console.log(`[Lista de deseos] ${next ? 'Añadir' : 'Quitar'}:`, { productId: product.id, name: product.name });
    setWishlisted(next);
    setToast(next ? 'Añadido a tu lista de deseos' : 'Quitado de tu lista de deseos');
  };

  const askQuestion = (text) => {
    const entry = { id: `q-${Date.now()}`, question: text, answer: null };
    console.log('[Producto] Enviar pregunta:', { productId: product.id, question: text });
    setQuestions((list) => [entry, ...list]);
    setToast('Pregunta enviada. El vendedor la responderá pronto.');
  };

  const crumbs = [
    { label: 'Inicio', href: '/' },
    ...getProductCategories(product).map(({ id, name }) => ({ label: name, href: `/categorias/${id}` })),
    { label: product.name },
  ];

  return (
    <MainLayout headerProps={{ user: currentUser }}>
      <PageContainer sx={{ pt: 3, pb: { xs: 6, md: 10 } }}>
        <Breadcrumb items={crumbs} />

        <Box sx={{ mt: 4, display: 'grid', gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: '1fr', md: '7fr 8fr' }, alignItems: 'start' }}>
          <ProductGallery
            images={galleryImages}
            activeId={activeImageId}
            onSelect={chooseImage}
            placeholderLabel={product.imageLabel}
          />
          <ProductPurchasePanel
            product={product}
            rating={rating}
            reviewCount={count}
            variantId={variantId}
            onVariantChange={chooseVariant}
            quantity={quantity}
            onQuantityChange={setQuantity}
            stock={stock}
            isWishlisted={wishlisted}
            onToggleWishlist={toggleWishlist}
            onAddToCart={() => addToCart()}
            onOpenSeller={(seller) => console.log('[Producto] Ver vendedor:', seller)}
          />
        </Box>

        <Box sx={{ mt: { xs: 8, md: 10 } }}>
          <ProductTabsSection
            product={product}
            questions={questions}
            onAskQuestion={askQuestion}
            rating={rating}
            reviewCount={count}
          />
        </Box>

        <Box sx={{ mt: { xs: 8, md: 12 } }}>
          <RelatedProductsSection
            products={getRelatedProducts(product)}
            onAddToCart={(item) => addToCart(item, 1, null)}
          />
        </Box>
      </PageContainer>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </MainLayout>
  );
}

export default function ProductDetailPage() {
  const { productId } = useParams();
  const product = getProductById(productId);

  useEffect(() => { window.scrollTo(0, 0); }, [productId]);

  if (!product) {
    return (
      <MainLayout headerProps={{ user: currentUser }}>
        <ProductNotFound />
      </MainLayout>
    );
  }
  return <ProductDetail key={product.id} product={product} />;
}
