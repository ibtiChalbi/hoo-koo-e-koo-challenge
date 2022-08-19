import SafeServiceClient, {
  EthereumTxWithTransfersResponse,
  SafeModuleTransactionWithTransfersResponse,
  SafeMultisigTransactionResponse,
  SafeMultisigTransactionWithTransfersResponse,
} from "@gnosis.pm/safe-service-client";
import { useState } from "react";

type useTransactionType = {
  safeService: SafeServiceClient;
  safeAddress: string;
};

/**
 * Hooks useTransaction
 *
 */
export const useTransaction = ({
  safeService,
  safeAddress,
}: useTransactionType) => {
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
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [pendingTransactionsLoading, setPendingTransactionsLoading] =
    useState(true);

  /**
   * get history of transaction
   */
  const getTransactions = async () => {
    setTransactionsLoading(true);

    const pendingTxs = await safeService.getAllTransactions(safeAddress);
    setTransactions(pendingTxs?.results);
    setTransactionsLoading(false);
  };

  /**
   * get pending transactions
   */
  const getPendingTransactions = async () => {
    setPendingTransactionsLoading(true);

    const pendingTxs = await safeService.getPendingTransactions(safeAddress);
    setPendingTransactions(pendingTxs?.results);
    setPendingTransactionsLoading(false);
  };

  return {
    transactionsLoading,
    pendingTransactionsLoading,
    pendingTransactions,
    transactions,
    getTransactions,
    getPendingTransactions,
  };
};
