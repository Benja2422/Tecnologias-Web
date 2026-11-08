import { Avatar } from '@mui/material';

/** Avatar gris con las iniciales de la otra parte de una conversación. */
export default function ContactAvatar({ initials, size = 40 }) {
  return (
    <Avatar sx={{ width: size, height: size, bgcolor: '#E5E5E7', color: '#555', fontSize: size > 40 ? 15 : 14, fontWeight: 600, fontFamily: 'inherit' }}>
      {initials}
    </Avatar>
  );
}
