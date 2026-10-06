import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import UserRow from '../molecules/UserRow';
import PaginationBar from '../molecules/PaginationBar';
import { colors } from '../../utils/theme';

const COLUMNS = [
  { label: 'Nombre', width: 240 },
  { label: 'RUT', width: 150 },
  { label: 'Correo electrónico', width: 260 },
  { label: 'Tipo de cuenta', width: 200 },
  { label: 'Estado', width: 140 },
  { label: 'Acciones', width: 130, align: 'right' },
];

export default function UsersTable({ users, total, page, pageSize, onPageChange, onEdit, onDelete, onExport }) {
  return (
    <Box component="section" sx={{ mt: 3, bgcolor: '#fff', border: '1px solid #E5E7EB', borderRadius: 3, overflow: 'hidden' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, px: 2.5, py: 2.5, borderBottom: '1px solid #E5E7EB' }}>
        <Typography component="h2" sx={{ fontSize: 17, fontWeight: 600, color: colors.ink }}>Listado General de Cuentas</Typography>
        <Button
          onClick={onExport}
          startIcon={<FileDownloadOutlinedIcon />}
          variant="outlined"
          sx={{ height: 30, px: 1.5, borderRadius: '6px', borderColor: '#D1D5DB', color: colors.ink, textTransform: 'none', fontFamily: 'inherit', fontSize: 12, fontWeight: 600, '& svg': { fontSize: 16 } }}
        >
          Exportar CSV
        </Button>
      </Box>

      <TableContainer>
        <Table sx={{ minWidth: 900 }} aria-label="Listado general de cuentas">
          <TableHead>
            <TableRow sx={{ bgcolor: '#F9FAFB' }}>
              {COLUMNS.map(({ label, width, align }) => (
                <TableCell
                  key={label}
                  align={align}
                  sx={{ width, py: 1.75, fontSize: 12, fontWeight: 600, letterSpacing: '0.03em', textTransform: 'uppercase', color: '#4B5563', borderBottom: '1px solid #E5E7EB' }}
                >
                  {label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6, color: colors.muted }}>No hay usuarios para mostrar</TableCell>
              </TableRow>
            ) : (
              users.map((user) => <UserRow key={user.id} user={user} onEdit={onEdit} onDelete={onDelete} />)
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ borderTop: '1px solid #E5E7EB' }}>
        <PaginationBar page={page} pageSize={pageSize} total={total} onChange={onPageChange} />
      </Box>
    </Box>
  );
}
