import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import CheckoutLayout from '../components/templates/CheckoutLayout';
import CheckoutSummary from '../components/organisms/CheckoutSummary';
import AddressOption from '../components/molecules/AddressOption';
import ShippingOption from '../components/molecules/ShippingOption';
import AddressDialog from '../components/molecules/AddressDialog';
import PrimaryButton from '../components/atoms/PrimaryButton';
import { useCart } from '../contexts/CartContext';
import { useAddresses } from '../contexts/AddressesContext';
import { useCheckout } from '../contexts/CheckoutContext';
import { SHIPPING_METHODS, calcTotals, getShippingMethod, needsShipping } from '../utils/cart';
import { getPrincipalPhone } from '../utils/mockProfile';
import { formatPrice } from '../utils/format';
import { colors } from '../utils/theme';


/** Paso 1 del checkout: dirección de despacho y método de envío (se compra de a un vendedor: ?vendedor=<id>). */
export default function CheckoutShippingPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const sellerId = params.get('vendedor');
  const { items } = useCart();
  const { addresses, saveAddress } = useAddresses();
  const { draft, startDraft, updateDraft } = useCheckout();
  const [dialog, setDialog] = useState(null); // null | { address: Address | null }
  const [error, setError] = useState('');

  const lines = items.filter((l) => l.seller.id === sellerId);
  const hasDraft = draft?.sellerId === sellerId;

  useEffect(() => {
    if (sellerId && lines.length > 0 && !hasDraft) startDraft(sellerId);
  }, [sellerId, lines.length, hasDraft, startDraft]);

  if (!sellerId || lines.length === 0) return <Navigate to="/carrito" replace />;
  if (!hasDraft) return null;

  const seller = lines[0].seller;
  const shippable = needsShipping(lines);
  const method = shippable ? getShippingMethod(draft.shippingId) : null;
  const totals = calcTotals(lines, method);
  const phone = getPrincipalPhone();
  const sorted = [...addresses].sort((a, b) => Number(Boolean(b.isPrincipal)) - Number(Boolean(a.isPrincipal)));
  const lockPrincipal = dialog ? (dialog.address ? Boolean(dialog.address.isPrincipal) : addresses.length === 0) : false;

  const saveFromDialog = (address) => {
    const creating = !dialog.address;
    saveAddress(address);
    if (creating || draft.addressId === address.id) updateDraft({ addressId: address.id });
    setError('');
    setDialog(null);
  };

  const next = () => {
    if (!draft.addressId || !addresses.some((a) => a.id === draft.addressId)) {
      setError('Selecciona una dirección para continuar.');
      return;
    }
    const address = addresses.find((a) => a.id === draft.addressId);
    console.log('[Checkout] Continuar a pago:', { sellerId, addressId: address.id, shippingId: method ? method.id : null, shipping: method ? method.price : 0, total: totals.total });
    navigate(`/checkout/pago?vendedor=${sellerId}`);
  };

  const aside = (
    <CheckoutSummary
      seller={seller}
      lines={lines}
      totals={totals}
      showShipping={shippable}
      shippingName={method?.name}
      shippingLabel={method ? (method.price === 0 ? 'Gratis' : formatPrice(method.price)) : ''}
    />
  );

  return (
    <CheckoutLayout step={1} aside={aside}>
      <Box component="section" aria-labelledby="dir-title">
        <Typography id="dir-title" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 20, fontWeight: 700, color: colors.text, mb: 2 }}>
          <PlaceOutlinedIcon aria-hidden sx={{ fontSize: 22 }} />
          {shippable ? 'Dirección de despacho' : 'Dirección del servicio'}
        </Typography>
        <Box role="radiogroup" aria-labelledby="dir-title" sx={{ display: 'grid', gap: 1.5 }}>
          {sorted.map((a) => (
            <AddressOption
              key={a.id}
              address={a}
              phone={phone}
              selected={draft.addressId === a.id}
              onSelect={() => { updateDraft({ addressId: a.id }); setError(''); }}
              onEdit={(address) => setDialog({ address })}
            />
          ))}
          <Button
            onClick={() => setDialog({ address: null })}
            startIcon={<AddIcon />}
            sx={{
              height: 56, borderRadius: 3, border: '1.5px dashed #C4C4C4', bgcolor: '#F9FAFB', color: colors.muted, fontFamily: 'inherit', fontSize: 15, fontWeight: 500, textTransform: 'none',
              '&:hover': { borderColor: colors.primary, color: colors.primary, bgcolor: 'transparent' },
            }}
          >
            Agregar nueva dirección
          </Button>
        </Box>
        {error && <Alert severity="error" role="alert" sx={{ mt: 2 }}>{error}</Alert>}
      </Box>

      {shippable && (
        <Box component="section" aria-labelledby="env-title" sx={{ mt: 5, pt: 5, borderTop: '1px solid #E5E7EB' }}>
          <Typography id="env-title" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 20, fontWeight: 700, color: colors.text, mb: 2 }}>
            <LocalShippingOutlinedIcon aria-hidden sx={{ fontSize: 22 }} />
            Método de envío
          </Typography>
          <Box role="radiogroup" aria-labelledby="env-title" sx={{ display: 'grid', gap: 1.5 }}>
            {SHIPPING_METHODS.map((m) => (
              <ShippingOption key={m.id} method={m} selected={draft.shippingId === m.id} onSelect={() => updateDraft({ shippingId: m.id })} />
            ))}
          </Box>
        </Box>
      )}

      <Box sx={{ mt: 5 }}>
        <PrimaryButton onClick={next} sx={{ height: 50, py: 0 }}>Continuar a pago</PrimaryButton>
      </Box>

      {dialog && (
        <AddressDialog
          key={dialog.address?.id ?? 'new'}
          initial={dialog.address}
          showPrincipal
          lockPrincipal={lockPrincipal}
          onSubmit={saveFromDialog}
          onClose={() => setDialog(null)}
        />
      )}
    </CheckoutLayout>
  );
}
