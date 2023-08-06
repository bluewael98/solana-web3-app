"use client";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
export default function Navbar() {
  return (
    <div className="top-0 w-screen fixed bg-black flex flex-row justify-end px-10">
      <WalletMultiButton />
      <WalletDisconnectButton />
    </div>
  );
}
