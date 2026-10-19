import { Box, ButtonBase } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AppLink from '../atoms/AppLink';
import { colors } from '../../utils/theme';

/**
 * Fila del árbol de categorías.
 * - Con subcategorías: flecha que despliega/pliega (no navega).
 * - Sin ellas: punto. El nombre siempre navega a la categoría.
 * level 0 = categoría, 1 = subcategoría, 2 y 3 = niveles siguientes (cada uno con más sangría).
 */
export default function CategoryTreeItem({ name, href, level = 0, active = false, expandable = false, expanded = false, onToggle }) {
  return (
    <Box
      sx={{
        display: 'flex', alignItems: 'center', gap: '6px', minHeight: 32, pl: `${level === 0 ? 0 : 40 + (level - 1) * 24}px`, pr: '18px',
        borderRadius: '6px', bgcolor: active ? '#E5E7EB' : 'transparent',
        '&:hover': { bgcolor: active ? '#E5E7EB' : '#EEF0F3' },
      }}
    >
      {expandable ? (
        <ButtonBase
          onClick={onToggle}
          aria-expanded={expanded}
          aria-label={`${expanded ? 'Contraer' : 'Expandir'} ${name}`}
          sx={{ width: 14, height: 24, color: '#6B7280', overflow: 'visible', borderRadius: '4px', '&.Mui-focusVisible': { outline: `2px solid ${colors.link}` } }}
        >
          {expanded ? <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowRightIcon sx={{ fontSize: 16 }} />}
        </ButtonBase>
      ) : (
        <Box aria-hidden sx={{ width: 14, display: 'grid', placeItems: 'center' }}>
          <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: active ? colors.ink : '#9CA3AF' }} />
        </Box>
      )}
      <AppLink
        href={href}
        underline="none"
        aria-current={active ? 'page' : undefined}
        title={name}
        sx={{
          flex: 1, minWidth: 0, display: 'block', py: '6px', fontFamily: 'inherit', fontSize: 14, lineHeight: '20px',
          fontWeight: active ? 600 : 500, color: colors.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}
      >
        {name}
      </AppLink>
    </Box>
  );
}
