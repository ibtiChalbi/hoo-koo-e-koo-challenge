import { all, fork } from "redux-saga/effects";

import { watchAuth } from "modules/auth/state/auth.effects";

export function* sagas(): Generator {
  yield all([fork(watchAuth)]);
}
