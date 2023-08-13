"use client";
// Components
import Navbar from "@/components/Navbar";
import PortfolioChart from "@/components/PortfolioChart";
import AvailableBets from "@/components/AvailableBets";
// Icons
import { IoMdArrowDropdown } from "react-icons/io";

// Dependencies
import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { STOCKDATA, CRYPTODATA } from "@/data/asset.seed";
import DropDown from "@/components/DropDown";
import CustomModal from "@/components/CustomModal";

// SOLANA IMPORTS
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { useGlobalState } from "@/hooks/useGlobalState";

//Styles
const styles = {
  mainContainer: " w-2/3 h-full m-auto flex mt-16",
  leftMain: "flex flex-col w-3/4 h-full  p-6 ",
  portfolioAmountContainer: "flex flex-col ",
  portfolioAmount: "text-white text-4xl",
  portfolioPercent: "text-white font-bold text-sm",
  pastHour: "text-gray-400",

  buyingPowerContainer:
    "w-full border-t   h-16 border-[#30363b] flex justify-between items-center p-4",
  buyingPowerTitle: "text-white font-bolder text-xl",
  buyingPowerAmount:
    "text-white font-bolder text-xl flex flex-row items-center relative ",
  notice: "flex border border-[#30363b] mx-11 my-4 p-5 flex-col flex-1",
  noticeContainer: "flex-1",
  noticeTitle: "text-gray-500",
  noticeMessage: "text-white font-bold",
  noticeCTA: "font-bold text-green-500 cursor-pointer mt-5",
  rightMain:
    "flex flex-col flex-1 h-4/5 bg-[#1E2123] mt-6 rounded-lg overflow-hidden noScroll",
  dropDownBets:
    "absolute bg-[#1E2123] border-[#30363b] px-2 py-2 border rounded-xl top-7",
  formButtons: " w-full flex flex-row justify-center p-2 text-2xl",
  button:
    "rounded-lg py-2 px-16 text-[#ffffff] text-xs border-[#30363b] bg-[#1E2123] border ",
  inputForm: "flex flex-row mt-4",
  input:
    "rounded-lg px-5 border-[#30363b] bg-[#1E2123] border mx-2 w-3/4 p-1 text-[#ffffff] focus:outline-none",
  availableBetsContainer: "flex flex-col mt-4 border-t border-[#30363b] pt-2",
  availableBetsTitle: "text-[#ffffff] font-bolder text-lg ",
  availableBetsItem:
    "flex flex-row justify-between items-center border-b border-[#30363b] pb-2",
  currentStockPrice: "flex flex-col justify-center items-center",
  currentStockPriceTitle: "text-[8px] text-[#ffffff] mt-4",
  currentStockPriceAmount: "text-lg text-[#ffffff]",
};
const timeTypes = ["seconds", "days", "months"];

