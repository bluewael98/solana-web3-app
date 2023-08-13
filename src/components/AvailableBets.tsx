import { useState, useContext, useEffect } from "react";
import { STOCKDATA } from "@/data/asset.seed";
const styles = {
  button:
    "rounded-lg py-2 px-5 text-[#ffffff] text-xs border-[#30363b] bg-[#1E2123] border",
  availableBetsContainer: "flex flex-col mt-4 border-t border-[#30363b] pt-2",
  availableBetsTitle: "text-[#ffffff] font-bolder text-lg ",
  stockName: "text-[#ffffff] font-bolder text-lg ml-4",
  noAvailableBetsTitle: "text-[#ef4b09] font-bold text-sm ",
  availableBetsItem:
    "flex flex-row justify-between items-center border-b border-[#30363b] pb-2",
  currentStockPrice: "flex flex-col justify-center items-center",
  currentStockPriceTitle: "text-[8px] text-[#ffffff] mt-4",
  currentStockPriceAmount: "text-lg text-[#ffffff]",
};
// SOLANA STUFF
import { useGlobalState } from "@/hooks/useGlobalState";
import { getSolAmount } from "@/utils/utils";
import { IoMdClose } from "react-icons/io";

const AvailableBets = ({ setSelectedBet, setShowModal }: any) => {
  const { allBets, closeBet, claimBet } = useGlobalState();

  return (
    <div className={styles.availableBetsContainer}>
      <p className={styles.availableBetsTitle}>Available Bets</p>
      {allBets?.map((bet: any) => {
        return (
          <div key={bet.id.toString()} className={styles.availableBetsItem}>
            <p className={styles.stockName}>AMC</p>
            <div className={styles.currentStockPrice}>
              <p className={styles.currentStockPriceTitle}>
                CURRENT POT AMOUNT
              </p>
              <p className={styles.currentStockPriceAmount}>
                {getSolAmount(bet.amount)} SOL
              </p>
            </div>
            {Object.keys(bet.state)[0].toLocaleUpperCase() == "STARTED" ? (
              <div className={styles.button} onClick={() => closeBet(bet)}>
                CLAIM
              </div>
            ) : Object.keys(bet.state)[0].toLocaleUpperCase() ==
              "PLAYERAWON" ? (
              <div className={styles.availableBetsTitle}>Player A Won </div>
            ) : Object.keys(bet.state)[0].toLocaleUpperCase() ==
              "PLAYERBWON" ? (
              <div className={styles.availableBetsTitle}>Player B Won </div>
            ) : (
              <div
                className={styles.button}
                onClick={() => {
                  setSelectedBet(bet);
                  setShowModal(true);
                }}
              >
                Enter
              </div>
            )}

            <IoMdClose
              className="hover:text-[#ffffff] text-2xl mr-4"
              onClick={() => closeBet(bet)}
            />
          </div>
        );
      })}

      {allBets?.length === 0 && (
        <p className={styles.noAvailableBetsTitle}>No Available Bets</p>
      )}
    </div>
  );
};

export default AvailableBets;
