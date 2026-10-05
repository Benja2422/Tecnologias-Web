import { useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import AddButton from '../atoms/AddButton';
import Badge from '../atoms/Badge';
import FormField from './FormField';
import { colors } from '../../utils/theme';

/**
 * Lista editable de valores (correos, teléfonos).
 * - items: string[]
 * - markFirstAsPrimary: muestra "Principal" en el primero y permite elegir otro al hacer clic
 */
export default function ItemListInput({
  id,
  label,
  items,
  onChange,
  placeholder,
  icon,
  validate,
  normalize = (v) => v.trim(),
  errorMessage = 'Valor inválido',
  markFirstAsPrimary = false,
  error,
  inputProps,
}) {
  const [draft, setDraft] = useState('');
  const [localError, setLocalError] = useState('');

  const add = () => {
    const value = normalize(draft);
    if (!value) return;
    if (validate && !validate(value)) return setLocalError(errorMessage);
    if (items.some((i) => i.toLowerCase() === value.toLowerCase())) return setLocalError('Ya lo agregaste');
    onChange([...items, value]);
    setDraft('');
    setLocalError('');
  };

  const remove = (index) => onChange(items.filter((_, i) => i !== index));

  const makePrimary = (index) => {
    if (!markFirstAsPrimary || index === 0) return;
    onChange([items[index], ...items.filter((_, i) => i !== index)]);
  };

  return (
    <FormField label={label} htmlFor={id} error={error}>
      {items.length > 0 && (
        <Box
          component="ul"
          sx={{
            listStyle: 'none', m: 0, p: 0, mb: 1,
            border: `1px solid ${colors.border}`, borderRadius: 2,
            maxHeight: 150, overflowY: 'auto', bgcolor: '#fff',
          }}
        >
          {items.map((item, index) => (
            <Box
              component="li"
              key={item}
              onClick={() => makePrimary(index)}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, height: 50, px: 2,
                borderBottom: index < items.length - 1 ? `1px solid ${colors.border}` : 'none',
                cursor: markFirstAsPrimary && index > 0 ? 'pointer' : 'default',
                '&:hover': markFirstAsPrimary && index > 0 ? { bgcolor: '#FAFAFA' } : {},
              }}
              title={markFirstAsPrimary && index > 0 ? 'Hacer principal' : undefined}
            >
              <Box sx={{ display: 'flex', color: colors.muted }}>{icon}</Box>
              <Typography sx={{ flex: 1, fontSize: 15 }} noWrap>{item}</Typography>
              {markFirstAsPrimary && index === 0 && <Badge>Principal</Badge>}
              <IconButton
                size="small"
                aria-label={`Quitar ${item}`}
                onClick={(e) => { e.stopPropagation(); remove(index); }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      <Stack direction="row" spacing={1} alignItems="flex-start">
        <TextInput
          id={id}
          value={draft}
          placeholder={placeholder}
          onChange={(e) => { setDraft(e.target.value); setLocalError(''); }}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          error={localError}
          {...inputProps}
        />
        <AddButton onClick={add} />
      </Stack>
    </FormField>
  );
}
