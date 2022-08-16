import { all, put, PutEffect, takeLatest } from "redux-saga/effects";
import { localStorageKeys, RouterPaths } from "core/constant";
import { ErrorResponseData, SigninData, UserDetails } from "core/models";
import * as authAction from "./auth.actions";
import { PayloadAction } from "@reduxjs/toolkit";
import * as snackbarAction from "../../snackbar/state/snackbar.actions";
import { history } from "core/services/history.service";
import { authenticate, register } from "core/services/auth.service";
import { SignupData } from "core/models/auth/sign-up-data";
import { dummyAction } from "store/store.actions";

function* authenticateEffect({
  payload,
}: PayloadAction<SigninData>): Generator<
  Promise<UserDetails> | PutEffect,
  void,
  UserDetails
> {
  try {
    const user = yield authenticate({
      body: SigninData.mapToApiValue(payload),
    });
    localStorage.setItem(localStorageKeys.token, user.token);
    yield put(authAction.authenticateSuccess(user));
  } catch (error) {
    yield put(authAction.authenticateFailed(error as ErrorResponseData));
  }
}

function* authenticateSuccessEffect(): Generator {
  yield history.push(RouterPaths.RootPaths.rootPath);
}

function* failEffect(error: ErrorResponseData): Generator {
  let msg = "error.network";
  if (error.status) {
    msg = "error.server";
  }
  yield put(snackbarAction.openSnackbar({ message: msg, severity: "error" }));
}

function* registerEffect({
  payload,
}: PayloadAction<SignupData>): Generator<
  Promise<UserDetails> | PutEffect,
  void,
  UserDetails
> {
  try {
    const user = yield register({ body: SignupData.mapToApiValue(payload) });
    yield put(authAction.registerSuccess(user));
  } catch (error) {
    yield put(authAction.registerFailed(error as ErrorResponseData));
  }
}

function* registerSuccessEffect(): Generator {
  yield put(dummyAction());
}

function* logoutEffect(): Generator {
  localStorage.removeItem(localStorageKeys.token);
  history.push(RouterPaths.EntryPaths.loginPath);
  yield put(dummyAction());
}

export function* watchAuth(): Generator {
  yield all([
    takeLatest(authAction.authenticate.type, authenticateEffect),
    takeLatest(
      [authAction.authenticateSuccess.type],
      authenticateSuccessEffect
    ),
    takeLatest(
      [authAction.getUserFailed.type, authAction.authenticateFailed.type],
      failEffect
    ),
    takeLatest(authAction.register.type, registerEffect),
    takeLatest([authAction.registerSuccess.type], registerSuccessEffect),
    takeLatest(
      [authAction.getUserFailed.type, authAction.registerFailed.type],
      failEffect
    ),
    takeLatest([authAction.logout.type], logoutEffect),
  ]);
}
