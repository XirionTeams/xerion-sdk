import type BN from 'bn.js';

export type OraclePrice = Readonly<{
  price: BN;
  confidence: BN;
  publishSlot: number;
}>;

export type OracleValidationConfig = Readonly<{
  maxStalenessSlots: number;
  maxConfidenceBps: number;
}>;
