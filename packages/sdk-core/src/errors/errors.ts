import type { PublicKey } from '@solana/web3.js';

import { XerionError } from './xerion-error.js';

export class XerionConfigError extends XerionError {
  public readonly code = 'XERION_CONFIG_ERROR' as const;

  public constructor(message: string, context: Readonly<Record<string, unknown>>) {
    super(message, context);
    this.name = 'XerionConfigError';
  }
}

export class OracleStaleError extends XerionError {
  public readonly code = 'ORACLE_STALE' as const;

  public constructor(message: string, context: Readonly<Record<string, unknown>>) {
    super(message, context);
    this.name = 'OracleStaleError';
  }
}

export class InvariantViolationError extends XerionError {
  public readonly code = 'INVARIANT_VIOLATION' as const;

  public constructor(message: string, context: Readonly<Record<string, unknown>>) {
    super(message, context);
    this.name = 'InvariantViolationError';
  }
}

export class AccountOwnershipError extends XerionError {
  public readonly code = 'ACCOUNT_OWNERSHIP' as const;

  public constructor(params: {
    message: string;
    expectedOwner: PublicKey;
    actualOwner: PublicKey;
    account: PublicKey;
  }) {
    super(params.message, {
      expectedOwner: params.expectedOwner.toBase58(),
      actualOwner: params.actualOwner.toBase58(),
      account: params.account.toBase58(),
    });
    this.name = 'AccountOwnershipError';
  }
}

export class TransactionBuildError extends XerionError {
  public readonly code = 'TRANSACTION_BUILD' as const;

  public constructor(message: string, context: Readonly<Record<string, unknown>>) {
    super(message, context);
    this.name = 'TransactionBuildError';
  }
}
