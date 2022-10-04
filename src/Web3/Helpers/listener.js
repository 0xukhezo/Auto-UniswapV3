const listenerForTxMine = (txResponse, provider) => {
  console.log(txResponse);
  console.log(`Mining ${txResponse.hash}..`);
  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (txReceipt) => {
      console.log(`Completed with ${txReceipt.confirmations} confirmations`);
      resolve();
    });
  });
};

export default listenerForTxMine;
