import { describe, expect, it } from 'vitest';

import { OracleStaleError } from '../../src/errors/errors.js';
import { validateOraclePrice } from '../../src/utils/oracle-validation.js';
import { BN } from '../../src/utils/bn.js';

describe('validateOraclePrice', () => {
  it('throws OracleStaleError when stale', () => {
    expect(() => {
      validateOraclePrice({
        currentSlot: 200,
        price: {
          price: new BN(100),
          confidence: new BN(1),
          publishSlot: 1,
        },
        config: {
          maxStalenessSlots: 10,
          maxConfidenceBps: 100,
        },
      });
    }).toThrow(OracleStaleError);
  });

  it('accepts price when fresh and within confidence bounds', () => {
    expect(() => {
      validateOraclePrice({
        currentSlot: 200,
        price: {
          price: new BN(10_000),
          confidence: new BN(10),
          publishSlot: 195,
        },
        config: {
          maxStalenessSlots: 10,
          maxConfidenceBps: 100,
        },
      });
    }).not.toThrow();
  });
});
