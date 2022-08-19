import React from "react";
import { Grid } from "@mui/material";
import { Button } from "@mui/material";
import CustomTable from "shared/components/CustomTable/custom-table.component";
import { TableHeaderEnum } from "core/enums/table-header/table-header.enum";
import styles from "./safe.module.scss";
import {
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse,
  EthereumTxWithTransfersResponse,
} from "@gnosis.pm/safe-service-client";

interface TransactionsListProps {
  transactions: Array<
    | SafeModuleTransactionWithTransfersResponse
    | SafeMultisigTransactionWithTransfersResponse
    | EthereumTxWithTransfersResponse
  >;
  loading: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = (
  props: TransactionsListProps
) => {
  return (
    <Grid container justifyContent="center">
      <Grid container justifyContent="flex-end" className={styles.add_button}>
        <Button variant="contained">New Transaction</Button>
      </Grid>
      <CustomTable
        list={props.transactions.map((transaction: any) => ({
          method:
            transaction.dataDecoded?.method || "On-chain rejection created",
          transaction: transaction.transactionHash,
          status: !transaction.isSuccessful
            ? "pending"
            : transaction.dataDecoded
            ? "success"
            : "rejected",
        }))}
        loading={props.loading}
        headers={TableHeaderEnum.safeTransactionsItems}
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
  );
};

export default TransactionsList;
