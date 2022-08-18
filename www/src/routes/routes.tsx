import React from "react";
import Layout from "modules/layouts/layouts.component";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "pages/login";
import { RouterPaths } from "core/constant";
import Homepage from "pages/home";
import GuardRouter from "shared/guard";
import SafePage from "pages/safe";

export const RoutesList = () => {
  return (
    <GuardRouter>
      <Routes>
        <Route
          path={RouterPaths.RootPaths.rootPath}
          element={
            <Layout title={"Transactions"}>
              <Homepage />
            </Layout>
          }
        />
        <Route
          path={RouterPaths.RootPaths.safePath}
          element={
            <Layout title={"Safe"}>
              <SafePage />
            </Layout>
          }
        />
        <Route
          path={RouterPaths.EntryPaths.loginPath}
          element={<LoginPage />}
        />
        <Route
          path="*"
          element={<Navigate replace to={RouterPaths.RootPaths.rootPath} />}
        />
      </Routes>
    </GuardRouter>
  );
};
export default RoutesList;
