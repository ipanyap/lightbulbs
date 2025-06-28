/**
 * The category code of the application error.
 */
export enum AppErrorCode {
  UNKNOWN = 'UNKNOWN',
  INPUT = 'INPUT',
  ACTION = 'ACTION',
  DATA = 'DATA',
  CONNECTION = 'CONNECTION',
  CONFIG = 'CONFIG',
}

/**
 * Dictionary of common application error names and their corresponding error codes.
 */
export const COMMON_ERROR_NAMES = {
  // INPUT errors
  MissingInput: AppErrorCode.INPUT,
  InvalidInput: AppErrorCode.INPUT,
  // ACTION errors
  InvalidPrecondition: AppErrorCode.ACTION,
  UnauthorizedAccess: AppErrorCode.ACTION,
  InsufficientPermission: AppErrorCode.ACTION,
  // DATA errors
  MissingData: AppErrorCode.DATA,
  InvalidData: AppErrorCode.DATA,
  // CONNECTION errors
  DatabaseOutage: AppErrorCode.CONNECTION,
  InternalServiceOutage: AppErrorCode.CONNECTION,
  NoExternalResponse: AppErrorCode.CONNECTION,
  // CONFIG errors
  MissingConfig: AppErrorCode.CONFIG,
  InvalidConfig: AppErrorCode.CONFIG,
};

/**
 * Available string values for common application error names.
 */
export type ICommonErrorName = keyof typeof COMMON_ERROR_NAMES;
