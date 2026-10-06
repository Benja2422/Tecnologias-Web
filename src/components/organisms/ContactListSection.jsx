import { useState } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProfileSection from '../molecules/ProfileSection';
import ContactRow from '../molecules/ContactRow';
import ContactDialog from '../molecules/ContactDialog';
import SecondaryButton from '../atoms/SecondaryButton';

// Garantiza que siempre exista un contacto principal
const ensurePrincipal = (list) =>
  list.length && !list.some((i) => i.isPrincipal)
    ? list.map((i, idx) => (idx === 0 ? { ...i, isPrincipal: true } : i))
    : list;

/** Lista editable de correos o teléfonos del perfil (agregar / editar / eliminar). */
export default function ContactListSection({
  title, icon, rowIcon, items, onChange, typeOptions, addLabel, valueLabel, placeholder,
  validate, normalize = (v) => v.trim(), errorMessage, inputProps, divider = true,
}) {
  const [dialog, setDialog] = useState(null); // null | { item: ContactItem | null }

  const submit = (form) => {
    const value = normalize(form.value);
    const editing = dialog.item;
    if (!value || !validate(value)) return errorMessage;
    if (items.some((i) => i.id !== editing?.id && i.value.toLowerCase() === value.toLowerCase())) {
      return 'Ya lo agregaste';
    }
    const isPrincipal = form.isPrincipal || items.length === 0;
    const saved = { id: editing?.id ?? crypto.randomUUID(), value, type: form.type, isPrincipal };

    let next = editing ? items.map((i) => (i.id === editing.id ? saved : i)) : [...items, saved];
    if (isPrincipal) next = next.map((i) => (i.id === saved.id ? i : { ...i, isPrincipal: false }));
    onChange(ensurePrincipal(next));
    setDialog(null);
    return null;
  };

  const remove = (id) => onChange(ensurePrincipal(items.filter((i) => i.id !== id)));

  const sorted = [...items].sort((a, b) => Number(b.isPrincipal) - Number(a.isPrincipal));

  return (
    <ProfileSection icon={icon} title={title} divider={divider}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mt: -1, borderTop: '1px solid transparent' }}>
        {sorted.map((item) => (
          <ContactRow
            key={item.id}
            item={item}
            icon={rowIcon}
            canDelete={items.length > 1}
            onEdit={() => setDialog({ item })}
            onDelete={() => remove(item.id)}
          />
        ))}
      </Box>
      <SecondaryButton startIcon={<AddIcon />} onClick={() => setDialog({ item: null })} sx={{ mt: 3 }}>
        {addLabel}
      </SecondaryButton>

      {dialog && (
        <ContactDialog
          key={dialog.item?.id ?? 'new'}
          title={dialog.item ? `Editar ${valueLabel.toLowerCase()}` : addLabel}
          valueLabel={valueLabel}
          placeholder={placeholder}
          typeOptions={typeOptions}
          initial={dialog.item}
          inputProps={inputProps}
          onSubmit={submit}
          onClose={() => setDialog(null)}
        />
      )}
    </ProfileSection>
  );
}
