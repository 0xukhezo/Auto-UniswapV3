const { ethers } = require("ethers");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");

require("dotenv").config();
const {
  positionManagerAddress,
  WALLET_ADDRESS,
} = require("../../Constants/Constants");

async function claimFees(poolIdToClaim) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const nonFungiblePositionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    signer
  );

  let response;

  // 35733 36238 36208 36086 36087 36088 36089 36090
  await nonFungiblePositionManagerContract.positions(
    poolIdToClaim.toString() //  tokenId Pool
  );

  const params = {
    tokenId: poolIdToClaim, // tokenId Pool
    recipient: WALLET_ADDRESS,
    amount0Max: ethers.utils.parseUnits("10", 18),
    amount1Max: ethers.utils.parseUnits("10", 18),
  };

  await nonFungiblePositionManagerContract
    .collect(params, { gasLimit: ethers.utils.hexlify(1000000) })
    .then((res) => {
      response = res;
    });

  return response;
}

export default claimFees;
