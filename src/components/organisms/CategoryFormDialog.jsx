import { useState } from 'react';
import { Alert, Box, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, MenuItem, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormField from '../molecules/FormField';
import TextInput from '../atoms/TextInput';
import SelectInput from '../atoms/SelectInput';
import PrimaryButton from '../atoms/PrimaryButton';
import SecondaryButton from '../atoms/SecondaryButton';
import { childrenOf, flatten, nameTaken, subtreeIds } from '../../utils/categoryTree';
import { colors } from '../../utils/theme';

const ROOT = '__root__';
const MAX_NAME = 60;

/**
 * Modal para crear o editar una categoría (admin). Se monta solo cuando está abierto.
 * - category = null → crear (parentId sugiere el padre inicial; null = categoría principal)
 * - category = {...} → editar nombre y/o moverla a otro padre (con todo su subárbol)
 * tree: árbol del tipo actual. typeLabel: "productos" | "servicios".
 * onSave({ name, parentId }) puede lanzar un Error; el mensaje se muestra en el modal.
 */
export default function CategoryFormDialog({ tree, typeLabel, category = null, parentId = null, onSave, onClose }) {
  const isCreate = !category;
  const [name, setName] = useState(category?.name ?? '');
  const [parent, setParent] = useState(parentId ?? ROOT);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  // Una categoría no puede quedar dentro de sí misma ni de sus subcategorías
  const blocked = new Set(category ? subtreeIds(category) : []);
  const entries = flatten(tree).filter((e) => !blocked.has(e.node.id));
  const options = [
    { id: ROOT, name: 'Ninguna (categoría principal)' },
    ...entries.map((e) => ({ id: e.node.id, name: e.path.join(' › '), depth: e.depth, label: e.node.name })),
  ];

  const submit = (ev) => {
    ev.preventDefault();
    const clean = name.trim().replace(/\s+/g, ' ');
    const target = parent === ROOT ? null : parent;
    let message = '';
    if (clean.length < 2) message = 'Ingresa un nombre de al menos 2 caracteres.';
    else if (nameTaken(childrenOf(tree, target), clean, category?.id)) message = 'Ya existe una categoría con ese nombre en el mismo nivel.';
    setError(message);
    if (message) return;
    try {
      onSave({ name: clean, parentId: target });
    } catch (err) {
      setFormError(err?.message || 'No pudimos guardar la categoría.');
    }
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm" sx={{ '& .MuiPaper-root': { borderRadius: 3 } }} aria-labelledby="category-dialog-title">
      <Box component="form" onSubmit={submit} noValidate sx={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', pb: 1 }}>
          <Box>
            <Typography id="category-dialog-title" component="span" sx={{ display: 'block', fontSize: 20, fontWeight: 600, color: colors.ink }}>
              {isCreate ? 'Crear categoría' : 'Editar categoría'}
            </Typography>
            <Typography component="span" sx={{ display: 'block', fontSize: 13, color: colors.muted }}>
              {isCreate ? `Nueva categoría del árbol de ${typeLabel}` : `ID: ${category.id}`}
            </Typography>
          </Box>
          <IconButton aria-label="Cerrar" onClick={onClose} sx={{ mt: -0.5, mr: -1 }}><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: '#EEF0F2' }}>
          {formError && <Alert severity="error" sx={{ mb: 2 }}>{formError}</Alert>}
          <Box sx={{ display: 'grid', gap: 2.5, pt: 1 }}>
            <FormField label="Nombre" htmlFor="categoryName" error={error} hint={`${name.length}/${MAX_NAME} caracteres`}>
              <TextInput
                id="categoryName"
                autoFocus
                autoComplete="off"
                placeholder="Ej. Drones y cámaras"
                value={name}
                error={Boolean(error)}
                onChange={(e) => { setName(e.target.value.slice(0, MAX_NAME)); setError(''); }}
              />
            </FormField>
            <FormField
              label="Categoría padre"
              htmlFor="categoryParent"
              hint={isCreate ? 'Elige dónde ubicarla dentro del árbol.' : 'Si cambias el padre, la categoría se mueve con todas sus subcategorías y publicaciones.'}
            >
              <SelectInput
                id="categoryParent"
                options={options}
                value={parent}
                onChange={(e) => { setParent(e.target.value); setError(''); }}
                ariaLabel="Categoría padre"
              >
                {options.map((o) => (
                  <MenuItem key={o.id} value={o.id} sx={{ fontSize: 14.5, pl: 2 + (o.depth ?? 0) * 2.5, fontWeight: o.id === ROOT || o.depth === 0 ? 600 : 400 }}>
                    {o.label ?? o.name}
                  </MenuItem>
                ))}
              </SelectInput>
            </FormField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
          <SecondaryButton onClick={onClose} sx={{ height: 44 }}>Cancelar</SecondaryButton>
          <PrimaryButton type="submit" fullWidth={false} sx={{ height: 44, px: 3, py: 0, fontSize: 15 }}>
            {isCreate ? 'Crear categoría' : 'Guardar cambios'}
          </PrimaryButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
