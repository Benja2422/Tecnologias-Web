import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddressCard from '../molecules/AddressCard';
import AddressDialog from '../molecules/AddressDialog';
import ConfirmDialog from '../molecules/ConfirmDialog';
import { colors } from '../../utils/theme';
import { formatAddress } from '../molecules/AddressField';

// Garantiza que siempre exista una dirección principal
const ensurePrincipal = (list) =>
  list.length && !list.some((a) => a.isPrincipal)
    ? list.map((a, i) => (i === 0 ? { ...a, isPrincipal: true } : a))
    : list;

/**
 * "Mis direcciones": encabezado + botón Añadir + tarjetas con Editar / Eliminar.
 * addresses: [{ id, label?, isPrincipal, street, number, regionId, region, provinceId, province, communeId, commune }]
 * onChange(nextAddresses, message?) — message es el aviso a mostrar al usuario.
 */
export default function AddressBook({ addresses, onChange }) {
  const [dialog, setDialog] = useState(null); // null | { address: Address | null }  (null = crear)
  const [toDelete, setToDelete] = useState(null);

  const save = (address) => {
    const editing = dialog.address;
    let next = editing ? addresses.map((a) => (a.id === editing.id ? address : a)) : [...addresses, address];
    // Solo una dirección principal: si esta lo es, las demás dejan de serlo
    if (address.isPrincipal) next = next.map((a) => (a.id === address.id ? a : { ...a, isPrincipal: false }));
    onChange(ensurePrincipal(next), editing ? 'Dirección actualizada' : 'Dirección añadida');
    setDialog(null);
  };

  const confirmDelete = () => {
    // TODO: persistir con src/services
    console.log('[Dirección] Eliminar dirección:', toDelete);
    onChange(ensurePrincipal(addresses.filter((a) => a.id !== toDelete.id)), 'Dirección eliminada');
    setToDelete(null);
  };

  // La principal siempre va primero
  const sorted = [...addresses].sort((a, b) => Number(Boolean(b.isPrincipal)) - Number(Boolean(a.isPrincipal)));
  // La primera dirección que se crea, y la que ya es principal, no se pueden "desmarcar"
  const lockPrincipal = dialog ? (dialog.address ? Boolean(dialog.address.isPrincipal) : addresses.length === 0) : false;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', mb: 4 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: { xs: 28, md: 36 }, fontWeight: 600, color: colors.text }}>
            Mis direcciones
          </Typography>
          <Typography sx={{ mt: 1.5, fontSize: 16, color: colors.muted }}>
            Administra tus ubicaciones para despachos más rápidos
          </Typography>
        </Box>
        <Button
          variant="contained"
          disableElevation
          onClick={() => setDialog({ address: null })}
          sx={{ height: 48, px: 2.5, borderRadius: '8px', fontFamily: 'inherit', fontSize: 16, fontWeight: 600 }}
        >
          Añadir dirección
        </Button>
      </Box>

      {addresses.length === 0 ? (
        <Box sx={{ py: 8, textAlign: 'center', border: '1px dashed #D9D9D9', borderRadius: 3 }}>
          <Typography sx={{ fontSize: 16, color: colors.muted }}>Aún no tienes direcciones guardadas.</Typography>
        </Box>
      ) : (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 2.5 }}>
          {sorted.map((a) => (
            <li key={a.id}>
              <AddressCard address={a} onEdit={() => setDialog({ address: a })} onDelete={() => setToDelete(a)} />
            </li>
          ))}
        </Box>
      )}

      {dialog && (
        <AddressDialog
          key={dialog.address?.id ?? 'new'}
          initial={dialog.address}
          showPrincipal
          lockPrincipal={lockPrincipal}
          onSubmit={save}
          onClose={() => setDialog(null)}
        />
      )}

      {toDelete && (
        <ConfirmDialog
          title="Eliminar dirección"
          message={
            toDelete.isPrincipal && addresses.length > 1
              ? `¿Seguro que quieres eliminar "${formatAddress(toDelete)}"? Es tu dirección principal, así que la siguiente de la lista pasará a ser la principal.`
              : `¿Seguro que quieres eliminar "${formatAddress(toDelete)}"? Esta acción no se puede deshacer.`
          }
          confirmLabel="Eliminar"
          onConfirm={confirmDelete}
          onClose={() => setToDelete(null)}
        />
      )}
    </Box>
  );
}
