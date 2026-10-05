import { createTheme } from '@mui/material/styles';

export const colors = {
  primary: '#CC0000',
  primaryDark: '#A80000',
  link: '#2755B8',
  text: '#333333',
  muted: '#6B6B6B',
  border: '#D9D9D9',
  footer: '#F0F0F0',
};

const theme = createTheme({
  palette: {
    primary: { main: colors.primary, dark: colors.primaryDark },
    text: { primary: colors.text, secondary: colors.muted },
  },
  typography: { fontFamily: '"Poppins", "Helvetica", "Arial", sans-serif' },
  shape: { borderRadius: 8 },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
          '& fieldset': { borderColor: colors.border },
          '&:hover fieldset': { borderColor: '#B0B0B0' },
        },
        input: { padding: '14px 16px', fontSize: 15 },
      },
    },
    MuiButton: { styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } } },
  },
});

export default theme;
