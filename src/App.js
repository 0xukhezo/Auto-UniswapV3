import React, { useState } from "react";
import AmountETHInput from "./Components/AmountETHInput/AmountETHInput";
import FunctionButtonsGroup from "./Components/FunctionButtonsGroup/FunctionButtonsGroup";
import PoolIdInput from "./Components/PoolIdInput/PoolIdInput";

function App() {
  const [connectedState, setConnectedState] = useState("Connet Wallet");
  const [poolId, setPoolId] = useState(undefined);
  const [amountETH, setAmountETH] = useState(0);

  let getPoolId = (id) => {
    setPoolId(id);
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
    <div>
      {connectedState !== "Connet Wallet" ? (
        <>
          <p className="m-6">{connectedState}</p>
          <PoolIdInput getPoolId={getPoolId} />
          <AmountETHInput getAmountETH={getAmountETH} />
          <FunctionButtonsGroup poolId={poolId} amountETH={amountETH} />
        </>
      ) : (
        <button
          onClick={connect}
          className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        >
          {connectedState}
        </button>
      )}
    </div>
  );
}

export default App;
