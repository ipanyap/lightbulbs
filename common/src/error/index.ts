import { AppErrorCode, COMMON_ERROR_NAMES, ICommonErrorName } from './types';

/**
 * Class that extends standard `Error` for use within all applications.
 */
export class AppError extends Error {
  code: AppErrorCode;
  metadata: Record<string, any>;

  /**
   * Construct an error object with a number of parameter list options.
   */
  /**
   * @overload The simple way, specify only the error message string.
   * The error code and name will be initialized with default values.
   * @param message The error message
   */
  constructor(message: string);
  /**
   * @overload Quick way to instantiate common errors, using pre-defined error names.
   * The error code will be automatically derived from the error name.
   * @param input.message The error message
   * @param input.name The error name, pick one from list of common error names
   */
  constructor(input: string | { message: string; name: ICommonErrorName });
  /**
   * @overload The custom way, specify user-defined values for both error name and code.
   * @param input.message The error message
   * @param input.name The error name, can be any string
   * @param input.code The error code
   */
  constructor(input: string | { message: string; name: string; code: AppErrorCode });
  constructor(input: string | { message: string; name: string; code?: AppErrorCode }) {
    if (typeof input === 'string') {
      super(input);

      this.code = AppErrorCode.UNKNOWN;
      this.name = 'AppError';
    } else {
      const { message, name, code } = input;

      super(message);

      this.code = code || COMMON_ERROR_NAMES[name as ICommonErrorName];
      this.name = name;
    }

    this.metadata = {};
  }
}
