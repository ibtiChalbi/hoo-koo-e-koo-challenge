import { createSelector } from "@reduxjs/toolkit";

import { AppState } from "store/store.types";

const snackbarState = (state: AppState) => state.snackbar;

export const snackbarIsOpen = createSelector(
  snackbarState,
  (state) => state.open
);
export const snackbarMessage = createSelector(
  snackbarState,
  (state) => state.message
);
export const snackbarSeverity = createSelector(
  snackbarState,
  (state) => state.severity
);
