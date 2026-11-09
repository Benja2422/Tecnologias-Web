import { Box } from '@mui/material';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

/** Miniatura de producto: la imagen o, si no hay, una caja con un ícono. dashed: borde punteado. */
export default function ItemThumb({ src, size = 48, dashed = false }) {
  return (
    <Box sx={{ width: size, height: size, flexShrink: 0, borderRadius: '6px', border: `1px ${dashed ? 'dashed' : 'solid'} #D1D5DB`, bgcolor: src ? '#fff' : '#F9FAFB', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
      {src ? <Box component="img" src={src} alt="" sx={{ width: '100%', height: '100%', objectFit: 'contain' }} /> : <ImageOutlinedIcon aria-hidden sx={{ fontSize: size * 0.42, color: '#9CA3AF' }} />}
    </Box>
  );
}
