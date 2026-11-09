import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Alert, Box, Button, Typography } from '@mui/material';
import SellerLayout from '../components/templates/SellerLayout';
import Breadcrumb from '../components/molecules/Breadcrumb';
import TextInput from '../components/atoms/TextInput';
import SelectInput from '../components/atoms/SelectInput';
import ImageDropzone from '../components/molecules/ImageDropzone';
import OfferFields from '../components/molecules/OfferFields';
import { useSeller } from '../contexts/SellerContext';
import { AGE_RESTRICTIONS, SERVICE_MODALITIES, hasValidCategory, parseAmount } from '../utils/seller';
import CategorySelect from '../components/molecules/CategorySelect';
import { formatPrice, formatThousands } from '../utils/format';
import { btnOutlined, btnPrimary, card } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const label = { display: 'block', mb: 1, fontSize: 15, fontWeight: 500, color: colors.ink };
const hint = { mt: 1, fontSize: 12.5, color: '#4B5563' };
const textarea = { '& .MuiOutlinedInput-root.MuiInputBase-multiline': { height: 'auto', py: 1.75, px: 2, alignItems: 'flex-start' }, '& textarea': { height: 'auto', padding: '0 !important', fontSize: 15 } };
const h2 = { fontSize: 19, fontWeight: 600, color: colors.ink };

