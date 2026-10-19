import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Box, InputAdornment } from '@mui/material';
import TextInput from '../atoms/TextInput';
import PrimaryButton from '../atoms/PrimaryButton';
import { formatThousands } from '../../utils/format';

const COMPACT = {
  '& .MuiOutlinedInput-root.MuiInputBase-root': { height: 40 },
  '& .MuiOutlinedInput-input.MuiInputBase-input': { height: 40, fontSize: 14, px: 0 },
};

const digits = (value) => value.replace(/\D/g, '').slice(0, 9);

/** Campo de precio: guarda solo dígitos y los muestra con puntos de miles mientras se escribe. */
function PriceField({ label, value, onChange }) {
  const inputRef = useRef(null);
  const caretDigits = useRef(null); // dígitos que había antes del cursor, para no saltar al final al reformatear
  const shown = formatThousands(value);

  useLayoutEffect(() => {
    if (caretDigits.current === null || !inputRef.current) return;
    let seen = 0;
    let pos = 0;
    while (pos < shown.length && seen < caretDigits.current) {
      if (shown[pos] !== '.') seen += 1;
      pos += 1;
    }
    inputRef.current.setSelectionRange(pos, pos);
    caretDigits.current = null;
  }, [shown]);

  return (
    <TextInput
      value={shown}
      onChange={(e) => {
        const { value: raw, selectionStart } = e.target;
        caretDigits.current = digits(raw.slice(0, selectionStart ?? raw.length)).length;
        onChange(digits(raw));
      }}
      placeholder={label}
      inputRef={inputRef}
      slotProps={{
        input: { startAdornment: <InputAdornment position="start" sx={{ '& p': { fontSize: 14, color: '#9A9A9A' } }}>$</InputAdornment> },
        htmlInput: { inputMode: 'numeric', 'aria-label': `Precio ${label.toLowerCase()}` },
      }}
      sx={COMPACT}
    />
  );
}

/** Rango de precio con botón "Aplicar". min / max: texto con dígitos ('' = sin límite). onApply({ min, max }). */
export default function PriceRangeFilter({ min, max, onApply }) {
  const [draftMin, setDraftMin] = useState(min);
  const [draftMax, setDraftMax] = useState(max);
  const [error, setError] = useState('');

  // Si cambia desde afuera (p. ej. "Limpiar"), el formulario se actualiza
  useEffect(() => { setDraftMin(min); setDraftMax(max); setError(''); }, [min, max]);

  const submit = (e) => {
    e.preventDefault();
    if (draftMin && draftMax && Number(draftMin) > Number(draftMax)) {
      setError('El máximo debe ser mayor o igual al mínimo');
      return;
    }
    setError('');
    onApply({ min: draftMin, max: draftMax });
  };

  return (
    <Box component="form" onSubmit={submit} noValidate>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
        <PriceField label="Mínimo" value={draftMin} onChange={setDraftMin} />
        <PriceField label="Máximo" value={draftMax} onChange={setDraftMax} />
      </Box>
      {error && <Box role="alert" sx={{ mt: 1, fontSize: 12, color: '#d32f2f' }}>{error}</Box>}
      <PrimaryButton
        type="submit"
        fullWidth={false}
        sx={{ mt: 2, minWidth: 76, height: 34, py: 0, px: 2.5, fontSize: 13 }}
      >
        Aplicar
      </PrimaryButton>
    </Box>
  );
}
