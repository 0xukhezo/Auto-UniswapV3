const { ethers, BigNumber } = require("ethers");
const {
  abi: INonfungiblePositionManagerABI,
} = require("@uniswap/v3-periphery/artifacts/contracts/interfaces/INonfungiblePositionManager.sol/INonfungiblePositionManager.json");

require("dotenv").config();
const {
  positionManagerAddress,
  WALLET_ADDRESS,
} = require("../../Constants/Constants");

async function gasEstimationClaim(poolIdToClaim) {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const gasPrice = ethers.utils.formatEther(await provider.getGasPrice());

  const nonFungiblePositionManagerContract = new ethers.Contract(
    positionManagerAddress,
    INonfungiblePositionManagerABI,
    provider
  );

  await nonFungiblePositionManagerContract.positions(poolIdToClaim.toString());

  const params = {
    tokenId: poolIdToClaim,
    recipient: WALLET_ADDRESS,
    amount0Max: ethers.utils.parseUnits("10", 18),
    amount1Max: ethers.utils.parseUnits("10", 18),
  };

  const claimRewardsGas =
    (
      await nonFungiblePositionManagerContract.estimateGas.collect(params, {
        gasLimit: ethers.utils.hexlify(1000000),
      })
    ).toNumber() * gasPrice;

  return claimRewardsGas;
}

export default gasEstimationClaim;
