import { useState } from 'react';
import { Box, Button, Dialog, IconButton, InputBase, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import SelectInput from '../atoms/SelectInput';
import { REGION_NAMES, communesOf, parseAmount } from '../../utils/seller';
import { formatThousands } from '../../utils/format';
import { btnOutlined, btnOutlinedRed, btnPrimary, iconBtn } from '../../utils/sellerStyles';
import { colors } from '../../utils/theme';

const h3 = { fontSize: 15, fontWeight: 700, color: colors.ink };
const help = { mt: 0.5, fontSize: 12.5, color: '#6B7280' };
const money = (n) => (n || n === 0 ? formatThousands(String(n)) : '');
const regionOptions = REGION_NAMES.map((r) => ({ id: r, name: r }));
const compactSelect = { '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input.MuiSelect-select': { height: 38, fontSize: 13.5 } };

/** Campo compacto de monto ($) o número. */
function Amount({ value, onChange, label, error, prefix = '$' }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', height: 38, px: 1.25, border: `1px solid ${error ? '#d32f2f' : '#D1D5DB'}`, borderRadius: '6px', bgcolor: '#fff', '&:focus-within': { borderColor: colors.primary } }}>
      {prefix && <Box component="span" aria-hidden sx={{ mr: 0.75, fontSize: 13, color: '#6B7280' }}>{prefix}</Box>}
      <InputBase fullWidth value={value} onChange={(e) => onChange(formatThousands(e.target.value.replace(/\D/g, '').slice(0, 7)))} inputProps={{ 'aria-label': label, inputMode: 'numeric' }} sx={{ fontSize: 14, fontFamily: 'inherit' }} />
    </Box>
  );
}

/**
 * "Ajustar despachos": costos de envío por zona geográfica (región, con excepciones por comuna) y por peso.
 * rates: ver defaultShippingRates() en utils/seller. onSave(rates).
 */
