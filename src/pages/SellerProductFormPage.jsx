import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, IconButton, InputBase, Snackbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import SellerLayout from '../components/templates/SellerLayout';
import Breadcrumb from '../components/molecules/Breadcrumb';
import TextInput from '../components/atoms/TextInput';
import SelectInput from '../components/atoms/SelectInput';
import ItemThumb from '../components/atoms/ItemThumb';
import ImageDropzone from '../components/molecules/ImageDropzone';
import OfferFields from '../components/molecules/OfferFields';
import VariantDialog from '../components/organisms/VariantDialog';
import { useSeller } from '../contexts/SellerContext';
import { CRITICAL_STOCK, PRODUCT_CATEGORIES, norm, parseAmount, toLocalInput } from '../utils/seller';
import { formatPrice, formatThousands } from '../utils/format';
import { btnOutlined, btnOutlinedRed, btnPrimary, iconBtn } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const label = { display: 'block', mb: 1, fontSize: 15, fontWeight: 600, color: colors.ink };
const req = <Box component="span" sx={{ color: colors.primary, ml: 0.75 }}>*</Box>;
const textarea = { '& .MuiOutlinedInput-root.MuiInputBase-multiline': { height: 'auto', py: 1.75, px: 2, alignItems: 'flex-start' }, '& textarea': { height: 'auto', padding: '0 !important', fontSize: 15 } };

const Section = ({ n, title, subtitle, action, children }) => (
  <Box component="section" aria-label={title}>
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 2, pb: 1, mb: 3, borderBottom: '1px solid #E5E7EB' }}>
      <Box>
        <Typography component="h2" sx={{ fontSize: 19, fontWeight: 700, color: colors.ink }}>{n}. {title}</Typography>
        <Typography sx={{ mt: 0.5, fontSize: 13.5, color: '#4B5563' }}>{subtitle}</Typography>
      </Box>
      {action}
    </Box>
    {children}
  </Box>
);

const toForm = (item) => ({
  name: item?.name ?? '',
  category: item?.category ?? '',
  sku: item?.sku ?? '',
  description: item?.description ?? '',
  size: item?.size ?? '',
  weightKg: item?.weightKg ? String(item.weightKg).replace('.', ',') : '',
  color: item?.color ?? '',
  material: item?.material ?? '',
  images: item?.images ?? [],
  price: item?.price ? formatThousands(String(item.price)) : '',
  stock: item && !item.variants?.length ? String(item.stock ?? 0) : '',
  minStock: String(item?.minStock ?? CRITICAL_STOCK),
  variants: item?.variants ?? [],
  related: item?.related ?? [],
  offer: item?.offer && !item.offer.endedAt && new Date(item.offer.endsAt) > new Date()
    ? { on: true, price: formatThousands(String(item.offer.price)), ends: toLocalInput(item.offer.endsAt), startsAt: item.offer.startsAt }
    : { on: false, price: '', ends: '', startsAt: null },
});

