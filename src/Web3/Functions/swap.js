const { ethers } = require("ethers");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: SwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
const { getPoolImmutables, getPoolState } = require("../Helpers/helpers");
const ERC20ABI = require("../Abis/abiSwap.json");

require("dotenv").config();
const WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const poolAddress = "0x07A4f63f643fE39261140DF5E613b9469eccEC86"; // UNI/WETH
const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";

const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";

const name1 = "USD Coin";
const symbol1 = "USDC";
const decimals1 = 18;
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

async function swapETH() {
  const poolContract = new ethers.Contract(
    poolAddress,
    IUniswapV3PoolABI,
    provider
  );
  const immutables = await getPoolImmutables(poolContract);

  const state = await getPoolState(poolContract);

  const swapRouterContract = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI,
    signer
  );

  const inputAmount = 0.008;
  // .001 => 1 000 000 000 000 000
  const amountIn = ethers.utils.parseUnits(inputAmount.toString(), decimals0);

  const approvalAmount = (amountIn * 100000).toString();
  const tokenContract0 = new ethers.Contract(address0, ERC20ABI, signer);
  const approvalResponse = await tokenContract0.approve(
    swapRouterAddress,
    approvalAmount
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

  console.log(params);

  let response;

  await swapRouterContract
    .exactInputSingle(params, {
      gasLimit: ethers.utils.hexlify(1000000),
    })
    .then((transaction) => {
      console.log(transaction);
      response = transaction;
    });

  return response;
}

export default swapETH;
