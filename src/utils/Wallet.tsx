"use client";
import React, { FC } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { useGlobalState } from "@/hooks/useGlobalState";
import { GlobalState } from "@/state/global";

type Props = { children?: React.ReactNode };

export const Wallet: FC<Props> = ({ children }) => {
  const [mounted, setMounted] = React.useState(false);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = React.useMemo(() => clusterApiUrl(network), [network]);
  const wallets = React.useMemo(
    () => [new PhantomWalletAdapter()],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );
  React.useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{ commitment: "confirmed" }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          {mounted && <GlobalState>{children}</GlobalState>}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
