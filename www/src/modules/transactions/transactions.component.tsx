import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PublishIcon from "@mui/icons-material/Publish";
import styles from "./transactions.module.scss";
import { useAccount } from "wagmi";
import {
  EtherscanProvider,
  TransactionResponse,
} from "@ethersproject/providers";
import { formatEther } from "ethers/lib/utils";
import { RINKEBY_link } from "core/constant";
import SendTransaction from "./send-transaction.component";
import Modal from "shared/components/Model/model.component";

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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Block</TableCell>
                <TableCell></TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Value</TableCell>
                <TableCell>Hash</TableCell>
              </TableRow>
            </TableHead>
            {loadingTransactions ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Grid container justifyContent="center">
                      <CircularProgress />
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : transactions?.length > 0 ? (
              <TableBody>
                {transactions.map((row, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.blockNumber}
                    </TableCell>
                    <TableCell>
                      <div className={styles.transaction_button}>
                        {row.to === address && row.from === address ? (
                          <div className={styles.self}>self</div>
                        ) : row.to === address ? (
                          <div className={styles.in}>in</div>
                        ) : (
                          <div className={styles.out}>out</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.ellipsis}>{row.from}</div>
                    </TableCell>
                    <TableCell>
                      <div className={styles.ellipsis}>{row.to}</div>
                    </TableCell>
                    <TableCell>{formatEther(row.value)} Ether</TableCell>
                    <TableCell>
                      <a href={`${RINKEBY_link}tx/${row.hash}`} target="blank">
                        View Transaction
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={7}>
                    <Grid container justifyContent="center">
                      No data available try again later
                    </Grid>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
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
