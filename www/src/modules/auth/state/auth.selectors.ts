import { createSelector } from "@reduxjs/toolkit";

import { AppState } from "store/store.types";

const authState = (state: AppState) => state.auth;

export const authLoading = createSelector(authState, (state) => state.loading);
export const registerLoading = createSelector(
  authState,
  (state) => state.registerLoading
);
export const authSubmitting = createSelector(
  authState,
  (state) => state.submitting
);
export const userDetails = createSelector(authState, (state) => state.user);
