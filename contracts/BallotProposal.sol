pragma solidity ^0.4.11;

import "./TokenBallot.sol";

contract BallotProposal {

  mapping (address => address) public votes;

  string public name;
  TokenBallot public ballot;

  function BallotProposal(string _name, TokenBallot _ballot) {
    name = _name;
    ballot = _ballot;

    BallotProposalCreatedEvent(_ballot, _name);
  }

  event BallotProposalCreatedEvent(address ballot, string name);

  function vote(address voter) external {

    // only the ballot contract code may initiate a vote for the proposal
    assert (msg.sender == address(ballot));

    votes[voter] = msg.sender;
    VoteEvent(voter);
  }

  event VoteEvent(address voter);

  function undoVote(address voter) external {

    // only the ballot contract code may initiate a vote for the proposal
    assert (msg.sender == address(ballot));

    votes[voter] = address(0);
    UndoVoteEvent(voter);
  }

  event UndoVoteEvent(address vorter);
}
