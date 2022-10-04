import React from "react";
import { ethers } from "ethers";

import addLiquidity from "../../Web3/Functions/addLiquidity";
import removeLiquidity from "../../Web3/Functions/removeLiquidity";
import claimFees from "../../Web3/Functions/claimFees";
import listenerForTxMine from "../../Web3/Helpers/listener";

require("dotenv").config();
const INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET;

function FunctionButtonsGroup({ poolId, amountETH }) {
  const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET);

  const add = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const txResponse = await addLiquidity(amountETH);
        await listenerForTxMine(txResponse, provider);
        console.log("Adding Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const remove = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        let txResponse = await removeLiquidity(poolId);
        await listenerForTxMine(txResponse, provider);
        console.log("Remove Done");
        txResponse = await claimFees(poolId);
        await listenerForTxMine(txResponse, provider);
        console.log("Claim Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const claim = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const txResponse = await claimFees(poolId);
        await listenerForTxMine(txResponse, provider);
        console.log("Claim Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      {" "}
      <button
        className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        onClick={add}
      >
        Add Liquidity
      </button>
      <button
        className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md disabled:opacity-75 p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        onClick={remove}
        disabled={poolId !== undefined ? false : true}
      >
        Remove Liquidity
      </button>
      <button
        className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md disabled:opacity-75 p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        onClick={claim}
        disabled={poolId !== undefined ? false : true}
      >
        Claim Fees
      </button>
    </div>
  );
}

export default FunctionButtonsGroup;
