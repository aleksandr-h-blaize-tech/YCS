// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GovernanceToken is ERC20 {
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
    }

    function mint(address account, uint256 amount) public {
        super._mint(account, amount);
    }    
}
