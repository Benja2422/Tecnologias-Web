import { Avatar } from '@mui/material';
import { colors } from '../../utils/theme';
import { getInitials } from '../../utils/format';

export default function UserAvatar({ name }) {
  return (
    <Avatar sx={{ width: 40, height: 40, bgcolor: colors.primary, fontSize: 13, fontWeight: 700, fontFamily: 'inherit' }}>
      {getInitials(name)}
    </Avatar>
  );
}
