import { createTheme } from "@mui/material/styles";
import { colors } from "./shared-theme";

export const inputTheme = createTheme({
  palette: {
    primary: {
      main: colors.BLACK,
      contrastText: colors.BLACK,
    },
    secondary: {
      main: colors.BLACK,
      contrastText: colors.BLACK,
      dark: colors.BLACK,
    },
    action: {
      disabledBackground: colors.BLACK,
    },
    contrastThreshold: 3,
    tonalOffset: 0.1,
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    allVariants: {
      textTransform: "none",
      display: "flex",
      alignItems: "center",
      fontFamily: "Arial",
      fontStyle: "normal",
      fontSize: "15px",
    },
  },
  components: {
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          margin: "0",
          marginTop: 3,
          color: colors.BLACK,
          fontSize: 12,
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          background: colors.LIGHT_BLUE,
          padding: "0 1rem",
          marginTop: "0.25rem !important",
          height: 48,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: colors.LIGHT_BLUE,
          "&:after,&:before": {
            content: "none",
          },
          input: {
            "&:-webkit-autofill,&:-webkit-autofill:hover,	&:-webkit-autofill:focus,	&:-webkit-autofill:active":
              {
                WebkitBoxShadow: "unset !important",
                WebkitTransition:
                  "color 9999s ease-out, background-color 9999s ease-out",
              },
          },
          ".MuiIconButton-root": {
            padding: 0,
          },
          "&.MuiInputBase-adornedEnd": {
            paddingRight: 8,
          },
          "input[type=password]": {
            fontWeight: "bold",
            letterSpacing: 6,
          },
          svg: {
            color: colors.DARK_BLUE,
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          margin: "0.625rem 0.313rem",
          minWidth: "none",
          label: {
            color: colors.DARK_BLUE,
            fontSize: 13,
            textAlign: "left",
            fontFamily: "Arial",
          },
        },
      },
    },
  },
});
