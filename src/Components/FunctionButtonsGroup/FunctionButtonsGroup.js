import React from "react";
import { ethers } from "ethers";

import addLiquidity from "../../Web3/Functions/addLiquidity";
import removeLiquidity from "../../Web3/Functions/removeLiquidity";
import claimFees from "../../Web3/Functions/claimFees";
import listenerForTxMine from "../../Web3/Helpers/listener";

require("dotenv").config();

function FunctionButtonsGroup({ poolId, amountETH }) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const add = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const txResponse = await addLiquidity(amountETH);
        await listenerForTxMine(txResponse, signer);
        console.log("Adding Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const close = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        let txResponse = await removeLiquidity(poolId);
        await listenerForTxMine(txResponse, signer);
        console.log("Remove Done");
        txResponse = await claimFees(poolId);
        await listenerForTxMine(txResponse, signer);
        console.log("Claim Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const remove = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        let txResponse = await removeLiquidity(poolId);
        await listenerForTxMine(txResponse, signer);
        console.log("Remove Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const claim = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const txResponse = await claimFees(poolId);
        await listenerForTxMine(txResponse, signer);
        console.log("Claim Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      {poolId !== undefined ? (
        <>
          {" "}
          <button
            className="p-3 border-solid border-indigo-600 border-2 mx-6 rounded-md disabled:opacity-75 p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
            onClick={close}
            disabled={poolId !== undefined ? false : true}
          >
            Close Position
          </button>
          <button
            className="p-3 border-solid border-indigo-600 border-2 mx-6 rounded-md disabled:opacity-75 p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
            onClick={remove}
            disabled={poolId !== undefined ? false : true}
          >
            Remove Liquidity
          </button>
          <button
            className="p-3 border-solid border-indigo-600 border-2 mx-6 rounded-md disabled:opacity-75 p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
            onClick={claim}
            disabled={poolId !== undefined ? false : true}
          >
            Claim Fees
          </button>
        </>
      ) : (
        <></>
      )}
      <button
        className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        onClick={add}
      >
        Add Liquidity
      </button>
    </div>
  );
}

export default FunctionButtonsGroup;
