import { Box } from '@mui/material';
import StatCard from '../molecules/StatCard';

const n = (v) => v.toLocaleString('en-US');

export default function UserStats({ stats }) {
  return (
    <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr 1fr', lg: 'repeat(4, 1fr)' } }}>
      <StatCard label="Total usuarios" value={n(stats.total)} />
      <StatCard label="Clientes activos" value={n(stats.activeClients)} color="#4B5563" />
      <StatCard label="Emprendedores" value={n(stats.entrepreneurs)} color="#CC0000" />
      <StatCard label="Suspendidos" value={n(stats.suspended)} color="#A80000" />
    </Box>
  );
}
