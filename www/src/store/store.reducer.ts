import { AnyAction, combineReducers } from "redux";

import { AppState } from "./store.types";
import {
  initialSnackbarState,
  snackbarReducer,
} from "modules/snackbar/state/snackbar.reducer";
import { authReducer, initialAuthState } from "modules/auth/state/auth.reducer";

export const reducerInitialState: AppState = {
  snackbar: initialSnackbarState,
  auth: initialAuthState,
};

export const reducers = combineReducers<AppState, AnyAction>({
  snackbar: snackbarReducer,
  auth: authReducer,
});
