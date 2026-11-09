import { useMemo, useState, useSyncExternalStore } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, InputAdornment, Snackbar, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import AdminLayout from '../components/templates/AdminLayout';
import StatCard from '../components/molecules/StatCard';
import SegmentedToggle from '../components/molecules/SegmentedToggle';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import CategoryAdminTree from '../components/organisms/CategoryAdminTree';
import CategoryFormDialog from '../components/organisms/CategoryFormDialog';
import PrimaryButton from '../components/atoms/PrimaryButton';
import TextInput from '../components/atoms/TextInput';
import { useCategories } from '../contexts/CategoriesContext';
import { useSeller } from '../contexts/SellerContext';
import { getDefaultCategoryTrees } from '../utils/mockCategories';
import { getAdminProducts } from '../utils/mockProducts';
import { getAdminServices } from '../utils/mockServices';
import { getCatalogAdminState, isRemoved, subscribeCatalogAdmin } from '../utils/catalogAdmin';
import { countByCategory, findNode, flatten, insertNode, maxDepth, moveNode, removeNode, shiftNode, slugify, subtreeIds, uniqueId, updateNode } from '../utils/categoryTree';
import { downloadCsv } from '../utils/csv';
import { mockAdmin } from '../utils/mockUsers';
import { currentUser } from '../utils/mockCatalog';
import { colors } from '../utils/theme';

const CRUMBS = [{ label: 'Panel de Administración', href: '/admin' }, { label: 'Categorías' }];
const TYPES = [{ id: 'productos', label: 'Productos' }, { id: 'servicios', label: 'Servicios' }];
const toolBtn = {
  height: 34, px: 1.5, borderRadius: '6px', borderColor: '#D1D5DB', color: colors.ink, textTransform: 'none', fontFamily: 'inherit',
  fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', '& svg': { fontSize: 17 }, '&:hover': { borderColor: colors.ink, bgcolor: 'transparent' },
};
const n = (v) => v.toLocaleString('es-CL');
const plain = (t) => slugify(t).replace(/-/g, ' ');

/** Ids de las categorías que coinciden con la búsqueda, junto con sus ancestros y descendientes. */
function matchIds(nodes, q) {
  const set = new Set();
  const walk = (list, inherited) => list.reduce((any, node) => {
    const self = inherited || plain(node.name).includes(q);
    const below = walk(node.children ?? [], self);
    if (self || below) set.add(node.id);
    return any || self || below;
  }, false);
  walk(nodes, false);
  return set;
}

