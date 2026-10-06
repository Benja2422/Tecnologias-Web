import { useState } from 'react';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ProfileSection from '../molecules/ProfileSection';
import ContactRow from '../molecules/ContactRow';
import ContactDialog from '../molecules/ContactDialog';
import SecondaryButton from '../atoms/SecondaryButton';

const newId = () => globalThis.crypto?.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Garantiza que siempre exista un contacto principal
const ensurePrincipal = (list) =>
  list.length && !list.some((i) => i.isPrincipal)
    ? list.map((i, idx) => (idx === 0 ? { ...i, isPrincipal: true } : i))
    : list;

/** Lista editable de correos o teléfonos del perfil (crear / editar / eliminar). */
export default function ContactListSection({
  title, icon, rowIcon, items, onChange, addLabel, valueLabel, placeholder,
  validate, normalize = (v) => v.trim(), errorMessage, inputProps, divider = true,
  prefix, formatDraft, toDraft,
}) {
  const [dialog, setDialog] = useState(null); // null | { item: ContactItem | null }  (null = crear)

  const submit = (form) => {
    const value = normalize(form.value);
    const editing = dialog.item;
    if (!value || !validate(value)) return errorMessage;
    if (items.some((i) => i.id !== editing?.id && i.value.toLowerCase() === value.toLowerCase())) {
      return 'Ya lo agregaste';
    }
    const isPrincipal = form.isPrincipal || items.length === 0;
    const saved = { id: editing?.id ?? newId(), value, isPrincipal };

    // TODO: persistir con src/services
    console.log(`[Perfil] ${editing ? 'Actualizar' : 'Crear'} - ${valueLabel}:`, saved);

    let next = editing ? items.map((i) => (i.id === editing.id ? saved : i)) : [...items, saved];
    if (isPrincipal) next = next.map((i) => (i.id === saved.id ? i : { ...i, isPrincipal: false }));
    onChange(ensurePrincipal(next));
    setDialog(null);
    return null;
  };

  const remove = (id) => {
    // TODO: persistir con src/services
    console.log(`[Perfil] Eliminar - ${valueLabel}:`, items.find((i) => i.id === id));
    onChange(ensurePrincipal(items.filter((i) => i.id !== id)));
  };

  const sorted = [...items].sort((a, b) => Number(b.isPrincipal) - Number(a.isPrincipal));

  return (
    <ProfileSection icon={icon} title={title} divider={divider}>
      <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mt: -1 }}>
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
          initial={dialog.item}
          prefix={prefix}
          formatDraft={formatDraft}
          toDraft={toDraft}
          inputProps={inputProps}
          onSubmit={submit}
          onClose={() => setDialog(null)}
        />
      )}
    </ProfileSection>
  );
}
