import { describe, expect, it } from 'vitest';

import { PublicKey } from '@solana/web3.js';

import { findProgramAddressVerified } from '../../src/utils/pda.js';

describe('findProgramAddressVerified', () => {
  it('derives a PDA and verifies bump deterministically', () => {
    const programId = new PublicKey('11111111111111111111111111111111');
    const seeds = [Buffer.from('xerion'), Buffer.from('pda-test')];

    const { address, bump } = findProgramAddressVerified({ programId, seeds });
    expect(PublicKey.isOnCurve(address.toBytes())).toBe(false);
    expect(Number.isInteger(bump)).toBe(true);
  });
});
