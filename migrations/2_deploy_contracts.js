require('babel-polyfill');

const AddressesList = artifacts.require("./AddressesList.sol");

const log = console.log;
const Web3 = require('../node_modules/web3');
const web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


module.exports = async (deployer, network, accounts) => {


  if (network === 'development') {

  } else if (network === 'live') {
    log("todo: livenet deployment");
  } else {
    log("Unexpected net - aborting.");
  }
};
