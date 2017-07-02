require('babel-polyfill');

const TokenBallot = artifacts.require("./TokenBallot.sol");
const TokenBallotRegistry = artifacts.require("./TokenBallotsRegistry.sol");
const BallotProposal = artifacts.require("./BallotProposal.sol");
const ImmersiveToken = artifacts.require("./ImmersiveToken.sol");

const AddressesList = artifacts.require("./AddressesList.sol");

const log = console.log;
const Web3 = require('../node_modules/web3');
const web3 = new Web3();
const BigNumber = web3.BigNumber;

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

module.exports = async (deployer, network, accounts) => {

  if (network === 'development') {

    deployer.deploy(AddressesList);
    deployer.link(AddressesList,BallotProposal);

    deployer.deploy(TokenBallotRegistry);

    TokenBallotRegistry.deployed().then ((res)=> {
        log (`>>>> Deployed TokenBallotRegistry to address: ${res.address}`);
      }
    );

    const opsAddress = accounts[0];
    const endBlock = web3.eth.blockNumber + 1000;
    const fundingGoal = web3.toWei(new BigNumber(1), "ether");
    const startblock = web3.eth.blockNumber;

    log (`Start block: ${startblock}`);
    log (`End block: ${endBlock}`);
    log (`Ops account: ${opsAddress}`);
    log (`Funding goal: ${fundingGoal}`);

    deployer.deploy(ImmersiveToken, accounts[0], fundingGoal, endBlock);

    const token = await ImmersiveToken.deployed();

    log (`>>>> Deployed ImmersiveToken to address: ${token.address}`);

  } else if (network === 'live') {
    log("todo: livenet deployment");
  } else {
    log("Unexpected net - aborting.");
  }
};
