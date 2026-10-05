import { Button } from '@mui/material';

export default function PrimaryButton({ children, ...props }) {
  return (
    <Button
      fullWidth
      variant="contained"
      disableElevation
      sx={{ borderRadius: 999, py: 1.7, fontSize: 17 }}
      {...props}
    >
      {children}
    </Button>
  );
}
