import { TextField } from '@mui/material';

export default function TextInput({ error, ...props }) {
  return (
    <TextField
      fullWidth
      variant="outlined"
      error={Boolean(error)}
      helperText={error || undefined}
      FormHelperTextProps={{ sx: { mx: 0.5 } }}
      {...props}
    />
  );
}
