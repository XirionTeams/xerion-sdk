# Security

## Security Principles

- **Explicit configuration:** no implicit defaults for cluster, commitment, registries, or wallet.
- **No hardcoded protocol addresses:** program IDs and oracle feeds must come from registries.
- **Deterministic math:** all arithmetic uses `BN`.
- **Typed failures:** unsafe situations throw typed errors; no silent fallback.

## Validation Requirements

### Configuration

The client constructor validates that all required configuration fields are provided and internally consistent.

### Account Ownership

When constructing or verifying instructions, account ownership must be validated against the expected program owner.

### PDA Derivation

PDA derivation must be reproducible and verified with explicit seeds and bump, sourced from the program registry.

### Oracles

Oracle data must be validated for:

- Freshness (slot / timestamp bounds)
- Confidence interval (explicit bounds)
- Sanity (non-negative, non-zero constraints where applicable)

If any check fails, the SDK must throw a typed oracle error.

## Operational Controls

- Reproducible builds via lockfile
- Dependency review during releases
- Mandatory tests for any feature change
