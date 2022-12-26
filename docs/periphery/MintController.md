# Solidity API

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__7758b231) internal pure
```

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__7758b231) internal pure returns (bool)
```

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__7758b231) internal pure returns (bool)
```

## MintController

### c_d9b9c994

```solidity
function c_d9b9c994(bytes8 c__d9b9c994) internal pure
```

### c_trued9b9c994

```solidity
function c_trued9b9c994(bytes8 c__d9b9c994) internal pure returns (bool)
```

### c_falsed9b9c994

```solidity
function c_falsed9b9c994(bytes8 c__d9b9c994) internal pure returns (bool)
```

### c_mod39d50adf

```solidity
modifier c_mod39d50adf()
```

### c_mod0330ebb7

```solidity
modifier c_mod0330ebb7()
```

### c_mod944e9a90

```solidity
modifier c_mod944e9a90()
```

### c_modbb9f668c

```solidity
modifier c_modbb9f668c()
```

### c_mod51defbd2

```solidity
modifier c_mod51defbd2()
```

### c_modae78ae1b

```solidity
modifier c_modae78ae1b()
```

### c_mod0e356e77

```solidity
modifier c_mod0e356e77()
```

### c_moda49c4eed

```solidity
modifier c_moda49c4eed()
```

### c_mod04e6d5a4

```solidity
modifier c_mod04e6d5a4()
```

### c_modad8e5762

```solidity
modifier c_modad8e5762()
```

### c_mod4770fb01

```solidity
modifier c_mod4770fb01()
```

### c_modb3400005

```solidity
modifier c_modb3400005()
```

### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

### contractVersion

```solidity
string contractVersion
```

### sbt

```solidity
contract ISBT sbt
```

### digiProofTypesBytes32

```solidity
struct EnumerableSetUpgradeable.Bytes32Set digiProofTypesBytes32
```

It is `private`, because internal type is not allowed for public state variables.
There is the getting function `getDigiProofTypesBytes32()`.

### metadataRegistry

```solidity
contract IMetadataRegistry metadataRegistry
```

### InvalidDigitalProofType

```solidity
error InvalidDigitalProofType(string _difiProofType)
```

### ExistingDigitalProofType

```solidity
error ExistingDigitalProofType(string _difiProofType)
```

### UnknownDigitalProofType

```solidity
error UnknownDigitalProofType(string _difiProofType)
```

### ContractVersionSet

```solidity
event ContractVersionSet(string _version)
```

### SBTSet

```solidity
event SBTSet(address _sbt)
```

### MetadataRegistrySet

```solidity
event MetadataRegistrySet(address _metadataRegistry)
```

### DigiProofTypeSet

```solidity
event DigiProofTypeSet(string _digiProofType, bool _add)
```

### SBTMinted

```solidity
event SBTMinted(uint256 _sbt)
```

### initialize

```solidity
function initialize() external
```

_Initializes the contract by granting of `DEFAULT_ADMIN_ROLE` to the deployer,
setting of the contact version to 1.0.0, and default types of a digital proof (in `bytes32`) to:
`Investor`, `Collaboration`, `Influencer`, `Affiliation` and `Partnership`._

### setContractVerison

```solidity
function setContractVerison(string _version) external
```

### setSBTContract

```solidity
function setSBTContract(address _sbt) external
```

### setMetadataRegistry

```solidity
function setMetadataRegistry(address _metadataRegistry) external
```

### setDigiProofType

```solidity
function setDigiProofType(string _digiProofType, bool _add) external
```

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _digiProofType | string |  |
| _add | bool | It is `true` to add a new digital proof type or `false` to remove it. |

### mintSBT

```solidity
function mintSBT(address[] _recipients, struct Metadata _metadata) external returns (uint256 sbtId)
```

_Requirements:
 - (!) The digital proof type (`_metadata.digiProofType`) should be correct
   and can not be set later._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| _recipients | address[] |  |
| _metadata | struct Metadata | See `IMetadataRegistry.Metadata` for details. |

### getDigiProofTypesBytes32

```solidity
function getDigiProofTypesBytes32() external view returns (bytes32[])
```

