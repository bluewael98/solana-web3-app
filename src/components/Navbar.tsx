"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
export default function Navbar() {
  return (
    <div className="top-0 w-screen fixed bg-black">
      <WalletMultiButton />
    </div>
  );
}
