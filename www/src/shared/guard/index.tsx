import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { localStorageKeys, RouterPaths } from "core/constant";
import { history } from "core/services/history.service";
import { LinearProgress } from "@mui/material";
import jwt_decode from "jwt-decode";

interface GuardRouterProps {
  children: React.ReactNode;
}
const GuardRouter = ({ children }: GuardRouterProps) => {
  const dispatch = useDispatch();
  const [canAccess, setCanAccess] = useState(false);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem(localStorageKeys.token) || "";
      const currentDate = new Date();
      let isAuthenticated = true;
      let decodedToken: {
        exp: number;
      } | null = null;
      if (!token) {
        isAuthenticated = false;
      } else {
        try {
          decodedToken = token ? jwt_decode(token) : null;
          if (
            decodedToken &&
            decodedToken?.exp * 1000 < currentDate.getTime()
          ) {
            isAuthenticated = false;
          } else {
            isAuthenticated = true;
          }
        } catch (error) {
          isAuthenticated = false;
        }
      }

      if (history.location.pathname !== RouterPaths.EntryPaths.loginPath) {
        if (!isAuthenticated) {
          history.push(RouterPaths.EntryPaths.loginPath);
          setCanAccess(true);
        } else {
          setCanAccess(true);
        }
      } else {
        if (isAuthenticated) {
          history.push(RouterPaths.RootPaths.rootPath);
        } else {
          localStorage.removeItem(localStorageKeys.token);
        }
        setCanAccess(true);
      }
    })();
  }, []);

  if (canAccess) {
    return <>{children}</>;
  } else {
    return <LinearProgress />;
  }
};

export default GuardRouter;
