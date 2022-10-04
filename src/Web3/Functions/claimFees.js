const { ethers } = require("ethers");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");

require("dotenv").config();
const INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET;
const WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;
const WALLET_SECRET = process.env.REACT_APP_WALLET_SECRET;

const positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88"; // NonfungiblePositionManager

async function claimFees() {
  const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET);

  const nonFungiblePositionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    provider
  );

  const wallet = new ethers.Wallet(WALLET_SECRET);
  const connectedWallet = wallet.connect(provider);

  // 35733 36238 36208 36086 36087 36088 36089 36090
  await nonFungiblePositionManagerContract
    .connect(connectedWallet)
    .positions(
      "36218" //  tokenId Pool
    )
    .then((res) => {
      params = {
        tokenId: 36218, // tokenId Pool
        recipient: WALLET_ADDRESS,
        amount0Max: ethers.utils.parseUnits("10", 18),
        amount1Max: ethers.utils.parseUnits("10", 18),
      };

      nonFungiblePositionManagerContract
        .connect(connectedWallet)
        .collect(params, { gasLimit: ethers.utils.hexlify(1000000) })
        .then((res2) => {
          console.log("Claiming", res2);
        });
    });
}

module.exports = claimFees();
