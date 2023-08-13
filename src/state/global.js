"use client";
import React, {
  useContext,
  createContext,
  useEffect,
  useCallback,
} from "react";
import { Context, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  getProgram,
  getMasterAccountPk,
  getBetAccountPk,
} from "@/utils/program";
import toast from "react-hot-toast";
import { data } from "autoprefixer";

export const GlobalContext = createContext({
  isConnected: null,
  wallet: null,
  hasUserAccount: null,
  allBets: null,
  fetchBets: null,
});

export const GlobalState = ({ children }) => {
  const [program, setProgram] = React.useState();
  const [isConnected, setIsConnected] = React.useState();
  const [masterAccount, setMasterAccount] = React.useState();
  const [allBets, setAllBets] = React.useState();
  const [userBets, setUserBets] = React.useState();

  const { connection } = useConnection();
  const wallet = useAnchorWallet();

  //Set program
  React.useEffect(() => {
    if (connection) {
      setProgram(getProgram(connection, wallet ?? {}));
    } else {
      setProgram(null);
    }
  }, [connection, wallet]);

  React.useEffect(() => {
    setIsConnected(!!wallet?.publicKey);
  }, [wallet]);

  const fetchMasterAccount = React.useCallback(async () => {
    if (!program) return;
    try {
      const masterAccountPk = await getMasterAccountPk();
      const masterAccount = await program.account.master.fetch(masterAccountPk);
      setMasterAccount(masterAccount);
    } catch (e) {
      console.log("Could not fetch master account:");
      setMasterAccount(null);
    }
  });

  //Check for master account
  useEffect(() => {
    if (!masterAccount && program) {
      fetchMasterAccount();
    }
  }, [masterAccount, program]);

  const fetchBets = React.useCallback(async () => {
    if (!program) return;
    const allBetsResult = await program.account.bet.all();
    const allBets = allBetsResult.map((bet) => {
      return bet.account;
    });
    setAllBets(allBets);

    // if needed you can use .filter to get JUST the users bets
  }, [program]);

  useEffect(() => {
    // fetch all bets if they do not exist
    if (!allBets) {
      fetchBets();
    }
  }, [allBets, fetchBets]);

  const createBet = React.useCallback(
    async (amount, price, duration, pythPriceKey) => {
      if (!masterAccount) return;
      try {
        const betId = masterAccount.lastBetId.addn(1);
        const res = await getBetAccountPk(betId);
        console.log({ betPk: res });
        const txHash = await program.methods
          .createBet(amount, price, duration, pythPriceKey)
          .accounts({
            bet: await getBetAccountPk(betId),
            master: await getMasterAccountPk(),
            player: wallet.publicKey,
          })
          .rpc();
        await connection.confirmTransaction(txHash);
        console.log("Created bet!", txHash);
        toast.success("Created bet!");
        location.reload();
      } catch (e) {
        toast.error("Failed to create bet!");
        console.log(e.message);
      }
    },
    [masterAccount]
  );

  // Close Bet
  const closeBet = React.useCallback(
    async (bet) => {
      if (!masterAccount) return;

      try {
        const txHash = await program.methods
          .closeBet()
          .accounts({
            bet: await getBetAccountPk(bet.id),
            player: wallet.publicKey,
          })
          .rpc();
        toast.success("Closed bet!", txHash);
        location.reload();
      } catch (e) {
        toast.error("Failed to close bet!");
        console.log("Couldnt close bet", e.message);
      }
    },
    [masterAccount]
  );

  // Enter Bet

  const enterBet = React.useCallback(async (price, bet) => {
    if (!masterAccount) return;
    try {
      const txHash = await program.methods
        .enterBet(price)
        .accounts({
          bet: await getBetAccountPk(bet.id),
          player: wallet.publicKey,
        })
        .rpc();
      toast.success("Entered bet!", txHash);
    } catch (e) {
      console.log("Couldn't enter bet:", e.message);
      toast.error("Failed to enter bet!");
    }
  });

  // Claim Bet

  const claimBet = useCallback(
    async (bet) => {
      if (!masterAccount) return;
      try {
        const txHash = await program.methods
          .claimBet()
          .accounts({
            bet: await getBetAccountPk(bet.id),
            pyth: bet.pythPriceKey,
            playerA: bet.predictionA.player,
            playerB: bet.predictionB.player,
            signer: wallet.publicKey,
          })
          .rpc();
      } catch (e) {
        console.log("Failed to claim the bet!", e.message);
        toast.error("Failed to claim the bet!");
      }
    },
    [masterAccount]
  );

  return (
    <GlobalContext.Provider
      value={{
        allBets: allBets,
        masterAccount: masterAccount,
        createBet: createBet,
        closeBet: closeBet,
        enterBet,
        claimBet,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
