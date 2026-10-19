import { useState } from 'react';
import { Alert, Snackbar } from '@mui/material';
import AccountLayout from '../components/templates/AccountLayout';
import AddressBook from '../components/organisms/AddressBook';
import { mockProfile } from '../utils/mockProfile';
import { currentUser } from '../utils/mockCatalog';

export default function AddressesPage() {
  const [addresses, setAddresses] = useState(mockProfile.addresses);
  const [toast, setToast] = useState('');

  const update = (next, message) => {
    // TODO: persistir con src/services
    setAddresses(next);
    if (message) setToast(message);
  };

  return (
    <AccountLayout headerProps={{ user: { ...currentUser, name: mockProfile.fullName }, cartCount: 3 }}>
      <AddressBook addresses={addresses} onChange={update} />

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AccountLayout>
  );
}
