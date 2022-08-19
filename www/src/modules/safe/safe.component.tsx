import React, { useEffect, useState } from "react";
import { CircularProgress, Grid } from "@mui/material";
import { useAccount } from "wagmi";
import { localStorageKeys } from "core/constant";
import SafeCard from "./safe-details.component";
import AddSafe from "./create-safe.component";
import Modal from "shared/components/Modal/modal.component";
import { AddSafeData, OwnerData } from "core/models";
import SafeForm from "./safe-form.component";
import CustomTabs from "shared/components/CustomTabs/custom-tabs.component";
import OwnersList from "./owners-list.component";
import { SafeFormTypes } from "core/enums";
import TransactionsList from "./transactions-list.component";
import OwnerForm from "./owner-form.component";
import { useGnosisSafe } from "core/hooks/use-safe-init.hook";
import { useConnectSafe } from "core/hooks/use-connect-safe.hook";
import { useOwner } from "core/hooks/use-owner.hook";
import { useTransaction } from "core/hooks/use-transaction.hook";

const SafeDetails: React.FC = () => {
  const { safeService } = useGnosisSafe();
  const {
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
  } = useConnectSafe(safeService);

  const { address } = useAccount();

  const {
    addOwner,
    updateOwner,
    deleteOwner,
    safeOwnersLoading,
    owners,
    getOwners,
    editOwnerLoading,
  } = useOwner({
    safeSdk,
    threshold,
  });

  const {
    transactionsLoading,
    pendingTransactionsLoading,
    pendingTransactions,
    transactions,
    getTransactions,
    getPendingTransactions,
  } = useTransaction({ safeService, safeAddress });

  const [disconnectModal, setDisconnectModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editOwnerModal, setEditOwnerModal] = useState(false);
  const [addOwnerModal, setAddOwnerModal] = useState(false);
  const [deleteOwnerModal, setDeleteOwnerModal] = useState(false);
  const [ownerToDelete, setOwnerToDelete] = useState("");
  const [ownertoEdit, setOwnertoEdit] = useState<OwnerData | null>(null);

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

  const editSafe = async () => {};

  useEffect(() => {
    const safeKey = localStorage.getItem(localStorageKeys.safeAddress);
    if (safeKey) {
      const startConnecting = async () => {
        await connectSafe(safeKey);
      };
      startConnecting();
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

  const handledeleteOwner = (value: string) => {
    setOwnerToDelete(value);
    handleOpenDeleteOwnerModal();
  };

  const handleupdateOwnerModal = async (value: OwnerData) => {
    setOwnertoEdit(value);
    handleOpenEditOwnerModal();
  };

  const handelDisconnectSafe = async () => {
    await disconnectSafe();
    handleCloseDisconnectModal();
  };

  const handleUpdateSafe = async (data: AddSafeData) => {
    await updateSafe(data);
    handleCloseEditModal();
  };

  const handleDeleteOwner = async () => {
    await deleteOwner(ownerToDelete);
    handleCloseDeleteOwnerModal();
  };

  const handleUpdateOwner = async (data: OwnerData) => {
    await updateOwner(data, ownertoEdit);
    handleCloseEditOwnerModal();
  };

  const handleAddOwner = async (data: OwnerData) => {
    await addOwner(data);
    handleCloseAddOwnerModal();
  };

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
              defaultAddress={address || ""}
              connectLoading={connectionLoading}
              connectSafe={(value) =>
                connectSafe(value?.address || "", value?.name)
              }
              createSafe={(value) => createSafe(value)}
            />
          </Grid>
        </Grid>
      ) : (
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
                    isQueue
                  />
                ),
              },
            ]}
          />
        </Grid>
      )}
      <Modal
        confirmation
        title="Confirmation"
        open={disconnectModal}
        handleClose={handleCloseDisconnectModal}
        handleConfirm={handelDisconnectSafe}
      >
        <>Are you sure you want to disconnect this safe ?</>
      </Modal>
      <Modal
        confirmation
        title="Confirmation"
        open={deleteOwnerModal}
        handleClose={handleCloseDeleteOwnerModal}
        handleConfirm={handleDeleteOwner}
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
          submit={handleUpdateSafe}
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
          submit={handleUpdateOwner}
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
          submit={handleAddOwner}
          initialData={{ name: "", address: "" }}
          loading={editOwnerLoading}
          type={SafeFormTypes.CreateSafe}
        />
      </Modal>
    </Grid>
  );
};

export default SafeDetails;
