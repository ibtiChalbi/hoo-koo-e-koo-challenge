import { configureStore } from "@reduxjs/toolkit";

import createSagaMiddleware from "redux-saga";

import { promiseMiddleware } from "core/utils";

import { reducerInitialState, reducers } from "./store.reducer";
import { sagas } from "./store.effects";

export default function configureAppStore(initialStates = {}) {
  const sagaMiddleware = createSagaMiddleware();
  initialStates = { ...reducerInitialState };

  const middleWares = [promiseMiddleware, sagaMiddleware];

  const appStore = configureStore({
    reducer: reducers,
    preloadedState: initialStates,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {},
      }).concat(middleWares),
  });

  sagaMiddleware.run(sagas);

  return appStore;
}
