import { useRef, useState } from 'react';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, Box, Button, Typography } from '@mui/material';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import CheckoutLayout from '../components/templates/CheckoutLayout';
import CheckoutSummary from '../components/organisms/CheckoutSummary';
import QuotationCheckoutSummary from '../components/organisms/QuotationCheckoutSummary';
import CardPaymentForm from '../components/organisms/CardPaymentForm';
import PaymentMethodOption from '../components/molecules/PaymentMethodOption';
import PrimaryButton from '../components/atoms/PrimaryButton';
import { useCart } from '../contexts/CartContext';
import { useAddresses } from '../contexts/AddressesContext';
import { useCheckout } from '../contexts/CheckoutContext';
import { useQuotations } from '../contexts/QuotationsContext';
import { quotationToLines, quoteTotals, stockIssues } from '../utils/quotations';
import { calcTotals, getShippingMethod, needsShipping } from '../utils/cart';
import { isValidCardNumber, isValidCvv, isValidExpiry, onlyDigits } from '../utils/cardValidators';
import { isValidName } from '../utils/validators';
import { formatPrice } from '../utils/format';
import { mockProfile } from '../utils/mockProfile';
import { colors } from '../utils/theme';

const EMPTY_CARD = { number: '', expiry: '', cvv: '', holder: '', save: true };

function validate(card) {
  const errors = {};
  if (!card.number) errors.number = 'Ingresa el número de tarjeta';
  else if (!isValidCardNumber(card.number)) errors.number = 'El número debe tener 16 dígitos';
  if (!card.expiry) errors.expiry = 'Ingresa la fecha de vencimiento';
  else if (!isValidExpiry(card.expiry)) errors.expiry = 'Fecha inválida o tarjeta vencida';
  if (!card.cvv) errors.cvv = 'Ingresa el CVV';
  else if (!isValidCvv(card.cvv)) errors.cvv = 'El CVV debe tener 3 dígitos';
  if (!card.holder.trim()) errors.holder = 'Ingresa el nombre del titular';
  else if (!isValidName(card.holder)) errors.holder = 'Ingresa un nombre válido';
  return errors;
}

/**
 * Paso 2 del checkout: medio de pago y confirmación de la compra.
 * Con ?cotizacion=<COT-…> se paga una cotización aceptada: si falta stock de algún producto no se puede pagar.
 */
