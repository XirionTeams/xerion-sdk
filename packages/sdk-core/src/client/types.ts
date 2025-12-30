import type { Commitment, Connection } from '@solana/web3.js';

import type { XerionCluster } from '../types/cluster.js';
import type { OracleRegistry, ProgramRegistry } from '../types/registries.js';
import type { XerionWallet } from '../types/wallet.js';

export type XerionClientConfig = Readonly<{
  connection: Connection;
  wallet: XerionWallet;
  cluster: XerionCluster;
  programRegistry: ProgramRegistry;
  oracleRegistry: OracleRegistry;
  commitment: Commitment;
}>;
