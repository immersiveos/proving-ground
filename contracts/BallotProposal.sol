pragma solidity ^0.4.11;

import "./TokenBallot.sol";
import "./AddressesList.sol";

contract BallotProposal {

  using AddressesList for AddressesList.data;

  mapping (address => address) public votesMap;
  AddressesList.data public votes;
  string public name;
  TokenBallot public ballot;

  function BallotProposal(string _name, TokenBallot _ballot) {
    name = _name;
    ballot = _ballot;
    BallotProposalCreatedEvent(_ballot, _name);
  }

  event BallotProposalCreatedEvent(address ballot, string name);

  function votersCount() external constant returns (uint80) {
    return votes.itemsCount();
  }

  function getFirstVoterIdx() external constant returns(uint80) {
    if (votes.itemsCount() == 0) throw;
    var it = votes.iterate_start();
    if (votes.iterate_valid(it)) return it;
    else throw;
  }

  function hasNextVoter(uint80 idx) external constant returns (bool) {
    var it = votes.iterate_next(idx);
    return votes.iterate_valid(it);
  }

  // votes iteration
  function getNextVoterIdx(uint80 idx) external constant returns(uint80) {
    var it = votes.iterate_next(idx);
    if (votes.iterate_valid(it)) return it;
    else throw;
  }

  function getVoterAt(uint80 idx) external constant returns(address) {
    if (votes.iterate_valid(idx)) return votes.iterate_get(idx);
    else return address(0);
  }


  function vote(address voter) external {

    // only the ballot contract code may initiate a vote for the proposal
    assert (msg.sender == address(ballot));
    assert (votesMap[voter] == address(0));

    votesMap[voter] = msg.sender;
    votes.append(voter);

    VoteEvent(voter);
  }

  event VoteEvent(address voter);

  function undoVote(address voter) external {

    // only the ballot contract code may initiate a vote for the proposal
    assert (msg.sender == address(ballot));
    assert (votesMap[voter] != address(0));

    votesMap[voter] = address(0);

    var item = votes.find(voter);
    if (votes.iterate_valid(item))  {
      votes.remove(item);
    }

    UndoVoteEvent(voter);
  }

  event UndoVoteEvent(address vorter);
}
