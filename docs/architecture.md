# Architecture

## Goals

Xerion SDK is designed for institutional integrations where determinism, explicit configuration, and auditability are mandatory. The SDK is intentionally modular so that teams can evolve components (vault, swap, yield, accounting, risk, analytics) with clear ownership and minimal coupling.

## Non-Goals

- The SDK does not attempt to bypass on-chain rules or "optimize around" program constraints.
- The SDK does not embed program IDs or oracle feeds.

## High-Level Structure

- `packages/sdk-core`: protocol-safe primitives and client surface.
- `packages/sdk-react`: React bindings and hooks (thin wrappers around sdk-core).
- `packages/sdk-cli`: operator tooling (explicit inputs, no hidden state).

## Determinism & State

- No implicit defaults: all configuration must be explicit.
- Read APIs must not mutate state and must not require a signer.
- Transaction builders must validate inputs and invariants before emitting instructions.

## Registries

### Program Registry

All program IDs and seeds required for PDA derivation are sourced from a `ProgramRegistry` provided by the integrator at initialization. The SDK never hardcodes protocol program IDs.

### Oracle Registry

All oracle feed addresses and validation parameters are sourced from an `OracleRegistry` provided by the integrator at initialization. The SDK validates freshness and confidence bounds and fails explicitly when unsafe.

## Error Model

The SDK throws typed errors only. Each error includes a stable `name`, a machine-readable `code`, and structured `context` for logging and incident response.

## Build & Packaging

- Node.js >= 18
- ESM only
- TypeScript `strict` with enterprise linting
- Deterministic BN math only
