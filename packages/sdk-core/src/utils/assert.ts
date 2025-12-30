import { XerionConfigError } from '../errors/errors.js';

export const assertDefined = <T>(
  value: T | null | undefined,
  message: string,
  context: Readonly<Record<string, unknown>>,
): T => {
  if (value === null || value === undefined) {
    throw new XerionConfigError(message, context);
  }
  return value;
};

export const assertCondition = (
  condition: boolean,
  message: string,
  context: Readonly<Record<string, unknown>>,
): void => {
  if (!condition) {
    throw new XerionConfigError(message, context);
  }
};
