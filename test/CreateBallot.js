import bignum from 'bignum';

import sha3 from 'solidity-sha3';

const Web3 = require('web3');
const crypto = require('crypto');
const web3 = new Web3();
const log = console.log;
const BigNumber = web3.BigNumber;

const TokenBallot = artifacts.require("./TokenBallot.sol");
const TokenBallotRegistry = artifacts.require("./TokenBallotsRegistry.sol");
const BallotProposal = artifacts.require("./BallotProposal.sol");
const ImmersiveToken = artifacts.require("./ImmersiveToken.sol");

// todo: take this from truffle config
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_HALF_EVEN });

const blockGasLimit = 4200000;

contract('Ballots', function(accounts) {

  it('Basic test', async () => {

    const registry = await TokenBallotRegistry.deployed();
    const token = await ImmersiveToken.deployed();

    log(`Registry address: ${registry.address}`);
    log(`Token address: ${token.address}`);

    const symbol = await token.symbol();
    log (`${symbol}`);


    const ballotStart =  web3.eth.blockNumber + 20;
    const ballotEnd =  ballotStart + 10;
    const ballot = await TokenBallot.new("Test Ballot", token.address, ballotStart, ballotEnd);

    const ballotName = await ballot.name.call();
    log(`Ballot address: ${ballot.address}, name: ${ballotName}`);

    const proposal1 = await BallotProposal.new("Proposal 1", ballot.address);
    const proposal2 = await BallotProposal.new("Proposal 2", ballot.address);
    const proposal3 = await BallotProposal.new("Proposal 3", ballot.address);

    //log(`Proposal1 address: ${proposal1.address}`);
    //log(`Proposal2 address: ${proposal2.address}`);
    //log(`Proposal3 address: ${proposal3.address}`);

    await execLogTx(ballot.addProposal(proposal1.address));
    await execLogTx(ballot.addProposal(proposal2.address));
    await execLogTx(ballot.addProposal(proposal3.address));

    await execLogTx(registry.addBallot(ballot.address));

    await token.fund({value: web3.toWei(new BigNumber(0.1), "ether"), from: accounts[1]});
    await token.fund({value: web3.toWei(new BigNumber(0.2), "ether"), from: accounts[2]});
    await token.fund({value: web3.toWei(new BigNumber(0.3), "ether"), from: accounts[3]});
    await token.fund({value: web3.toWei(new BigNumber(0.1), "ether"), from: accounts[4]});
    await token.fund({value: web3.toWei(new BigNumber(0.1), "ether"), from: accounts[5]});
    await token.fund({value: web3.toWei(new BigNumber(0.1), "ether"), from: accounts[6]});


    await mineToBlock(new BigNumber(ballotStart));

    await ballot.vote(proposal1.address, {from: accounts[1]});
    await ballot.vote(proposal2.address, {from: accounts[2]});
    await ballot.vote(proposal3.address, {from: accounts[3]});

    await ballot.vote(proposal1.address, {from: accounts[6]});
    await ballot.vote(proposal2.address, {from: accounts[4]});
    await ballot.vote(proposal3.address, {from: accounts[4]});



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
      log(`${l.event}:`);
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
