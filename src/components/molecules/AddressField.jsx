import { useState } from 'react';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import CloseIcon from '@mui/icons-material/Close';
import TextInput from '../atoms/TextInput';
import AddButton from '../atoms/AddButton';
import AddressDialog from './AddressDialog';
import { colors } from '../../utils/theme';

export const formatAddress = (a) => `${a.street} ${a.number}, ${a.commune}, ${a.province}, ${a.region}`;

/**
 * Lista de direcciones + modal (AddressDialog) para agregar una.
 * Cada dirección guarda nombres e IDs de la base de datos:
 *   { id, street, number, regionId, region, provinceId, province, communeId, commune }
 * maxItems: al alcanzarlo se oculta el campo de ingreso (p. ej. 1 para "Dirección del local").
 */
export default function AddressField({ id, addresses, onChange, maxItems = Infinity }) {
  const [open, setOpen] = useState(false);
  const full = addresses.length >= maxItems;

  const openDialog = () => setOpen(true);
  const close = () => setOpen(false);
  const add = (address) => {
    onChange([...addresses, address]);
    close();
  };

  const remove = (addressId) => {
    console.log('[Dirección] Eliminar dirección:', addresses.find((a) => a.id === addressId));
    onChange(addresses.filter((a) => a.id !== addressId));
  };

  return (
    <>
      {addresses.length > 0 && (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, mb: full ? 0 : 1, border: `1px solid ${colors.border}`, borderRadius: 2 }}>
          {addresses.map((a, i) => (
            <Box
              component="li"
              key={a.id}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, minHeight: 50, px: 2, py: 0.5,
                borderBottom: i < addresses.length - 1 ? `1px solid ${colors.border}` : 'none',
              }}
            >
              <PlaceOutlinedIcon fontSize="small" sx={{ color: colors.muted }} />
              <Typography sx={{ flex: 1, fontSize: 15 }}>{formatAddress(a)}</Typography>
              <IconButton size="small" aria-label="Quitar dirección" onClick={() => remove(a.id)}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          ))}
        </Box>
      )}

      {!full && (
        <Stack direction="row" spacing={1}>
          <TextInput
            id={id}
            placeholder="Aún no has agregado una dirección"
            value=""
            onClick={openDialog}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDialog(); } }}
            InputProps={{
              readOnly: true,
              startAdornment: <PlaceOutlinedIcon fontSize="small" sx={{ color: colors.muted, mr: 1.2 }} />,
            }}
            inputProps={{ 'aria-label': 'Agregar dirección' }}
            sx={{ '& input': { cursor: 'pointer' } }}
          />
          <AddButton onClick={openDialog} />
        </Stack>
      )}

      {open && <AddressDialog onSubmit={add} onClose={close} />}
    </>
  );
}
