import type { PublicKey } from '@solana/web3.js';

export type ProgramRole = string;
export type OracleFeedRole = string;

export interface ProgramRegistry {
  getProgramId(role: ProgramRole): PublicKey;
}

export interface OracleRegistry {
  getFeedAddress(role: OracleFeedRole): PublicKey;
}
