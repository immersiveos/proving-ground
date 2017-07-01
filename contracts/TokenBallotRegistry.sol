pragma solidity ^0.4.11;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./IERC20Token.sol";
import "./BallotProposal.sol";
import "./TokenBallot.sol";


contract TokenBallotsRegistry {

  mapping (address => TokenBallot) public ballotsMap;
  TokenBallot[] public ballotsArray;

  function addBallot(TokenBallot _ballot) external {

    if (ballotsMap[_ballot] == address(0)) {
      ballotsMap[_ballot] = _ballot;
      ballotsArray.push(_ballot);
    }

    BallotRegisteredEvent(_ballot.token(), _ballot);
  }

  event BallotRegisteredEvent(address indexed token, address ballot);

}
