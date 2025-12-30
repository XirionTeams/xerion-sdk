# Investor & Partner Appendix

## Summary

Xerion SDK is an institutional integration surface for interacting with Xerion on Solana. It is designed to be deterministic, explicitly configured, and audit-ready.

## Why Determinism

Institutional systems require repeatable behavior for:

- Risk controls
- Incident response
- Auditing and forensic analysis

The SDK enforces deterministic BN math and explicit configuration to ensure predictable outcomes.

## Operational Safety

- Typed errors for incident classification
- Explicit validation of oracle data
- No hidden configuration or hardcoded protocol addresses

## Integration Model

Integrators supply:

- RPC connection
- Wallet interface
- Program registry
- Oracle registry

This keeps the SDK environment-agnostic while preserving strict validation.