export default function ShippingRatesDialog({ rates, onSave, onClose }) {
  const [regions, setRegions] = useState(() => Object.fromEntries(REGION_NAMES.map((r) => [r, { estandar: money(rates.regions[r]?.estandar), express: money(rates.regions[r]?.express) }])));
  const [communes, setCommunes] = useState(() => rates.communes.map((c) => ({ ...c, estandar: money(c.estandar), express: money(c.express) })));
  const [free, setFree] = useState(rates.gratisDesde ? money(rates.gratisDesde) : '');
  const [kgIncluded, setKgIncluded] = useState(String(rates.kgIncluidos ?? 5));
  const [perKg, setPerKg] = useState(money(rates.porKgExtra ?? 0));
  const [error, setError] = useState('');

  const setRegion = (r, k, v) => setRegions((x) => ({ ...x, [r]: { ...x[r], [k]: v } }));
  const setCommune = (i, patch) => setCommunes((list) => list.map((c, j) => (j === i ? { ...c, ...patch } : c)));

  const submit = (e) => {
    e.preventDefault();
    const next = { regions: {}, communes: [], gratisDesde: 0, kgIncluidos: 0, porKgExtra: 0 };
    for (const r of REGION_NAMES) {
      const est = parseAmount(regions[r].estandar);
      const exp = parseAmount(regions[r].express);
      if (!(est > 0) || !(exp > 0)) { setError(`Completa las tarifas de la región ${r}.`); return; }
      next.regions[r] = { estandar: est, express: exp };
    }
    const seen = new Set();
    for (const c of communes) {
      const est = parseAmount(c.estandar);
      const exp = parseAmount(c.express);
      if (!c.region || !c.commune || !(est > 0) || !(exp > 0)) { setError('Completa o quita las excepciones por comuna incompletas.'); return; }
      if (seen.has(`${c.region}|${c.commune}`)) { setError(`La comuna ${c.commune} está repetida.`); return; }
      seen.add(`${c.region}|${c.commune}`);
      next.communes.push({ region: c.region, commune: c.commune, estandar: est, express: exp });
    }
    const kgs = Number(kgIncluded.replace(/\D/g, ''));
    if (kgIncluded === '' || !Number.isInteger(kgs)) { setError('Indica cuántos kg incluye la tarifa base.'); return; }
    next.kgIncluidos = kgs;
    next.porKgExtra = Number.isFinite(parseAmount(perKg)) ? parseAmount(perKg) : 0;
    next.gratisDesde = Number.isFinite(parseAmount(free)) ? parseAmount(free) : 0;
    setError('');
    onSave(next);
  };

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth={false} scroll="paper" slotProps={{ paper: { component: 'form', onSubmit: submit, noValidate: true, sx: { maxWidth: 760, width: 'calc(100% - 32px)', m: 2, borderRadius: 3 } } }} aria-labelledby="rates-title">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, px: 3, pt: 3, pb: 1.5 }}>
        <Box>
          <Typography id="rates-title" component="h2" sx={{ fontSize: 20, fontWeight: 700, color: colors.ink }}>Ajustar despachos</Typography>
          <Typography sx={{ mt: 0.5, fontSize: 13.5, color: '#6B7280' }}>Costos de envío (con IVA) por zona geográfica y por peso. La tarifa de una comuna reemplaza la de su región.</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar" sx={{ mt: -0.5 }}><CloseIcon /></IconButton>
      </Box>

      <Box sx={{ px: 3, pb: 3, overflowY: 'auto', display: 'grid', gap: 3.5 }}>
        <Box component="section" aria-labelledby="rates-regions">
          <Typography id="rates-regions" component="h3" sx={h3}>Tarifas por región</Typography>
          <Box role="table" aria-label="Tarifas por región" sx={{ mt: 1.5, border: '1px solid #E5E7EB', borderRadius: '8px', overflow: 'hidden' }}>
            <Box role="row" sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(90px, 130px) minmax(90px, 130px)', gap: 1.5, px: 2, py: 1, bgcolor: '#F9FAFB', fontSize: 11, fontWeight: 600, color: '#4B5563', letterSpacing: '0.03em' }}>
              <Box role="columnheader">REGIÓN</Box><Box role="columnheader">ESTÁNDAR</Box><Box role="columnheader">EXPRESS</Box>
            </Box>
            {REGION_NAMES.map((r) => (
              <Box role="row" key={r} sx={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(90px, 130px) minmax(90px, 130px)', gap: 1.5, alignItems: 'center', px: 2, py: 0.75, borderTop: '1px solid #F0F0F0' }}>
                <Box role="cell" sx={{ fontSize: 13.5, color: colors.ink, overflowWrap: 'anywhere' }}>{r}</Box>
                <Box role="cell"><Amount value={regions[r].estandar} onChange={(v) => setRegion(r, 'estandar', v)} label={`Estándar ${r}`} error={!regions[r].estandar} /></Box>
                <Box role="cell"><Amount value={regions[r].express} onChange={(v) => setRegion(r, 'express', v)} label={`Express ${r}`} error={!regions[r].express} /></Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box component="section" aria-labelledby="rates-communes">
          <Typography id="rates-communes" component="h3" sx={h3}>Excepciones por comuna</Typography>
          <Typography sx={help}>Úsalas para comunas con un costo distinto al de su región (por ejemplo, las más cercanas a tu bodega).</Typography>
          <Box sx={{ mt: 1.5, display: 'grid', gap: 1.25 }}>
            {communes.map((c, i) => (
              <Box key={i} sx={{ display: 'grid', gap: 1, alignItems: 'center', gridTemplateColumns: { xs: 'minmax(0, 1fr) minmax(0, 1fr)', sm: 'minmax(0, 1.3fr) minmax(0, 1fr) 110px 110px 38px' } }}>
                <SelectInput options={regionOptions} value={c.region} onChange={(e) => setCommune(i, { region: e.target.value, commune: '' })} placeholder="Región" ariaLabel={`Región de la excepción ${i + 1}`} sx={compactSelect} />
                <SelectInput options={communesOf(c.region).map((n) => ({ id: n, name: n }))} value={c.commune} onChange={(e) => setCommune(i, { commune: e.target.value })} placeholder="Comuna" ariaLabel={`Comuna de la excepción ${i + 1}`} disabled={!c.region} sx={compactSelect} />
                <Amount value={c.estandar} onChange={(v) => setCommune(i, { estandar: v })} label={`Estándar de la excepción ${i + 1}`} />
                <Amount value={c.express} onChange={(v) => setCommune(i, { express: v })} label={`Express de la excepción ${i + 1}`} />
                <IconButton aria-label={`Quitar excepción ${i + 1}`} onClick={() => setCommunes((list) => list.filter((_, j) => j !== i))} sx={{ ...iconBtn, width: 38, height: 38, color: colors.primary }}><DeleteOutlinedIcon /></IconButton>
              </Box>
            ))}
            <Button onClick={() => setCommunes((list) => [...list, { region: '', commune: '', estandar: '', express: '' }])} startIcon={<AddIcon />} sx={{ ...btnOutlinedRed, height: 36, justifySelf: 'start', fontSize: 13 }}>Agregar comuna</Button>
          </Box>
        </Box>

        <Box component="section" aria-labelledby="rates-weight" sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: 'minmax(0, 1fr)', sm: 'repeat(3, minmax(0, 1fr))' } }}>
          <Box sx={{ gridColumn: '1 / -1' }}>
            <Typography id="rates-weight" component="h3" sx={h3}>Peso y envío gratis</Typography>
            <Typography sx={help}>Sobre los kg incluidos se cobra un recargo por cada kg adicional (según el peso de tus productos).</Typography>
          </Box>
          <Box>
            <Typography sx={{ mb: 0.75, fontSize: 13, fontWeight: 600 }}>Kg incluidos en la tarifa</Typography>
            <Amount prefix="" value={kgIncluded} onChange={(v) => setKgIncluded(v.replace(/\D/g, '').slice(0, 3))} label="Kg incluidos en la tarifa" />
          </Box>
          <Box>
            <Typography sx={{ mb: 0.75, fontSize: 13, fontWeight: 600 }}>Costo por kg adicional</Typography>
            <Amount value={perKg} onChange={setPerKg} label="Costo por kg adicional" />
          </Box>
          <Box>
            <Typography sx={{ mb: 0.75, fontSize: 13, fontWeight: 600 }}>Estándar gratis desde <Box component="span" sx={{ fontWeight: 400, color: '#9CA3AF' }}>(opcional)</Box></Typography>
            <Amount value={free} onChange={setFree} label="Envío estándar gratis desde" />
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 3, py: 2, borderTop: '1px solid #EEE', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
        {error && <Typography role="alert" sx={{ mr: 'auto', fontSize: 13, color: 'error.main' }}>{error}</Typography>}
        <Button onClick={onClose} sx={btnOutlined}>Cancelar</Button>
        <Button type="submit" sx={btnPrimary}>Guardar tarifas</Button>
      </Box>
    </Dialog>
  );
}