const two = (n) => String(n).padStart(2, '0');
const toDateInput = (iso) => { if (!iso) return ''; const d = new Date(iso); return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`; };
/** Fin del día elegido (la oferta vale hasta las 23:59). */
const endOfDay = (value) => { const [y, m, d] = value.split('-').map(Number); return new Date(y, m - 1, d, 23, 59, 0); };

/** SKU automático para un servicio nuevo: "SER-" + iniciales + sufijo. */
const makeSku = (name, taken) => {
  const base = `SER-${name.normalize('NFD').replace(/[^A-Za-z ]/g, '').split(/\s+/).filter((w) => w.length > 2).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'X'}`;
  for (let n = 1; n < 1000; n += 1) { const sku = `${base}${String(n).padStart(2, '0')}`; if (!taken.includes(sku)) return sku; }
  return `${base}${Date.now().toString(36).toUpperCase()}`;
};

const toForm = (item) => ({
  name: item?.name ?? '',
  category: item?.category ?? '',
  description: item?.description ?? '',
  price: item?.price ? formatThousands(String(item.price)) : '',
  unit: item?.unit ?? '',
  images: item?.images ?? [],
  duration: item?.duration ?? '',
  modality: item?.modality ?? 'domicilio',
  ageRestriction: item?.ageRestriction ?? 0,
  offer: item?.offer && !item.offer.endedAt && new Date(item.offer.endsAt) > new Date()
    ? { on: true, price: formatThousands(String(item.offer.price)), ends: toDateInput(item.offer.endsAt), startsAt: item.offer.startsAt }
    : { on: false, price: '', ends: '', startsAt: null },
});

/** Crear o editar un servicio: información, tarifa, oferta, imágenes y logística. Los servicios no manejan stock. */
export default function SellerServiceFormPage() {
  const { itemId } = useParams();
  const navigate = useNavigate();
  const { items, saveItem } = useSeller();
  const existing = itemId ? items.find((i) => i.id === itemId && i.kind === 'servicio') : null;
  const [form, setForm] = useState(() => toForm(existing));
  const [errors, setErrors] = useState({});

  if (itemId && !existing) return <Navigate to="/emprendedor/catalogo" replace />;

  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const field = (k, fn = (x) => x) => (e) => { set(k)(fn(e.target.value)); if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined })); };

  const submit = () => {
    const e = {};
    const price = parseAmount(form.price);
    if (!form.name.trim()) e.name = 'Ingresa el nombre del servicio.';
    if (!form.category) e.category = 'Elige una categoría.';
    else if (!hasValidCategory({ kind: 'servicio', category: form.category })) e.category = 'Esa categoría ya no existe. Elige otra.';
    if (!form.description.trim()) e.description = 'Describe el servicio.';
    if (!Number.isFinite(price) || price <= 0) e.price = 'Ingresa el precio base.';
    if (!form.duration.trim()) e.duration = 'Indica cuánto tiempo toma el servicio.';
    if (form.offer.on) {
      const offerPrice = parseAmount(form.offer.price);
      if (!Number.isFinite(offerPrice) || offerPrice <= 0) e.offerPrice = 'Ingresa el precio de oferta.';
      else if (Number.isFinite(price) && offerPrice >= price) e.offerPrice = `Debe ser menor al precio base (${formatPrice(price)}).`;
      if (!form.offer.ends) e.offerEnds = 'Indica hasta cuándo vale la oferta.';
      else if (endOfDay(form.offer.ends) <= new Date()) e.offerEnds = 'Debe ser hoy o una fecha futura.';
    }
    setErrors(e);
    if (Object.keys(e).length) { document.querySelector(`#sf-${Object.keys(e)[0]}`)?.focus?.(); return; }

    const taken = items.filter((i) => i.id !== existing?.id).map((i) => i.sku);
    const saved = saveItem({
      ...(existing ?? {}),
      id: existing?.id,
      kind: 'servicio',
      sku: existing?.sku ?? makeSku(form.name, taken),
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      price,
      unit: form.unit.trim(),
      images: form.images,
      duration: form.duration.trim(),
      modality: form.modality,
      ageRestriction: Number(form.ageRestriction) || 0,
      offer: form.offer.on ? { price: parseAmount(form.offer.price), startsAt: form.offer.startsAt ?? new Date().toISOString(), endsAt: endOfDay(form.offer.ends).toISOString(), endedAt: null } : null,
      draft: false,
    });
    console.log('[Emprendedor] Publicar servicio:', { itemId: saved.id, sku: saved.sku, precio: saved.price, oferta: Boolean(saved.offer), imagenes: saved.images.length });
    navigate('/emprendedor/catalogo');
  };

  return (
    <SellerLayout plain>
      <Box sx={{ '& [aria-current=page]': { color: colors.primary, fontWeight: 600 } }}>
        <Breadcrumb items={[{ label: 'Panel Emprendedor', href: '/emprendedor' }, { label: 'Mis Servicios', href: '/emprendedor/catalogo' }, { label: existing ? 'Editar Servicio' : 'Nuevo Servicio' }]} />
      </Box>
      <Typography component="h1" sx={{ mt: 4, fontSize: { xs: 26, md: 30 }, fontWeight: 600, color: colors.ink }}>{existing ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</Typography>
      <Typography sx={{ mt: 1.25, fontSize: 15, color: '#4B5563' }}>Completa la información técnica, multimedia y comercial de tu servicio para publicarlo en TodoMart.</Typography>

      <Box sx={{ mt: 4, display: 'grid', gap: 4, alignItems: 'start', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.7fr) minmax(0, 1fr)' } }}>
        <Box sx={{ ...card, p: { xs: 2.5, md: 4 }, display: 'grid', gap: 3, gridTemplateColumns: 'minmax(0, 1fr)' }}>
          <Typography component="h2" sx={h2}>Información del Servicio</Typography>
          <Box>
            <Typography component="label" htmlFor="sf-name" sx={label}>Nombre del Servicio *</Typography>
            <TextInput id="sf-name" value={form.name} onChange={field('name', (x) => x.slice(0, 120))} placeholder="Ej. Gasfitería premium a domicilio, Clases de Matemáticas" error={errors.name} />
            {!errors.name && <Typography sx={hint}>Escribe un título descriptivo y claro para que los clientes te encuentren fácilmente.</Typography>}
          </Box>
          <Box>
            <Typography component="label" htmlFor="sf-category" sx={label}>Categoría del Servicio *</Typography>
            <CategorySelect type="servicios" id="sf-category" value={hasValidCategory({ kind: 'servicio', category: form.category }) ? form.category : ''} onChange={field('category')} placeholder="Selecciona una categoría o subcategoría técnica" ariaLabel="Categoría del servicio" error={errors.category} />
          </Box>
          <Box>
            <Typography component="label" htmlFor="sf-description" sx={label}>Descripción del Servicio *</Typography>
            <TextInput id="sf-description" multiline minRows={4} value={form.description} onChange={field('description', (x) => x.slice(0, 2000))} placeholder="Detalla en qué consiste el servicio, qué incluye, qué materiales debe proveer el cliente, cobertura, etc." error={errors.description} sx={textarea} />
          </Box>

          <Box sx={{ borderTop: '1px solid #E5E7EB', pt: 4, display: 'grid', gap: 3, gridTemplateColumns: 'minmax(0, 1fr)' }}>
            <Typography component="h2" sx={h2}>Tarifas y Precio Base</Typography>
            <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
              <Box>
                <Typography component="label" htmlFor="sf-price" sx={label}>Precio Base ($ CLP) *</Typography>
                <TextInput id="sf-price" value={form.price} onChange={field('price', (x) => formatThousands(x.replace(/\D/g, '').slice(0, 9)))} placeholder="Ej. 25.000" error={errors.price} inputProps={{ inputMode: 'numeric' }} />
                {!errors.price && <Typography sx={hint}>Moneda nacional chilena, IVA incluido</Typography>}
              </Box>
              <Box>
                <Typography component="label" htmlFor="sf-unit" sx={label}>Unidad de Cobro</Typography>
                <TextInput id="sf-unit" value={form.unit} onChange={field('unit', (x) => x.slice(0, 40))} placeholder="Ej. Por hora, por visita, proyecto completo" />
                <Typography sx={hint}>Especifica cómo estimas la tarifa</Typography>
              </Box>
            </Box>
            <OfferFields
              variant="outlined"
              dateOnly
              value={form.offer}
              onChange={(v) => { set('offer')(v); setErrors((x) => ({ ...x, offerPrice: undefined, offerEnds: undefined })); }}
              errors={errors}
              title="Activar oferta para este servicio"
              description="Al activar esta opción, los clientes verán un precio rebajado destacado junto al precio original."
              priceLabel="Precio Especial de Oferta"
              pricePlaceholder="Ej. 18.000"
              endLabel="Vigencia de la Oferta (Hasta)"
              endHint="Fecha límite del descuento"
            />
          </Box>
        </Box>

        <Box sx={{ display: 'grid', gap: 4, gridTemplateColumns: 'minmax(0, 1fr)' }}>
          <Box sx={{ ...card, p: { xs: 2.5, md: 4 } }}>
            <Typography component="h2" sx={h2}>Imágenes del Servicio</Typography>
            <Typography sx={{ mt: 2, mb: 2.5, fontSize: 13, color: '#4B5563' }}>Sube fotos descriptivas sobre tu trabajo. La primera imagen será la de portada.</Typography>
            <ImageDropzone id="sf-images" accent images={form.images} onChange={set('images')} title="Arrastra tus archivos aquí" hint="o haz clic para explorar en tu equipo · JPG o PNG, máx. 5 MB" />
          </Box>
          <Box sx={{ ...card, p: { xs: 2.5, md: 4 }, display: 'grid', gap: 2.5, gridTemplateColumns: 'minmax(0, 1fr)' }}>
            <Typography component="h2" sx={h2}>Logística y Duración</Typography>
            <Box>
              <Typography component="label" htmlFor="sf-duration" sx={label}>Duración Estimada del Servicio *</Typography>
              <TextInput id="sf-duration" value={form.duration} onChange={field('duration', (x) => x.slice(0, 60))} placeholder="Ej. 2 horas, Media jornada, Varía según requerimiento"  error={errors.duration}/>
              <Typography sx={hint}>Ayuda a coordinar las expectativas de tiempo de los clientes.</Typography>
            </Box>
            <Box>
              <Typography component="label" htmlFor="sf-modality" sx={label}>Modalidad de Entrega</Typography>
              <SelectInput id="sf-modality" options={SERVICE_MODALITIES} value={form.modality} onChange={field('modality')} ariaLabel="Modalidad de entrega" />
            </Box>
            <Box>
              <Typography component="label" htmlFor="sf-age" sx={label}>Restricción de Edad *</Typography>
              <SelectInput id="sf-age" options={AGE_RESTRICTIONS} value={form.ageRestriction} onChange={field('ageRestriction', Number)} ariaLabel="Restricción de edad" />
              <Typography sx={hint}>Los clientes que no cumplan la edad no podrán contratar el servicio.</Typography>
            </Box>
          </Box>
          <Box sx={{ ...card, p: { xs: 2.5, md: 4 }, display: 'grid', gap: 1.5, gridTemplateColumns: 'minmax(0, 1fr)' }}>
            <Typography sx={{ fontSize: 13, color: '#4B5563', mb: 1 }}>Al guardar, el servicio se revisará brevemente de acuerdo a nuestras normas antes de aparecer en el catálogo público.</Typography>
            {Object.values(errors).some(Boolean) && <Alert severity="error">Revisa los campos marcados.</Alert>}
            <Button onClick={submit} sx={{ ...btnPrimary, height: 50, fontSize: 16 }}>Guardar y Publicar Servicio</Button>
            <Button onClick={() => navigate('/emprendedor/catalogo')} sx={{ ...btnOutlined, height: 50, fontSize: 16 }}>Cancelar y Volver</Button>
          </Box>
        </Box>
      </Box>
    </SellerLayout>
  );
}
