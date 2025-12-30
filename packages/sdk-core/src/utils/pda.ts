import type { PublicKey } from '@solana/web3.js';
import { PublicKey as Web3PublicKey } from '@solana/web3.js';

import { TransactionBuildError } from '../errors/errors.js';

export type VerifiedPda = Readonly<{ address: PublicKey; bump: number }>;

export const findProgramAddressVerified = (params: {
  programId: PublicKey;
  seeds: readonly Uint8Array[];
}): VerifiedPda => {
  const seeds = Array.from(params.seeds);
  const [address, bump] = Web3PublicKey.findProgramAddressSync(seeds, params.programId);
  // Explicitly re-derive to ensure bump matches the address for given seeds.
  const derived = Web3PublicKey.createProgramAddressSync(
    [...seeds, Uint8Array.of(bump)],
    params.programId,
  );
  if (!derived.equals(address)) {
    throw new TransactionBuildError('PDA bump verification failed', {
      bump,
      programId: params.programId.toBase58(),
    });
  }
  return { address, bump };
};
