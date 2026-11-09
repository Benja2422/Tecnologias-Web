import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { useSeller } from '../contexts/SellerContext';
import { useCategories } from '../contexts/CategoriesContext';
import { getCatalogAdminState, subscribeCatalogAdmin, updateCatalogAdmin } from '../utils/catalogAdmin';
import { getAdminProducts } from '../utils/mockProducts';
import { getAdminServices } from '../utils/mockServices';
import { slugify } from '../utils/categoryTree';
import { SELLER, itemStock, offerStatus } from '../utils/seller';

/** Estado de una publicación para el administrador. */
export function publicationStatus(row) {
  if (row.removed) return 'Dado de baja';
  if (row.suspended) return 'Suspendido';
  if (row.draft) return 'Borrador';
  if (row.kind === 'producto' && row.stock === 0) return 'Sin stock';
  return 'Publicado';
}

const stamp = (reason, note) => ({ reason, note: (note ?? '').trim(), at: new Date().toISOString() });

/**
 * Catálogo completo de la plataforma para el administrador, con un formato común por publicación:
 * { key, source: 'tienda' | 'panel', id, kind, name, sku, seller, categoryId, price, originalPrice, stock (null en servicios),
 *   basePrice (precio sin oferta del panel), hasVariants, image, href, suspended, removed, draft, status }
 * - 'tienda': catálogo público de ejemplo (cambios en utils/catalogAdmin).
 * - 'panel': ítems del panel de emprendedor (cambios vía SellerContext, el emprendedor los ve).
 * Acciones: save, suspend, reactivate, remove (baja), restore.
 */
export function useAdminCatalog() {
  const store = useSyncExternalStore(subscribeCatalogAdmin, getCatalogAdminState, getCatalogAdminState);
  const { allItems, profile, saveItem, deleteItem } = useSeller();
  const { trees } = useCategories(); // vuelve a calcular si cambia el árbol
  const panelSeller = profile?.company?.name || SELLER.name;

  const rows = useMemo(() => {
    const now = new Date();
    const fromStore = (prefix, kind) => (p) => {
      const key = `${prefix}:${p.id}`;
      const hasVariants = Boolean(p.variants?.length);
      return {
        key, source: 'tienda', id: p.id, kind, name: p.name, sku: p.id, seller: p.seller?.name ?? '—', categoryId: p.categoryId,
        price: p.price, basePrice: p.price, originalPrice: p.originalPrice ?? null,
        stock: kind === 'servicio' ? null : hasVariants ? p.variants.reduce((s, v) => s + v.stock, 0) : (p.stock ?? 0),
        hasVariants, image: kind === 'servicio' ? p.image : p.images?.[0]?.src ?? null,
        href: kind === 'producto' ? `/producto/${p.id}` : `/categorias/${p.categoryId}`,
        suspended: store.suspended[key] ?? null, removed: store.deleted.includes(key), draft: false,
        created: store.created.some((c) => c.id === p.id),
      };
    };
    const fromPanel = (it) => {
      const offer = it.offer && ['Activa', 'Vence pronto'].includes(offerStatus(it.offer, now)) ? it.offer : null;
      return {
        key: `v:${it.id}`, source: 'panel', id: it.id, kind: it.kind, name: it.name, sku: it.sku, seller: panelSeller, categoryId: it.category,
        price: offer ? offer.price : it.price, basePrice: it.price, originalPrice: offer ? it.price : null,
        stock: it.kind === 'producto' ? itemStock(it) : null, hasVariants: Boolean(it.variants?.length),
        image: it.images?.[0]?.src ?? null, href: null,
        suspended: it.suspended ?? null, removed: Boolean(it.retired), draft: Boolean(it.draft), raw: it,
      };
    };
    return [
      ...getAdminProducts().map(fromStore('p', 'producto')),
      ...getAdminServices().map(fromStore('s', 'servicio')),
      ...allItems.map(fromPanel),
    ].map((r) => ({ ...r, status: publicationStatus(r) }));
  }, [store, allItems, panelSeller, trees]); // eslint-disable-line react-hooks/exhaustive-deps

  const setOverride = (key, patch) => updateCatalogAdmin((s) => ({ ...s, overrides: { ...s.overrides, [key]: { ...s.overrides[key], ...patch } } }));

  /** Crea (row = null) o edita una publicación. values: { kind, seller, name, categoryId, price, stock } */
  const save = useCallback((row, values) => {
    const { name, categoryId, price, stock } = values;
    if (!row) {
      const id = `${slugify(name)}-${Date.now().toString(36)}`;
      const item = {
        id, kind: values.kind, name, price, categoryId, seller: { id: slugify(values.seller), name: values.seller },
        rating: 0, reviewCount: 0, ...(values.kind === 'producto' && { stock }),
      };
      updateCatalogAdmin((s) => ({ ...s, created: [...s.created, item] }));
      return id;
    }
    const canStock = row.kind === 'producto' && !row.hasVariants && Number.isInteger(stock);
    if (row.source === 'panel') saveItem({ ...row.raw, name, price, category: categoryId, ...(canStock && { stock }) });
    else setOverride(row.key, { name, price, categoryId, ...(canStock && { stock }) });
    return row.id;
  }, [saveItem]);

  const suspend = useCallback((row, reason, note) => {
    if (row.source === 'panel') saveItem({ ...row.raw, suspended: stamp(reason, note) });
    else updateCatalogAdmin((s) => ({ ...s, suspended: { ...s.suspended, [row.key]: stamp(reason, note) } }));
  }, [saveItem]);

  const reactivate = useCallback((row) => {
    if (row.source === 'panel') saveItem({ ...row.raw, suspended: null });
    else updateCatalogAdmin((s) => { const suspended = { ...s.suspended }; delete suspended[row.key]; return { ...s, suspended }; });
  }, [saveItem]);

  /** Baja lógica: deja de mostrarse, pero se conserva (las ventas anteriores la referencian). */
  const remove = useCallback((row) => {
    if (row.source === 'panel') deleteItem(row.id);
    else updateCatalogAdmin((s) => ({ ...s, deleted: s.deleted.includes(row.key) ? s.deleted : [...s.deleted, row.key] }));
  }, [deleteItem]);

  const restore = useCallback((row) => {
    if (row.source === 'panel') saveItem({ ...row.raw, retired: false, retiredAt: null });
    else updateCatalogAdmin((s) => ({ ...s, deleted: s.deleted.filter((k) => k !== row.key) }));
  }, [saveItem]);

  return { rows, save, suspend, reactivate, remove, restore };
}
