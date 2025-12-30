import type { Commitment, Connection } from '@solana/web3.js';

import { XerionConfigError } from '../errors/errors.js';
import type { OracleRegistry, ProgramRegistry } from '../types/registries.js';
import type { XerionCluster } from '../types/cluster.js';
import type { XerionWallet } from '../types/wallet.js';

import type { XerionClientConfig } from './types.js';

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === 'string' && value.length > 0;
};

interface PublicKeyLike {
  toBase58(): string;
}

const isPublicKeyLike = (value: unknown): value is PublicKeyLike => {
  return typeof (value as PublicKeyLike | null)?.toBase58 === 'function';
};

export class XerionClient {
  public readonly connection: Connection;
  public readonly wallet: XerionWallet;
  public readonly cluster: XerionCluster;
  public readonly programRegistry: ProgramRegistry;
  public readonly oracleRegistry: OracleRegistry;
  public readonly commitment: Commitment;

  public constructor(config: XerionClientConfig) {
    this.connection = config.connection;
    this.wallet = config.wallet;
    this.cluster = config.cluster;
    this.programRegistry = config.programRegistry;
    this.oracleRegistry = config.oracleRegistry;
    this.commitment = config.commitment;

    this.validate();
  }

  private validate(): void {
    const pkUnknown: unknown = (this.wallet as unknown as { publicKey: unknown }).publicKey;
    if (!isPublicKeyLike(pkUnknown)) {
      throw new XerionConfigError('wallet.publicKey must be a valid PublicKey', {});
    }

    if (typeof this.wallet.signTransaction !== 'function') {
      throw new XerionConfigError('wallet.signTransaction must be provided', {});
    }

    if (typeof this.wallet.signAllTransactions !== 'function') {
      throw new XerionConfigError('wallet.signAllTransactions must be provided', {});
    }

    if (typeof this.wallet.signVersionedTransaction !== 'function') {
      throw new XerionConfigError('wallet.signVersionedTransaction must be provided', {});
    }

    if (typeof this.wallet.signAllVersionedTransactions !== 'function') {
      throw new XerionConfigError('wallet.signAllVersionedTransactions must be provided', {});
    }

    if (!isNonEmptyString(this.cluster)) {
      throw new XerionConfigError('cluster must be a non-empty string', {
        cluster: this.cluster,
      });
    }

    if (!isNonEmptyString(this.commitment)) {
      throw new XerionConfigError('commitment must be a non-empty string', {
        commitment: this.commitment,
      });
    }

    if (typeof this.programRegistry.getProgramId !== 'function') {
      throw new XerionConfigError('programRegistry.getProgramId must be provided', {});
    }

    if (typeof this.oracleRegistry.getFeedAddress !== 'function') {
      throw new XerionConfigError('oracleRegistry.getFeedAddress must be provided', {});
    }

    // Connection is structural; validate by checking required methods exist.
    if (typeof this.connection.getLatestBlockhash !== 'function') {
      throw new XerionConfigError('connection must be a valid Solana Connection', {});
    }
  }
}
