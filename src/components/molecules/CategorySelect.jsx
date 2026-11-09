import { MenuItem } from '@mui/material';
import SelectInput from '../atoms/SelectInput';
import { useCategories } from '../../contexts/CategoriesContext';
import { flatten } from '../../utils/categoryTree';

/**
 * Selector de categoría sobre el árbol que administra la plataforma (/admin/categorias).
 * type: 'productos' | 'servicios'. Muestra la jerarquía con sangría y, ya elegida, la ruta completa.
 */
export default function CategorySelect({ type, ...props }) {
  const { trees } = useCategories();
  const entries = flatten(trees[type] ?? []);
  const options = entries.map((e) => ({ id: e.node.id, name: e.path.join(' › ') }));
  return (
    <SelectInput options={options} {...props}>
      {entries.map((e) => (
        <MenuItem key={e.node.id} value={e.node.id} sx={{ fontSize: 14.5, pl: 2 + e.depth * 2.5, fontWeight: e.depth === 0 ? 600 : 400 }}>
          {e.node.name}
        </MenuItem>
      ))}
    </SelectInput>
  );
}
