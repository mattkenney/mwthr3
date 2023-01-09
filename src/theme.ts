import { blueGrey, orange } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: 'transparent',
        },
      },
    },
  },
  palette: {
    primary: {
      main: blueGrey[600],
    },
    secondary: {
      main: orange[600],
    },
  },
});
