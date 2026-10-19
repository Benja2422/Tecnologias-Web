import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import AccountLayout from '../components/templates/AccountLayout';
import AddressBook from '../components/organisms/AddressBook';
import { useAddresses } from '../contexts/AddressesContext';
import { mockProfile } from '../utils/mockProfile';
import { currentUser } from '../utils/mockCatalog';

export default function AddressesPage() {
  const { addresses, setAddresses } = useAddresses();
  const [toast, setToast] = useState('');

  const update = (next, message) => {
    // TODO: persistir con src/services
    setAddresses(next);
    if (message) setToast(message);
  };

  return (
    <AccountLayout headerProps={{ user: { ...currentUser, name: mockProfile.fullName } }}>
      <AddressBook addresses={addresses} onChange={update} />

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AccountLayout>
  );
}
