import React from "react";
import { Grid } from "@mui/material";
import CustomTable from "shared/components/CustomTable/custom-table.component";
import { TableHeaderEnum } from "core/enums/table-header/table-header.enum";
import {
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionWithTransfersResponse,
  EthereumTxWithTransfersResponse,
  SafeMultisigTransactionResponse,
} from "@gnosis.pm/safe-service-client";

interface TransactionsListProps {
  transactions: Array<
    | SafeModuleTransactionWithTransfersResponse
    | SafeMultisigTransactionWithTransfersResponse
    | EthereumTxWithTransfersResponse
    | SafeMultisigTransactionResponse
  >;
  loading: boolean;
  isQueue?: boolean;
}

const TransactionsList: React.FC<TransactionsListProps> = (
  props: TransactionsListProps
) => {
  return (
    <Grid container justifyContent="center">
      <CustomTable
        list={props.transactions.map((transaction: any) => ({
          method:
            transaction.dataDecoded?.method || "On-chain rejection created",
          transaction: transaction.transactionHash,
          status: !transaction.isSuccessful
            ? 0
            : transaction.dataDecoded
            ? 1
            : -1,
        }))}
        loading={props.loading}
        headers={
          props.isQueue
            ? TableHeaderEnum.safePendingTransactionsItems
            : TableHeaderEnum.safeTransactionsItems
        }
      />
    </Grid>
  );
};

export default TransactionsList;
