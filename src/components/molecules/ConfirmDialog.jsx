import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { colors } from '../../utils/theme';

export default function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', onConfirm, onClose }) {
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontFamily: 'inherit' }}>{message}</DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} sx={{ color: colors.muted }}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" disableElevation autoFocus>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}
