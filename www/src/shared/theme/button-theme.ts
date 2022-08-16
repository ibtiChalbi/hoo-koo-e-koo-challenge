import { createTheme } from "@mui/material/styles";
import { colors } from "./shared-theme";

export const buttonTheme = createTheme({
  palette: {
    primary: {
      main: colors.PRIMARY_BLUE,
      contrastText: colors.WHITE,
    },
    secondary: {
      main: colors.PRIMARY_BLUE,
      contrastText: colors.WHITE,
    },
    action: {
      disabledBackground: colors.GREY,
    },
    contrastThreshold: 3,
    tonalOffset: 0.1,
  },
  shape: {
    borderRadius: 43,
  },
  shadows: [
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
    "none",
  ],
  typography: {
    allVariants: {
      textTransform: "none",
      display: "flex",
      alignItems: "center",
      fontFamily: "Poppins",
      fontStyle: "normal",
      fontWeight: "normal",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: "2.5rem",
          minWidth: "none",
        },
      },
    },
  },
});
