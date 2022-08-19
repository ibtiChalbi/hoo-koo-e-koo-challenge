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
import { AddSafeData, OwnerData } from "core/models";
import SafeServiceClient, {
  EthereumTxWithTransfersResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionResponse,
  SafeMultisigTransactionWithTransfersResponse,
} from "@gnosis.pm/safe-service-client";
import SafeForm from "./safe-form.component";
import CustomTabs from "shared/components/CustomTabs/custom-tabs.component";
import OwnersList from "./owners-list.component";
import { SafeFormTypes } from "core/enums";
import TransactionsList from "./transactions-list.component";
import OwnerForm from "./owner-form.component";

const SafeDetails: React.FC = () => {
  const [owners, setOwners] = useState<{ name: string; address: string }[]>([]);
  const [transactions, setTransactions] = useState<
    Array<
      | SafeModuleTransactionWithTransfersResponse
      | SafeMultisigTransactionWithTransfersResponse
      | EthereumTxWithTransfersResponse
    >
  >([]);
  const [pendingTransactions, setPendingTransactions] = useState<
    Array<SafeMultisigTransactionResponse>
  >([]);
  const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
  const [threshold, setThreshold] = useState<number>(0);
  const [balance, setBalance] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [safeAddress, setSafeAddress] = useState<string>("");
  const [safeOwnersLoading, setSafeOwnersLoading] = useState(true);
  const [safeDataLoading, setSafeDataLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [pendingTransactionsLoading, setPendingTransactionsLoading] =
    useState(true);
  const [connectionLoading, setConnectionLoading] = useState(false);
  const [disconnectModal, setDisconnectModal] = useState(false);
  const [editOwnerLoading, setEditOwnerLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editSafeLoading, setEditSafeLoading] = useState(false);
  const [editOwnerModal, setEditOwnerModal] = useState(false);
  const [addOwnerModal, setAddOwnerModal] = useState(false);
  const [deleteOwnerModal, setDeleteOwnerModal] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState("");
  const [ownertoEdit, setOwnertoEdit] = useState<OwnerData | null>(null);
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
    localStorage.setItem(
      localStorageKeys.safeWallets,
      JSON.stringify(ownersData)
    );
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

  const getPendingTransactions = async () => {
    setPendingTransactionsLoading(true);

    const pendingTxs = await safeService.getPendingTransactions(safeAddress);
    console.log(pendingTxs);
    setPendingTransactions(pendingTxs?.results);
    setPendingTransactionsLoading(false);
  };

  const handleAccept = async (hash: string) => {
    if (safeSdk) {
      let signature = await safeSdk.approveTransactionHash(hash);
      await signature.transactionResponse?.wait();

      // const executeTxResponse = await safeSdk.executeTransaction(tx);
    }
  };

  const handleReject = async (hash: string) => {
    if (safeSdk) {
      // const executeTxResponse = await safeSdk.executeTransaction(tx);
    }
  };

  const handledeleteOwner = (value: string) => {
    setOwnerToDelete(value);
    handleOpenDeleteOwnerModal();
  };

  const deleteOwner = async () => {
    setEditOwnerLoading(true);
    if (safeSdk) {
      try {
        const removeOwnerResponse = await safeSdk.getRemoveOwnerTx({
          ownerAddress: ownerToDelete,
          threshold,
        });

        await safeSdk.executeTransaction(removeOwnerResponse);
        const ownersData = owners.filter(function (item) {
          return item.address !== ownerToDelete;
        });
        setOwners(ownersData);
        localStorage.setItem(
          localStorageKeys.safeWallets,
          JSON.stringify(ownersData)
        );
      } catch (error) {
        console.log(error);
        setEditOwnerLoading(false);
      }
    }
    handleCloseDeleteOwnerModal();
    setEditOwnerLoading(false);
  };

  const handleupdateOwnerModal = async (value: OwnerData) => {
    setOwnertoEdit(value);
    handleOpenEditOwnerModal();
  };

  const updateOwner = async (data: OwnerData) => {
    setEditOwnerLoading(true);
    const ownersData = owners.map((owner) => ({
      ...owner,
      name: owner.address === ownertoEdit?.address ? data?.name : owner.name,
    }));
    localStorage.setItem(
      localStorageKeys.safeWallets,
      JSON.stringify(ownersData)
    );
    setOwners([...ownersData]);
    handleCloseEditOwnerModal();
    setOwnertoEdit(null);
    setEditOwnerLoading(false);
  };

  const addOwner = async (data: OwnerData) => {
    setEditOwnerLoading(true);
    try {
      const addOwnerResponse = await safeSdk?.getAddOwnerTx({
        ownerAddress: data.address,
      });
      if (addOwnerResponse) {
        const executeTxResponse = await safeSdk?.executeTransaction(
          addOwnerResponse
        );
        if (executeTxResponse) {
          const ownersList = [data, ...owners];
          setOwners(ownersList);
          localStorage.setItem(
            localStorageKeys.safeWallets,
            JSON.stringify(ownersList)
          );
        }
      }
    } catch (error) {
      console.log(error);
      setEditOwnerLoading(false);
    }
    handleCloseAddOwnerModal();
    setEditOwnerLoading(false);
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

        handleCloseEditModal();
      } catch (error) {
        console.log(error);
        setEditSafeLoading(false);
      }
    }
    setEditSafeLoading(false);
  };

  const handleOpenDisconnectModal = () => setDisconnectModal(true);
  const handleCloseDisconnectModal = () => setDisconnectModal(false);

  const handleOpenEditModal = () => setEditModal(true);
  const handleCloseEditModal = () => setEditModal(false);

  const handleOpenEditOwnerModal = () => setEditOwnerModal(true);
  const handleCloseEditOwnerModal = () => setEditOwnerModal(false);

  const handleOpenAddOwnerModal = () => setAddOwnerModal(true);
  const handleCloseAddOwnerModal = () => setAddOwnerModal(false);

  const handleOpenDeleteOwnerModal = () => setDeleteOwnerModal(true);
  const handleCloseDeleteOwnerModal = () => setDeleteOwnerModal(false);

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
        await getPendingTransactions();
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeSdk]);

  useEffect(() => {
    if (safeAddress) {
      const reconnectSafe = async () => {
        await connectSafe(safeAddress);
      };
      reconnectSafe();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

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
                    <OwnersList
                      owners={owners}
                      loading={safeOwnersLoading}
                      handleDelete={handledeleteOwner}
                      handleUpdate={handleupdateOwnerModal}
                      handleAddOwner={handleOpenAddOwnerModal}
                    />
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
                {
                  title: "Queue",
                  content: (
                    <TransactionsList
                      transactions={pendingTransactions}
                      loading={pendingTransactionsLoading}
                      handleAccept={(hash) => handleAccept(hash)}
                      handleReject={(hash) => handleReject(hash)}
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
        confirmation
        title="Confirmation"
        open={deleteOwnerModal}
        handleClose={handleCloseDeleteOwnerModal}
        handleConfirm={deleteOwner}
        loading={editOwnerLoading}
      >
        <>Are you sure you want to delete this owner ?</>
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
          connectLoading={editSafeLoading}
        />
      </Modal>
      <Modal
        title="Edit Owner"
        open={editOwnerModal}
        handleClose={handleCloseEditOwnerModal}
      >
        <OwnerForm
          submit={updateOwner}
          initialData={ownertoEdit}
          loading={editOwnerLoading}
        />
      </Modal>
      <Modal
        title="Edit Owner"
        open={addOwnerModal}
        handleClose={handleCloseAddOwnerModal}
      >
        <OwnerForm
          submit={addOwner}
          initialData={{ name: "", address: "" }}
          loading={editOwnerLoading}
          type={SafeFormTypes.CreateSafe}
        />
      </Modal>
    </Grid>
  );
};

export default SafeDetails;
