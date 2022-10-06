import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import addLiquidity from "../../Web3/Functions/addLiquidity";
import removeLiquidity from "../../Web3/Functions/removeLiquidity";
import claimFees from "../../Web3/Functions/claimFees";
import swapETH from "../../Web3/Functions/swap";
import pool from "../../Web3/Functions/getPool";

import listenerForTxMine from "../../Web3/Helpers/listener";
import abiBalance from "../../Web3/Abis/abiBalance.json";

import {
  WALLET_ADDRESS,
  constantWETH,
  constantUNI,
} from "../../Constants/Constants";

require("dotenv").config();

function FunctionButtonsGroup({ poolId, amountETH, amountToSwap }) {
  const [balanceUniWeth, setBalanceUniWeth] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log(balanceUniWeth);
  const ratio = 0.01099 / 0.008132;

  const add = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        // The ETH amount is smaller than UNI
        // needs to swap UNI for ETH
        if (balanceUniWeth[1] < amountETH) {
          const balanceToSwapETH = amountETH - balanceUniWeth[1];
          let txResponse = await swapETH(balanceToSwapETH, 0, ratio);
          await listenerForTxMine(txResponse, provider);
          console.log("Swapping Done");
          txResponse = await addLiquidity(amountETH);
          await listenerForTxMine(txResponse, provider);
        } else {
          const txResponse = await addLiquidity(amountETH, ratio);
          await listenerForTxMine(txResponse, provider);
        }
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

  const remove = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        let txResponse = await removeLiquidity(poolId);
        await listenerForTxMine(txResponse, provider);
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
        await listenerForTxMine(txResponse, provider);
        console.log("Claim Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const swap = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const txResponse = await swapETH(amountToSwap, 1, ratio);
        await listenerForTxMine(txResponse, provider);
        console.log("Swap Done");
      } catch (error) {
        console.log(error);
      }
    }
  };

  const getPool = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await pool();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const balance = async () => {
    if (typeof window.ethereum != "undefined") {
      const tokenUNI = new ethers.Contract(
        constantUNI.address,
        abiBalance,
        provider
      );
      const tokenWETH = new ethers.Contract(
        constantWETH.address,
        abiBalance,
        provider
      );
      const balanceUNI = ethers.utils
        .formatUnits(
          (await tokenUNI.balanceOf(WALLET_ADDRESS)).toString(),
          constantUNI.decimals
        )
        .toString();
      const balanceWETH = ethers.utils
        .formatEther(await tokenWETH.balanceOf(WALLET_ADDRESS))
        .toString();
      setBalanceUniWeth([balanceUNI, balanceWETH]);
    }
  };

  useEffect(() => {
    balance();
  }, []);

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
      <button
        className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        onClick={swap}
      >
        Swap WETH
      </button>
      <button
        className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        onClick={balance}
      >
        Get Balance
      </button>
      <button
        className="p-3 border-solid border-indigo-600 border-2 m-6 rounded-md"
        onClick={getPool}
      >
        Get Pool
      </button>
    </div>
  );
}

export default FunctionButtonsGroup;
