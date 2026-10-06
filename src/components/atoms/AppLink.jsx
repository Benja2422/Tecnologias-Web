import { Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

/** Link de MUI con navegación del router (sin recargar la página). */
export default function AppLink({ href, ...props }) {
  return <Link component={RouterLink} to={href} {...props} />;
}
