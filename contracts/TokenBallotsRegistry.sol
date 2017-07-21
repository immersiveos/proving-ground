pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IERC20Token.sol";
import "./BallotProposal.sol";
import "./TokenBallot.sol";

contract TokenBallotsRegistry {

  // ballots store - index is ballot id
  TokenBallot[] public ballotsArray;

  // key: ballot id, value: ballot address
  mapping (uint256 => address) public ids;

  function addBallot(TokenBallot _ballot) external {

    assert (ballotsMap[_ballot] == address(0));

    var l = ballotsArray.length;

    ballotsArray.push(_ballot);
    ids[l] = _ballot;

    BallotRegisteredEvent(_ballot.token(), id, _ballot);
  }

  event BallotRegisteredEvent(address indexed token, uint256 id, address ballot);

  // array iteration helper
  function ballotsCount() external constant returns (uint256) {
    return ballotsArray.length;
  }
}
