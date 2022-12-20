// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract YoungCompanyStaking is Initializable, AccessControlUpgradeable {

    // _______________ Storage _______________
    address public token;
    uint256 public lockTime;
    uint256 public rewardPercentage;

    // _______________ Errors _______________

    // _______________ Events _______________

    // _______________ Constructor ______________
    constructor(address _token) {
        token = _token;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // _______________ Initializer ______________
    function initialize(uint256 _lockTIme, uint256 _rewardPercentage) external onlyRole(DEFAULT_ADMIN_ROLE) initializer {
        lockTime = _lockTIme;
        rewardPercentage = _rewardPercentage;
    }
}
