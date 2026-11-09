import { useRef, useState } from 'react';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import CloseIcon from '@mui/icons-material/Close';
import { colors } from '../../utils/theme';

const MAX_SIZE = 5 * 1024 * 1024;
const TYPES = ['image/png', 'image/jpeg'];

/**
 * Zona para arrastrar o elegir imágenes (PNG o JPG, máx. 5 MB c/u, hasta `max`). La primera es la portada.
 * images: [{ name, src }] — src es una URL temporal (blob:) o null si la imagen no se cargó en esta sesión.
 * accent: borde y nube rojos (formulario de servicios).
 */
export default function ImageDropzone({ id, images, onChange, max = 5, title, hint, accent = false, error }) {
  const input = useRef(null);
  const [over, setOver] = useState(false);
  const [problem, setProblem] = useState('');

  const add = (files) => {
    const list = [...files];
    const valid = list.filter((f) => TYPES.includes(f.type) && f.size <= MAX_SIZE);
    const room = max - images.length;
    if (valid.length < list.length) setProblem('Algunos archivos no se agregaron: solo PNG o JPG de hasta 5 MB.');
    else if (valid.length > room) setProblem(`Puedes subir hasta ${max} imágenes.`);
    else setProblem('');
    if (room <= 0) return;
    onChange([...images, ...valid.slice(0, room).map((f) => ({ name: f.name, src: URL.createObjectURL(f) }))]);
  };
  const remove = (i) => {
    const img = images[i];
    if (img.src?.startsWith('blob:')) URL.revokeObjectURL(img.src);
    onChange(images.filter((_, j) => j !== i));
  };

  return (
    <Box>
      <input id={id} ref={input} type="file" accept="image/png,image/jpeg" multiple hidden onChange={(e) => { add(e.target.files ?? []); e.target.value = ''; }} />
      <ButtonBase
        onClick={() => input.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); add(e.dataTransfer.files ?? []); }}
        aria-describedby={`${id}-hint`}
        sx={{
          width: '100%', minHeight: 160, display: 'grid', placeContent: 'center', justifyItems: 'center', gap: 0.75, p: 3, textAlign: 'center',
          border: `${accent ? 2 : 1.5}px dashed ${error ? '#d32f2f' : accent || over ? colors.primary : '#D1D5DB'}`, borderRadius: '8px', fontFamily: 'inherit',
          bgcolor: over ? '#FFF5F5' : '#fff', '&:hover': { bgcolor: '#FAFAFA' },
        }}
      >
        <CloudUploadOutlinedIcon aria-hidden sx={{ fontSize: 34, color: accent ? colors.primary : '#6B7280' }} />
        <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.ink }}>{title}</Typography>
        <Typography id={`${id}-hint`} sx={{ fontSize: 12.5, color: '#6B7280' }}>{hint}</Typography>
      </ButtonBase>
      {(problem || error) && <Typography role="alert" sx={{ mt: 0.75, fontSize: 12, color: 'error.main' }}>{problem || error}</Typography>}

      {images.length > 0 && (
        <>
          <Typography sx={{ mt: 2.5, mb: 1.25, fontSize: 13, fontWeight: 600, color: colors.ink }}>Archivos cargados ({images.length} / {max})</Typography>
          <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 0, display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
            {images.map((img, i) => (
              <Box component="li" key={`${img.name}-${i}`} sx={{ position: 'relative', width: 100, height: 100, borderRadius: '8px', border: '1px solid #E5E7EB', bgcolor: '#F3F4F6', overflow: 'hidden', display: 'grid', placeItems: 'center' }}>
                {img.src ? <Box component="img" src={img.src} alt={img.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (
                  <Box sx={{ display: 'grid', justifyItems: 'center', gap: 0.5, px: 0.5 }}>
                    <ImageOutlinedIcon aria-hidden sx={{ fontSize: 28, color: '#6B7280' }} />
                    <Typography sx={{ fontSize: 10.5, color: '#4B5563', textAlign: 'center', overflowWrap: 'anywhere' }}>{img.name}</Typography>
                  </Box>
                )}
                {i === 0 && <Box component="span" sx={{ position: 'absolute', left: 4, bottom: 4, px: 0.75, borderRadius: '4px', bgcolor: 'rgba(0,0,0,.65)', color: '#fff', fontSize: 10 }}>Portada</Box>}
                <IconButton size="small" onClick={() => remove(i)} aria-label={`Quitar ${img.name}`} sx={{ position: 'absolute', top: 2, right: 2, width: 24, height: 24, bgcolor: 'rgba(255,255,255,.9)', '&:hover': { bgcolor: '#fff' } }}>
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
