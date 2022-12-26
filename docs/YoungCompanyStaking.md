# Solidity API

## YoungCompanyStaking

### token

```solidity
address token
```

### lockTime

```solidity
uint256 lockTime
```

### rewardPercentage

```solidity
uint256 rewardPercentage
```

### Deposit

```solidity
struct Deposit {
  address user;
  uint256 amount;
  uint256 startTime;
  uint256 endTime;
  uint256 rewardPercentage;
}
```

### deposits

```solidity
mapping(address => struct YoungCompanyStaking.Deposit[]) deposits
```

### lockUsers

```solidity
mapping(address => bool) lockUsers
```

### ADMIN_ROLE

```solidity
bytes32 ADMIN_ROLE
```

### AccountLocked

```solidity
error AccountLocked()
```

### ZeroAddress

```solidity
error ZeroAddress()
```

### IncorrectLockTime

```solidity
error IncorrectLockTime()
```

### IncorrectRewardPercentage

```solidity
error IncorrectRewardPercentage()
```

### AdminNotGranted

```solidity
error AdminNotGranted()
```

### AdminAlreadyGranted

```solidity
error AdminAlreadyGranted()
```

### UserNotLocked

```solidity
error UserNotLocked()
```

### UserAlreadyLocked

```solidity
error UserAlreadyLocked()
```

### ContractHasNoEther

```solidity
error ContractHasNoEther()
```

### EmptyDeposit

```solidity
error EmptyDeposit()
```

### AdminAdded

```solidity
event AdminAdded(address _admin)
```

### AdminRevoked

```solidity
event AdminRevoked(address _admin)
```

### UserLocked

```solidity
event UserLocked(address _user)
```

### UserUnlocked

```solidity
event UserUnlocked(address _user)
```

### LockTimeChanged

```solidity
event LockTimeChanged(uint256 _oldLockTime, uint256 _newLockTime)
```

### RewardPercentageChanged

```solidity
event RewardPercentageChanged(uint256 _oldRewardPercentage, uint256 _newRewardPercentage)
```

### Deposited

```solidity
event Deposited(address _user, uint256 _amount, uint256 _startTime, uint256 _endTime, uint256 _rewardPercentage)
```

### Withdrawed

```solidity
event Withdrawed(address _user, uint256 _amount, uint256 _timeSnapshot, uint256 _reward)
```

### onlyUnlockedUser

```solidity
modifier onlyUnlockedUser(address _user)
```

### constructor

```solidity
constructor(address _token) public
```

### initialize

```solidity
function initialize(uint256 _lockTIme, uint256 _rewardPercentage) public
```

### getDeposits

```solidity
function getDeposits() public view returns (struct YoungCompanyStaking.Deposit[])
```

### setLockTime

```solidity
function setLockTime(uint256 _newLockTime) public
```

### setRewardPercentage

```solidity
function setRewardPercentage(uint256 _newRewardPercentage) public
```

### addAdmin

```solidity
function addAdmin(address _admin) public
```

### revokeAdmin

```solidity
function revokeAdmin(address _admin) public
```

### lockUser

```solidity
function lockUser(address _user) public
```

### unlockUser

```solidity
function unlockUser(address _user) public
```

### sendEther

```solidity
function sendEther() public payable
```

### withdrawEther

```solidity
function withdrawEther(uint256 _amount) public
```

### deposit

```solidity
function deposit() public payable
```

### withdraw

```solidity
function withdraw() public
```

