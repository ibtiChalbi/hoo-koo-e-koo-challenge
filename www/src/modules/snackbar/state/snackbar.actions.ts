import { createAction } from "@reduxjs/toolkit";

export const openSnackbar = createAction<{ message: string; severity: string }>(
  "open snackbar"
);
export const closeSnackbar = createAction("close snackbar");
