import { JsonRpcFetchFunc } from "@ethersproject/providers";
import EthersAdapter from "@gnosis.pm/safe-ethers-lib";
import SafeServiceClient from "@gnosis.pm/safe-service-client";
import { ethers } from "ethers";

/**
 * Hooks useSafe
 *
 */
export const useGnosisSafe = () => {
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

  return {
    provider,
    safeOwner,
    ethAdapter,
    safeService,
  };
};
