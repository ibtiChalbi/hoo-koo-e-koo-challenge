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
import { useAccount } from "wagmi";

interface TransactionsListProps {
  transactions: Array<
    | SafeModuleTransactionWithTransfersResponse
    | SafeMultisigTransactionWithTransfersResponse
    | EthereumTxWithTransfersResponse
    | SafeMultisigTransactionResponse
  >;
  loading: boolean;
  handleAccept?: (data: string) => void;
  handleReject?: (data: string) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = (
  props: TransactionsListProps
) => {
  const { address } = useAccount();

  return (
    <Grid container justifyContent="center">
      <CustomTable
        canConfirm
        canReject
        list={props.transactions.map((transaction: any) => ({
          method:
            transaction.dataDecoded?.method || "On-chain rejection created",
          transaction: transaction.transactionHash,
          status: !transaction.isSuccessful
            ? 0
            : transaction.dataDecoded
            ? 1
            : !transaction.confirmations?.find((x: any) => x.owner === address)
            ? 2
            : -1,
          confirmations: transaction.confirmationsRequired
            ? `${transaction.confirmations?.length}/${
                !transaction.isSuccessful || transaction.dataDecoded
                  ? transaction.confirmationsRequired
                  : transaction.confirmationsRequired +
                    transaction.confirmations?.length
              }`
            : "",
        }))}
        loading={props.loading}
        headers={TableHeaderEnum.safeTransactionsItems}
        handleAccept={(data) => props.handleAccept?.(data?.transaction)}
        handleReject={(data) => props.handleReject?.(data?.transaction)}
      />
    </Grid>
  );
};

export default TransactionsList;
