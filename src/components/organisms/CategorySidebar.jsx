import { useEffect, useState } from 'react';
import { Box, ButtonBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SegmentedToggle from '../molecules/SegmentedToggle';
import CategoryTreeItem from '../molecules/CategoryTreeItem';
import { colors } from '../../utils/theme';

const TYPE_OPTIONS = [
  { id: 'productos', label: 'Productos' },
  { id: 'servicios', label: 'Servicios' },
];

function CategoryBranch({ category, level, activeId, getHref, isExpanded, toggle }) {
  const hasChildren = Boolean(category.children?.length);
  const expanded = hasChildren && isExpanded(category.id);
  return (
    <li>
      <CategoryTreeItem
        name={category.name}
        href={getHref(category.id)}
        level={level}
        active={activeId === category.id}
        expandable={hasChildren}
        expanded={expanded}
        onToggle={() => toggle(category.id)}
      />
      {expanded && (
        <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: '5px', p: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {category.children.map((child) => (
            <CategoryBranch key={child.id} category={child} level={level + 1} {...{ activeId, getHref, isExpanded, toggle }} />
          ))}
        </Box>
      )}
    </li>
  );
}

/**
 * Menú lateral de categorías: interruptor Productos/Servicios + árbol.
 * categories: [{ id, name, children? }] (árbol del tipo activo, con cualquier profundidad); getHref(id) devuelve el enlace de cada categoría.
 * La rama de la categoría activa se abre sola; las demás se abren con la flecha.
 */
export default function CategorySidebar({ categories, activeId, activePathIds = [], type, onTypeChange, getHref }) {
  const [overrides, setOverrides] = useState({}); // { [id]: boolean } elegido por la persona
  const [mobileOpen, setMobileOpen] = useState(false);

  // Al navegar a otra categoría, su rama vuelve a abrirse
  useEffect(() => {
    setOverrides((prev) => {
      const next = { ...prev };
      activePathIds.forEach((id) => delete next[id]);
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const isExpanded = (id) => overrides[id] ?? activePathIds.includes(id);
  const toggle = (id) => setOverrides((prev) => ({ ...prev, [id]: !isExpanded(id) }));

  return (
    <Box
      component="aside"
      aria-label="Categorías"
      sx={{ width: { xs: '100%', md: 280 }, flexShrink: 0, boxSizing: 'border-box', p: 3, bgcolor: '#F9FAFB', borderRight: { md: '1px solid #E5E7EB' }, borderBottom: { xs: '1px solid #E5E7EB', md: 'none' } }}
    >
      <SegmentedToggle label="Tipo de publicación" options={TYPE_OPTIONS} value={type} onChange={onTypeChange} />

      <ButtonBase
        onClick={() => setMobileOpen((o) => !o)}
        aria-expanded={mobileOpen}
        aria-controls="category-tree"
        sx={{ display: { xs: 'flex', md: 'none' }, gap: 1, mt: 2, fontFamily: 'inherit', fontSize: 14, fontWeight: 600, color: colors.ink }}
      >
        <MenuIcon sx={{ fontSize: 18 }} /> {mobileOpen ? 'Ocultar categorías' : 'Ver categorías'}
      </ButtonBase>

      <Box
        id="category-tree"
        component="ul"
        sx={{ listStyle: 'none', m: 0, mt: { xs: 1, md: '19px' }, p: 0, display: { xs: mobileOpen ? 'flex' : 'none', md: 'flex' }, flexDirection: 'column', gap: '5px' }}
      >
        {categories.map((category) => (
          <CategoryBranch key={category.id} category={category} level={0} {...{ activeId, getHref, isExpanded, toggle }} />
        ))}
      </Box>
    </Box>
  );
}
