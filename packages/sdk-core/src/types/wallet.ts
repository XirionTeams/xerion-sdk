import type { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';

export interface XerionWallet {
  readonly publicKey: PublicKey;
  signTransaction(tx: Transaction): Promise<Transaction>;
  signAllTransactions(txs: Transaction[]): Promise<Transaction[]>;
  signVersionedTransaction(tx: VersionedTransaction): Promise<VersionedTransaction>;
  signAllVersionedTransactions(
    txs: VersionedTransaction[],
  ): Promise<VersionedTransaction[]>;
}
