pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IERC20Token.sol";
import "./BallotProposal.sol";
import "./TokenBallot.sol";

contract TokenBallotsRegistry {

  mapping (address => TokenBallot) public ballotsMap;
  TokenBallot[] public ballotsArray;

  uint256 public id;

  mapping (uint256 => address) public ids;

  function addBallot(TokenBallot _ballot) external {

    assert (ballotsMap[_ballot] == address(0));

    ballotsMap[_ballot] = _ballot;
    ballotsArray.push(_ballot);
    ids[id] = _ballot;

    BallotRegisteredEvent(_ballot.token(), id, _ballot);

    id = id + 1;

  }

  event BallotRegisteredEvent(address indexed token, uint256 indexed id, address ballot);

  // array iteration helper
  function numberOfBallots() external constant returns (uint256) {
    return ballotsArray.length;
  }
}
