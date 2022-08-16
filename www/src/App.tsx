import React from "react";
import { RoutesList } from "routes";
import Snackbar from "modules/snackbar/snackbar.component";
import {
  getDefaultWallets,
  lightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import "./assets/sass/common.scss";
import "@rainbow-me/rainbowkit/styles.css";

function App() {
  const { chains, provider } = configureChains(
    [chain.rinkeby],
    [alchemyProvider({}), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "Value Unlocked",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        theme={lightTheme({
          accentColorForeground: "white",
          borderRadius: "small",
          fontStack: "system",
        })}
        chains={chains}
        coolMode
        showRecentTransactions={true}
      >
        <div className="App">
          <RoutesList />
          <Snackbar />
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