export default function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const quotationId = params.get('cotizacion');
  const { getQuotation } = useQuotations();
  const quotation = quotationId ? getQuotation(quotationId) : null;
  const sellerId = quotation ? quotation.seller.id : params.get('vendedor');
  const { items } = useCart();
  const { addresses } = useAddresses();
  const { draft, placeOrder } = useCheckout();
  const [method, setMethod] = useState('tarjeta');
  const [card, setCard] = useState(EMPTY_CARD);
  const [errors, setErrors] = useState({});
  const placed = useRef(false); // al confirmar se vacían las líneas del vendedor: no debe redirigir al carrito

  const payable = !quotationId || (quotation && quotation.status === 'Aceptada' && !quotation.orderId);
  const lines = quotationId ? (payable && quotation ? quotationToLines(quotation) : []) : items.filter((l) => l.seller.id === sellerId);
  if (placed.current) return null;
  if (quotationId && !payable) return <Navigate to={quotation ? `/cotizaciones/${quotation.id}` : '/cotizaciones'} replace />;
  if (!sellerId || lines.length === 0) return <Navigate to="/carrito" replace />;
  const address = addresses.find((a) => a.id === draft?.addressId);
  const shippingUrl = quotation ? `/checkout/despacho?cotizacion=${quotation.id}` : `/checkout/despacho?vendedor=${sellerId}`;
  if (draft?.sellerId !== sellerId || (draft.quotationId ?? null) !== (quotation?.id ?? null) || !address) return <Navigate to={shippingUrl} replace />;

  const seller = lines[0].seller;
  const shippable = needsShipping(lines);
  const shipping = shippable ? getShippingMethod(draft.shippingId) : null;
  const totals = calcTotals(lines, shipping);
  const shortages = quotation ? stockIssues(lines) : []; // se paga solo si hay stock para toda la cotización
  const blocked = shortages.length > 0;
  const payTotal = quotation ? quoteTotals(lines).total + (shipping?.price ?? 0) : totals.total;

  const changeCard = (patch) => {
    setCard((c) => ({ ...c, ...patch }));
    setErrors((e) => {
      const next = { ...e };
      Object.keys(patch).forEach((k) => delete next[k]);
      return next;
    });
  };

  const confirm = (e) => {
    e.preventDefault();
    if (blocked) {
      console.log('[Checkout] Pago bloqueado por falta de stock:', { quotationId: quotation.id, productos: shortages.map((s) => ({ productId: s.productId, quantity: s.quantity, stock: s.stock })) });
      return;
    }
    let payment;
    if (method === 'tarjeta') {
      const found = validate(card);
      setErrors(found);
      if (Object.keys(found).length) return;
      // Nunca se guarda ni se registra el número completo ni el CVV
      payment = { method: 'tarjeta', last4: onlyDigits(card.number).slice(-4), holder: card.holder.trim(), saved: card.save };
    } else {
      payment = { method: 'transferencia' };
    }
    console.log('[Checkout] Confirmar compra:', {
      sellerId, quotationId: quotation?.id ?? null, addressId: address.id, shippingId: shipping ? shipping.id : null, payment, total: totals.total,
    });
    placed.current = true;
    const order = placeOrder(payment);
    if (order) navigate(`/checkout/confirmacion/${order.id}`, { replace: true });
    else placed.current = false;
  };

  const aside = quotation ? (
    <QuotationCheckoutSummary quotation={quotation} lines={lines} shippingName={shipping?.name} shippingPrice={shipping?.price ?? 0} />
  ) : (
    <CheckoutSummary
      seller={seller}
      lines={lines}
      totals={totals}
      showTax
      showShipping={shippable}
      shippingName={shipping?.name}
      shippingLabel={shipping ? (shipping.price === 0 ? 'Gratis' : formatPrice(shipping.price)) : ''}
    />
  );

  return (
    <CheckoutLayout
      step={2}
      aside={aside}
      quotation={quotation}
      notice={blocked && (
        <Alert severity="error" role="alert" sx={{ mt: 2 }}>
          {shortages.map((s) => `No puedes pagar: ${s.name}, cantidad ${s.quantity}, stock ${s.stock}.`).join(' ')} Vuelve a la cotización para revisar la disponibilidad con {seller.name}.
        </Alert>
      )}
    >
      <Box component="form" onSubmit={confirm} noValidate>
        <Typography id="pago-title" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, fontSize: 20, fontWeight: 700, color: colors.text, mb: 2 }}>
          <CreditCardOutlinedIcon aria-hidden sx={{ fontSize: 24 }} />
          Medio de pago
        </Typography>
        <Box role="radiogroup" aria-labelledby="pago-title" sx={{ display: 'grid', gap: 1.5 }}>
          <PaymentMethodOption value="tarjeta" title="Tarjeta de crédito o débito" icon={<CreditCardOutlinedIcon sx={{ fontSize: 22 }} />} selected={method === 'tarjeta'} onSelect={() => setMethod('tarjeta')}>
            <CardPaymentForm value={card} errors={errors} onChange={changeCard} />
          </PaymentMethodOption>
          <PaymentMethodOption
            value="transferencia"
            title="Transferencia bancaria"
            icon={<AccountBalanceOutlinedIcon sx={{ fontSize: 22 }} />}
            description="Recibirás los datos de transferencia al confirmar"
            selected={method === 'transferencia'}
            onSelect={() => setMethod('transferencia')}
          />
        </Box>

        <Box sx={{ mt: 4, p: 2.5, bgcolor: '#F3F4F6', borderRadius: 3, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.text }}>{shippable ? 'Dirección de envío' : 'Dirección del servicio'}</Typography>
            <Typography sx={{ mt: 1, fontSize: 14, fontWeight: 600, color: colors.text }}>{mockProfile.fullName}</Typography>
            <Typography sx={{ fontSize: 14, color: colors.muted, overflowWrap: 'anywhere' }}>
              {address.street} {address.number}, {address.commune}, {address.province}, {address.region}
            </Typography>
            {shipping && <Typography sx={{ fontSize: 14, color: colors.muted }}>{shipping.name} ({shipping.eta})</Typography>}
          </Box>
          <Button
            onClick={() => navigate(shippingUrl)}
            sx={{ minWidth: 0, p: 0, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', textDecoration: 'underline', color: colors.primary, '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' } }}
          >
            Cambiar
          </Button>
        </Box>

        <Box sx={{ mt: 4, display: 'grid', gap: 1.5 }}>
          {blocked && (
            <Button
              onClick={() => navigate(`/cotizaciones/${quotation.id}`)}
              variant="outlined"
              sx={{ height: 46, borderRadius: '8px', fontFamily: 'inherit', fontSize: 15, fontWeight: 600, textTransform: 'none', color: colors.primary, borderColor: colors.primary, '&:hover': { borderColor: colors.primaryDark, bgcolor: '#FDECEF' } }}
            >
              Volver a la cotización
            </Button>
          )}
          <PrimaryButton type="submit" disabled={blocked} sx={{ height: 50, py: 0 }}>{quotation ? `Pagar ${formatPrice(payTotal)}` : 'Confirmar compra'}</PrimaryButton>
        </Box>
        <Typography sx={{ mt: 2, fontSize: 13, color: colors.muted, textAlign: 'center' }}>
          Al confirmar, aceptas los <Box component="span" sx={{ color: colors.link }}>Términos y condiciones</Box> y la <Box component="span" sx={{ color: colors.link }}>Política de privacidad</Box>
        </Typography>
      </Box>
    </CheckoutLayout>
  );
}
