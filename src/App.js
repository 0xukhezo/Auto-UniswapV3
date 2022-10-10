import React, { useState } from "react";
import AmountETHInput from "./Components/AmountETHInput/AmountETHInput";
import FunctionButtonsGroup from "./Components/FunctionButtonsGroup/FunctionButtonsGroup";
import PoolIdInput from "./Components/PoolIdInput/PoolIdInput";
import SwapInput from "./Components/SwapInput/SwapInput";
import TickInput from "./Components/TicksInputs/TicksInputs";

function App() {
  const [connectedState, setConnectedState] = useState("Connet Wallet");
  const [poolId, setPoolId] = useState(undefined);
  const [amountToSwap, setAmountToSwap] = useState(0);
  const [upTickPrice, setUpTickPrice] = useState(undefined);
  const [lowTickPrice, setLowTickPrice] = useState(undefined);
  const [amountETH, setAmountETH] = useState(0);

  let getPoolId = (id) => {
    setPoolId(id);
  };

  let getTickLow = (valueLow) => {
    setLowTickPrice(parseFloat(valueLow));
  };

  let getTickUp = (valueUp) => {
    setUpTickPrice(parseFloat(valueUp));
  };

  let getAmountToSwap = (amountSwap) => {
    setAmountToSwap(amountSwap);
  };

  let getAmountETH = (amount) => {
    setAmountETH(amount);
  };

  const connect = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setConnectedState(
        `${window.ethereum.selectedAddress.slice(0, 5)}` +
          "..." +
          `${window.ethereum.selectedAddress.slice(-4)}`
      );
    } else {
      console.log("I don't see a metamask");
      setConnectedState("Please install Metamask");
    }
  };

  return (
    <>
      {connectedState !== "Connet Wallet" ? (
        <>
          <div className="mt-6 mx-8 p-4 grid justify-items-end ">
            <p className="p-4 border-solid border-indigo-600 border-2 rounded-lg">
              {connectedState}
            </p>
          </div>

          <div className="mx-12 border-solid border-indigo-600 border-2 rounded-lg align-items-center">
            <PoolIdInput getPoolId={getPoolId} />
            <AmountETHInput getAmountETH={getAmountETH} />
            <SwapInput getAmountToSwap={getAmountToSwap} />
            <TickInput getTickLow={getTickLow} getTickUp={getTickUp} />
            <FunctionButtonsGroup
              poolId={poolId}
              amountETH={amountETH}
              amountToSwap={amountToSwap}
              upTickPrice={upTickPrice}
              lowTickPrice={lowTickPrice}
            />
          </div>
        </>
      ) : (
        <div className="flex align-center justify-center h-90">
          <button
            onClick={connect}
            className="p-3 border-solid border-indigo-600 border-2 m-80 rounded-md"
          >
            {connectedState}
          </button>
        </div>
      )}
    </>
  );
}

export default App;
