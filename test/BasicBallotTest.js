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

const AddressesList = artifacts.require("./AddressesList.sol");

// todo: take this from truffle config
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

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

    await token.fund({value: web3.toWei(new BigNumber(0.5), "ether"), from: accounts[7]});

    await mineToBlock(new BigNumber(ballotStart));

    await ballot.vote(proposal1.address, {from: accounts[1]});
    await ballot.undoVote(proposal1.address, {from: accounts[1]});
    await ballot.vote(proposal1.address, {from: accounts[1]});

    await ballot.vote(proposal2.address, {from: accounts[2]});
    await ballot.vote(proposal3.address, {from: accounts[3]});

    await ballot.vote(proposal1.address, {from: accounts[6]});
    await ballot.vote(proposal2.address, {from: accounts[5]});
    await ballot.vote(proposal3.address, {from: accounts[4]});

    await mineToBlock(new BigNumber(ballotEnd));

    const proposalsCount = await ballot.numberOfProposals.call();

    // key - proposal address, value - voters map [voter, balance]
    const proposalVotersMap = new Map ();

    // voting algorithm step 1 - aggregate token real time balance for each voter. Remove double-voters and voters
    // with current 0 token balance

    for(let i=0; i < proposalsCount.toNumber(); i++) {

      const proposalAddress = await ballot.proposalsArray.call(i);
      const proposal = BallotProposal.at(proposalAddress);
      const name = await proposal.name.call();

      const votersCount = await proposal.votersCount.call();

      log (`Proposal '${name}', voters: ${votersCount.toNumber()}, address: ${proposalAddress}`);

      // key: voter, value: balance (bigNumber)
      const votersBalancesMap = new Map ();

      proposalVotersMap.set(proposalAddress, votersBalancesMap);

      if (votersCount.toNumber() > 0) {
        let voterIdx = await proposal.getFirstVoterIdx.call();
        let hasNext = false;
        do {
          const voterAddress = await proposal.getVoterAt.call(voterIdx);
          log(`Voter address: ${voterAddress}`);

          if (alreadyVoted(proposalVotersMap,voterAddress)) {
            // double voting - remove voter from this ballet
            log (`Warning - voter ${voterAddress} already voted for a different proposal - discarding`);
            removeVoter(proposalVotersMap,voterAddress);

          } else {
            // disallow double voting
            const balance = await token.balanceOf.call(voterAddress);
            if (balance > 0) {
              log (`Valid voter token balance: ${weiString(balance)}`);
              votersBalancesMap.set(voterAddress, balance);
            } else {
              log (`Warning! voter ${voterAddress} current token balance is 0 - disregarding vote`);
            }
          }

          hasNext = await proposal.hasNextVoter.call(voterIdx);
          if (hasNext) {
            voterIdx = await proposal.getNextVoterIdx.call(voterIdx);
          }
        } while (hasNext);
      }
    }

    // step 2 - after removal of dishonest voters - calc total token balance for each proposal

    // key - proposal address, value - total token voted (bigNumber)
    const votingResults = new Map();
    const zero = new BigNumber(0);
    let totalTokenVoted = zero;

    for (let [proposal, voters] of proposalVotersMap) {
      votingResults.set(proposal, zero);
      for (let [voterAddress, balance] of voters) {
        const newBalance = votingResults.get(proposal).add(balance);
        votingResults.set(proposal, newBalance);
        totalTokenVoted = totalTokenVoted.add(balance);
      }
    }

    const totalTokenSupply = await token.totalSupply.call();

    // output final results
    log (`Total token voted: ${weiString(totalTokenVoted)} out of total supply of ${weiString(totalTokenSupply)}`);

    if (!totalTokenSupply.isZero()) {
      const ratio = totalTokenVoted.div(totalTokenSupply).mul(100);
      log(`Ratio of token voted: ${ratio.toFixed(0)}%`);
    }

    let totalValidVoters = 0;

    for(let i=0; i < proposalsCount.toNumber(); i++) {

      const proposalAddress = await ballot.proposalsArray.call(i);
      const proposal = BallotProposal.at(proposalAddress);
      const name = await proposal.name.call();


      const honestVotersCount = proposalVotersMap.get(proposalAddress).size;

      const tokenBalance = votingResults.get(proposalAddress);
      const ratio = totalTokenVoted.isZero() ? zero : tokenBalance.div(totalTokenVoted).mul(100);

      totalValidVoters += honestVotersCount;

      log(`Proposal '${name}', honest voters: ${honestVotersCount}, token: ${weiString(tokenBalance)}, vote: ${ratio.toFixed(2)}%, address: ${proposalAddress}`);

      await execLogTx(ballot.finalizeProposal(proposalAddress, honestVotersCount, tokenBalance, totalTokenVoted));

    }

    log (`Total counted honest voters: ${totalValidVoters}`);


  });

  // return true iff voter already voted on a proposal in the map
  const alreadyVoted = (proposalVotersMap, voter) => {
    for (let [proposal, voters] of proposalVotersMap) {
      for (let [voterAddress, balance] of voters) {
        if (voterAddress === voter) return true;
      }
    }
    return false;
  };

  // remove voter from all proposals tracked by the map
  const removeVoter = (proposalVotersMap, voter) => {
    for (let [proposal, voters] of proposalVotersMap) {
      for (let [voterAddress, balance] of voters) {
        if (voterAddress === voter) {
          voters.delete(voter);
        }
      }
    }
  };

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

    for (let i=0; i<blocks; i++) {
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
