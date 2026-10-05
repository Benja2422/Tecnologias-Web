import { useState } from 'react';
import { Button, InputAdornment } from '@mui/material';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import TextInput from '../atoms/TextInput';
import { colors } from '../../utils/theme';

export default function PasswordField({ id, ...props }) {
  const [visible, setVisible] = useState(false);
  const Icon = visible ? VisibilityOffOutlinedIcon : VisibilityOutlinedIcon;

  return (
    <TextInput
      id={id}
      type={visible ? 'text' : 'password'}
      autoComplete="new-password"
      placeholder="••••••••"
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={() => setVisible((v) => !v)}
              startIcon={<Icon fontSize="small" />}
              aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              sx={{ color: colors.muted, fontWeight: 400, minWidth: 0 }}
            >
              {visible ? 'Ocultar' : 'Mostrar'}
            </Button>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
