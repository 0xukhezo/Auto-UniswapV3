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
  name: "USDC Coin",
  symbol: "USDC",
  decimals: 18,
  address: "0xD87Ba7A50B2E7E660f678A895E4B72E7CB4CCd9C",
};

exports.chainId = 5;

exports.poolAddressWethUni = "0x07A4f63f643fE39261140DF5E613b9469eccEC86";
exports.poolAddressWethUsdc = "0x951b8635A3D7Aa2FD659aB93Cb81710536d90043";
exports.positionManagerAddress = "0xC36442b4a4522E871399CD717aBDD847Ab11FE88";
exports.swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
exports.EthInUsdc = "0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e";
exports.WALLET_ADDRESS = process.env.REACT_APP_WALLET_ADDRESS;
