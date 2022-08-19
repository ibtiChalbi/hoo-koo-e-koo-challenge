import { JsonRpcFetchFunc } from "@ethersproject/providers";
import Safe, { SafeAccountConfig, SafeFactory } from "@gnosis.pm/safe-core-sdk";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import { CONSTANTS, localStorageKeys } from "core/constant";
import { AddSafeData } from "core/models";
import { ethers } from "ethers";
import { openSnackbar } from "modules/snackbar/state/snackbar.actions";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAccount } from "wagmi";
import { formatEther } from "ethers/lib/utils";
import SafeServiceClient from "@gnosis.pm/safe-service-client";

/**
 * Hooks useSafe
 *
 */
export const useConnectSafe = (safeService: SafeServiceClient) => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const [threshold, setThreshold] = useState<number>(0);

  const { ethereum } = window;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const provider = new ethers.providers.Web3Provider(
    ethereum as unknown as JsonRpcFetchFunc
  );

  const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
  const [title, setTitle] = useState<string>("");
  const [safeAddress, setSafeAddress] = useState<string>("");
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [editSafeLoading, setEditSafeLoading] = useState(false);
  const [safeDataLoading, setSafeDataLoading] = useState(true);
  const [balance, setBalance] = useState<string>("");

  const disconnectSafe = async () => {
    localStorage.removeItem(localStorageKeys.safeAddress);
    localStorage.removeItem(localStorageKeys.safeTitle);
    localStorage.removeItem(localStorageKeys.safeWallets);
    setSafeSdk(null);
    setSafeAddress("");
  };

  /**
   * Connect a safe
   *
   * @param safeKey
   * @param name
   */
  const connectSafe = async (safeKey: string, name?: string) => {
    try {
      setConnectionLoading(true);
      setTitle(name || CONSTANTS.safeDefaultName);
      const safeOwner = provider.getSigner(address);
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: safeOwner,
      });

      const safeSdkRes = await Safe.create({
        ethAdapter,
        safeAddress: safeKey,
        isL1SafeMasterCopy: true,
      });
      setSafeSdk(safeSdkRes);

      localStorage.setItem(localStorageKeys.safeAddress, safeKey);
      localStorage.setItem(
        localStorageKeys.safeTitle,
        name || CONSTANTS.safeDefaultName
      );

      setSafeAddress(safeKey);

      setConnectionLoading(false);
    } catch (error) {
      console.log(error);
      setConnectionLoading(false);
      dispatch(
        openSnackbar({
          message: "Please verify your Address",
          severity: "error",
        })
      );
    }
  };

  const createSafe = async (data: AddSafeData) => {
    try {
      if (
        data?.owners &&
        data?.threshold &&
        data?.threshold > data?.owners?.length
      ) {
        dispatch(
          openSnackbar({
            message:
              "The threshold should be lower or equial to the number of owners",
            severity: "error",
          })
        );
        return;
      }
      setConnectionLoading(true);
      const safeOwner = provider.getSigner(address);
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: safeOwner,
      });

      const safeFactory = await SafeFactory.create({ ethAdapter });
      const safeAccountConfig: SafeAccountConfig = {
        owners: data.owners || [],
        threshold: data.threshold || 1,
      };
      const safeSdkRes = await safeFactory.deploySafe({
        safeAccountConfig,
      });
      setSafeSdk(safeSdkRes);

      const newSafeAdr = await safeSdkRes.getAddress();

      localStorage.setItem(localStorageKeys.safeAddress, newSafeAdr);
      localStorage.setItem(
        localStorageKeys.safeTitle,
        data.name || CONSTANTS.safeDefaultName
      );

      setSafeAddress(newSafeAdr);

      setConnectionLoading(false);
    } catch (error) {
      console.error(error);
      setConnectionLoading(false);
      dispatch(
        openSnackbar({
          message: "An error occurred please try again",
          severity: "error",
        })
      );
    }
  };

  const updateSafe = async (data: AddSafeData) => {
    setEditSafeLoading(true);
    if (safeSdk) {
      try {
        const thresholdTx = await safeSdk.getChangeThresholdTx(
          data?.threshold || 0
        );
        const safeTxHash = await safeSdk.getTransactionHash(thresholdTx);
        const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
        await safeService.proposeTransaction({
          safeAddress,
          safeTransactionData: thresholdTx.data,
          safeTxHash,
          senderAddress: address || "",
          senderSignature: senderSignature.data,
          origin,
        });

        await safeSdk.executeTransaction(thresholdTx);

        setThreshold(data?.threshold || threshold);
      } catch (error) {
        console.log(error);
        setEditSafeLoading(false);
        dispatch(
          openSnackbar({
            message: "An error has occurred please try again later",
            severity: "error",
          })
        );
      }
    }
    setEditSafeLoading(false);
  };

  const getSafeData = async () => {
    try {
      setSafeDataLoading(true);
      const numberThreshold = await safeSdk?.getThreshold();
      setThreshold(numberThreshold || 0);

      const currentbalance = await safeSdk?.getBalance();
      setBalance(formatEther(currentbalance?.toString() || ""));
      setSafeDataLoading(false);
    } catch (error) {
      console.log(error);
      setSafeDataLoading(false);
      dispatch(
        openSnackbar({
          message: "An error has occurred please try again later",
          severity: "error",
        })
      );
    }
  };

  return {
    connectSafe,
    connectionLoading,
    disconnectSafe,
    title,
    safeAddress,
    safeSdk,
    createSafe,
    updateSafe,
    threshold,
    editSafeLoading,
    getSafeData,
    safeDataLoading,
    balance,
  };
};
