# Xerion SDK

Enterprise-grade Solana SDK for deterministic DeFi infrastructure.

Xerion provides secure, oracle-priced vault interactions, yield routing,
position accounting, and analytics-grade read-only access for Solana-based
financial applications.

---

## Badges

![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-green)
![Solana](https://img.shields.io/badge/Solana-Web3-purple)
![License](https://img.shields.io/badge/License-MIT-lightgrey) 

---

## Overview

Xerion SDK is designed for:

- Institutional DeFi builders
- Protocol integrators
- Analytics platforms
- Long-term production systems

Key principles:

- Deterministic execution
- Explicit configuration
- No hidden state
- Audit-ready architecture

---

## Core Capabilities

- Vault interactions with invariant enforcement
- Oracle-priced swaps with sanity validation
- Deterministic yield routing
- Accurate position accounting
- Risk & invariant validation
- Analytics-grade read-only endpoints

---

## Architecture

- TypeScript (strict mode)
- Solana Web3 + Anchor
- BN-based math only
- Explicit error handling
- Modular enterprise monorepo

Detailed architecture can be found in `/docs/architecture.md`.

---

## Security Model

- SDK never bypasses on-chain rules
- All oracle data validated
- Invariants enforced pre-transaction
- Explicit failures on unsafe conditions

See `/docs/security.md` for full details.

---

## Versioning & Stability

- Semantic Versioning (SemVer)
- Backward compatibility guaranteed per major version
- Breaking changes only in major releases

---

## Governance

- Maintainer-reviewed contributions
- Mandatory tests & documentation
- Security-first development process

See `/docs/governance.md`.

---

## Investor & Partner Information

A technical appendix for partners and institutional stakeholders
is available in `/docs/investor-appendix.md`.

---

## Disclaimer

Xerion SDK is a developer tool.
Users are responsible for validating integration suitability
for their specific regulatory and risk requirements.

---

## Testing

- Unit/contract tests run with `pnpm -r test`.
- Integration tests require `solana-test-validator` to be installed and available on `PATH` (provided by Solana CLI).
