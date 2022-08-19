import React, { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { ethers } from "ethers";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import Safe, { SafeAccountConfig, SafeFactory } from "@gnosis.pm/safe-core-sdk";
import { useAccount } from "wagmi";
import { CONSTANTS, localStorageKeys } from "core/constant";
import { formatEther } from "ethers/lib/utils";
import SafeCard from "./safe-details.component";
import AddSafe from "./create-safe.component";
import { openSnackbar } from "modules/snackbar/state/snackbar.actions";
import { useDispatch } from "react-redux";
import { JsonRpcFetchFunc } from "@ethersproject/providers";
import Modal from "shared/components/Modal/modal.component";
import { AddSafeData } from "core/models";
import SafeServiceClient, {
  EthereumTxWithTransfersResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse,
} from "@gnosis.pm/safe-service-client";
import SafeForm from "./safe-form.component";
import CustomTabs from "shared/components/CustomTabs/custom-tabs.component";
import OwnersList from "./owners-list.component";
import { SafeFormTypes } from "core/enums";
import TransactionsList from "./transactions-list.component";

const SafeDetails: React.FC = () => {
  const [owners, setOwners] = useState<{ name: string; address: string }[]>([]);
  const [transactions, setTransactions] = useState<
    Array<
      | SafeModuleTransactionWithTransfersResponse
      | SafeMultisigTransactionWithTransfersResponse
      | EthereumTxWithTransfersResponse
    >
  >([]);
  const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
  const [threshold, setThreshold] = useState<number>(0);
  const [balance, setBalance] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [safeAddress, setSafeAddress] = useState<string>("");
  const [safeOwnersLoading, setSafeOwnersLoading] = useState(true);
  const [safeDataLoading, setSafeDataLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const { address } = useAccount();
  const dispatch = useDispatch();

  const { ethereum } = window;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const provider = new ethers.providers.Web3Provider(
    ethereum as unknown as JsonRpcFetchFunc
  );
  const safeOwner = provider.getSigner(0);

  const ethAdapter = new EthersAdapter({
    ethers,
    signer: safeOwner,
  });
  const safeService = new SafeServiceClient({
    txServiceUrl: "https://safe-transaction.rinkeby.gnosis.io",
    ethAdapter,
  });

  const connectSafe = async (safeKey: string, name?: string) => {
    try {
      setConnectionLoading(true);
      setTitle(name || "");
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

  const getOwners = async () => {
    setSafeOwnersLoading(true);
    let localOwners: { name: string; address: string }[] = [];
    try {
      localOwners = JSON.parse(
        localStorage.getItem(localStorageKeys.safeWallets) || ""
      );
    } catch (error) {
      localOwners = [];
    }

    const ownersList = await safeSdk?.getOwners();

    const ownersData = ownersList?.map((owner) => {
      return {
        name: localOwners.find((x) => x.address === owner)?.name || "",
        address: owner,
      };
    });
    setOwners(ownersData || []);
    setSafeOwnersLoading(false);
  };

  const getTransactions = async () => {
    setTransactionsLoading(true);

    const pendingTxs = await safeService.getAllTransactions(safeAddress);
    console.log(pendingTxs);
    setTransactions(pendingTxs?.results);
    setTransactionsLoading(false);
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
    }
  };

  const createSafe = async (name: string) => {
    try {
      setConnectionLoading(true);
      const safeOwner = provider.getSigner(address);
      const ethAdapter = new EthersAdapter({
        ethers,
        signer: safeOwner,
      });

      const safeFactory = await SafeFactory.create({ ethAdapter });
      const safeAccountConfig: SafeAccountConfig = {
        owners: [address || ""],
        threshold: 1,
      };
      const safeSdkRes = await safeFactory.deploySafe({
        safeAccountConfig,
      });
      console.log("safeSdk", safeSdkRes);
      setSafeSdk(safeSdkRes);

      const newSafeAdr = await safeSdkRes.getAddress();

      localStorage.setItem(localStorageKeys.safeAddress, newSafeAdr);
      localStorage.setItem(
        localStorageKeys.safeTitle,
        name || CONSTANTS.safeDefaultName
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
    console.log(data);
    if (safeSdk) {
      const thresholdTx = await safeSdk.getChangeThresholdTx(
        data?.threshold || 0
      );
      const safeTxHash = await safeSdk.getTransactionHash(thresholdTx);
      console.log("safeService", safeService);
      const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
      await safeService.proposeTransaction({
        safeAddress,
        safeTransactionData: thresholdTx.data,
        safeTxHash,
        senderAddress: address || "",
        senderSignature: senderSignature.data,
        origin,
      });

      handleCloseEditModal();
    }
  };

  const handleOpenDisconnectModal = () => setDisconnectModal(true);
  const handleCloseDisconnectModal = () => setDisconnectModal(false);

  const handleOpenEditModal = () => setEditModal(true);
  const handleCloseEditModal = () => setEditModal(false);

  const disconnectSafe = async () => {
    localStorage.removeItem(localStorageKeys.safeAddress);
    localStorage.removeItem(localStorageKeys.safeTitle);
    localStorage.removeItem(localStorageKeys.safeWallets);
    setSafeSdk(null);
    setSafeAddress("");
    setOwners([]);
    handleCloseDisconnectModal();
  };

  const editSafe = async () => {};

  useEffect(() => {
    const safeKey = localStorage.getItem(localStorageKeys.safeAddress);
    if (safeKey) {
      const startConnecting = async () => {
        await connectSafe(safeKey);
      };
      startConnecting();
    }

    const safeTitle = localStorage.getItem(localStorageKeys.safeTitle);
    if (!safeTitle) {
      localStorage.setItem(
        localStorageKeys.safeTitle,
        CONSTANTS.safeDefaultName
      );
      setTitle(CONSTANTS.safeDefaultName);
    } else {
      setTitle(safeTitle);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (safeSdk) {
      const fetchData = async () => {
        await getSafeData();
        await getOwners();
        await getTransactions();
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeSdk]);

  return (
    <Grid container direction="column">
      {connectionLoading ? (
        <Grid container justifyContent="center">
          <CircularProgress />
        </Grid>
      ) : !safeAddress ? (
        <Grid container justifyContent="center">
          <Grid item md={9} lg={8} sm={12} xs={12}>
            <AddSafe
              connectLoading={connectionLoading}
              connectSafe={(value) =>
                connectSafe(value?.address || "", value?.name)
              }
              createSafe={(value) => createSafe(value?.name)}
            />
          </Grid>
        </Grid>
      ) : (
        <>
          <Grid container justifyContent="center" alignItems="center">
            <CustomTabs
              tabs={[
                {
                  title: "Settings",
                  content: (
                    <SafeCard
                      loading={safeDataLoading || connectionLoading}
                      address={safeSdk?.getAddress()}
                      threshold={threshold}
                      balance={balance}
                      title={title}
                      handleDisconnect={handleOpenDisconnectModal}
                      handleEdit={handleOpenEditModal}
                    />
                  ),
                },
                {
                  title: "Owners",
                  content: (
                    <OwnersList owners={owners} loading={safeOwnersLoading} />
                  ),
                },
                {
                  title: "Transactions",
                  content: (
                    <TransactionsList
                      transactions={transactions}
                      loading={transactionsLoading}
                    />
                  ),
                },
              ]}
            />
          </Grid>
        </>
      )}
      <Modal
        confirmation
        title="Confirmation"
        open={disconnectModal}
        handleClose={handleCloseDisconnectModal}
        handleConfirm={disconnectSafe}
      >
        <>Are you sure you want to disconnect this safe ?</>
      </Modal>
      <Modal
        title="Edit Safe"
        open={editModal}
        handleClose={handleCloseEditModal}
        handleConfirm={editSafe}
      >
        <SafeForm
          type={SafeFormTypes.EditSafe}
          submit={updateSafe}
          initialData={{
            name: title,
            threshold,
          }}
          connectLoading={false}
        />
      </Modal>
    </Grid>
  );
};

export default SafeDetails;
