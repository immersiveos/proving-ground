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

  modifier onlyIfAceptingVotes() {
    assert(block.number >= startBlock);
    assert(block.number <= endBlock);
    _;
  }

  modifier onlyBeforeVotingStarts() {
    assert(block.number < startBlock);
    _;
  }

  function TokenBallot(string _name, IERC20Token _token , uint256 _startBlock, uint256 _endBlock) {

    assert(_startBlock >= block.number);
    assert(_endBlock > _startBlock);

    token = _token;
    startBlock = _startBlock;
    endBlock = _endBlock;
    name = _name;

    BallotCreatedEvent(name, token, startBlock, endBlock);
  }

  event BallotCreatedEvent(string indexed name, address indexed token, uint256 startBlock, uint256 endBlock);

  function addProposal(BallotProposal _proposal) external onlyOwner onlyBeforeVotingStarts {
    proposalsMap[_proposal] = _proposal;
    proposalsArray.push(_proposal);
  }

  event ProposalAddedEvent(address indexed proposal);

  // array iteration helper
  function numberOfProposals() external constant returns (uint256) {
    return proposalsArray.length;
  }

  function vote(address _proposal) external onlyIfAceptingVotes {

     // only token holder may vote
     assert (token.balanceOf(msg.sender) > 0);

     var proposal = proposalsMap[_proposal];
     proposal.vote(msg.sender);

     VoteEvent(proposal, msg.sender);
  }

  event VoteEvent(address indexed proposal, address voter);

}
