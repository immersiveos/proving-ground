pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

import "./IERC20Token.sol";
import "./BallotProposal.sol";

contract TokenBallot is Ownable {

  IERC20Token public token;

  uint256 public startBlock;
  uint256 public endBlock;
  string public name;

  mapping (address => BallotProposal) public proposalsMap;
  BallotProposal[] public proposalsArray;

  modifier onlyIfAcceptingVotes() {
    assert(block.number >= startBlock);
    assert(block.number <= endBlock);
    _;
  }

  modifier onlyBeforeVotingStarts() {
    assert(block.number < startBlock);
    _;
  }

  modifier onlyAfterVotingEnded() {
    assert(block.number > endBlock);
    _;
  }

  function TokenBallot(string _name, IERC20Token _token , uint256 _startBlock, uint256 _endBlock) {

    assert(_startBlock >= block.number);
    assert(_endBlock > _startBlock);

    token = _token;
    startBlock = _startBlock;
    endBlock = _endBlock;
    name = _name;

    BallotCreatedEvent(token, name, startBlock, endBlock);
  }

  event BallotCreatedEvent(address indexed token, string name, uint256 startBlock, uint256 endBlock);

  function addProposal(BallotProposal _proposal) external onlyOwner onlyBeforeVotingStarts {

    proposalsMap[address(_proposal)] = _proposal;
    proposalsArray.push(_proposal);

    ProposalAddedEvent(_proposal);
  }

  event ProposalAddedEvent(address indexed proposal);

  // array iteration helper
  function numberOfProposals() external constant returns (uint256) {

    return proposalsArray.length;
  }

  function finalizeProposal (
    BallotProposal _proposal,
    uint256 _voters,
    uint256 _votedTokens,
    uint256 _allVotedTokens) external onlyOwner onlyAfterVotingEnded {

    var proposal = proposalsMap[_proposal];

    assert(proposal != address(0));
    assert(!proposal.finalized());

    proposal.finalizeResults(_voters,_votedTokens,_allVotedTokens);

    ProposalFinalizedEvent(proposal, _voters, _votedTokens, _allVotedTokens);
  }

  event ProposalFinalizedEvent(address indexed proposal, uint256 voters, uint256 votedTokens, uint256 allVotedTokens);

  function vote(BallotProposal _proposal) external onlyIfAcceptingVotes {

     // only token holder may vote
     assert (token.balanceOf(msg.sender) > 0);

     var proposal = proposalsMap[_proposal];
     proposal.vote(msg.sender);

     VoteEvent(proposal, msg.sender);
  }

  event VoteEvent(address indexed proposal, address voter);


  function undoVote(BallotProposal _proposal) external onlyIfAcceptingVotes {

    // only token holder may unvote
    assert(token.balanceOf(msg.sender) > 0);

    var proposal = proposalsMap[_proposal];
    proposal.undoVote(msg.sender);

    UndoVoteEvent(proposal, msg.sender);
  }

  event UndoVoteEvent(address indexed proposal, address voter);

}
