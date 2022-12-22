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
    
    // mapping(address => Deposit[]) public deposits;
    Deposit[] public deposits;
    mapping(address => bool) internal lockUsers;

    // _______________ Constants _______________
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // _______________ Errors _______________
    error AccountLocked();

    error ZeroAddress();

    error IncorrectLockTime();
    error IncorrectRewardPercentage();

    error AdminNotGranted();
    error AdminAlreadyGranted();

    error UserNotLocked();
    error UserAlreadyLocked();

    error ContractHasNoEther();
    error EmptyDeposit();

    // _______________ Events _______________
    event AdminAdded(address _admin);
    event AdminRevoked(address _admin);

    event UserLocked(address _user);
    event UserUnlocked(address _user);

    event LockTimeChanged(uint256 _oldLockTime, uint256 _newLockTime);
    event RewardPercentageChanged(uint256 _oldRewardPercentage, uint256 _newRewardPercentage);

    event Deposited(address _user, uint256 _amount, uint256 _startTime, uint256 _endTime, uint256 _rewardPercentage);
    event Withdrawed(address _user, uint256 _amount, uint256 _timeSnapshot, uint256 _reward);

    // _______________ Modifiers _______________
    modifier onlyUnlockedUser(address _user) {
        if (lockUsers[_user]) {
            revert AccountLocked();
        }
        _;
    }

    // _______________ Constructor ______________
    constructor(address _token) {
        // cheking not zero address
        if (address(_token) == address(0)) {
            revert ZeroAddress();
        }

        token = _token;
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // _______________ Initializer ______________
    function initialize(uint256 _lockTIme, uint256 _rewardPercentage) external onlyRole(DEFAULT_ADMIN_ROLE) initializer {
        // checking lock time
        if ((_lockTIme <= 0) || (_lockTIme > 26 weeks)) {
            revert IncorrectLockTime();
        }

        // checking reward percentage
        if ((_rewardPercentage <= 0) || (_rewardPercentage > 50)) {
            revert IncorrectRewardPercentage();
        }

        lockTime = _lockTIme;
        rewardPercentage = _rewardPercentage;
    }

    // _______________ Getters ______________
    // TODO
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
        // checking lock time
        if ((_newLockTime <= 0) || (_newLockTime > 26 weeks)) {
            revert IncorrectLockTime();
        }

        uint256 oldLockTime = lockTime;
        lockTime = _newLockTime;

        emit LockTimeChanged(oldLockTime, lockTime);
    }

    function setRewardPercentage(uint256 _newRewardPercentage) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // checking reward percentage
        if ((_newRewardPercentage <= 0) || (_newRewardPercentage > 50)) {
            revert IncorrectRewardPercentage();
        }

        uint256 oldRewardPercentage = rewardPercentage;
        rewardPercentage = _newRewardPercentage;

        emit RewardPercentageChanged(oldRewardPercentage, rewardPercentage);
    }

    function addAdmin(address _admin) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // cheking not zero address
        if (address(_admin) == address(0)) {
            revert ZeroAddress();
        }

        // cheking admin role
        if (hasRole(ADMIN_ROLE, _admin)) {
            revert AdminAlreadyGranted();
        }

        _grantRole(ADMIN_ROLE, _admin);

        emit AdminAdded(_admin);
    }

    function revokeAdmin(address _admin) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // cheking not zero address
        if (address(_admin) == address(0)) {
            revert ZeroAddress();
        }

        // cheking admin role
        if (!hasRole(ADMIN_ROLE, _admin)) {
            revert AdminNotGranted();
        }

        _revokeRole(ADMIN_ROLE, _admin);

        emit AdminRevoked(_admin);
    }

    // _______________ Admin functions ______________
    function lockUser(address _user) public onlyRole(ADMIN_ROLE) {
        // checking not zero address
        if (address(_user) == address(0)) {
            revert ZeroAddress();
        }

        // check users lock
        if (lockUsers[_user]) {
            revert UserAlreadyLocked();
        }

        lockUsers[_user] = true;

        emit UserLocked(_user);
    }

    function unlockUser(address _user) public onlyRole(ADMIN_ROLE) {
        // cheking not zero address
        if (address(_user) == address(0)) {
            revert ZeroAddress();
        }

        // check users lock
        if (!lockUsers[_user]) {
            revert UserNotLocked();
        }

        lockUsers[_user] = false;

        emit UserUnlocked(_user);
    }

    function sendEther() public payable onlyRole(ADMIN_ROLE) {
    }

    function withdrawEther(uint256 _amount) public onlyRole(ADMIN_ROLE) {
        // checking Ether existence
        if (_amount > address(this).balance) {
            revert ContractHasNoEther();
        }
    
        // sending Ether
        address payable admin = payable(msg.sender);
        admin.transfer(_amount);
    }

    // _______________ Users functions ______________
    // TODO
    function deposit() public payable onlyUnlockedUser(msg.sender) {
        // checking Ether
        if (msg.value <= 0) {
            revert EmptyDeposit();
        }

        uint256 amount = msg.value;
        deposits.push(Deposit({
            user: msg.sender,
            amount: amount,
            startTime: block.timestamp,
            endTime: block.timestamp + lockTime,
            rewardPercentage: rewardPercentage
        }));

        emit Deposited(msg.sender, amount, block.timestamp, block.timestamp + lockTime, rewardPercentage);
    }

    // TODO
    function withdraw() public onlyUnlockedUser(msg.sender) {
        uint256 etherAmount = 0;
        uint256 ERC20rewards = 0;

        for (uint i = 0; i < deposits.length; i++) {
            if ((deposits[i].user == msg.sender) && (deposits[i].endTime < block.timestamp)) {
                etherAmount += deposits[i].amount;
                IGovernanceToken(token).mint(msg.sender, deposits[i].amount * rewardPercentage / 100);
                ERC20rewards += deposits[i].amount * rewardPercentage / 100;
                _removeDeposit(msg.sender, i);
            }
        }

        // checking Ether existence
        if (etherAmount > address(this).balance) {
            revert ContractHasNoEther();
        }

        // sending Ether
        address payable user = payable(msg.sender);
        user.transfer(etherAmount);

        // emit event
        emit Withdrawed(msg.sender, etherAmount, block.timestamp, ERC20rewards);
    }

    // _______________ Support functions ______________
    function _removeDeposit(address user, uint index) private {
    }
}
