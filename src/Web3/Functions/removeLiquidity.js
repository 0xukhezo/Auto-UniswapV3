const { ethers } = require("ethers");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");

require("dotenv").config();
const INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET;
const WALLET_SECRET = process.env.REACT_APP_WALLET_SECRET;

const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager

async function removeLiquidity() {
  const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET);

  const nonFungiblePositionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    provider
  );

  const wallet = new ethers.Wallet(WALLET_SECRET);
  const connectedWallet = wallet.connect(provider);

  await nonFungiblePositionManagerContract
    .connect(connectedWallet)
    .positions(
      "36218" // tokenId Pool
    )
    .then((res) => {
      const totalLiquidity = res.liquidity.toString();

      params = {
        tokenId: 36218, // tokenId Pool
        liquidity: totalLiquidity,
        amount0Min: 0,
        amount1Min: 0,
        deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      };

      nonFungiblePositionManagerContract
        .connect(connectedWallet)
        .decreaseLiquidity(params, { gasLimit: ethers.utils.hexlify(1000000) })
        .then((res2) => {
          claimFees();
          console.log("Removing", res2);
        });
    });
}

module.exports = removeLiquidity();
