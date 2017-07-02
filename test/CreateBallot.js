import bignum from 'bignum';

import sha3 from 'solidity-sha3';

const Web3 = require('web3');
const crypto = require('crypto');
const web3 = new Web3();
const log = console.log;
const BigNumber = web3.BigNumber;

const TokenBallot = artifacts.require("./TokenBallot.sol");
const TokenBallotRegistry = artifacts.require("./TokenBallotRegistry.sol");
const BallotProposal = artifacts.require("./BallotProposal.sol");

// todo: take this from truffle config
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN });

const blockGasLimit = 4200000;

contract('Ballots', function(accounts) {

  it('Create Ballot', async () => {

    const registry = await TokenBallotRegistry.deployed();
    const token = await ImmersiveToken.deployed();
    const ballotStart =  new BigNumber(web3.eth.blockNumber);
    const ballotEnd =  new BigNumber(web3.eth.blockNumber).add(10);
    const ballot = await TokenBallot.new("Test Ballot", token, ballotStart, ballotEnd);
    await registry.addBallot(ballot);
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

    log (`Current block: ${web3.eth.blockNumber.toString()}`);

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
