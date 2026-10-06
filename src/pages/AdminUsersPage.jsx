import { useMemo, useState } from 'react';
import { Alert, Box, Snackbar, Typography } from '@mui/material';
import AdminLayout from '../components/templates/AdminLayout';
import UserStats from '../components/organisms/UserStats';
import UsersTable from '../components/organisms/UsersTable';
import UserFormDialog from '../components/organisms/UserFormDialog';
import ConfirmDialog from '../components/molecules/ConfirmDialog';
import PrimaryButton from '../components/atoms/PrimaryButton';
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

const nextId = (users) => `#${Math.max(...users.map((u) => Number(u.id.slice(1)))) + 1}`;

// RUN y correo deben ser únicos
const findConflict = (users, { rut, email }, ignoreId) => {
  const others = users.filter((u) => u.id !== ignoreId);
  if (others.some((u) => u.rut === rut)) return 'Ya existe un usuario con ese RUN';
  if (others.some((u) => u.email.toLowerCase() === email.toLowerCase())) return 'Ya existe un usuario con ese correo';
  return '';
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [page, setPage] = useState(1);
  const [dialog, setDialog] = useState(null); // null | { user: User | null }  (null = crear)
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

  // Envío del modal (crear o actualizar). Si lanza un Error, el modal muestra el mensaje.
  const submitUser = async (values) => {
    const target = dialog.user;
    const conflict = findConflict(users, values, target?.id);
    if (conflict) throw new Error(conflict);

    // `password` solo viene si se escribió una (siempre en "crear")
    const { password, ...data } = values;

    if (target) {
      // TODO: actualizar vía src/services
      console.log('[Admin/Usuarios] Actualizar usuario:', { id: target.id, ...values });
      setUsers((prev) => prev.map((u) => (u.id === target.id ? { ...u, ...data } : u)));
      setToast('Usuario actualizado');
    } else {
      // TODO: crear vía src/services
      const newUser = { id: nextId(users), status: 'Activo', ...data };
      console.log('[Admin/Usuarios] Crear usuario:', { ...newUser, password });
      setUsers((prev) => [newUser, ...prev]);
      setPage(1);
      setToast('Usuario creado');
    }
    setDialog(null);
  };

  const deleteUser = () => {
    // TODO: eliminar vía src/services
    console.log('[Admin/Usuarios] Eliminar usuario:', deleting);
    setUsers((prev) => prev.filter((u) => u.id !== deleting.id));
    setDeleting(null);
    setToast('Usuario eliminado');
  };

  const exportCsv = () => downloadCsv('usuarios-todomart.csv', users, CSV_COLUMNS);

  return (
    <AdminLayout headerProps={{ user: currentUser, cartCount: 3 }} crumbs={CRUMBS} admin={mockAdmin}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Typography component="h1" sx={{ fontSize: { xs: 26, md: 32 }, fontWeight: 700, color: colors.ink }}>
          Gestión de Usuarios
        </Typography>
        <PrimaryButton
          fullWidth={false}
          onClick={() => setDialog({ user: null })}
          sx={{ height: 40, px: 2.5, py: 0, fontSize: 14, borderRadius: '6px' }}
        >
          Crear usuario
        </PrimaryButton>
      </Box>

      <UserStats stats={stats} />

      <UsersTable
        users={visible}
        total={users.length}
        page={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
        onEdit={(user) => setDialog({ user })}
        onDelete={setDeleting}
        onExport={exportCsv}
      />

      {dialog && <UserFormDialog key={dialog.user?.id ?? 'new'} user={dialog.user} onSave={submitUser} onClose={() => setDialog(null)} />}

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
