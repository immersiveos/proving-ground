const Web3 = require('web3');
const crypto = require('crypto');
const web3 = new Web3();
const log = console.log;
const BigNumber = web3.BigNumber;

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

export const logBlock = () => {
  log(`Current block: ${web3.eth.blockNumber}`);
};

export const logKeyValue = (key, value) => {
  log(`${key} : ${value}`)
};

export const weiString = (amount) => {
  return `${amount} wei (${web3.fromWei(amount)} eth)`
};

export const mineToBlock = async (blockNumber) => {
  log(`Mining to block ${blockNumber.toString()}...`);
  const currBlock = web3.eth.blockNumber;
  const blocks = blockNumber.sub(currBlock).toNumber();
  if (blocks > 0) await mineBlocks(blocks);
};

const mineBlocks = async (blocks) => {

  log(`Mining ${blocks.toString()} blocks`);

  for (let i = 0; i < blocks; i++) {
    const mine = new Promise((resolve) => {
      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "evm_mine",
        id: new Date().getTime(),
      }, (err, result) => {
        resolve();
      })
    });
    await mine;
  }

  log(`Current block: ${web3.eth.blockNumber.toString()}`);
};

export const logEvents = (tx) => {
  for (let l of tx.logs) {
    log(`${l.event}:`);
    log(l.args);
  }
};

export const logGas = (tx) => {
  log("Gas used: " + tx.receipt.gasUsed);
};

export const execLogTx = async (promise) => {
  const tx = await promise;
  logGas(tx);
  logEvents(tx);
};
