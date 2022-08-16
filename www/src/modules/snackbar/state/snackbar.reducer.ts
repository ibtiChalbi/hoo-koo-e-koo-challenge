import { Action, createReducer } from "@reduxjs/toolkit";

import * as fromActions from "./snackbar.actions";

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: string;
}

export const initialSnackbarState: SnackbarState = {
  open: false,
  message: "",
  severity: "",
};

const _snackbarReducer = createReducer<SnackbarState>(
  initialSnackbarState,
  (builder) => {
    builder
      .addCase(
        fromActions.openSnackbar,
        (state, { payload }): SnackbarState => ({
          ...state,
          message: payload.message,
          open: true,
          severity: payload.severity,
        })
      )
      .addCase(
        fromActions.closeSnackbar,
        (state): SnackbarState => ({ ...state, message: "", open: false })
      );
  }
);

export function snackbarReducer(
  state: SnackbarState | undefined,
  action: Action
): SnackbarState {
  return _snackbarReducer(state, action);
}
