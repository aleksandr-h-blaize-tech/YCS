pragma solidity ^0.8.13;

import "hardhat/console.sol";
// import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
// import "../contracts/YoungCompanyStaking.sol";

/**
The YoungCompanyStakingProxy contract is a proxy contract that forwards function calls and transactions to an implementation contract.
It has four functions: fallback, receive, _delegate, and upgradeTo.
The fallback and receive functions forward calls to the implementation contract's fallback and receive functions, respectively.
The _delegate function is a private function that calls the implementation contract using the delegatecall opcode.
The upgradeTo function allows the contract's admin to upgrade the implementation contract to a new address.
*/
contract YoungCompanyStakingProxy {
    address public implementation;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    /**
    @notice Forwards function calls and transactions to the implementation contract.
    @dev This function uses the delegatecall opcode to call the implementation contract with the caller's
    context and the provided data. If the call to the implementation contract fails, the function will throw
    an exception with the message "delegatecall failed".
    */
    function _delegate() private {
        (bool ok, bytes memory res) = implementation.delegatecall(msg.data);
        require(ok, "delegatecall failed");
    }

    /**
    @notice Handles any function calls or transactions sent to the contract that do not match a defined function.
    @dev If the implementation contract implements the fallback function, this function will forward the call
    to the implementation contract. If the implementation contract does not implement the fallback function,
    the contract will throw an exception.
    Throws exception if the implementation contract does not implement the fallback function.
    */
    fallback() external payable {
        _delegate();
    }

    /**
    @notice Accepts and forwards incoming Ether payments to the implementation contract.
    @dev This function is meant to be used in conjunction with the send and transfer Ethereum functions.
    It allows the contract to receive Ether payments as long as the implementation contract implements the
    receive function. Any excess Ether is forwarded to the implementation contract.
    */
    receive() external payable {
        _delegate();
    }

    /**
    @notice Upgrades the implementation of the proxy contract to a new contract address.
    @param _implementation The address of the new implementation contract.
    @dev Only the contract's admin is authorized to perform the upgrade.
    Throws not authorized if the caller is not the contract's admin.
    */
    function upgradeTo(address _implementation) external {
        require(msg.sender == admin, "not authorized");
        implementation = _implementation;
    }
}