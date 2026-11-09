// Estilos de botones del panel de emprendedor (para usar en sx).
import { colors } from './theme';

const base = { height: 42, px: 2.5, borderRadius: '6px', fontFamily: 'inherit', fontSize: 14, fontWeight: 600, textTransform: 'none', whiteSpace: 'nowrap' };

export const btnPrimary = { ...base, bgcolor: colors.primary, color: '#fff', '&:hover': { bgcolor: colors.primaryDark }, '&.Mui-disabled': { bgcolor: '#E5A3A3', color: '#fff' } };
export const btnOutlined = { ...base, color: colors.ink, border: '1px solid #D1D5DB', bgcolor: '#fff', '&:hover': { bgcolor: '#F7F7F7', borderColor: '#9CA3AF' } };
export const btnOutlinedRed = { ...base, color: colors.primary, border: `1px solid ${colors.primary}`, bgcolor: '#fff', '&:hover': { bgcolor: '#FDECEF' } };
export const btnSmall = { height: 32, px: 1.5, fontSize: 13 };
export const iconBtn = { width: 30, height: 30, border: '1px solid #D1D5DB', borderRadius: '6px', '& svg': { fontSize: 17 } };

/** Tarjeta blanca del panel. */
export const card = { bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: '10px' };
