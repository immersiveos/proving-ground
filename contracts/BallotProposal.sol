pragma solidity ^0.4.11;

contract BallotProposal {

  mapping (address => address) public votes;

  string public name;
  address public ballot;

  function BallotProposal(string _name, address _ballot) {
    name = _name;
    ballot = _ballot;
  }

  function vote(address voter) external {

    // only the ballot contract code may initiate a vote for the proposal
    assert (msg.sender == ballot);

    votes[voter] = msg.sender;
    VoteEvent(voter);
  }

  event VoteEvent(address voter);

}
