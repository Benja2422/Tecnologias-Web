import { Box } from '@mui/material';
import CategoryAdminRow from '../molecules/CategoryAdminRow';
import { subtreeIds } from '../../utils/categoryTree';

/**
 * Árbol recursivo de categorías del administrador.
 * isExpanded(id) / onToggle(id): estado de cada rama. counts: Map(categoryId → publicaciones directas).
 * visible(id): false para ocultar ramas que no coinciden con la búsqueda.
 */
export default function CategoryAdminTree({ nodes, depth = 0, counts, isExpanded, onToggle, visible = () => true, onAdd, onEdit, onShift, onDelete }) {
  const shown = nodes.filter((n) => visible(n.id));
  if (!shown.length) return null;
  return (
    <Box component="ul" role={depth === 0 ? 'tree' : 'group'} aria-label={depth === 0 ? 'Árbol de categorías' : undefined} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {shown.map((node) => {
        const children = node.children ?? [];
        const expanded = children.length > 0 && isExpanded(node.id);
        const index = nodes.indexOf(node);
        const itemCount = subtreeIds(node).reduce((sum, id) => sum + (counts.get(id) ?? 0), 0);
        return (
          <Box component="li" key={node.id} role="treeitem" aria-expanded={children.length ? expanded : undefined} aria-label={node.name}>
            <CategoryAdminRow
              name={node.name}
              depth={depth}
              href={`/categorias/${node.id}`}
              expandable={children.length > 0}
              expanded={expanded}
              onToggle={() => onToggle(node.id)}
              childCount={children.length}
              itemCount={itemCount}
              first={index === 0}
              last={index === nodes.length - 1}
              onAdd={() => onAdd(node)}
              onEdit={() => onEdit(node)}
              onUp={() => onShift(node, -1)}
              onDown={() => onShift(node, 1)}
              onDelete={() => onDelete(node, itemCount)}
            />
            {expanded && (
              <CategoryAdminTree nodes={children} depth={depth + 1} {...{ counts, isExpanded, onToggle, visible, onAdd, onEdit, onShift, onDelete }} />
            )}
          </Box>
        );
      })}
    </Box>
  );
}
