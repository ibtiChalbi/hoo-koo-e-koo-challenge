import { AuthState } from "modules/auth/state/auth.reducer";
import { SnackbarState } from "modules/snackbar/state/snackbar.reducer";

export type AppState = {
  snackbar: SnackbarState;
  auth: AuthState;
};
