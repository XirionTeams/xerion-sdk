# Invariants

This document defines invariants enforced by the SDK prior to transaction submission (preflight) and verified post-transaction where feasible.

## Vault Solvency

- Deposits and withdrawals must not violate vault solvency constraints.
- Any calculation that depends on oracle data must validate oracle freshness and confidence before use.

## Swap Conservation

- The SDK must ensure that quoted swaps respect explicit slippage bounds.
- Swap routes must be deterministic given the same inputs.

## Position Safety

- PnL and exposure calculations must be BN-based and consistent across historical reads.
- Read paths must not write state.

## Failure Mode

Any invariant violation must throw `InvariantViolationError` with structured context describing the violated invariant and relevant inputs.
