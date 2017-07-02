import bignum from 'bignum';

import sha3 from 'solidity-sha3';

const Web3 = require('web3');
const crypto = require('crypto');
const web3 = new Web3();
const log = console.log;
const BigNumber = web3.BigNumber;

// todo: take this from truffle config
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

contract('Mine', function(accounts) {

  it('Mine', async () => {
    await mineBlocks(6);
    log("done");
  });

  const logBlock = () => {
    log(`Current block: ${web3.eth.blockNumber}`);
  };

  const logKeyValue = (key, value) => {
    log(`${key} : ${value}`)
  };

  const weiString = (amount) => {
    return `${amount} wei (${web3.fromWei(amount)} eth)`
  };

  const mineToBlock = async (blockNumber) => {
    log (`Mining to block ${blockNumber.toString()}...`);
    const currBlock = web3.eth.blockNumber;
    const blocks = blockNumber.sub(currBlock).toNumber();
    if (blocks > 0) await mineBlocks(blocks);
  };

  const mineBlocks = async (blocks)  => {

    log (`Mining ${blocks.toString()} blocks`);

    for (let i=0; i < blocks; i++) {
      mine = new Promise((resolve) => {
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

    console.log (`Current block: ${web3.eth.blockNumber.toString()}`);

  };

  let mine = function() {
    web3.currentProvider.sendAsync({jsonrpc: "2.0", method: "evm_mine", id: "1234",});
  };

  const logEvents = (tx) => {
    for (let l of tx.logs) {
      log(l.event + ":");
      log(l.args);
    }
  };

  const logGas = (tx) => {
    log("Gas used: " + tx.receipt.gasUsed);
  };

  const execLogTx = async (promise) => {
    const tx = await promise;
    logGas(tx);
    logEvents(tx);
  };

});
