// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "hardhat/console.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import "../interfaces/IGovernanceToken.sol";


/**
The contract is a staking contract for a governance token.
It allows users to lock their tokens for a certain time period and receive a reward for doing so.
The contract has functionality for managing the lock time and reward percentage, as well as granting and revoking the admin role.
It also has functionality for locking and unlocking user accounts, and for depositing and withdrawing tokens.
The contract is upgradeable and uses the Initializable and AccessControlUpgradeable contracts from OpenZeppelin for this purpose.
It also has several events and errors to track and handle different actions within the contract.
*/
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
    
    mapping(address => Deposit[]) public deposits;
    mapping(address => bool) internal lockUsers;

    // _______________ Constants _______________

    // bytes32 constant with the keccak256 hash of the string "ADMIN_ROLE"
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    // _______________ Errors _______________

    // AccountLocked: error triggered when a function is called by an address with a locked account
    error AccountLocked();
    // ZeroAddress: error triggered when the contract is constructed with a zero address as the governance token
    error ZeroAddress();

    // IncorrectLockTime: error triggered when an incorrect lock time is passed as a parameter.
    // Lock time must be between 0 and 26 weeks
    error IncorrectLockTime();
    // IncorrectRewardPercentage: error triggered when an incorrect reward percentage is passed as a parameter.
    // Reward percentage must be between 0 and 50.
    error IncorrectRewardPercentage();

    // AdminNotGranted: error triggered when the function is called by an address that is not an admin.
    error AdminNotGranted();
    // AdminAlreadyGranted: error triggered when the function is called to grant admin role to an address
    // that is already an admin.
    error AdminAlreadyGranted();

    // UserNotLocked: error triggered when the function is called for an address that is not locked.
    error UserNotLocked();
    // UserAlreadyLocked: error triggered when the function is called for an address that is already locked.
    error UserAlreadyLocked();

    // ContractHasNoEther: error triggered when the contract has no balance in ether.
    error ContractHasNoEther();
    // EmptyDeposit: error triggered when the function is called with a zero deposit amount.
    error EmptyDeposit();

    // _______________ Events _______________

    // AdminAdded(): event emitted when an address is granted the admin role.
    event AdminAdded(address _admin);
    // AdminRevoked(): event emitted when an address has the admin role revoked.
    event AdminRevoked(address _admin);

    // UserLocked(): event emitted when an address account is locked.
    event UserLocked(address _user);
    // UserUnlocked(): event emitted when an address account is unlocked.
    event UserUnlocked(address _user);

    // LockTimeChanged(): event emitted when the lock time for the contract is changed.
    event LockTimeChanged(uint256 _oldLockTime, uint256 _newLockTime);
    // RewardPercentageChanged(): event emitted when the reward percentage for the contract is changed.
    event RewardPercentageChanged(uint256 _oldRewardPercentage, uint256 _newRewardPercentage);

    // Deposited(): event emitted when an address deposits tokens in the contract.
    event Deposited(address _user, uint256 _amount, uint256 _startTime, uint256 _endTime, uint256 _rewardPercentage);
    // Withdrawed(): event emitted when an address withdraws tokens from the contract.
    event Withdrawed(address _user, uint256 _amount, uint256 _timeSnapshot, uint256 _reward);

    // _______________ Modifiers _______________

    modifier onlyUnlockedUser(address _user) {
        if (lockUsers[_user]) {
            revert AccountLocked();
        }
        _;
    }

    // _______________ Constructor ______________
    /**
    @notice Creates a new instance of the staking contract
    @param _token The governance token contract
    Throws ZeroAddress if the governance token contract address is the zero address
    */
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
    /**
    @notice Initialize staking contract
    @param _lockTIme The lock time for the staking contract in seconds. Must be between 0 and 26 weeks (in seconds).
    @param _rewardPercentage The reward percentage for the staking contract. Must be between 0 and 50.
    @dev Only the contract creator can call this function. The governance token contract must not be the zero address.
    Throws IncorrectLockTime if the lock time is not between 0 and 26 weeks (in seconds)
    Throws IncorrectRewardPercentage if the reward percentage is not between 0 and 50
    */
    function initialize(uint256 _lockTIme, uint256 _rewardPercentage) public onlyRole(DEFAULT_ADMIN_ROLE) initializer {
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
    /**
    @notice Get the list of deposits made by an address
    @dev This function is view and can be called by anyone
    @return deposits An array of Deposit structs representing the deposits made by the specified user
    */
    function getDeposits() public view returns (Deposit[] memory){
        Deposit[] memory deps = new Deposit[](deposits[msg.sender].length);

            for (uint i = 0; i < deposits[msg.sender].length; i++) {
                Deposit storage deposit = deposits[msg.sender][i];
                deps[i] = deposit;
            }
            return deps;
    }

    // _______________ Owner functions ______________
    /**
    @notice Set the lock time for the staking contract
    @param _newLockTime The new lock time in seconds
    @dev Only admins can call this function. The lock time must be between 0 and 26 weeks (in seconds).
    Throws AdminNotGranted if caller is not an admin
    Throws IncorrectLockTime if the lock time is not between 0 and 26 weeks (in seconds)
    */
    function setLockTime(uint256 _newLockTime) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // checking lock time
        if ((_newLockTime <= 0) || (_newLockTime > 26 weeks)) {
            revert IncorrectLockTime();
        }

        uint256 oldLockTime = lockTime;
        lockTime = _newLockTime;

        emit LockTimeChanged(oldLockTime, lockTime);
    }

    /**
    @notice Set the reward percentage for the staking contract
    @param _newRewardPercentage The new reward percentage
    @dev Only admins can call this function. The reward percentage must be between 0 and 50.
    Throws: AdminNotGranted if caller is not an admin
    Throws: IncorrectRewardPercentage if the reward percentage is not between 0 and 50
    */
    function setRewardPercentage(uint256 _newRewardPercentage) public onlyRole(DEFAULT_ADMIN_ROLE) {
        // checking reward percentage
        if ((_newRewardPercentage <= 0) || (_newRewardPercentage > 50)) {
            revert IncorrectRewardPercentage();
        }

        uint256 oldRewardPercentage = rewardPercentage;
        rewardPercentage = _newRewardPercentage;

        emit RewardPercentageChanged(oldRewardPercentage, rewardPercentage);
    }

    /**
    @notice Grant the admin role to an address
    @param _admin The address to grant the admin role to
    @dev Only admins can call this function. The address cannot already have the admin role.
    Throws AdminNotGranted if caller is not an admin
    Throws AdminAlreadyGranted if the specified address already has the admin role
    */
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

    /**
    @notice Revoke the admin role from an address
    @param _admin The address to revoke the admin role from
    @dev Only admins can call this function. The address must have the admin role.
    Throws AdminNotGranted if caller is not an admin
    Throws AdminAlreadyGranted if the specified address does not have the admin role
    */
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
    /**
    @dev Function that locks an account in the contract. This function can only be called by an admin.
    @param _user Address of the user to lock.
    Throws AdminNotGranted If the caller is not an admin.
    */
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

    /**
    @dev Unlocks an address account
    @param _user address of the user to unlock
    Throws AdminNotGranted if the calling address is not an admin
    Throws UserNotLocked if the address to unlock is not locked
    Throws UserAlreadyLocked if the address to unlock is already locked
    */
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

    /**
    @dev Sends ether to the contract
    Throws AdminNotGranted if the calling address is not an admin
    Throws EmptyDeposit if the amount of ether to send is zero
    */
    function sendEther() public payable onlyRole(ADMIN_ROLE) {
    }

    /**
    @dev Withdraws ether from the contract
    @param _amount amount of ether to withdraw
    Throws AccountLocked if the calling address has a locked account
    Throws ContractHasNoEther if the contract has no balance in ether
    Throws EmptyDeposit if the amount of ether to withdraw is zero
    */
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
    /**
    @dev Deposit tokens in the contract.
    Throws AccountLocked If the caller's account is locked.
    Throws IncorrectLockTime If the provided lock time is not between 0 and 26 weeks.
    Throws IncorrectRewardPercentage If the provided reward percentage is not between 0 and 50.
    Throws EmptyDeposit If the amount of tokens to deposit is zero.
    */
    function deposit() public payable onlyUnlockedUser(msg.sender) {
        // checking Ether
        if (msg.value <= 0) {
            revert EmptyDeposit();
        }

        uint256 amount = msg.value;
        deposits[msg.sender].push(Deposit({
            user: msg.sender,
            amount: amount,
            startTime: block.timestamp,
            endTime: block.timestamp + lockTime,
            rewardPercentage: rewardPercentage
        }));

        emit Deposited(msg.sender, amount, block.timestamp, block.timestamp + lockTime, rewardPercentage);
    }

    /**
    @notice Allows a user to withdraw their staked tokens and any earned rewards from the contract.
    @dev The user must have a non-empty balance of staked tokens in the contract and must not have a locked account.
    The amount of tokens being withdrawn must not exceed the user's balance in the contract.
    Any earned rewards are calculated based on the amount of time the tokens were staked and the specified reward percentage.
    The withdrawn tokens and earned rewards are transferred to the user's account.
    Throws UserNotLocked if the user's account is locked.
    Throws EmptyDeposit if the amount of tokens being withdrawn is zero.
    */
    function withdraw() public {
        uint256 etherAmount = 0;
        uint256 ERC20rewards = 0;

        Deposit[] memory userDeposits = deposits[msg.sender];
        delete deposits[msg.sender];

        for (uint i = 0; i < userDeposits.length; i++) {
            if (userDeposits[i].endTime < block.timestamp) {
                etherAmount += userDeposits[i].amount;
                IGovernanceToken(token).mint(msg.sender, userDeposits[i].amount * rewardPercentage / 100);
                ERC20rewards += userDeposits[i].amount * rewardPercentage / 100;
            } else {
                deposits[msg.sender].push(userDeposits[i]);
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
}
