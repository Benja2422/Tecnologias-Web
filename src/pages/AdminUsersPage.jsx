import { useMemo, useState } from 'react';
import { Alert, Snackbar, Typography } from '@mui/material';
import AdminLayout from '../components/templates/AdminLayout';
import UserStats from '../components/organisms/UserStats';
import UsersTable from '../components/organisms/UsersTable';
import UserEditDialog from '../components/organisms/UserEditDialog';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import { colors } from '../utils/theme';
import { downloadCsv } from '../utils/csv';
import { mockAdmin, mockUsers } from '../utils/mockUsers';
import { currentUser } from '../utils/mockCatalog';

const PAGE_SIZE = 6;
const CRUMBS = [{ label: 'Panel de Administración', href: '/admin' }, { label: 'Usuarios' }];

const CSV_COLUMNS = [
  { header: 'ID', value: (u) => u.id },
  { header: 'Nombre', value: (u) => `${u.firstName} ${u.lastName}` },
  { header: 'RUT', value: (u) => u.rut },
  { header: 'Correo electrónico', value: (u) => u.email },
  { header: 'Tipo de cuenta', value: (u) => u.accountType },
  { header: 'Estado', value: (u) => u.status },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [toast, setToast] = useState('');

  // TODO: estas cifras y la paginación deberían venir del backend (src/services)
  const stats = useMemo(() => {
    const active = users.filter((u) => u.status === 'Activo');
    return {
      total: users.length,
      activeClients: active.filter((u) => u.accountType.includes('Cliente')).length,
      entrepreneurs: active.filter((u) => u.accountType.includes('Emprendedor')).length,
      suspended: users.length - active.length,
    };
  }, [users]);

  const totalPages = Math.max(1, Math.ceil(users.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visible = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const saveUser = async (id, { password, ...data }) => {
    // TODO: enviar a src/services. `password` solo viene si el admin escribió una nueva.
    // Si el servicio falla, lanzar un Error para que el modal muestre el mensaje.
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...data } : u)));
    setEditing(null);
    setToast('Usuario actualizado');
  };

  const deleteUser = () => {
    // TODO: eliminar vía src/services
    setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
    setDeleting(null);
    setToast('Usuario eliminado');
  };

  const exportCsv = () => downloadCsv('usuarios-todomart.csv', users, CSV_COLUMNS);

  return (
    <AdminLayout headerProps={{ user: currentUser, cartCount: 3 }} crumbs={CRUMBS} admin={mockAdmin}>
      <Typography component="h1" sx={{ mb: 4, fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.ink }}>
        Gestión de Usuarios
      </Typography>

      <UserStats stats={stats} />

      <UsersTable
        users={visible}
        total={users.length}
        page={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onEdit={setEditing}
        onDelete={setDeleting}
        onExport={exportCsv}
      />

      {editing && <UserEditDialog key={editing.id} user={editing} onSave={saveUser} onClose={() => setEditing(null)} />}

      {deleting && (
        <ConfirmDialog
          title="Eliminar usuario"
          message={`¿Seguro que quieres eliminar a ${deleting.firstName} ${deleting.lastName}? Esta acción no se puede deshacer.`}
          confirmLabel="Eliminar"
          onConfirm={deleteUser}
          onClose={() => setDeleting(null)}
        />
      )}

      <Snackbar open={Boolean(toast)} autoHideDuration={3000} onClose={() => setToast('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity="success" variant="filled" onClose={() => setToast('')} sx={{ width: '100%' }}>{toast}</Alert>
      </Snackbar>
    </AdminLayout>
  );
}
