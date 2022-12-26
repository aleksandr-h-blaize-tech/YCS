# Solidity API

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__4122e0ef) internal pure
```

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__4122e0ef) internal pure returns (bool)
```

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__4122e0ef) internal pure returns (bool)
```

## MetadataRegistry

### c_cf4ebf9d

```solidity
function c_cf4ebf9d(bytes8 c__cf4ebf9d) internal pure
```

### c_truecf4ebf9d

```solidity
function c_truecf4ebf9d(bytes8 c__cf4ebf9d) internal pure returns (bool)
```

### c_falsecf4ebf9d

```solidity
function c_falsecf4ebf9d(bytes8 c__cf4ebf9d) internal pure returns (bool)
```

### c_mod56af7cde

```solidity
modifier c_mod56af7cde()
```

### c_modd70b7a88

```solidity
modifier c_modd70b7a88()
```

### c_mod4c0443a5

```solidity
modifier c_mod4c0443a5()
```

### c_modcbfe4722

```solidity
modifier c_modcbfe4722()
```

### SETTER_ROLE

```solidity
bytes32 SETTER_ROLE
```

### DELETER_ROLE

```solidity
bytes32 DELETER_ROLE
```

### metadata

```solidity
mapping(uint256 => struct Metadata) metadata
```

### LessThanTwoCompanyNames

```solidity
error LessThanTwoCompanyNames(uint256 _sbtId)
```

### MetadataSet

```solidity
event MetadataSet(uint256 _sbtId, struct Metadata _metadata)
```

### MetadataDeleted

```solidity
event MetadataDeleted(uint256 _sbtId)
```

### constructor

```solidity
constructor() public
```

### setMetadata

```solidity
function setMetadata(uint256 _sbtId, struct Metadata _metadata) external
```

### deleteMetadata

```solidity
function deleteMetadata(uint256 _sbtId) external
```

### getURI

```solidity
function getURI(uint256 _sbtId) external view returns (string)
```

### getCompanyNames

```solidity
function getCompanyNames(uint256 _sbtId) external view returns (string[])
```

### getDigiProofType

```solidity
function getDigiProofType(uint256 _sbtId) external view returns (string)
```

### getDescription

```solidity
function getDescription(uint256 _sbtId) external view returns (string)
```

