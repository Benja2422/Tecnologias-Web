import { Box, InputAdornment } from '@mui/material';
import CreditCardOutlinedIcon from '@mui/icons-material/CreditCardOutlined';
import TextInput from '../atoms/TextInput';
import FormField from '../molecules/FormField';
import CheckboxField from '../molecules/CheckboxField';
import { formatCardNumber, formatCvv, formatExpiry } from '../../utils/cardValidators';
import { formatName } from '../../utils/validators';
import { colors } from '../../utils/theme';

/**
 * Datos de la tarjeta. Controlado: value = { number, expiry, cvv, holder, save }, errors = mismas claves.
 * onChange(patch) recibe solo los campos que cambian, ya formateados.
 */
export default function CardPaymentForm({ value, errors = {}, onChange }) {
  return (
    <Box sx={{ display: 'grid', gap: 2.5, mt: 2.5 }}>
      <FormField label="Número de tarjeta" htmlFor="card-number" error={errors.number}>
        <TextInput
          id="card-number"
          value={value.number}
          onChange={(e) => onChange({ number: formatCardNumber(e.target.value) })}
          placeholder="1234 5678 9012 3456"
          error={Boolean(errors.number)}
          autoComplete="cc-number"
          inputProps={{ inputMode: 'numeric', maxLength: 19 }}
          InputProps={{ startAdornment: <InputAdornment position="start"><CreditCardOutlinedIcon sx={{ color: colors.muted }} /></InputAdornment> }}
        />
      </FormField>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
        <FormField label="Fecha de vencimiento" htmlFor="card-expiry" error={errors.expiry}>
          <TextInput
            id="card-expiry"
            value={value.expiry}
            onChange={(e) => onChange({ expiry: formatExpiry(e.target.value) })}
            placeholder="MM/AA"
            error={Boolean(errors.expiry)}
            autoComplete="cc-exp"
            inputProps={{ inputMode: 'numeric', maxLength: 5 }}
          />
        </FormField>
        <FormField label="CVV" htmlFor="card-cvv" error={errors.cvv}>
          <TextInput
            id="card-cvv"
            type="password"
            value={value.cvv}
            onChange={(e) => onChange({ cvv: formatCvv(e.target.value) })}
            placeholder="123"
            error={Boolean(errors.cvv)}
            autoComplete="cc-csc"
            inputProps={{ inputMode: 'numeric', maxLength: 3 }}
          />
        </FormField>
      </Box>

      <FormField label="Nombre del titular" htmlFor="card-holder" error={errors.holder}>
        <TextInput
          id="card-holder"
          value={value.holder}
          onChange={(e) => onChange({ holder: formatName(e.target.value) })}
          placeholder="Como aparece en la tarjeta"
          error={Boolean(errors.holder)}
          autoComplete="cc-name"
        />
      </FormField>

      <CheckboxField
        label="Guardar tarjeta para futuras compras"
        checked={value.save}
        onChange={(save) => onChange({ save })}
        labelColor={colors.text}
        labelSize={15}
      />
    </Box>
  );
}
