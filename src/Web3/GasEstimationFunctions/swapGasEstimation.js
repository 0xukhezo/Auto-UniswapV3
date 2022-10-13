const { ethers, BigNumber } = require("ethers");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: SwapRouterABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json");
const { getPoolImmutables } = require("../Helpers/helpers");
const {
  constantWETH,
  constantUSDC,
  positionManagerAddress,
  poolAddressWethUsdc,
  WALLET_ADDRESS,
  swapRouterAddress,
  EthInUsdc,
} = require("../../Constants/Constants");
const aggregatorV3InterfaceABI = require("../Abis/abiAggregatorV3Interface.json");

const ERC20ABI = require("../Abis/abiSwap.json");

require("dotenv").config();

async function swapGasEstimation(inputAmount, type, ratio) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const gasPrice = ethers.utils.formatEther(await provider.getGasPrice());

  const poolContract = new ethers.Contract(
    poolAddressWethUsdc,
    IUniswapV3PoolABI,
    provider
  );

  const immutables = await getPoolImmutables(poolContract);

  const swapRouterContract = new ethers.Contract(
    swapRouterAddress,
    SwapRouterABI,
    provider
  );

  let params;

  const amountIn = ethers.utils.parseUnits(inputAmount.toString(), "ether");

  if (type === 0) {
    console.log("dai por weth");

    const priceFeed = new ethers.Contract(
      EthInUsdc,
      aggregatorV3InterfaceABI,
      provider
    );

    let ethUsdc;

    await priceFeed.latestRoundData().then((roundData) => {
      ethUsdc = roundData.answer.toString() / 100000000;
    });

    const balanceToSwapETH = inputAmount + 0.055;
    const unisToSwap = (ratio * balanceToSwapETH).toFixed(18);

    params = {
      tokenIn: immutables.token0,
      tokenOut: immutables.token1,
      fee: immutables.fee,
      recipient: WALLET_ADDRESS,
      deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      amountIn: ethers.utils.parseUnits(
        unisToSwap.toString(),
        constantUSDC.decimals
      ),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };
  } else {
    console.log("weth por dai");

    params = {
      tokenIn: immutables.token1,
      tokenOut: immutables.token0,
      fee: immutables.fee,
      recipient: WALLET_ADDRESS,
      deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };
  }

  const approvalAmount = (amountIn * 10000).toString();

  const tokenContract0 = new ethers.Contract(
    constantUSDC.address,
    ERC20ABI,
    provider
  );

  const tokenContract0Gas = await tokenContract0.estimateGas.approve(
    positionManagerAddress,
    approvalAmount
  );

  const tokenContract1 = new ethers.Contract(
    constantWETH.address,
    ERC20ABI,
    provider
  );

  const tokenContract1Gas = await tokenContract1.estimateGas.approve(
    positionManagerAddress,
    approvalAmount
  );

  const encodedFunction = swapRouterContract.interface.encodeFunctionData(
    "exactInputSingle",
    params
  );

  const swapGas = await provider.estimateGas({
    to: swapRouterAddress,
    data: encodedFunction,
  });

  console.log(swapGas);

  //   const swapGas =
  //     (
  //       await swapRouterContract.estimateGas.exactInputSingle(params, {
  //         gasLimit: ethers.utils.hexlify(1000000),
  //       })
  //     ).toNumber() * gasPrice;

  return swapGas;
}

export default swapGasEstimation;
