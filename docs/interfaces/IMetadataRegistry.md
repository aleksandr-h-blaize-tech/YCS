# Solidity API

## Metadata

```solidity
struct Metadata {
  string digiProofType;
  string description;
  string uri;
  string[] companies;
}
```

## IMetadataRegistry

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

