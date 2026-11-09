import { useState } from 'react';
import { Alert, Box, Button, IconButton, Snackbar, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SellerLayout from '../components/templates/SellerLayout';
import SellerPageTitle from '../components/molecules/SellerPageTitle';
import TextInput from '../components/atoms/TextInput';
import SelectInput from '../components/atoms/SelectInput';
import { useSeller } from '../contexts/SellerContext';
import { REGION_NAMES, communesOf, normalizeProfile } from '../utils/seller';
import { formatNationalPhone, formatRut, isValidChileanPhone, isValidEmail, isValidRut, isValidUrl } from '../utils/validators';
import { btnOutlined, btnOutlinedRed, btnPrimary, card, iconBtn } from '../utils/sellerStyles';
import { colors } from '../utils/theme';

const MAX_PHONES = 4;
const label = { display: 'block', mb: 1, fontSize: 14, fontWeight: 600, color: colors.ink };
const req = <Box component="span" sx={{ color: colors.primary, ml: 0.5 }}>*</Box>;
const opt = <Box component="span" sx={{ ml: 0.75, fontWeight: 400, color: '#9CA3AF' }}>(opcional)</Box>;
const regionOptions = REGION_NAMES.map((r) => ({ id: r, name: r }));
const textarea = { '& .MuiOutlinedInput-root.MuiInputBase-multiline': { height: 'auto', py: 1.5, px: 2, alignItems: 'flex-start' }, '& textarea': { height: 'auto', padding: '0 !important', fontSize: 15 } };

const Field = ({ id, title, required, optional, children, sx }) => (
  <Box sx={sx}>
    <Typography component="label" htmlFor={id} sx={label}>{title}{required && req}{optional && opt}</Typography>
    {children}
  </Box>
);

const Section = ({ title, subtitle, children }) => (
  <Box component="section" aria-label={title} sx={{ ...card, p: { xs: 2.5, md: 3.5 } }}>
    <Typography component="h2" sx={{ fontSize: 18, fontWeight: 700, color: colors.ink }}>{title}</Typography>
    {subtitle && <Typography sx={{ mt: 0.5, fontSize: 13.5, color: '#6B7280' }}>{subtitle}</Typography>}
    <Box sx={{ mt: 3, display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' } }}>{children}</Box>
  </Box>
);

/** Lista de teléfonos (al menos uno, hasta 4): requerimiento de múltiples teléfonos. */
function PhoneList({ idPrefix, phones, onChange, errors = [] }) {
  return (
    <Box sx={{ display: 'grid', gap: 1.25 }}>
      {phones.map((p, i) => (
        <Box key={i} sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
          <TextInput
            id={`${idPrefix}-${i}`}
            prefix="+56"
            value={p}
            onChange={(e) => onChange(phones.map((x, j) => (j === i ? formatNationalPhone(e.target.value) : x)))}
            placeholder="9 1234 5678"
            error={errors[i]}
            inputProps={{ inputMode: 'tel', 'aria-label': `Teléfono ${i + 1}` }}
          />
          {phones.length > 1 && (
            <IconButton aria-label={`Quitar teléfono ${i + 1}`} onClick={() => onChange(phones.filter((_, j) => j !== i))} sx={{ ...iconBtn, width: 50, height: 50, color: colors.primary, flexShrink: 0 }}><DeleteOutlinedIcon /></IconButton>
          )}
        </Box>
      ))}
      {phones.length < MAX_PHONES && (
        <Button onClick={() => onChange([...phones, ''])} startIcon={<AddIcon />} sx={{ ...btnOutlinedRed, height: 36, justifySelf: 'start', fontSize: 13 }}>Agregar teléfono</Button>
      )}
    </Box>
  );
}

/** Dirección: calle, número, región y comuna (de la división político-administrativa del sistema). */
function AddressFields({ idPrefix, value, onChange, errors = {} }) {
  const set = (k, v) => onChange({ ...value, [k]: v, ...(k === 'region' && { commune: '' }) });
  return (
    <>
      <Field id={`${idPrefix}-street`} title="Calle" required>
        <TextInput id={`${idPrefix}-street`} value={value.street} onChange={(e) => set('street', e.target.value.slice(0, 80))} placeholder="Ej. Av. Matta" error={errors.street} />
      </Field>
      <Field id={`${idPrefix}-number`} title="Número" required>
        <TextInput id={`${idPrefix}-number`} value={value.number} onChange={(e) => set('number', e.target.value.slice(0, 10))} placeholder="Ej. 1150" error={errors.number} />
      </Field>
      <Field id={`${idPrefix}-region`} title="Región" required>
        <SelectInput id={`${idPrefix}-region`} options={regionOptions} value={value.region} onChange={(e) => set('region', e.target.value)} placeholder="Selecciona una región" ariaLabel="Región" error={errors.region} />
      </Field>
      <Field id={`${idPrefix}-commune`} title="Comuna" required>
        <SelectInput id={`${idPrefix}-commune`} options={communesOf(value.region).map((c) => ({ id: c, name: c }))} value={value.commune} onChange={(e) => set('commune', e.target.value)} placeholder={value.region ? 'Selecciona una comuna' : 'Primero elige la región'} ariaLabel="Comuna" disabled={!value.region} error={errors.commune} />
      </Field>
    </>
  );
}

const addressErrors = (a) => {
  const e = {};
  if (!a.street.trim()) e.street = 'Ingresa la calle.';
  if (!a.number.trim()) e.number = 'Ingresa el número.';
  if (!a.region) e.region = 'Elige la región.';
  if (!a.commune) e.commune = 'Elige la comuna.';
  return e;
};

/** Perfil y Tienda Física: datos de la empresa, del emprendedor, teléfonos y tiendas físicas (ver y actualizar). */
export default function SellerProfilePage() {
  const { profile: savedProfile, saveProfile } = useSeller();
  const profile = normalizeProfile(savedProfile);
  const [form, setForm] = useState(profile);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState('');

  const company = form.company;
  const owner = form.owner;
  const setCompany = (patch) => setForm((f) => ({ ...f, company: { ...f.company, ...patch } }));
  const setOwner = (patch) => setForm((f) => ({ ...f, owner: { ...f.owner, ...patch } }));
  const dirty = JSON.stringify(form) !== JSON.stringify(profile);

  const validate = () => {
    const e = {};
    if (!company.name.trim()) e.companyName = 'Ingresa el nombre de la empresa.';
    if (!isValidRut(company.rut)) e.companyRut = 'RUT inválido: revisa el dígito verificador.';
    if (!isValidEmail(company.email)) e.companyEmail = 'Ingresa un correo válido.';
    if (company.website.trim() && !isValidUrl(company.website)) e.companyWebsite = 'Ingresa una dirección web válida.';
    const companyPhones = company.phones.map((p) => (isValidChileanPhone(p) ? undefined : 'Teléfono inválido (9 dígitos).'));
    if (companyPhones.some(Boolean)) e.companyPhones = companyPhones;
    const storeErrors = company.stores.map(addressErrors);
    if (storeErrors.some((x) => Object.keys(x).length)) e.stores = storeErrors;
    if (!owner.name.trim()) e.ownerName = 'Ingresa tu nombre.';
    if (!isValidRut(owner.run)) e.ownerRun = 'RUN inválido: revisa el dígito verificador.';
    if (!isValidEmail(owner.email)) e.ownerEmail = 'Ingresa un correo válido.';
    const ownerPhones = owner.phones.map((p) => (isValidChileanPhone(p) ? undefined : 'Teléfono inválido (9 dígitos).'));
    if (ownerPhones.some(Boolean)) e.ownerPhones = ownerPhones;
    const oa = addressErrors(owner.address); if (Object.keys(oa).length) e.ownerAddress = oa;
    return e;
  };

  const submit = (ev) => {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) { setToast(''); return; }
    const clean = { ...form, company: { ...company, name: company.name.trim(), email: company.email.trim(), website: company.website.trim(), stores: company.stores.map((st) => ({ ...st, name: st.name.trim(), street: st.street.trim(), number: st.number.trim() })) }, owner: { ...owner, name: owner.name.trim(), email: owner.email.trim() } };
    console.log('[Emprendedor] Guardar perfil:', { empresa: clean.company.name, rut: clean.company.rut, telefonos: clean.company.phones.length, tiendasFisicas: clean.company.stores.length });
    saveProfile(clean);
    setForm(clean);
    setToast('Perfil actualizado.');
  };

  const setStore = (id, patch) => setForm((f) => ({ ...f, company: { ...f.company, stores: f.company.stores.map((st) => (st.id === id ? { ...st, ...patch } : st)) } }));
  const addStore = () => setCompany({ stores: [...company.stores, { id: `tienda-${Date.now().toString(36)}`, name: '', street: '', number: '', region: '', commune: '' }] });

  return (
    <SellerLayout crumbs={[{ label: 'Perfil y Tienda Física' }]}>
      <Box component="form" onSubmit={submit} noValidate>
        <SellerPageTitle
          title="Perfil y Tienda Física"
          subtitle="Mantén actualizados los datos de tu empresa y los tuyos. Se muestran a los compradores y se usan en tus comprobantes de venta."
          actions={(
            <>
              <Button onClick={() => { setForm(profile); setErrors({}); }} disabled={!dirty} sx={btnOutlined}>Descartar cambios</Button>
              <Button type="submit" sx={btnPrimary}>Guardar cambios</Button>
            </>
          )}
        />
        {Object.keys(errors).length > 0 && <Alert severity="error" sx={{ mt: 3 }}>Revisa los campos marcados antes de guardar.</Alert>}

        <Box sx={{ mt: 4, display: 'grid', gap: 3 }}>
          <Section title="Datos de la empresa" subtitle="Identifican a tu tienda en TodoMart.">
            <Field id="co-name" title="Nombre de la empresa" required>
              <TextInput id="co-name" value={company.name} onChange={(e) => setCompany({ name: e.target.value.slice(0, 80) })} error={errors.companyName} />
            </Field>
            <Field id="co-rut" title="RUT de la empresa" required>
              <TextInput id="co-rut" value={company.rut} onChange={(e) => setCompany({ rut: formatRut(e.target.value) })} placeholder="76.123.456-0" error={errors.companyRut} />
            </Field>
            <Field id="co-email" title="Correo de contacto" required>
              <TextInput id="co-email" type="email" value={company.email} onChange={(e) => setCompany({ email: e.target.value.slice(0, 80) })} error={errors.companyEmail} />
            </Field>
            <Field id="co-web" title="Página web" optional>
              <TextInput id="co-web" value={company.website} onChange={(e) => setCompany({ website: e.target.value.slice(0, 100) })} placeholder="www.miempresa.cl" error={errors.companyWebsite} />
            </Field>
            <Field id="co-phone-0" title="Teléfonos de la empresa" required>
              <PhoneList idPrefix="co-phone" phones={company.phones} onChange={(phones) => setCompany({ phones })} errors={errors.companyPhones} />
            </Field>
            <Field id="co-desc" title="Descripción de la tienda" optional>
              <TextInput id="co-desc" multiline minRows={3} value={company.description} onChange={(e) => setCompany({ description: e.target.value.slice(0, 300) })} sx={textarea} />
            </Field>
          </Section>

          <Section title="Tiendas físicas" subtitle="Locales donde atiendes o donde los compradores pueden retirar sus pedidos.">
            <Box sx={{ gridColumn: '1 / -1', display: 'grid', gap: 2 }}>
              {company.stores.length === 0 && (
                <Box role="status" sx={{ px: 2.5, py: 3, border: '1px dashed #D1D5DB', borderRadius: '8px', textAlign: 'center' }}>
                  <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>Sin tienda física</Typography>
                  <Typography sx={{ mt: 0.5, fontSize: 13, color: '#6B7280' }}>Tu empresa vende solo en línea. Agrega un local si atiendes público.</Typography>
                </Box>
              )}
              {company.stores.map((store, i) => (
                <Box key={store.id} component="fieldset" aria-label={`Tienda ${i + 1}`} sx={{ m: 0, p: 2.5, border: '1px solid #E5E7EB', borderRadius: '8px', minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, mb: 2 }}>
                    <Typography component="legend" sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{store.name.trim() || `Tienda ${i + 1}`}</Typography>
                    <Button onClick={() => setCompany({ stores: company.stores.filter((s) => s.id !== store.id) })} startIcon={<DeleteOutlinedIcon />} aria-label={`Eliminar tienda ${i + 1}`} sx={{ ...btnOutlinedRed, height: 34, fontSize: 13 }}>Eliminar</Button>
                  </Box>
                  <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: 'minmax(0, 1fr)', md: 'repeat(2, minmax(0, 1fr))' } }}>
                    <Field id={`store-${i}-name`} title="Nombre del local" optional sx={{ gridColumn: '1 / -1' }}>
                      <TextInput id={`store-${i}-name`} value={store.name} onChange={(e) => setStore(store.id, { name: e.target.value.slice(0, 60) })} placeholder="Ej. Casa matriz, Sucursal Maipú" />
                    </Field>
                    <AddressFields idPrefix={`store-${i}`} value={store} onChange={(v) => setStore(store.id, v)} errors={errors.stores?.[i]} />
                  </Box>
                </Box>
              ))}
              <Button onClick={addStore} startIcon={<AddIcon />} sx={{ ...btnOutlinedRed, height: 38, justifySelf: 'start' }}>{company.stores.length ? 'Agregar otra tienda' : 'Agregar tienda física'}</Button>
            </Box>
          </Section>

          <Section title="Datos del emprendedor" subtitle="Tus datos personales como responsable de la tienda.">
            <Field id="ow-name" title="Nombre completo" required>
              <TextInput id="ow-name" value={owner.name} onChange={(e) => setOwner({ name: e.target.value.slice(0, 80) })} error={errors.ownerName} />
            </Field>
            <Field id="ow-run" title="RUN" required>
              <TextInput id="ow-run" value={owner.run} onChange={(e) => setOwner({ run: formatRut(e.target.value) })} placeholder="12.345.678-5" error={errors.ownerRun} />
            </Field>
            <Field id="ow-email" title="Correo" required>
              <TextInput id="ow-email" type="email" value={owner.email} onChange={(e) => setOwner({ email: e.target.value.slice(0, 80) })} error={errors.ownerEmail} />
            </Field>
            <Field id="ow-phone-0" title="Teléfonos" required>
              <PhoneList idPrefix="ow-phone" phones={owner.phones} onChange={(phones) => setOwner({ phones })} errors={errors.ownerPhones} />
            </Field>
            <AddressFields idPrefix="ow-address" value={owner.address} onChange={(address) => setOwner({ address })} errors={errors.ownerAddress} />
          </Section>

          <Typography sx={{ fontSize: 13, color: '#6B7280' }}>El perfil de emprendedor no se puede eliminar desde el panel. Si quieres cerrar tu tienda, escríbenos a soporte.</Typography>
        </Box>
      </Box>

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')}>{toast}</Alert>
      </Snackbar>
    </SellerLayout>
  );
}
