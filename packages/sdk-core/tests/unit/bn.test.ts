import { describe, expect, it } from 'vitest';

import { BN, bnBpsMul } from '../../src/utils/bn.js';

describe('bnBpsMul', () => {
  it('computes value * bps / 10_000 deterministically', () => {
    const value = new BN(1_000_000);
    const bps = new BN(25); // 0.25%
    const out = bnBpsMul(value, bps);
    expect(out.toString(10)).toBe('2500');
  });
});
