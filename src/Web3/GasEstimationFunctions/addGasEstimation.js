const { ethers, BigNumber } = require("ethers");
const { Token, Price } = require("@uniswap/sdk-core");
const {
  Pool,
  Position,
  nearestUsableTick,
  priceToClosestTick,
} = require("@uniswap/v3-sdk");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");
const ERC20ABI = require("../Abis/abiAddLiquidity.json");
const {
  chainId,
  positionManagerAddress,
  poolAddressWethUsdc,
  WALLET_ADDRESS,
  constantUSDC,
  constantWETH,
} = require("../../Constants/Constants");

require("dotenv").config();

async function getPoolData(poolContract) {
  const [tickSpacing, fee, liquidity, slot0] = await Promise.all([
    poolContract.tickSpacing(),
    poolContract.fee(),
    poolContract.liquidity(),
    poolContract.slot0(),
  ]);

  return {
    tickSpacing: tickSpacing,
    fee: fee,
    liquidity: liquidity,
    sqrtPriceX96: slot0[0],
    tick: slot0[1],
  };
}

async function gasEstimationAdd(amountETH, ratio, upTickPrice, lowTickPrice) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const gasPrice = ethers.utils.formatEther(await provider.getGasPrice());

  const UniToken = new Token(
    chainId,
    constantUSDC.address,
    constantUSDC.decimals,
    constantUSDC.symbol,
    constantUSDC.name
  );

  const WethToken = new Token(
    chainId,
    constantWETH.address,
    constantWETH.decimals,
    constantWETH.symbol,
    constantWETH.name
  );

  const nonfungiblePositionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    provider
  );

  const poolContract = new ethers.Contract(
    poolAddressWethUsdc,
    IUniswapV3PoolABI,
    provider
  );

  const poolData = await getPoolData(poolContract);
  const amountIn = amountETH * ratio;

  const WETH_UNI_POOL = new Pool(
    WethToken,
    UniToken,
    poolData.fee,
    poolData.sqrtPriceX96.toString(),
    poolData.liquidity.toString(),
    poolData.tick
  );

  const position = new Position({
    pool: WETH_UNI_POOL,
    liquidity: ethers.utils.parseUnits("0.01", 18),
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
  });

  const approvalAmount = ethers.utils.parseUnits("10", 18).toString();
  const tokenContract0 = new ethers.Contract(
    UniToken.address,
    ERC20ABI,
    provider
  );

  const tokenContract0Gas = await tokenContract0.estimateGas.approve(
    positionManagerAddress,
    approvalAmount
  );

  const tokenContract1 = new ethers.Contract(
    WethToken.address,
    ERC20ABI,
    provider
  );

  const tokenContract1Gas = await tokenContract1.estimateGas.approve(
    positionManagerAddress,
    approvalAmount
  );

  const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;
  // mintAmountsWithSlippage

  const params = {
    token0: constantUSDC.address,
    token1: constantWETH.address,
    fee: poolData.fee,
    tickLower: nearestUsableTick(
      priceToClosestTick(new Price(UniToken, WethToken, lowTickPrice, 1)) < 0
        ? priceToClosestTick(new Price(UniToken, WethToken, upTickPrice, 1))
        : priceToClosestTick(new Price(UniToken, WethToken, lowTickPrice, 1)),
      poolData.tickSpacing
    ),
    tickUpper: nearestUsableTick(
      priceToClosestTick(new Price(UniToken, WethToken, upTickPrice, 1)) < 0
        ? priceToClosestTick(new Price(UniToken, WethToken, lowTickPrice, 1))
        : priceToClosestTick(new Price(UniToken, WethToken, upTickPrice, 1)),
      poolData.tickSpacing
    ),
    amount0Desired: ethers.utils.parseEther(amountIn.toString()).toString(),
    amount1Desired: ethers.utils.parseEther(amountETH.toString()).toString(),
    amount0Min: amount0Desired.toString(),
    amount1Min: amount1Desired.toString(),
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  const addLiquidityGas =
    (
      await nonfungiblePositionManagerContract.estimateGas.mint(params, {
        gasLimit: 10000000000,
      })
    ).toNumber() * gasPrice;

  return addLiquidityGas;
}
export default gasEstimationAdd;
