const { ethers } = require("ethers");
const { Token } = require("@uniswap/sdk-core");
const { Pool, Position, nearestUsableTick } = require("@uniswap/v3-sdk");
const {
  abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");
const ERC20ABI = require("../Abis/abiAddLiquidity.json");

require("dotenv").config();

const WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;

const poolAddress = "0xfAe941346Ac34908b8D7d000f86056A18049146E"; // UNI/WETH on Goerli
const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const name0 = "Wrapped Ether";
const symbol0 = "WETH";
const decimals0 = 18;
const address0 = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";

const name1 = "USD Coin";
const symbol1 = "USDC";
const decimals1 = 18;
const address1 = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";

const chainId = 5; // Goerli
const WethToken = new Token(chainId, address0, decimals0, symbol0, name0);
const UniToken = new Token(chainId, address1, decimals1, symbol1, name1);

const nonfungiblePositionManagerContract = new ethers.Contract(
  positionManagerAddress,
  INonfungiblePositionManagerABI,
  signer
);

const poolContract = new ethers.Contract(
  poolAddress,
  IUniswapV3PoolABI,
  signer
);

const getPoolData = async (poolContract) => {
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
};

const addLiquidity = async (amountETH) => {
  const poolData = await getPoolData(poolContract);

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

  const tokenContract0 = new ethers.Contract(address0, ERC20ABI, signer);
  await tokenContract0.approve(positionManagerAddress, approvalAmount);
  const tokenContract1 = new ethers.Contract(address1, ERC20ABI, signer);
  await tokenContract1.approve(positionManagerAddress, approvalAmount);

  const { amount0: amount0Desired, amount1: amount1Desired } =
    position.mintAmounts;
  // mintAmountsWithSlippage

  const params = {
    token0: address0,
    token1: address1,
    fee: poolData.fee,
    tickLower:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) -
      poolData.tickSpacing * 2,
    tickUpper:
      nearestUsableTick(poolData.tick, poolData.tickSpacing) +
      poolData.tickSpacing * 2,
    amount0Desired: ethers.utils
      .parseUnits(amountETH.toString(), 18)
      .toString(), // Cantidad del primer token que se va a depositar
    amount1Desired: ethers.utils
      .parseUnits(amountETH.toString(), 18)
      .toString(),
    amount0Min: amount0Desired.toString(),
    amount1Min: amount1Desired.toString(),
    recipient: WALLET_ADDRESS,
    deadline: Math.floor(Date.now() / 1000) + 60 * 10,
  };

  let response;

  await nonfungiblePositionManagerContract
    .mint(params, { gasLimit: ethers.utils.hexlify(1000000) })
    .then((res) => {
      response = res;
    });

  return response;
};

export default addLiquidity;
