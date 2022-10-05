import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

import addLiquidity from "../../Web3/Functions/addLiquidity";
import removeLiquidity from "../../Web3/Functions/removeLiquidity";
import claimFees from "../../Web3/Functions/claimFees";
import swapETH from "../../Web3/Functions/swap";
import pool from "../../Web3/Functions/getPool";

import listenerForTxMine from "../../Web3/Helpers/listener";
import abiBalance from "../../Web3/Abis/abiBalance.json";

require("dotenv").config();

function FunctionButtonsGroup({ poolId, amountETH, amountToSwap }) {
  const [balanceUsdcWeth, setBalanceUsdcWeth] = useState([]);
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const add = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        if (balanceUsdcWeth[1] < amountETH) {
          const balanceToSwap =
            amountETH - balanceUsdcWeth[1] + ethers.utils.parseEther("0.01");
          let txResponse = await swapETH(balanceToSwap);
          await listenerForTxMine(txResponse, provider);
          txResponse = await addLiquidity(amountETH);
          await listenerForTxMine(txResponse, provider);
        } else {
          const txResponse = await addLiquidity(amountETH);
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
        const txResponse = await swapETH(amountToSwap);
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
      const contractAddressUSDC = "0x07865c6e87b9f70255377e024ace6630c1eaa37f"; // address of the token contract
      const contractAddressWETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"; // address of the token contract
      const tokenUSDC = new ethers.Contract(
        contractAddressUSDC,
        abiBalance,
        provider
      );
      const tokenWETH = new ethers.Contract(
        contractAddressWETH,
        abiBalance,
        provider
      );
      const balanceUSDC = (
        (
          await tokenUSDC.balanceOf(
            "0xa8EC796eE75B04af1223445c587588181CEb56CD"
          )
        ).toString() / 1000000
      ).toString();
      const balanceWETH = ethers.utils
        .formatEther(
          await tokenWETH.balanceOf(
            "0xa8EC796eE75B04af1223445c587588181CEb56CD"
          )
        )
        .toString();
      setBalanceUsdcWeth([balanceUSDC, balanceWETH]);
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
