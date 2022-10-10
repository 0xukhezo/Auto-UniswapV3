const { ethers } = require("ethers");
const {
  abi: UniswapV3Factory,
} = require("@uniswap/v3-core/artifacts/contracts/UniswapV3Factory.sol/UniswapV3Factory.json");
require("dotenv").config();

const address1 = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6";
const address0 = "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844";

const factoryAddress = "0x1F98431c8aD98523631AE4a59f267346ea31F984";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

async function pool() {
  const factoryContract = new ethers.Contract(
    factoryAddress,
    UniswapV3Factory,
    signer
  );

  const poolAddress = await factoryContract.getPool(address0, address1, 3000);
  console.log("poolAddress", poolAddress);
}

export default pool;
