import { colors } from "@mui/material";
import { red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.green.A400,
    },
    secondary: {
      main: colors.green.A400,
    },
    error: {
      main: red.A400,
    },
  },
});
export default theme;
