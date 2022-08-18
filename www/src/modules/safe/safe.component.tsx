import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import { ethers } from "ethers";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import Safe from "@gnosis.pm/safe-core-sdk";
import { useAccount } from "wagmi";
import { localStorageKeys } from "core/constant";
import CustomTable from "shared/components/CustomTable/custom-table.component";
import { TableHeaderEnum } from "core/enums/table-header/table-header.enum";
import { formatEther } from "ethers/lib/utils";
import SafeCard from "./safe-details.component";
import styles from "./safe.module.scss";
import AddIcon from "@mui/icons-material/Add";

const SafeDetails: React.FC = () => {
  const [owners, setOwners] = useState<{ name: string; address: string }[]>([]);
  const [safeSdk, setSafeSdk] = useState<Safe | null>(null);
  const [threshold, setThreshold] = useState<number | undefined>(undefined);
  const [balance, setBalance] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [safeLoading, setSafeLoading] = useState(true);
  const [safeDataLoading, setSafeDataLoading] = useState(true);
  const { address } = useAccount();

  const provider = new ethers.providers.JsonRpcProvider(
    `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_KEY}`
  );

  const connectSafe = async () => {
    const safeKey = localStorage.getItem(localStorageKeys.safeAddress) || "";
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
  };

  const getOwners = async () => {
    setSafeLoading(true);
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
    setSafeLoading(false);
  };

  const getSafeData = async () => {
    setSafeDataLoading(true);
    const numberThreshold = await safeSdk?.getThreshold();
    setThreshold(numberThreshold);

    const currentbalance = await safeSdk?.getBalance();
    setBalance(formatEther(currentbalance?.toString() || ""));
    setSafeDataLoading(false);
  };

  useEffect(() => {
    const safeKey = localStorage.getItem(localStorageKeys.safeAddress);
    if (safeKey) {
      const startConnecting = async () => {
        await connectSafe();
      };
      startConnecting();
    }

    const safeTitle = localStorage.getItem(localStorageKeys.safeTitle);
    if (!safeTitle) {
      const generatedTitle = `Rin safe`;
      localStorage.setItem(localStorageKeys.safeTitle, generatedTitle);
      setTitle(generatedTitle);
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
      };
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [safeSdk]);

  return (
    <Grid container direction="column">
      <Grid container justifyContent="center" alignItems="center">
        <Grid item justifyContent="center" md={9} sm={12} xs={12} lg={9}>
          {localStorage.getItem(localStorageKeys.safeAddress) && (
            <SafeCard
              loading={safeDataLoading}
              address={safeSdk?.getAddress()}
              threshold={threshold}
              balance={balance}
              title={title}
            />
          )}
        </Grid>
      </Grid>
      {!localStorage.getItem(localStorageKeys.safeAddress) ? (
        <Grid container justifyContent="center">
          <Button variant="contained">Create multi-sig wallet</Button>
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <Grid container>
            <h2>Owners</h2>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item justifyContent="center" md={9} sm={12} xs={12} lg={9}>
              <Grid
                container
                justifyContent="flex-end"
                className={styles.add_button}
              >
                <Button variant="contained">
                  Add owner <AddIcon />
                </Button>
              </Grid>
              <CustomTable
                list={owners}
                loading={safeLoading}
                headers={TableHeaderEnum.ownersItems}
                canDelete
                canEdit
                canView
                handleView={() => {
                  console.log("handleView");
                }}
                handleEdit={() => {
                  console.log("handleEdit");
                }}
                handleDelete={() => {
                  console.log("handleDelete");
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default SafeDetails;
