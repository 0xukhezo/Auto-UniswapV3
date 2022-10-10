exports.constantWETH = {
  name: "Wrapped Ether",
  symbol: "WETH",
  decimals: 18,
  address: "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6",
};
exports.constantUNI = {
  name: "Uniswap Coin",
  symbol: "UNI",
  decimals: 18,
  address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
};
exports.constantUSDC = {
  name: "DAI Coin",
  symbol: "DAI",
  decimals: 18,
  address: "0x11fE4B6AE13d2a6055C8D9cF65c55bac32B5d844",
};

exports.chainId = 5;

exports.poolAddressWethUni = "0x07A4f63f643fE39261140DF5E613b9469eccEC86";
exports.poolAddressWethUsdc = "0xB7Eb1cd21c39791Ca61a2A6FFf510248840b71E1";
exports.positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
exports.swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
exports.EthInUsdc = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e";
exports.WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;
