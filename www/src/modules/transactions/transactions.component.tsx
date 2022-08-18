import React, { useEffect, useState } from "react";
import { Button, Grid } from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import styles from "./transactions.module.scss";
import { useAccount } from "wagmi";
import {
  EtherscanProvider,
  TransactionResponse,
} from "@ethersproject/providers";
import SendTransaction from "./send-transaction.component";
import Modal from "shared/components/Model/model.component";
import CustomTable from "shared/components/CustomTable/custom-table.component";
import { TableHeaderEnum } from "core/enums/table-header/table-header.enum";

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loadingTransactions, setloadingTransactions] = useState(true);
  const [openSendModel, setopenSendModel] = useState(false);
  const { address } = useAccount();
  const provider = new EtherscanProvider("rinkeby");

  useEffect(() => {
    const fetchTransactions = async () => {
      await gethistory();
    };
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const gethistory = async () => {
    try {
      setloadingTransactions(true);
      const history = await provider.getHistory(address || "");
      if (history) {
        setTransactions(history);
      }
      setloadingTransactions(false);
    } catch (e) {
      setloadingTransactions(false);
    }
  };

  const handleOpen = () => setopenSendModel(true);
  const handleClose = () => setopenSendModel(false);
  const transactionDone = async () => {
    setopenSendModel(false);
    gethistory();
  };

  return (
    <Grid container justifyContent="center">
      <Grid container justifyContent="flex-end">
        <Button
          variant="contained"
          className={styles.funds_button}
          onClick={handleOpen}
        >
          Send Funds <PublishIcon />
        </Button>
      </Grid>
      <Grid container>
        <CustomTable
          list={transactions}
          loading={loadingTransactions}
          headers={TableHeaderEnum.transactionsItems}
        />
      </Grid>
      <Modal
        title="Send funds"
        open={openSendModel}
        handleClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <SendTransaction transactionDone={transactionDone} />
      </Modal>
    </Grid>
  );
};

export default Transactions;
