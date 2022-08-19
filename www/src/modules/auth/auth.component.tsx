/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Grid } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import loginImage from "assets/images/business-investment.svg";
import styles from "./auth.module.scss";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { useDispatch, useSelector } from "react-redux";
import { userDetails, registerLoading } from "./state/auth.selectors";
import { authenticate, register, logout } from "./state/auth.actions";
import { localStorageKeys } from "core/constant";

/**
 * Component Auth
 *
 * @component
 *
 * @example
 * return (
 *   <Auth>...</Auth>
 * )
 */
export const Auth = () => {
  const dispatch = useDispatch();
  const signupLoading = useSelector(registerLoading);
  const registerData = useSelector(userDetails);
  const { address, isConnected, isDisconnected, status } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnectAsync } = useDisconnect({
    onSuccess() {
      dispatch(logout());
    },
  });

  useEffect(() => {
    if (isConnected && !registerData?.address && status === "connected") {
      const registerRequest = {
        address,
      };
      dispatch(register(registerRequest));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, registerData]);

  useEffect(() => {
    if (isDisconnected) {
      dispatch(logout());
    }
  }, [isDisconnected]);

  useEffect(() => {
    const token = localStorage.getItem(localStorageKeys.token) || "";
    if (isConnected && !signupLoading && registerData?.address && !token) {
      const sign = async () => {
        await handleMessageSignIn();
      };
      sign();
    }
  }, [signupLoading]);

  const handleMessageSignIn = async () => {
    try {
      const signature = await signMessageAsync({
        message: `Welcome! Please sign this transaction to connect your wallet. ${registerData?.nonce}`,
      });
      if (signature) {
        const loginRequest = {
          signature,
          address,
        };
        dispatch(authenticate(loginRequest));
      }
    } catch (e) {
      await disconnectAsync();
      console.error("error from handleMessageSignIn", e);
    }
  };

  return (
    <Grid
      container
      alignItems="center"
      className={styles.container}
      justifyContent="space-between"
      wrap="nowrap"
    >
      <Grid lg={6} md={5} sm={6} className={styles.left_side} item>
        <h1>
          Authentification with <span>metamask</span>
        </h1>
        <p>
          Make sure you have{" "}
          <a href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en">
            metamask chrome extension
          </a>{" "}
          installed so you can connect easily.
        </p>
        <ConnectButton.Custom>
          {({ openConnectModal, mounted }) => {
            return (
              <div
                {...(!mounted && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {(() => {
                  return (
                    <Button onClick={openConnectModal}>
                      Connect Your Wallet
                    </Button>
                  );
                })()}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </Grid>
      <Grid className={styles.right_side} lg={6} md={7} sm={6} item>
        <img src={loginImage} alt="login" />
      </Grid>
    </Grid>
  );
};
export default Auth;