/** Gestión del árbol jerárquico de categorías de productos y servicios (crear, ver, editar, mover y eliminar). */
export default function AdminCategoriesPage() {
  const { trees, saveTrees } = useCategories();
  const [type, setType] = useState('productos');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(() => new Set([...trees.productos, ...trees.servicios].map((c) => c.id)));
  const [dialog, setDialog] = useState(null); // { category: node | null, parentId }
  const [deleting, setDeleting] = useState(null); // { node, itemCount, blocked }
  const [resetting, setResetting] = useState(false);
  const [toast, setToast] = useState('');

  const tree = trees[type];
  const typeLabel = type === 'productos' ? 'productos' : 'servicios';
  // Publicaciones por categoría: catálogo de la tienda + ítems de los emprendedores (incluso los dados de baja,
  // porque sus ventas siguen apuntando a la categoría). TODO: deberían venir del backend (src/services)
  // (las suspendidas por el administrador también cuentan; las dadas de baja de la tienda, no)
  const { allItems: sellerItems } = useSeller();
  const catalogAdmin = useSyncExternalStore(subscribeCatalogAdmin, getCatalogAdminState, getCatalogAdminState);
  const counts = useMemo(() => countByCategory([
    ...getAdminProducts().filter((p) => !isRemoved(`p:${p.id}`)),
    ...getAdminServices().filter((s) => !isRemoved(`s:${s.id}`)),
    ...sellerItems.map((it) => ({ categoryId: it.category })),
  ]), [sellerItems, catalogAdmin]); // eslint-disable-line react-hooks/exhaustive-deps

  const stats = useMemo(() => ({
    total: flatten(trees.productos).length + flatten(trees.servicios).length,
    productos: flatten(trees.productos).length,
    servicios: flatten(trees.servicios).length,
    depth: maxDepth(tree),
    roots: tree.length,
  }), [trees, tree]);

  const q = plain(query.trim());
  const visibleIds = useMemo(() => (q ? matchIds(tree, q) : null), [tree, q]);
  const visible = (id) => !visibleIds || visibleIds.has(id);
  const isExpanded = (id) => (visibleIds ? visibleIds.has(id) : expanded.has(id));
  const toggle = (id) => setExpanded((prev) => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const expandAll = () => setExpanded(new Set([...flatten(trees.productos), ...flatten(trees.servicios)].map((e) => e.node.id)));
  const collapseAll = () => { setExpanded(new Set()); setQuery(''); };

  const commit = (next, message) => {
    // TODO: guardar vía src/services cuando exista el backend
    saveTrees({ ...trees, [type]: next });
    setToast(message);
  };

  const saveCategory = ({ name, parentId }) => {
    const target = dialog.category;
    if (!target) {
      const taken = new Set([...flatten(trees.productos), ...flatten(trees.servicios)].map((e) => e.node.id));
      const node = { id: uniqueId(name, parentId, taken), name };
      console.log('[Admin/Categorías] Crear categoría:', { tipo: type, ...node, parentId });
      commit(insertNode(tree, parentId, node), 'Categoría creada');
    } else {
      const current = findNode(tree, target.id);
      let next = updateNode(tree, target.id, { name });
      const moved = current.parentId !== parentId;
      if (moved) next = moveNode(next, target.id, parentId); // lanza un Error si el destino no es válido
      console.log('[Admin/Categorías] Actualizar categoría:', { tipo: type, id: target.id, name, parentId });
      commit(next, moved ? 'Categoría movida' : 'Categoría actualizada');
    }
    if (parentId) setExpanded((prev) => new Set([...prev, parentId]));
    setDialog(null);
  };

  const askDelete = (node, itemCount) => {
    const isOnlyRoot = tree.length === 1 && tree[0].id === node.id;
    const blocked = itemCount > 0
      ? `"${node.name}" tiene ${itemCount} ${itemCount === 1 ? 'publicación asociada' : 'publicaciones asociadas'} (en ella o en sus subcategorías). Mueve esas publicaciones a otra categoría antes de eliminarla, para no dejarlas sin categoría.`
      : isOnlyRoot ? `El árbol de ${typeLabel} debe tener al menos una categoría principal.` : '';
    setDeleting({ node, blocked, subCount: subtreeIds(node).length - 1 });
  };

  const confirmDelete = () => {
    console.log('[Admin/Categorías] Eliminar categoría:', { tipo: type, id: deleting.node.id, subcategorias: deleting.subCount });
    commit(removeNode(tree, deleting.node.id), 'Categoría eliminada');
    setDeleting(null);
  };

  const shift = (node, delta) => saveTrees({ ...trees, [type]: shiftNode(tree, node.id, delta) });

  const exportCsv = () => {
    const rows = TYPES.flatMap((t) => flatten(trees[t.id]).map((e) => ({ ...e, type: t.label })));
    downloadCsv('categorias-todomart.csv', rows, [
      { header: 'Tipo', value: (r) => r.type },
      { header: 'ID', value: (r) => r.node.id },
      { header: 'Nombre', value: (r) => r.node.name },
      { header: 'Ruta', value: (r) => r.path.join(' > ') },
      { header: 'Nivel', value: (r) => r.depth + 1 },
      { header: 'ID categoría padre', value: (r) => r.parentId ?? '' },
      { header: 'Publicaciones', value: (r) => subtreeIds(r.node).reduce((s, id) => s + (counts.get(id) ?? 0), 0) },
    ]);
  };

  const reset = () => {
    console.log('[Admin/Categorías] Restaurar árbol original');
    saveTrees(getDefaultCategoryTrees());
    setResetting(false);
    setToast('Árbol restaurado');
  };

  return (
    <AdminLayout headerProps={{ user: currentUser }} crumbs={CRUMBS} admin={mockAdmin}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.ink }}>Gestión de Categorías</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 14, color: colors.muted }}>Organiza el árbol de categorías y subcategorías que ven clientes y emprendedores.</Typography>
        </Box>
        <PrimaryButton fullWidth={false} onClick={() => setDialog({ category: null, parentId: null })} sx={{ height: 40, px: 2.5, py: 0, fontSize: 14, borderRadius: '6px' }}>
          Crear categoría
        </PrimaryButton>
      </Box>

      <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr)', lg: 'repeat(4, minmax(0, 1fr))' } }}>
        <StatCard label="Total categorías" value={n(stats.total)} />
        <StatCard label="De productos" value={n(stats.productos)} color="#4B5563" />
        <StatCard label="De servicios" value={n(stats.servicios)} color="#4B5563" />
        <StatCard label={`Niveles (${typeLabel})`} value={n(stats.depth)} color={colors.primary} />
      </Box>

      <Box component="section" aria-labelledby="tree-title" sx={{ mt: 3, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, px: 2.5, pt: 2.5, pb: 2 }}>
          <Box>
            <Typography id="tree-title" component="h2" sx={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>Árbol de categorías</Typography>
            <Typography sx={{ fontSize: 12.5, color: '#9CA3AF' }}>{stats.roots} {stats.roots === 1 ? 'categoría principal' : 'categorías principales'} de {typeLabel}</Typography>
          </Box>
          <Box sx={{ width: { xs: '100%', sm: 260 } }}>
            <SegmentedToggle label="Tipo de categorías" options={TYPES} value={type} onChange={(t) => { setType(t); setQuery(''); }} />
          </Box>
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1.25, px: 2.5, pb: 2, borderBottom: '1px solid #E5E7EB' }}>
          <Box sx={{ flex: '1 1 260px', minWidth: 0 }}>
            <TextInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Buscar en ${typeLabel}...`}
              inputProps={{ 'aria-label': 'Buscar categoría' }}
              InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: '#9CA3AF' }} /></InputAdornment> }}
              sx={{ '& .MuiOutlinedInput-root': { height: 40, borderRadius: '6px' }, '& .MuiOutlinedInput-input': { py: 0, fontSize: 14 } }}
            />
          </Box>
          <Button variant="outlined" onClick={expandAll} startIcon={<UnfoldMoreIcon />} sx={toolBtn}>Expandir todo</Button>
          <Button variant="outlined" onClick={collapseAll} startIcon={<UnfoldLessIcon />} sx={toolBtn}>Contraer todo</Button>
          <Button variant="outlined" onClick={exportCsv} startIcon={<FileDownloadOutlinedIcon />} sx={toolBtn}>Exportar CSV</Button>
        </Box>

        <Box sx={{ mt: '-1px' }}>
          {visibleIds && visibleIds.size === 0 ? (
            <Typography role="status" sx={{ px: 3, py: 6, textAlign: 'center', color: colors.muted, borderTop: '1px solid #F0F1F3' }}>No hay categorías que coincidan con “{query.trim()}”.</Typography>
          ) : (
            <CategoryAdminTree
              nodes={tree}
              counts={counts}
              isExpanded={isExpanded}
              onToggle={toggle}
              visible={visible}
              onAdd={(node) => setDialog({ category: null, parentId: node.id })}
              onEdit={(node) => setDialog({ category: node, parentId: findNode(tree, node.id)?.parentId ?? null })}
              onShift={shift}
              onDelete={askDelete}
            />
          )}
        </Box>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 1.5, px: 2.5, py: 2, borderTop: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
          <Typography sx={{ fontSize: 12.5, color: colors.muted, maxWidth: 640 }}>
            Las categorías con publicaciones no se pueden eliminar. Al mover una categoría se lleva sus subcategorías y publicaciones, y su dirección en la tienda no cambia.
          </Typography>
          <Button onClick={() => setResetting(true)} sx={{ ...toolBtn, border: 'none', color: colors.muted, '&:hover': { color: colors.primary, bgcolor: 'transparent' } }}>Restaurar árbol original</Button>
        </Box>
      </Box>

      {dialog && (
        <CategoryFormDialog
          key={dialog.category?.id ?? `new-${dialog.parentId}`}
          tree={tree}
          typeLabel={typeLabel}
          category={dialog.category}
          parentId={dialog.parentId}
          onSave={saveCategory}
          onClose={() => setDialog(null)}
        />
      )}

      {deleting && !deleting.blocked && (
        <ConfirmDialog
          title="Eliminar categoría"
          message={`¿Seguro que quieres eliminar "${deleting.node.name}"${deleting.subCount === 1 ? ' y su subcategoría' : deleting.subCount ? ` y sus ${deleting.subCount} subcategorías` : ''}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          onConfirm={confirmDelete}
          onClose={() => setDeleting(null)}
        />
      )}

      {deleting?.blocked && (
        <Dialog open onClose={() => setDeleting(null)} maxWidth="xs" fullWidth aria-labelledby="blocked-title">
          <DialogTitle id="blocked-title" sx={{ fontWeight: 600 }}>No se puede eliminar</DialogTitle>
          <DialogContent><DialogContentText sx={{ fontFamily: 'inherit' }}>{deleting.blocked}</DialogContentText></DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={() => setDeleting(null)} variant="contained" disableElevation autoFocus>Entendido</Button>
          </DialogActions>
        </Dialog>
      )}

      {resetting && (
        <ConfirmDialog
          title="Restaurar árbol original"
          message="Se descartarán todos los cambios hechos a las categorías de productos y servicios, y se volverá al árbol del enunciado."
          confirmLabel="Restaurar"
          onConfirm={reset}
          onClose={() => setResetting(false)}
        />
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AdminLayout>
  );
}
