import { Box, ButtonBase } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { colors } from '../../utils/theme';

/**
 * Imagen principal + miniaturas.
 * images: [{ id, src, alt }], activeId, onSelect(id). Sin imágenes muestra un placeholder.
 */
export default function ProductGallery({ images, activeId, onSelect, placeholderLabel }) {
  const active = images.find((i) => i.id === activeId) ?? images[0];

  return (
    <Box>
      <Box
        sx={{
          height: { xs: 320, md: 500 }, display: 'grid', placeItems: 'center', borderRadius: 3, overflow: 'hidden',
          ...(active ? {} : { bgcolor: '#F4F4F4', color: '#C8C8C8' }),
        }}
      >
        {active ? (
          <Box component="img" src={active.src} alt={active.alt} sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        ) : (
          <Box sx={{ textAlign: 'center' }}>
            <ImageOutlinedIcon sx={{ fontSize: 72 }} />
            {placeholderLabel && <Box sx={{ fontSize: 14, color: colors.muted }}>{placeholderLabel}</Box>}
          </Box>
        )}
      </Box>

      {images.length > 1 && (
        <Box sx={{ display: 'flex', gap: 2, mt: 1.75, flexWrap: 'wrap' }} role="group" aria-label="Imágenes del producto">
          {images.map((img) => {
            const selected = img.id === active?.id;
            return (
              <ButtonBase
                key={img.id}
                onClick={() => onSelect(img.id)}
                aria-label={img.alt}
                aria-pressed={selected}
                sx={{
                  width: 80, height: 80, p: 0.5, borderRadius: 2, bgcolor: '#fff', overflow: 'hidden',
                  border: selected ? `2px solid ${colors.primary}` : '1px solid #EEE',
                  '&:hover': { borderColor: selected ? colors.primary : '#CFCFCF' },
                  '&.Mui-focusVisible': { outline: `2px solid ${colors.link}`, outlineOffset: 2 },
                }}
              >
                <Box component="img" src={img.src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
              </ButtonBase>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
