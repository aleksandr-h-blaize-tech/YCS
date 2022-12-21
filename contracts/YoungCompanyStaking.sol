// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "../interfaces/IGovernanceToken.sol";

contract YoungCompanyStaking is Initializable, AccessControlUpgradeable {

    // _______________ Storage _______________
    address public token;

    uint256 public lockTime;
    uint256 public rewardPercentage;

    struct Deposit {
            address user;
            uint256 amount;
            uint256 startTime;
            uint256 endTime;
            uint256 rewardPercentage;
        }
    Deposit[] public deposits;
    mapping(address => bool) internal lockUsers;

    // _______________ Constants _______________
    bytes32 public constant MINTER_ROLE = keccak256("ADMIN_ROLE");

    // _______________ Errors _______________

    // _______________ Events _______________
    event AdminAdded(address _admin);
    event AdminRemoved(address _admin);

    event UserLocked(address _user);
    event UserUnlocked(address _user);

    event LockTimeChanged(uint256 _oldLockTime, uint256 _newLockTime);
    event RewardPercentageChanged(uint256 _oldRewardPercentage, uint256 _newRewardPercentage);

    event Deposited(address _user, uint256 _amount, uint256 _startTime, uint256 _endTime, uint256 _rewardPercentage);
    event Withdrawed(address _user, uint256 _amount, uint256 _timeSnapshot, uint256 _reward);

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

    // _______________ Getters ______________
    function getDeposits() public view returns (Deposit[] memory){
        Deposit[] memory deps = new Deposit[](deposits.length);
        for (uint i = 0; i < deposits.length; i++) {
            Deposit storage deposit = deposits[i];
            deps[i] = deposit;
        }
        return deps;
    }

    // _______________ Owner functions ______________
    function setLockTime(uint256 _newLockTime) public onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldLockTime = lockTime;
        lockTime = _newLockTime;

        emit LockTimeChanged(oldLockTime, lockTime);
    }

    function setRewardPercentage(uint256 _newRewardPercentage) public onlyRole(DEFAULT_ADMIN_ROLE) {
        uint256 oldRewardPercentage = rewardPercentage;
        rewardPercentage = _newRewardPercentage;

        emit RewardPercentageChanged(oldRewardPercentage, rewardPercentage);
    }

    // _______________ Users functions ______________
    // TODO: Ether!!!
    function deposit(uint256 _amount) public {
        deposits.push(Deposit({
            user: msg.sender,
            amount: _amount,
            startTime: block.timestamp,
            endTime: block.timestamp + lockTime,
            rewardPercentage: rewardPercentage
        }));

        emit Deposited(msg.sender, _amount, block.timestamp, block.timestamp + lockTime, rewardPercentage);
    }

    // TODO: Ether!!!
    function withdraw() public {
        uint256 amount = 0;
        uint256 rewards = 0;

        for (uint i = 0; i < deposits.length; i++) {
            if (deposits[i].user == msg.sender) {
                amount += deposits[i].amount;
                IGovernanceToken(token).mint(msg.sender, amount * rewardPercentage / 100);
                rewards += amount * rewardPercentage / 100;
                delete deposits[i];
            }
        }

        emit Withdrawed(msg.sender, amount, block.timestamp, rewards);
    }
}