export default function Home() {
  const [showBetDropdown, setShowBetDropdown]: any = useState(false);
  const [data, setData] = useState(STOCKDATA[0]);
  const [bet, setBet] = useState("");
  const [sol, setSol] = useState("");
  const [expiryTime, setExpiryTime] = React.useState("");
  const [timeType, setTimeType] = useState(timeTypes[0]);
  const [timeDropDown, setTimeTypeDropDown] = useState(false);
  const [stockName, setStockName]: any = useState(STOCKDATA[0].name);
  const [stockPrice, setStockPrice] = useState(STOCKDATA[0].price);
  const [priceKey, setPriceKey] = useState(STOCKDATA[0].priceKey);
  const [availableStock, setAvailableStock] = React.useState([]);
  const [showStockDropDown, setShowStockDropDown] = useState(false);
  const [showAssetDropDown, setShowAssetDropDown] = useState(true);
  const [selectedBet, setSelectedBet] = useState({});
  const [showModal, setShowModal] = useState(false);

  // Static
  const staticCreatebet = () => {
    console.log("Creating bet");
  };
  const { allBets: allBets, createBet: createBet } = useGlobalState();
  console.log(allBets, "All bets");

  return (
    <div className="w-screen flex flex-col justify-center h-screen">
      <Navbar />
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.mainContainer}>
        <div className={styles.leftMain}>
          {/* Top section */}
          <div className={styles.portfolioAmountContainer}>
            <div className={styles.portfolioAmount}>{data.name}</div>
            <div className={styles.portfolioPercent}>
              +0.0008(+0.57%)
              <span className={styles.pastHour}>Past Hour</span>
            </div>
          </div>

          <div className="flex justify-center items-center m-5">
            <div>
              <PortfolioChart data={data} />
            </div>
          </div>

          <div className={styles.buyingPowerContainer}>
            {/* Dropdown Bet Menu  */}
            <div
              onClick={() => setShowBetDropdown(!showBetDropdown)}
              className={styles.buyingPowerAmount}
            >
              {stockName}
              <IoMdArrowDropdown />
              {showBetDropdown && (
                <div className={styles.dropDownBets}>
                  {STOCKDATA.filter((data: any) => {
                    let availableBetStockName = availableStock.map(
                      (stock: any) => stock.stockName
                    );
                    if (!availableBetStockName.includes(data.name)) {
                      return data;
                    } else {
                      return;
                    }
                  }).map((data: any) => {
                    return (
                      <p
                        key={data.name}
                        onClick={() => {
                          setStockName(data.name);
                          setStockPrice(data.price);
                          setPriceKey(data.priceKey);
                          setData(data);
                        }}
                      >
                        {data.name}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
            <div className={styles.buyingPowerTitle}>Bet On Stocks</div>
          </div>

          <div className={styles.formButtons}>
            <div>
              <p className="text-[#ffffff]">
                Current price of {stockName}: ${stockPrice}
              </p>
            </div>
          </div>
          {/* Submit bet */}
          <form className="flex flex-col">
            <div className="flex flex-row mt-4">
              <input
                className={styles.input}
                placeholder={"PREDICTION"}
                type="number"
                required
                onChange={(e) => setBet(e.target.value)}
                value={bet}
              />
              <input
                className={styles.input}
                placeholder={"SOL"}
                type="number"
                required
                onChange={(e) => {
                  setSol(e.target.value);
                }}
                value={sol}
              />
              <input
                className={styles.input}
                placeholder={timeType}
                type="number"
                required
                onChange={(e) => setExpiryTime(e.target.value)}
                value={expiryTime}
              />
              <div
                className={styles.buyingPowerAmount}
                onClick={() => setTimeTypeDropDown(!timeDropDown)}
              >
                {timeType} <IoMdArrowDropdown />
                {timeDropDown && (
                  <div className={styles.dropDownBets}>
                    {timeTypes.map((data: any) => {
                      return (
                        <p
                          key={data.name}
                          onClick={() => {
                            setTimeType(data);
                          }}
                        >
                          {data}
                        </p>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
            <input
              type="submit"
              disabled={availableStock.length === STOCKDATA.length}
              value="Submit"
              className={`${
                styles.button
              }${" bg-[#ef4b09] w-1/4 text-center mt-8 self-center"}`}
              onClick={(e) => {
                e.preventDefault();
                createBet(
                  new BN(Number(sol) * LAMPORTS_PER_SOL), // bet amount in lamports(10^-9 SOL)
                  Number(bet), // prediction price
                  Number(expiryTime), // duration in seconds
                  new PublicKey(priceKey) // pythPriceKey
                );
                staticCreatebet();
              }}
            />
          </form>
          <AvailableBets
            availableStock={availableStock}
            setSelectedBet={setSelectedBet}
            setShowModal={setShowModal}
            data={data}
          />
        </div>
        <div className={styles.rightMain}>
          <DropDown
            data={STOCKDATA}
            setData={setData}
            showDropDown={showAssetDropDown}
            setShowDropDown={setShowAssetDropDown}
            title={"Stocks/Assets"}
          />
          <DropDown
            data={CRYPTODATA}
            setData={setData}
            showDropDown={showStockDropDown}
            setShowDropDown={setShowStockDropDown}
            title={"Crypto Currencies"}
          />
        </div>
      </div>
      <CustomModal
        isOpen={showModal}
        selectedBet={selectedBet}
        setAvailableStock={setAvailableStock}
        setShowModal={setShowModal}
      />
    </div>
  );
}
