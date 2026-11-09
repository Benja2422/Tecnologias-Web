import { useState } from 'react';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormField from '../molecules/FormField';
import SegmentedToggle from '../molecules/SegmentedToggle';
import CategorySelect from '../molecules/CategorySelect';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import { getCategoryType } from '../../utils/mockCategories';
import { formatThousands } from '../../utils/format';
import { parseAmount } from '../../utils/seller';
import { colors } from '../../utils/theme';

const KINDS = [{ id: 'producto', label: 'Producto' }, { id: 'servicio', label: 'Servicio' }];
const full = { gridColumn: '1 / -1' };

/**
 * Crear (row = null) o editar una publicación desde el panel de administración.
 * stores: tiendas para elegir al crear. onSave({ kind, seller, name, categoryId, price, stock }).
 */
export default function CatalogItemDialog({ row = null, stores, onSave, onClose }) {
  const isCreate = !row;
  const [kind, setKind] = useState(row?.kind ?? 'producto');
  const [values, setValues] = useState({
    seller: '', name: row?.name ?? '', categoryId: row?.categoryId ?? '',
    price: row ? formatThousands(String(row.basePrice)) : '', stock: row?.stock != null ? String(row.stock) : '',
  });
  const [errors, setErrors] = useState({});
  const type = kind === 'servicio' ? 'servicios' : 'productos';
  const stockEditable = kind === 'producto' && !row?.hasVariants;
  const validCategory = getCategoryType(values.categoryId) === type;

  const set = (k, fn = (v) => v) => (e) => { const v = fn(e.target.value); setValues((x) => ({ ...x, [k]: v })); setErrors((x) => ({ ...x, [k]: undefined })); };

  const submit = (e) => {
    e.preventDefault();
    const name = values.name.trim().replace(/\s+/g, ' ');
    const price = parseAmount(values.price);
    const stock = Number(values.stock);
    const err = {};
    if (isCreate && !values.seller) err.seller = 'Elige la tienda.';
    if (name.length < 3) err.name = 'Ingresa un nombre de al menos 3 caracteres.';
    if (!values.categoryId) err.categoryId = 'Elige una categoría.';
    else if (!validCategory) err.categoryId = 'Esa categoría ya no existe. Elige otra.';
    if (!Number.isFinite(price) || price <= 0) err.price = 'Ingresa un precio mayor a $0.';
    if (stockEditable && (values.stock === '' || !Number.isInteger(stock) || stock < 0)) err.stock = 'Ingresa un stock de 0 o más unidades.';
    setErrors(err);
    if (Object.keys(err).length) return;
    onSave({ kind, seller: values.seller, name, categoryId: values.categoryId, price, stock: stockEditable ? stock : null });
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }} aria-labelledby="catalog-dialog-title">
      <Box component="form" onSubmit={submit} noValidate>
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1 }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography id="catalog-dialog-title" component="span" sx={{ display: 'block', fontSize: 20, fontWeight: 600, color: colors.ink }}>
              {isCreate ? 'Crear publicación' : `Editar ${row.kind}`}
            </Typography>
            <Typography component="span" sx={{ display: 'block', fontSize: 13, color: colors.muted, overflowWrap: 'anywhere' }}>
              {isCreate ? 'Se publica de inmediato en la tienda elegida.' : `${row.seller} · ${row.sku}`}
            </Typography>
          </Box>
          <IconButton aria-label="Cerrar" onClick={onClose} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: '#EEF0F2' }}>
          {row?.source === 'panel' && <Alert severity="info" sx={{ mb: 2 }}>Esta publicación pertenece al panel del emprendedor: verá los cambios en su catálogo.</Alert>}
          <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'minmax(0, 1fr) minmax(0, 1fr)' }, pt: 1 }}>
            {isCreate && (
              <>
                <Box sx={full}>
                  <Typography sx={{ mb: 1, fontSize: 15, color: colors.muted }}>Tipo</Typography>
                  <Box sx={{ maxWidth: 280 }}>
                    <SegmentedToggle label="Tipo de publicación" options={KINDS} value={kind} onChange={(k) => { setKind(k); setValues((x) => ({ ...x, categoryId: '' })); }} />
                  </Box>
                </Box>
                <Box sx={full}>
                  <FormField label="Tienda" htmlFor="ci-seller" error={errors.seller}>
                    <SelectInput id="ci-seller" options={stores.map((n) => ({ id: n, name: n }))} value={values.seller} onChange={set('seller')} placeholder="Selecciona la tienda" ariaLabel="Tienda" error={Boolean(errors.seller)} />
                  </FormField>
                </Box>
              </>
            )}
            <Box sx={full}>
              <FormField label="Nombre" htmlFor="ci-name" error={errors.name}>
                <TextInput id="ci-name" autoFocus={!isCreate} value={values.name} onChange={set('name', (v) => v.slice(0, 120))} placeholder={kind === 'servicio' ? 'Ej. Clases de guitarra' : 'Ej. Hervidor eléctrico 1,7 L'} error={Boolean(errors.name)} />
              </FormField>
            </Box>
            <Box sx={full}>
              <FormField label="Categoría" htmlFor="ci-category" error={errors.categoryId}>
                <CategorySelect type={type} id="ci-category" value={validCategory ? values.categoryId : ''} onChange={set('categoryId')} placeholder="Selecciona una categoría" ariaLabel="Categoría" error={Boolean(errors.categoryId)} />
              </FormField>
            </Box>
            <Box sx={kind === 'producto' ? undefined : full}>
              <FormField label="Precio (con IVA)" htmlFor="ci-price" error={errors.price} hint={row?.originalPrice && row.source === 'panel' ? 'Precio normal; la oferta vigente no cambia.' : undefined}>
                <TextInput id="ci-price" prefix="$" inputProps={{ inputMode: 'numeric' }} value={values.price} onChange={set('price', (v) => formatThousands(v.replace(/\D/g, '').slice(0, 9)))} placeholder="0" error={Boolean(errors.price)} />
              </FormField>
            </Box>
            {kind === 'producto' && (
              <FormField label="Stock" htmlFor="ci-stock" error={errors.stock} hint={stockEditable ? undefined : 'Se maneja por variante (color, talla…): lo ajusta el emprendedor.'}>
                <TextInput id="ci-stock" disabled={!stockEditable} inputProps={{ inputMode: 'numeric' }} value={values.stock} onChange={set('stock', (v) => v.replace(/\D/g, '').slice(0, 6))} placeholder="0" error={Boolean(errors.stock)} />
              </FormField>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <SecondaryButton onClick={onClose} sx={{ height: 44 }}>Cancelar</SecondaryButton>
          <PrimaryButton type="submit" fullWidth={false} sx={{ height: 44, px: 3, py: 0, fontSize: 15 }}>{isCreate ? 'Crear publicación' : 'Guardar cambios'}</PrimaryButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
