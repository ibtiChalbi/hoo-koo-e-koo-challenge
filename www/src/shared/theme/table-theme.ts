import { createTheme } from "@mui/material";

import { colors } from "./shared-theme";

export const tableTheme = createTheme({
  palette: {
    primary: {
      main: colors.BLACK,
      contrastText: colors.WHITE,
    },
    contrastThreshold: 3,
    tonalOffset: 0.1,
  },
  shape: {
    borderRadius: 5,
  },
  typography: {
    allVariants: {
      textTransform: "none",
      display: "flex",
      alignItems: "center",
      fontFamily: "Arial",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: 15,
    },
  },
  components: {
    MuiTable: {
      styleOverrides: {
        root: {
          width: "100%",
          ".no_data": {
            color: colors.GREY,
            fontWeight: "normal",
            fontStyle: "italic",
          },
          ".in": {
            backgroundColor: colors.LIGHT_GREEN,
            color: colors.GREEN,
            width: "100%",
            height: "100%",
            borderRadius: "0.188rem",
          },

          ".out": {
            color: colors.ORANGE,
            backgroundColor: colors.LIGHT_ORANGE,
            width: "100%",
            height: "100%",
            borderRadius: "0.188rem",
          },

          ".self": {
            color: colors.DARK_GREY,
            backgroundColor: colors.LIGHTER_GREY,
            width: "100%",
            height: "100%",
            borderRadius: "0.188rem",
          },

          ".transaction_button": {
            display: "flex",
            borderRadius: "0.188rem",
            justifyContent: "center",
            width: "2.188rem",
            fontWeight: "bold",
            fontSize: "0.8rem",
            textAlign: "center",
          },
          "a,circle": {
            color: colors.PRIMARY_BLUE,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          "&.MuiTableCell-head": {
            fontWeight: "bold",
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          "tr:hover": {
            backgroundColor: colors.HOVER_COLOR,
          },
        },
      },
    },
  },
});
