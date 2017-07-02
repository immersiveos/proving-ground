// Allows us to use ES6 in our migrations and tests.
require('babel-register');

const fs = require('fs');

const copySync = (src, dest, overwrite) => {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
};

const createIfDoesntExist = dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
};


// todo: support infura using client sign http://truffleframework.com/tutorials/using-infura-custom-provider

module.exports = {
  build: (options, callback) => {
    // copy truffle compiled contracts json to the web proj source directory so they can be used by truffle-contract
    const srcDir = options.destination_directory + '/contracts/';
    const dstDir = './src/contracts/';
    createIfDoesntExist(dstDir);
    fs.readdirSync(srcDir)
      .forEach((file) => {
        console.log(`Copying ${file}...`);
        copySync(srcDir + file, dstDir + file);
      });
  },
  version: '0.0.1',
  rpc: {
    host: 'localhost',
    port: 8545,
    gas: 4000000,
    network_id: 5,

  },
  migrations_directory: './migrations',
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: 5,
      //gas: 3141592,
      //gasPrice: 20000000000
    },
    rinkeby: {
      host: 'localhost',
      port: 8545,
      network_id: 4
      // optional config values:
      // gas
      // gasPrice
      // from - default address to use for any transaction Truffle makes during migrations
      // provider - web3 provider instance Truffle should use to talk to the Ethereum network.
      //          - if specified, host and port are ignored.
    },
    live: {
      network_id: 1,
      host: 'localhost',
      port: 8546   // Different than the default test ports
    }
  }
};

