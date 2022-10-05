const { ethers } = require("ethers");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: SwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
const { getPoolImmutables } = require("../Helpers/helpers");
const {
  constantWETH,
  poolAddressWethUni,
  WALLET_ADDRESS,
} = require("../../Constants/Constants");

require("dotenv").config();

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

async function swapETH(inputAmount) {
  const poolContract = new ethers.Contract(
    poolAddressWethUni,
    IUniswapV3PoolABI,
    provider
  );
  const immutables = await getPoolImmutables(poolContract);

  const swapRouterContract = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI,
    signer
  );

  const amountIn = ethers.utils.parseUnits(
    inputAmount.toString(),
    constantWETH.decimals
  );

  const params = {
    tokenIn: immutables.token1,
    tokenOut: immutables.token0,
    fee: immutables.fee,
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  let response;

  await swapRouterContract
    .exactInputSingle(params, {
      gasLimit: ethers.utils.hexlify(1000000),
    })
    .then((transaction) => {
      response = transaction;
    });

  return response;
}

export default swapETH;
