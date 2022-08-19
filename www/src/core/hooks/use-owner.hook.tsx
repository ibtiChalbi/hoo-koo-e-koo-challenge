import Safe from "@gnosis.pm/safe-core-sdk";
import { localStorageKeys } from "core/constant";
import { OwnerData } from "core/models";
import { openSnackbar } from "modules/snackbar/state/snackbar.actions";
import { useState } from "react";
import { useDispatch } from "react-redux";

type useOwnerType = {
  safeSdk: Safe | null;
  threshold: number;
};

/**
 * Hooks useOwner
 *
 */
export const useOwner = ({ safeSdk, threshold }: useOwnerType) => {
  const dispatch = useDispatch();
  const [owners, setOwners] = useState<{ name: string; address: string }[]>([]);
  const [safeOwnersLoading, setSafeOwnersLoading] = useState(true);
  const [editOwnerLoading, setEditOwnerLoading] = useState(false);

  /**
   * get list of owners
   */
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

  const deleteOwner = async (ownerToDelete: string) => {
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
        dispatch(
          openSnackbar({
            message: "An error has occurred please try again later",
            severity: "error",
          })
        );
      }
    }
    setEditOwnerLoading(false);
  };

  const updateOwner = async (
    data: OwnerData,
    ownertoEdit: OwnerData | null
  ) => {
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
      dispatch(
        openSnackbar({
          message: "An error has occurred please try again later",
          severity: "error",
        })
      );
    }
    setEditOwnerLoading(false);
  };

  return {
    addOwner,
    updateOwner,
    deleteOwner,
    safeOwnersLoading,
    owners,
    getOwners,
    editOwnerLoading,
  };
};
