import React, { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { AppBar, Grid } from "@mui/material";
import styles from "./layouts.module.scss";
import metamaskImage from "assets/images/metamask.gif";
import { Link } from "react-router-dom";
import { RouterPaths } from "core/constant";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useAccount } from "wagmi";
import { useDispatch } from "react-redux";
import { logout } from "modules/auth/state/auth.actions";

const MainHeader = () => {
  const dispatch = useDispatch();
  const { isDisconnected } = useAccount();

  useEffect(() => {
    if (isDisconnected) {
      dispatch(logout());
    }
  }, [isDisconnected]);

  return (
    <AppBar color="transparent">
      <Grid container justifyContent="flex-end" className={styles.header}>
        <img src={metamaskImage} className={styles.metamask_image} />
        <Grid>
          <Grid container justifyContent="flex-end" alignItems="center">
            <Link
              to={RouterPaths.RootPaths.rootPath}
              className={styles.menu_link}
            >
              <AccountBalanceIcon />
              Transactions
            </Link>

            <ConnectButton
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          </Grid>
        </Grid>
      </Grid>
    </AppBar>
  );
};
export default MainHeader;
