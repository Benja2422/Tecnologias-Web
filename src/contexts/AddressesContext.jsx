import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mockProfile } from '../utils/mockProfile';

const AddressesContext = createContext({ addresses: [], setAddresses: () => {}, saveAddress: () => {} });

// Garantiza que siempre exista una dirección principal
export const ensurePrincipal = (list) =>
  list.length && !list.some((a) => a.isPrincipal) ? list.map((a, i) => (i === 0 ? { ...a, isPrincipal: true } : a)) : list;

/** Direcciones del usuario, compartidas entre "Mis direcciones" y el checkout. */
export function AddressesProvider({ children }) {
  const [addresses, setAddresses] = useState(mockProfile.addresses);

  // Agrega o reemplaza (por id) una dirección. Solo una puede ser la principal.
  const saveAddress = useCallback((address) => {
    // TODO: persistir con src/services
    setAddresses((prev) => {
      let next = prev.some((a) => a.id === address.id) ? prev.map((a) => (a.id === address.id ? address : a)) : [...prev, address];
      if (address.isPrincipal) next = next.map((a) => (a.id === address.id ? a : { ...a, isPrincipal: false }));
      return ensurePrincipal(next);
    });
  }, []);

  const value = useMemo(() => ({ addresses, setAddresses, saveAddress }), [addresses, saveAddress]);
  return <AddressesContext.Provider value={value}>{children}</AddressesContext.Provider>;
}

export const useAddresses = () => useContext(AddressesContext);