/** "Ficha del Producto": crear o editar un producto (información, imágenes, precio, oferta, variantes y productos relacionados). */
export default function SellerProductFormPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { items, saveItem } = useSeller();
  const existing = itemId ? items.find((i) => i.id === itemId && i.kind === 'producto') : null;
  const [form, setForm] = useState(() => toForm(existing));
  const [errors, setErrors] = useState({});
  const [variantOpen, setVariantOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');

  if (itemId && !existing) return <Navigate to="/emprendedor/catalogo" replace />;

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const field = (k, fn = (x) => x) => (e) => { set(k)(fn(e.target.value)); if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined })); };
  const draft = !existing || existing.draft;
  const hasVariants = form.variants.length > 0;
  const otherSkus = items.filter((i) => i.id !== existing?.id).flatMap((i) => [i.sku, ...(i.variants ?? []).map((v) => v.sku)]);

  // Productos para vincular: del catálogo, sin el actual ni los ya vinculados
  const term = norm(search.trim());
  const linkable = items.filter((i) => i.id !== existing?.id && !i.draft && !form.related.includes(i.id) && (!term || norm(i.name).includes(term) || norm(i.sku).includes(term))).slice(0, term ? 5 : 2);
  const linked = form.related.map((id) => items.find((i) => i.id === id)).filter(Boolean);

  const validate = (publish) => {
    const e = {};
    const sku = form.sku.trim().toUpperCase();
    const price = parseAmount(form.price);
    const weight = Number(form.weightKg.replace(',', '.'));
    if (!form.name.trim()) e.name = 'Ingresa el nombre del producto.';
    if (publish) {
      if (!form.category) e.category = 'Elige una categoría.';
      if (!/^[A-Z0-9][A-Z0-9-]{2,29}$/.test(sku)) e.sku = 'Usa letras, números y guiones (3 a 30).';
      else if (otherSkus.includes(sku)) e.sku = 'Ese SKU ya está en uso en tu catálogo.';
      if (form.images.length === 0) e.images = 'Agrega al menos una imagen.';
      if (!form.size.trim()) e.size = 'Indica el tamaño (largo x ancho x alto).';
      if (!(weight > 0)) e.weightKg = 'Indica el peso en kg (se usa para el costo de envío).';
      if (!form.color.trim()) e.color = 'Indica el color.';
      if (!form.material.trim()) e.material = 'Indica el material principal.';
      if (!Number.isFinite(price) || price <= 0) e.price = 'Ingresa el precio base.';
      if (!hasVariants && form.stock === '') e.stock = 'Ingresa el stock disponible.';
      if (form.offer.on) {
        const offerPrice = parseAmount(form.offer.price);
        const end = new Date(form.offer.ends);
        if (!Number.isFinite(offerPrice) || offerPrice <= 0) e.offerPrice = 'Ingresa el precio de oferta.';
        else if (Number.isFinite(price) && offerPrice >= price) e.offerPrice = `Debe ser menor al precio base (${formatPrice(price)}).`;
        if (!form.offer.ends || Number.isNaN(end.getTime())) e.offerEnds = 'Indica cuándo vence la oferta.';
        else if (end <= new Date()) e.offerEnds = 'Debe ser una fecha futura.';
      }
    }
    return e;
  };

  const save = (publish) => {
    const e = validate(publish);
    setErrors(e);
    if (Object.keys(e).length) {
      setToast('');
      document.querySelector(`#pf-${Object.keys(e)[0]}`)?.focus?.();
      return;
    }
    const price = parseAmount(form.price);
    const offerOk = form.offer.on && Number.isFinite(parseAmount(form.offer.price)) && form.offer.ends;
    const item = {
      ...(existing ?? {}),
      id: existing?.id,
      kind: 'producto',
      name: form.name.trim(),
      category: form.category,
      sku: form.sku.trim().toUpperCase(),
      description: form.description.trim(),
      size: form.size.trim(),
      weightKg: Number(form.weightKg.replace(',', '.')) || 0,
      color: form.color.trim(),
      material: form.material.trim(),
      images: form.images,
      price: Number.isFinite(price) ? price : 0,
      stock: hasVariants ? 0 : Number(form.stock || 0),
      minStock: form.minStock === '' ? CRITICAL_STOCK : Number(form.minStock),
      variants: form.variants,
      related: form.related,
      offer: offerOk ? { price: parseAmount(form.offer.price), startsAt: form.offer.startsAt ?? new Date().toISOString(), endsAt: new Date(form.offer.ends).toISOString(), endedAt: null } : existing?.offer && !form.offer.on ? null : existing?.offer ?? null,
      draft: publish ? false : draft,
    };
    const saved = saveItem(item);
    console.log(`[Emprendedor] ${publish ? 'Publicar' : 'Guardar'} producto:`, { itemId: saved.id, sku: saved.sku, draft: saved.draft, variantes: saved.variants.length, relacionados: saved.related.length, oferta: Boolean(saved.offer) });
    if (publish) navigate('/emprendedor/catalogo');
    else {
      if (!existing) navigate(`/emprendedor/productos/${saved.id}/editar`, { replace: true });
      setToast(saved.draft ? 'Borrador guardado.' : 'Cambios guardados.');
    }
  };

  const addVariant = (v) => { set('variants')([...form.variants, v]); setVariantOpen(false); };

  return (
    <SellerLayout plain>
      <Box sx={{ '& [aria-current=page]': { color: colors.primary, fontWeight: 600 } }}>
        <Breadcrumb items={[{ label: 'Panel Emprendedor', href: '/emprendedor' }, { label: 'Mis Productos', href: '/emprendedor/catalogo' }, { label: existing ? 'Editar Producto' : 'Crear Producto' }]} />
      </Box>

      <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ flex: '1 1 420px' }}>
          <Typography component="h1" sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 700, color: colors.ink }}>Ficha del Producto{draft ? ' (Borrador)' : ''}</Typography>
          <Typography sx={{ mt: 1, fontSize: 15, color: '#4B5563' }}>Complete la información técnica, variaciones y asocie los productos correspondientes para la venta.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button onClick={() => navigate('/emprendedor/catalogo')} sx={{ ...btnOutlined, height: 46, px: 3 }}>Volver</Button>
          <Button onClick={() => save(false)} sx={{ ...btnPrimary, height: 46, px: 3 }}>Guardar Cambios</Button>
        </Box>
      </Box>

      <Box sx={{ mt: 5, display: 'grid', gap: 4, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.75fr) minmax(0, 1fr)' } }}>
        <Section n={1} title="Información General" subtitle="Identificación del producto para los buscadores">
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'minmax(0, 1fr)' }}>
            <Box>
              <Typography component="label" htmlFor="pf-name" sx={label}>Nombre del Producto{req}</Typography>
              <TextInput id="pf-name" value={form.name} onChange={field('name', (x) => x.slice(0, 120))} placeholder="Ej. Caja de Herramientas Premium Pro Edición Limitada" error={errors.name} />
            </Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Box>
                <Typography component="label" htmlFor="pf-category" sx={label}>Categoría{req}</Typography>
                <SelectInput id="pf-category" options={PRODUCT_CATEGORIES} value={form.category} onChange={field('category')} placeholder="Selecciona una categoría" ariaLabel="Categoría" error={errors.category} />
              </Box>
              <Box>
                <Typography component="label" htmlFor="pf-sku" sx={label}>SKU Principal{req}</Typography>
                <TextInput id="pf-sku" value={form.sku} onChange={field('sku', (x) => x.toUpperCase().slice(0, 30))} placeholder="Ej. HER-091-PRO" error={errors.sku} />
              </Box>
            </Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Box>
                <Typography component="label" htmlFor="pf-size" sx={label}>Tamaño{req}</Typography>
                <TextInput id="pf-size" value={form.size} onChange={field('size', (x) => x.slice(0, 40))} placeholder="Ej. 45 x 22 x 20 cm" error={errors.size} />
              </Box>
              <Box>
                <Typography component="label" htmlFor="pf-weightKg" sx={label}>Peso (kg){req}</Typography>
                <TextInput id="pf-weightKg" value={form.weightKg} onChange={field('weightKg', (x) => x.replace(/[^\d,.]/g, '').replace('.', ',').slice(0, 7))} placeholder="Ej. 3,2" error={errors.weightKg} inputProps={{ inputMode: 'decimal' }} />
              </Box>
              <Box>
                <Typography component="label" htmlFor="pf-color" sx={label}>Color{req}</Typography>
                <TextInput id="pf-color" value={form.color} onChange={field('color', (x) => x.slice(0, 40))} placeholder="Ej. Rojo / Negro" error={errors.color} />
              </Box>
              <Box>
                <Typography component="label" htmlFor="pf-material" sx={label}>Material principal{req}</Typography>
                <TextInput id="pf-material" value={form.material} onChange={field('material', (x) => x.slice(0, 40))} placeholder="Ej. Acero" error={errors.material} />
              </Box>
            </Box>
            <Box>
              <Typography component="label" htmlFor="pf-description" sx={label}>Descripción Completa</Typography>
              <TextInput id="pf-description" multiline minRows={4} value={form.description} onChange={field('description', (x) => x.slice(0, 2000))} placeholder="Detalla las especificaciones técnicas, materiales, usos recomendados y garantía..." sx={textarea} />
            </Box>
          </Box>
        </Section>

        <Section n={2} title="Multimedia & Precios" subtitle="Gestión visual y valor base">
          <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: 'minmax(0, 1fr)' }}>
            <Box>
              <Typography component="label" htmlFor="pf-images" sx={label}>Imágenes del Producto{req}</Typography>
              <ImageDropzone id="pf-images" images={form.images} onChange={(v) => { set('images')(v); if (errors.images) setErrors((x) => ({ ...x, images: undefined })); }} title="Arrastra imágenes aquí o haz clic para buscar" hint="Formatos admitidos: PNG, JPG (Máx. 5 MB)" error={errors.images} />
            </Box>
            <Box>
              <Typography component="label" htmlFor="pf-price" sx={label}>Precio Base (con IVA){req}</Typography>
              <TextInput id="pf-price" value={form.price} onChange={field('price', (x) => formatThousands(x.replace(/\D/g, '').slice(0, 9)))} placeholder="0" prefix="$" error={errors.price} inputProps={{ inputMode: 'numeric' }} />
            </Box>
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
              <Box>
                <Typography component="label" htmlFor="pf-stock" sx={label}>Stock{!hasVariants && req}</Typography>
                <TextInput id="pf-stock" value={hasVariants ? String(form.variants.reduce((s, v) => s + v.stock, 0)) : form.stock} disabled={hasVariants} onChange={field('stock', (x) => x.replace(/\D/g, '').slice(0, 6))} placeholder="Ej. 15" error={errors.stock} inputProps={{ inputMode: 'numeric' }} />
                {hasVariants && <Typography sx={{ mt: 0.5, fontSize: 12, color: '#6B7280' }}>Suma del stock de las variantes.</Typography>}
              </Box>
              <Box>
                <Typography component="label" htmlFor="pf-min" sx={label}>Stock mínimo</Typography>
                <TextInput id="pf-min" value={form.minStock} onChange={field('minStock', (x) => x.replace(/\D/g, '').slice(0, 6))} placeholder={String(CRITICAL_STOCK)} inputProps={{ inputMode: 'numeric' }} />
                <Typography sx={{ mt: 0.5, fontSize: 12, color: '#6B7280' }}>Bajo este número se activa la alerta (por defecto {CRITICAL_STOCK}).</Typography>
              </Box>
            </Box>
          </Box>
        </Section>
      </Box>

      <Box sx={{ mt: 4 }}>
        <OfferFields
          value={form.offer}
          onChange={(v) => { set('offer')(v); setErrors((x) => ({ ...x, offerPrice: undefined, offerEnds: undefined })); }}
          errors={errors}
          title="Activar oferta para este producto"
          description="Muestra un precio de descuento destacado y temporizador de validez"
          priceLabel="Precio de Oferta"
          pricePlaceholder="Ej. 39.990"
          endLabel="Fecha de Vencimiento de Oferta"
        />
      </Box>

      <Box sx={{ mt: 5 }}>
        <Section n={3} title="Variaciones del Producto" subtitle="Especificaciones físicas como color, tallas, material, etc." action={<Button onClick={() => setVariantOpen(true)} startIcon={<AddIcon />} sx={{ ...btnOutlinedRed, height: 38, mb: 0.5 }}>Agregar variante</Button>}>
          <Box sx={{ bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px', overflowX: 'auto' }}>
            <Box role="table" aria-label="Variantes" sx={{ minWidth: 640 }}>
              <Box role="row" sx={{ display: 'grid', gridTemplateColumns: '1.2fr 3fr 1.1fr 1.1fr 70px', gap: 2, px: 3, py: 1.5, bgcolor: '#F9FAFB', borderBottom: '1px solid #E5E7EB', '& > *': { fontSize: 11, fontWeight: 600, letterSpacing: '0.03em', color: '#4B5563' } }}>
                <Box role="columnheader">SKU VARIANTE</Box><Box role="columnheader">ATRIBUTOS (TALLA / COLOR)</Box><Box role="columnheader">PRECIO VARIANTE</Box><Box role="columnheader">STOCK</Box><Box role="columnheader" sx={{ textAlign: 'right' }}>ACCIÓN</Box>
              </Box>
              {form.variants.length === 0 && <Typography role="status" sx={{ px: 3, py: 3, fontSize: 14, color: '#6B7280' }}>Sin variantes: el producto se vende con el precio base y su propio stock.</Typography>}
              {form.variants.map((v, i) => (
                <Box role="row" key={v.sku} sx={{ display: 'grid', gridTemplateColumns: '1.2fr 3fr 1.1fr 1.1fr 70px', gap: 2, alignItems: 'center', px: 3, py: 1.5, borderBottom: i < form.variants.length - 1 ? '1px solid #F0F0F0' : 'none', fontSize: 14.5, color: colors.ink }}>
                  <Box role="cell" sx={{ fontWeight: 700 }}>{v.sku}</Box>
                  <Box role="cell">{v.attributes}</Box>
                  <Box role="cell" sx={{ fontWeight: 700 }}>{formatPrice(v.price)}</Box>
                  <Box role="cell">{v.stock} {v.stock === 1 ? 'unidad' : 'unidades'}</Box>
                  <Box role="cell" sx={{ textAlign: 'right' }}>
                    <IconButton aria-label={`Eliminar variante ${v.sku}`} onClick={() => set('variants')(form.variants.filter((x) => x.sku !== v.sku))} sx={{ ...iconBtn, color: colors.primary }}><DeleteOutlinedIcon /></IconButton>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Section>
      </Box>

      <Box sx={{ mt: 5 }}>
        <Section n={4} title="Productos Relacionados" subtitle="Asocia este producto con otros de tu catálogo para mostrarlos como recomendación de compra">
          <Box sx={{ display: 'grid', gap: 3, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'minmax(0, 1.5fr) minmax(0, 1fr)' } }}>
            <Box>
              <Typography component="label" htmlFor="pf-related" sx={label}>Buscar y Vincular Productos</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, height: 48, px: 2, bgcolor: '#fff', border: '1px solid #D1D5DB', borderRadius: '8px', '&:focus-within': { borderColor: colors.primary } }}>
                <SearchIcon aria-hidden sx={{ color: '#6B7280' }} />
                <InputBase id="pf-related" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Escribe el nombre del producto o SKU para asociar..." sx={{ fontSize: 15, fontFamily: 'inherit' }} />
              </Box>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 1.5, p: 0.75, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px', display: 'grid', gap: 0.5, gridTemplateColumns: 'minmax(0, 1fr)' }}>
                {linkable.length === 0 && <Typography component="li" sx={{ p: 1.5, fontSize: 13.5, color: '#6B7280' }}>No hay más productos que coincidan.</Typography>}
                {linkable.map((i) => (
                  <Box component="li" key={i.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1, borderRadius: '6px', bgcolor: '#FAFAFA' }}>
                    <ItemThumb src={i.images?.[0]?.src} size={36} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{i.name}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: '#6B7280' }}>SKU: {i.sku}</Typography>
                    </Box>
                    <Button onClick={() => set('related')([...form.related, i.id])} aria-label={`Vincular ${i.name}`} sx={{ height: 28, px: 1.25, borderRadius: 999, bgcolor: '#FDECEF', color: colors.primary, fontFamily: 'inherit', fontSize: 12, fontWeight: 600, '&:hover': { bgcolor: '#FAD9DF' } }}>+ Vincular</Button>
                  </Box>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography sx={label}>Productos Asociados ({linked.length})</Typography>
              <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'grid', gap: 1, gridTemplateColumns: 'minmax(0, 1fr)' }}>
                {linked.length === 0 && <Typography component="li" sx={{ p: 2, fontSize: 13.5, color: '#6B7280', border: '1px dashed #D1D5DB', borderRadius: '8px' }}>Aún no vinculas productos.</Typography>}
                {linked.map((i) => (
                  <Box component="li" key={i.id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                    <ItemThumb src={i.images?.[0]?.src} size={40} />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.ink }}>{i.name}</Typography>
                      <Typography sx={{ fontSize: 11.5, color: '#6B7280' }}>SKU: {i.sku}</Typography>
                    </Box>
                    <IconButton onClick={() => set('related')(form.related.filter((r) => r !== i.id))} aria-label={`Quitar ${i.name}`} sx={{ color: '#4B5563' }}><HighlightOffOutlinedIcon /></IconButton>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Section>
      </Box>

      <Box sx={{ mt: 5, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
        <Typography sx={{ fontSize: 13.5, color: '#4B5563' }}>* Los campos con asterisco son obligatorios para publicar.</Typography>
        <Button onClick={() => save(true)} sx={{ ...btnPrimary, height: 46, px: 4, fontSize: 15 }}>Publicar Producto</Button>
      </Box>
      {Object.keys(errors).some((k) => errors[k]) && <Alert severity="error" sx={{ mt: 2 }}>Revisa los campos marcados antes de continuar.</Alert>}

      {variantOpen && <VariantDialog baseSku={form.sku.trim()} basePrice={parseAmount(form.price)} takenSkus={[...otherSkus, form.sku.trim().toUpperCase(), ...form.variants.map((v) => v.sku)]} onSave={addVariant} onClose={() => setVariantOpen(false)} />}
      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
