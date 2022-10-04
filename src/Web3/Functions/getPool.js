const { ethers } = require("ethers");
const {
  abi: UniswapV3Factory,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
require("dotenv").config();
const INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET;

const address0 = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
const address1 = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET);

  const factoryContract = new ethers.Contract(
    factoryAddress,
    UniswapV3Factory,
    provider
  );

  const poolAddress = await factoryContract.getPool(address0, address1, 500);
  console.log("poolAddress", poolAddress);
}

main();