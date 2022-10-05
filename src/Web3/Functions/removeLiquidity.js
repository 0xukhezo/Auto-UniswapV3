const { ethers } = require("ethers");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");

require("dotenv").config();

const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager

async function removeLiquidity(poolIdToRemove) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const nonFungiblePositionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    signer
  );

  let response;
  let liquidityRemove;

  await nonFungiblePositionManagerContract
    .positions(
      poolIdToRemove.toString() // tokenId Pool
    )
    .then((res) => {
      liquidityRemove = res;
    });

  const totalLiquidity = liquidityRemove.liquidity.toString();

  const params = {
    tokenId: poolIdToRemove, // tokenId Pool
    liquidity: totalLiquidity,
    amount0Min: 0,
    amount1Min: 0,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  await nonFungiblePositionManagerContract
    .decreaseLiquidity(params, { gasLimit: ethers.utils.hexlify(1000000) })
    .then((res) => {
      response = res;
    });

  return response;
}

export default removeLiquidity;
