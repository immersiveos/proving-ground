// truffle console scripts
var mine = web3.currentProvider.sendAsync({jsonrpc: "2.0", method: "evm_mine", id: new Date().getTime()}, function (err, result){});

