import BN from 'bn.js';

import { XerionConfigError } from '../errors/errors.js';

export { BN };

export const BN_ZERO = new BN(0);
export const BN_ONE = new BN(1);

export const bnFromNumber = (value: number, contextName: string): BN => {
  if (!Number.isSafeInteger(value)) {
    throw new XerionConfigError('Expected a safe integer for BN conversion', {
      contextName,
      value,
    });
  }
  return new BN(value);
};

export const bnMax = (a: BN, b: BN): BN => (a.gte(b) ? a : b);
export const bnMin = (a: BN, b: BN): BN => (a.lte(b) ? a : b);

export const bnBpsMul = (value: BN, bps: BN): BN => {
  // value * bps / 10_000
  return value.mul(bps).div(new BN(10_000));
};
