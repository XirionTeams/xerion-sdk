export type XerionErrorCode =
  | 'XERION_CONFIG_ERROR'
  | 'ORACLE_STALE'
  | 'INVARIANT_VIOLATION'
  | 'ACCOUNT_OWNERSHIP'
  | 'TRANSACTION_BUILD';

export type XerionErrorContext = Readonly<Record<string, unknown>>;

export abstract class XerionError extends Error {
  public abstract readonly code: XerionErrorCode;
  public readonly context: XerionErrorContext;

  protected constructor(message: string, context: XerionErrorContext) {
    super(message);
    this.context = context;
  }
}

export const isXerionError = (value: unknown): value is XerionError => {
  return value instanceof XerionError;
};
