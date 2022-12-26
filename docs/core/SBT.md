# Solidity API

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__66c74b6c) internal pure
```

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__66c74b6c) internal pure returns (bool)
```

## freeFunction

```solidity
freeFunction freeFunction(bytes8 c__66c74b6c) internal pure returns (bool)
```

## SBT

### c_698ffdf5

```solidity
function c_698ffdf5(bytes8 c__698ffdf5) internal pure
```

### c_true698ffdf5

```solidity
function c_true698ffdf5(bytes8 c__698ffdf5) internal pure returns (bool)
```

### c_false698ffdf5

```solidity
function c_false698ffdf5(bytes8 c__698ffdf5) internal pure returns (bool)
```

### c_mod1ea54037

```solidity
modifier c_mod1ea54037()
```

### c_modf94c3367

```solidity
modifier c_modf94c3367()
```

### c_modbab39ed7

```solidity
modifier c_modbab39ed7()
```

### c_mod5011eeb5

```solidity
modifier c_mod5011eeb5()
```

### c_moddd52282e

```solidity
modifier c_moddd52282e()
```

### c_mod89132dea

```solidity
modifier c_mod89132dea()
```

### c_modeaf49d87

```solidity
modifier c_modeaf49d87()
```

### c_mod05dfcb0d

```solidity
modifier c_mod05dfcb0d()
```

### c_mod040566b8

```solidity
modifier c_mod040566b8()
```

### c_mod35eccd67

```solidity
modifier c_mod35eccd67()
```

### MINTER_ROLE

```solidity
bytes32 MINTER_ROLE
```

### FORCED_BURNER_ROLE

```solidity
bytes32 FORCED_BURNER_ROLE
```

### sbtOwners

```solidity
mapping(uint256 => struct EnumerableSet.AddressSet) sbtOwners
```

An ID of an SBT => owners.

It is `private`, because internal type is not allowed for public state variables.
There is the getting function `getOwnersOf()`.

### uriProvider

```solidity
contract IURIProvider uriProvider
```

### metadataRegistry

```solidity
contract IMetadataRegistry metadataRegistry
```

### burnExtraValidator

```solidity
contract IBurnExtraValidator burnExtraValidator
```

### nextSBTId

```solidity
uint256 nextSBTId
```

It is equal to the number of SBTs that have been added over time.

_Stores the ID for the next Soul Bound token (SBT) to be added._

### LessThanTwoRecipients

```solidity
error LessThanTwoRecipients()
```

### RecipientEqZeroAddress

```solidity
error RecipientEqZeroAddress(uint256 _i)
```

### SameRecipient

```solidity
error SameRecipient(address _recipient, uint256 _i)
```

### UnknownSBT

```solidity
error UnknownSBT(uint256 _sbtId)
```

### DoesNotOwnThisSBT

```solidity
error DoesNotOwnThisSBT(uint256 _sbtId)
```

### NoBurnExtraValidator

```solidity
error NoBurnExtraValidator()
```

### Inaccessible

```solidity
error Inaccessible()
```

### Minted

```solidity
event Minted(uint256 _sbtId, address[] _recipients)
```

### BurnExtraValidatorSet

```solidity
event BurnExtraValidatorSet(address _burnExtraValidator)
```

### Burnt

```solidity
event Burnt(uint256 _sbtId, address _burner)
```

### ForciblyBurnt

```solidity
event ForciblyBurnt(uint256 _sbtId)
```

### URIProviderSet

```solidity
event URIProviderSet(address _uriProvider)
```

### MetadataRegistrySet

```solidity
event MetadataRegistrySet(address _metadataRegistry)
```

### constructor

```solidity
constructor() public
```

### mint

```solidity
function mint(address[] _recipients) external returns (uint256 sbtId)
```

### setBurnExtraValidator

```solidity
function setBurnExtraValidator(address _burnExtraValidator) external
```

### burn

```solidity
function burn(uint256 _sbtId) external
```

### forciblyBurn

```solidity
function forciblyBurn(uint256 _sbtId) external
```

### setURIProvider

```solidity
function setURIProvider(address _uriProvider) external
```

### setMetadataRegistry

```solidity
function setMetadataRegistry(address _metadataRegistry) external
```

### getOwnersOf

```solidity
function getOwnersOf(uint256 _sbtId) external view returns (address[])
```

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_See the function `supportsInterface` in `IERC165` for details._

### uri

```solidity
function uri(uint256 _sbtId) public view virtual returns (string)
```

### safeTransferFrom

```solidity
function safeTransferFrom(address, address, uint256, uint256, bytes) public virtual
```

### safeBatchTransferFrom

```solidity
function safeBatchTransferFrom(address, address, uint256[], uint256[], bytes) public virtual
```

### burnSBT

```solidity
function burnSBT(uint256 _sbtId, struct EnumerableSet.AddressSet _owners) private
```

