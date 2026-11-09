import { useRef, useState } from 'react';
import { Box, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import PictureAsPdfOutlinedIcon from '@mui/icons-material/PictureAsPdfOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import TextInput from '../atoms/TextInput';
import { QUOTE_VALID_DAYS, daysLeft, effectiveStatus, formatDMY, quoteTotals, validUntil } from '../../utils/quotations';
import { formatWhen } from '../../utils/seller';
import { formatPrice } from '../../utils/format';
import { btnOutlined, btnPrimary } from '../../utils/sellerStyles';
import { colors } from '../../utils/theme';

const REPLY_MAX = 500;
const MAX_PDF = 5 * 1024 * 1024;
const caps = { fontSize: 11, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: '#4B5563' };
const small = { fontSize: 11.5, color: '#9CA3AF' };
const label = { display: 'block', mb: 1, fontSize: 14, fontWeight: 600, color: colors.ink };

const STATUS_NOTE = {
  Respondida: 'Respondiste esta cotización. El cliente puede aceptarla o rechazarla mientras esté vigente.',
  Aceptada: 'El cliente aceptó la cotización. Recibirás el pedido cuando complete el pago.',
  Rechazada: 'El cliente rechazó esta cotización.',
  Expirada: 'La cotización venció. El cliente puede volver a solicitarla.',
};

/**
 * Panel lateral para responder (o revisar) una cotización recibida. Los precios salen del catálogo y la vigencia es fija
 * (15 días desde la solicitud): el vendedor confirma disponibilidad y condiciones, y puede adjuntar un PDF.
 * onSend({ text, attachment }) · onClose()
 */
export default function QuoteResponsePanel({ quotation, onSend, onClose }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);
  const now = new Date();
  const status = effectiveStatus(quotation, now);
  const pending = status === 'Solicitada';
  const totals = quoteTotals(quotation.items);
  const shortages = quotation.items.filter((i) => i.quantity > i.stock);
  const left = daysLeft(quotation, now);

  const pickFile = (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    if (f.type !== 'application/pdf' && !f.name.toLowerCase().endsWith('.pdf')) { setErrors((x) => ({ ...x, file: 'Solo se aceptan archivos PDF.' })); return; }
    if (f.size > MAX_PDF) { setErrors((x) => ({ ...x, file: 'El PDF no puede pesar más de 5 MB.' })); return; }
    setErrors((x) => ({ ...x, file: undefined }));
    setFile({ name: f.name, size: f.size });
  };

  const submit = (e) => {
    e.preventDefault();
    if (!text.trim()) { setErrors((x) => ({ ...x, text: 'Escribe una respuesta para el cliente.' })); return; }
    onSend({ text: text.trim(), attachment: file });
  };

  return (
    <Box component="form" onSubmit={submit} noValidate aria-labelledby="quote-panel-title" sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2.5, minHeight: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, pb: 2.5, borderBottom: '1px solid #E5E7EB' }}>
        <Box>
          <Typography sx={{ ...caps, color: colors.primary }}>{pending ? 'Respuesta a cotización' : 'Detalle de cotización'}</Typography>
          <Typography id="quote-panel-title" component="h2" sx={{ mt: 0.75, fontSize: 18, fontWeight: 700, color: colors.ink }}>#{quotation.id}</Typography>
        </Box>
        <IconButton onClick={onClose} aria-label="Cerrar panel" sx={{ border: '1px solid #E5E7EB', width: 32, height: 32 }}><CloseIcon sx={{ fontSize: 18 }} /></IconButton>
      </Box>

      <Box sx={{ p: 2, bgcolor: '#F7F7F8', borderRadius: '8px', display: 'grid', gap: 1.5 }}>
        <Typography sx={caps}>Resumen de solicitud</Typography>
        <Box>
          <Typography sx={small}>Cliente</Typography>
          <Typography sx={{ fontSize: 14.5, fontWeight: 600, color: colors.ink }}>{quotation.buyer.name} <Box component="span" sx={{ fontWeight: 400, fontSize: 12.5, color: '#6B7280' }}>· {quotation.buyer.type}</Box></Typography>
        </Box>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
          <Box><Typography sx={small}>Solicitada</Typography><Typography sx={{ fontSize: 13.5, color: colors.ink }}>{formatWhen(quotation.createdAt, now)}</Typography></Box>
          <Box>
            <Typography sx={small}>Vigente hasta</Typography>
            <Typography sx={{ fontSize: 13.5, color: status === 'Expirada' ? colors.primary : colors.ink }}>{formatDMY(validUntil(quotation))}{left >= 0 && status !== 'Aceptada' && status !== 'Rechazada' ? ` (${left === 0 ? 'hoy' : `${left} d`})` : ''}</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={small}>Productos solicitados</Typography>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, mt: 0.5, p: 0, display: 'grid', gap: 1 }}>
            {quotation.items.map((i) => (
              <Box component="li" key={i.productId}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1.5 }}>
                  <Typography sx={{ fontSize: 13.5, color: colors.ink }}>{i.quantity} × {i.name}</Typography>
                  <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: colors.ink, whiteSpace: 'nowrap' }}>{formatPrice(i.unitPrice * i.quantity)}</Typography>
                </Box>
                <Typography sx={{ fontSize: 11.5, color: '#6B7280' }}>{formatPrice(i.unitPrice)} c/u · {i.detail}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Box sx={{ pt: 1.5, borderTop: '1px solid #E5E7EB', display: 'grid', gap: 0.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 13, color: '#6B7280' }}>Neto</Typography><Typography sx={{ fontSize: 13 }}>{formatPrice(totals.neto)}</Typography></Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}><Typography sx={{ fontSize: 13, color: '#6B7280' }}>IVA (19%)</Typography><Typography sx={{ fontSize: 13 }}>{formatPrice(totals.iva)}</Typography></Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}><Typography sx={{ fontSize: 14, fontWeight: 700 }}>Total</Typography><Typography sx={{ fontSize: 17, fontWeight: 700, color: colors.primary }}>{formatPrice(totals.total)}</Typography></Box>
        </Box>
      </Box>

      {shortages.length > 0 && (
        <Box role="status" sx={{ display: 'flex', gap: 1.25, p: 1.5, bgcolor: '#FFF6DD', borderRadius: '8px', color: '#8A5A00', fontSize: 13 }}>
          <WarningAmberOutlinedIcon aria-hidden sx={{ fontSize: 20, flexShrink: 0 }} />
          <Box>{shortages.map((s) => <div key={s.productId}>{s.name}: piden {s.quantity}, tienes {s.stock} en stock.</div>)} Indícalo en tu respuesta.</Box>
        </Box>
      )}

      {quotation.message && (
        <Box>
          <Typography sx={label}>Mensaje del cliente</Typography>
          <Typography sx={{ fontSize: 13.5, color: '#4B5563', whiteSpace: 'pre-wrap', p: 1.5, border: '1px solid #E5E7EB', borderRadius: '8px' }}>{quotation.message}</Typography>
        </Box>
      )}

      {pending ? (
        <>
          <Box>
            <Typography component="label" htmlFor="quote-reply" sx={label}>Condiciones y detalles de la respuesta</Typography>
            <TextInput
              id="quote-reply"
              multiline
              minRows={5}
              value={text}
              onChange={(e) => { setText(e.target.value.slice(0, REPLY_MAX)); if (errors.text) setErrors((x) => ({ ...x, text: undefined })); }}
              placeholder="Confirma disponibilidad, plazos de entrega y condiciones especiales."
              error={errors.text}
              sx={{ '& .MuiOutlinedInput-root.MuiInputBase-multiline': { height: 'auto', py: 1.5, px: 1.5, alignItems: 'flex-start' }, '& textarea': { height: 'auto', padding: '0 !important', fontSize: 14 } }}
            />
            <Box sx={{ mt: 0.5, display: 'flex', justifyContent: 'space-between', gap: 1 }}>
              <Typography sx={{ fontSize: 11.5, color: '#9CA3AF' }}>Los precios del catálogo y la vigencia de {QUOTE_VALID_DAYS} días no se modifican.</Typography>
              <Typography sx={{ fontSize: 11.5, color: '#9CA3AF', whiteSpace: 'nowrap' }}>{text.length} / {REPLY_MAX}</Typography>
            </Box>
          </Box>
          <Box>
            <Typography sx={label}>Folleto o Términos (Opcional)</Typography>
            <input ref={fileRef} type="file" accept="application/pdf,.pdf" hidden onChange={pickFile} aria-label="Subir PDF de condiciones" />
            {file ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1.25, border: '1px solid #E5E7EB', borderRadius: '8px' }}>
                <PictureAsPdfOutlinedIcon aria-hidden sx={{ color: colors.primary }} />
                <Typography sx={{ flex: 1, minWidth: 0, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                <IconButton size="small" onClick={() => setFile(null)} aria-label="Quitar PDF"><CloseIcon sx={{ fontSize: 16 }} /></IconButton>
              </Box>
            ) : (
              <Button fullWidth onClick={() => fileRef.current?.click()} startIcon={<FileUploadOutlinedIcon />} sx={{ height: 48, border: '1px dashed #9CA3AF', borderRadius: '8px', color: colors.ink, fontFamily: 'inherit', fontSize: 13, fontWeight: 600, '&:hover': { bgcolor: '#FAFAFA' } }}>Subir PDF de Condiciones</Button>
            )}
            {errors.file && <Typography role="alert" sx={{ mt: 0.5, fontSize: 12, color: 'error.main' }}>{errors.file}</Typography>}
          </Box>
          <Box sx={{ mt: 'auto', display: 'grid', gap: 1.25, pt: 1 }}>
            <Button type="submit" sx={{ ...btnPrimary, height: 46, fontSize: 15 }}>Enviar Cotización</Button>
            <Button onClick={onClose} sx={{ ...btnOutlined, height: 46, fontSize: 15 }}>Cancelar</Button>
          </Box>
        </>
      ) : (
        <>
          {quotation.reply && (
            <Box sx={{ p: 1.5, bgcolor: '#F7F7F8', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
              <Typography sx={{ ...caps, color: '#15803D' }}>Tu respuesta · {formatWhen(quotation.reply.at, now)}</Typography>
              <Typography sx={{ mt: 0.75, fontSize: 13.5, color: colors.ink, whiteSpace: 'pre-wrap' }}>{quotation.reply.text}</Typography>
              {quotation.reply.attachment && <Typography sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 0.75, fontSize: 12.5, color: '#4B5563' }}><PictureAsPdfOutlinedIcon aria-hidden sx={{ fontSize: 18, color: colors.primary }} />{quotation.reply.attachment.name}</Typography>}
            </Box>
          )}
          <Typography role="note" sx={{ fontSize: 13.5, color: '#4B5563' }}>{status === 'Expirada' && !quotation.reply ? 'La cotización venció sin respuesta. El cliente puede volver a solicitarla.' : STATUS_NOTE[status]}</Typography>
          <Button onClick={onClose} sx={{ ...btnOutlined, height: 46, mt: 'auto' }}>Cerrar</Button>
        </>
      )}
    </Box>
  );
}
