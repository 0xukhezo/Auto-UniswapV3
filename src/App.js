import React, { useState } from "react";
import { ethers } from "ethers";
import addLiquidity from "./Web3/Functions/addLiquidity";

function App() {
  const [connectedState, setConnectedState] = useState("Connet Wallet");

  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const add = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const txResponse = await addLiquidity();
        await listenerForTxMine(txResponse, provider);
        console.log("Done");
        setShowBalance(false);
      } catch (error) {
        console.log(error);
      }
    }
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

  function listenerForTxMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}..`);
    return new Promise((resolve, reject) => {
      provider.once(txResponse.hash, (txReceipt) => {
        console.log(`Completed with ${txReceipt.confirmations} confirmations`);
        resolve();
      });
    });
  }

  return (
    <>
      {connectedState !== "Connet Wallet" ? (
        <>
          <p className="m-6">{connectedState}</p>
          <button
            className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
            onClick={add}
          >
            Add Liquidity
          </button>
        </>
      ) : (
        <button
          onClick={connect}
          className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        >
          {connectedState}
        </button>
      )}
    </>
  );
}

export default App;
