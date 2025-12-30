import BN from 'bn.js';

import { OracleStaleError } from '../errors/errors.js';
import type { OraclePrice, OracleValidationConfig } from '../types/oracle.js';

export const validateOraclePrice = (params: {
  currentSlot: number;
  price: OraclePrice;
  config: OracleValidationConfig;
}): void => {
  const staleness = params.currentSlot - params.price.publishSlot;
  if (staleness > params.config.maxStalenessSlots) {
    throw new OracleStaleError('Oracle price is stale', {
      currentSlot: params.currentSlot,
      publishSlot: params.price.publishSlot,
      stalenessSlots: staleness,
      maxStalenessSlots: params.config.maxStalenessSlots,
    });
  }
  if (params.price.price.lte(new BN(0))) {
    throw new OracleStaleError('Oracle price must be > 0', {
      price: params.price.price.toString(10),
    });
  }
  if (params.price.confidence.lt(new BN(0))) {
    throw new OracleStaleError('Oracle confidence must be >= 0', {
      confidence: params.price.confidence.toString(10),
    });
  }
  // Confidence bound check: confidence/price <= maxConfidenceBps/10_000, using BN only.
  // confidence * 10_000 <= price * maxConfidenceBps
  const left = params.price.confidence.mul(new BN(10_000));
  const right = params.price.price.mul(new BN(params.config.maxConfidenceBps));
  if (left.gt(right)) {
    throw new OracleStaleError('Oracle confidence interval exceeds configured bound', {
      confidence: params.price.confidence.toString(10),
      price: params.price.price.toString(10),
      maxConfidenceBps: params.config.maxConfidenceBps,
    });
  }
};
