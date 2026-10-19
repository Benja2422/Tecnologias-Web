import { MenuItem, Typography } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import TextInput, { FIELD_HEIGHT } from './TextInput';

/**
 * Menú desplegable con el mismo aspecto que TextInput.
 * options: [{ id, name }] — value es el id elegido ('' = sin selección).
 */
export default function SelectInput({ options, placeholder = 'Selecciona una opción', ariaLabel, sx, slotProps = {}, children, ...props }) {
  return (
    <TextInput
      select
      slotProps={{
        ...slotProps,
        select: {
          displayEmpty: true,
          IconComponent: KeyboardArrowDownIcon,
          renderValue: (value) =>
            options.find((o) => o.id === value)?.name ?? (
              <Typography component="span" sx={{ fontSize: 15, color: '#9A9A9A' }}>{placeholder}</Typography>
            ),
          // El alto del texto del menú cerrado se mantiene igual que en TextInput
          SelectDisplayProps: { 'aria-label': ariaLabel },
          MenuProps: { slotProps: { paper: { sx: { maxHeight: 320 } } } },
          ...slotProps.select,
        },
      }}
      sx={{
        '& .MuiOutlinedInput-input.MuiSelect-select': {
          display: 'flex', alignItems: 'center', height: FIELD_HEIGHT, minHeight: 0, boxSizing: 'border-box', paddingRight: '40px',
        },
        ...sx,
      }}
      {...props}
    >
      {children ?? options.map(({ id, name }) => <MenuItem key={id} value={id} sx={{ fontSize: 15 }}>{name}</MenuItem>)}
    </TextInput>
  );
}
