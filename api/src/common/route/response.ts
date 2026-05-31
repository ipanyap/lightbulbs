import { AppError, AppErrorCode, ICommonErrorName } from '@lightbulbs/common';
import { APP_ERROR_HTTP_STATUS_CODES, IHTTPResponse } from './types';

/**
 * Format a successful workflow result into a standard HTTP response structure.
 * @param result The workflow result.
 * @param context Optional information that explains the context of the result.
 * @returns Structured HTTP response in JSON format.
 */
export function formatHTTPSuccessResponse<ResultType, ContextType>(
  result: ResultType,
  context?: ContextType
): IHTTPResponse<ResultType, ContextType | null> {
  return {
    success: true,
    data: result,
    error: null,
    meta: context || null,
  };
}

/**
 * Format an application error into a standard HTTP response structure.
 * @param error The generated or thrown application error.
 * @returns Structured HTTP response in JSON format.
 */
export function formatHTTPFailedResponse(error: AppError): IHTTPResponse {
  const { code, name, message } = error;

  return {
    success: false,
    data: null,
    error: { code, name, message },
    meta: null,
  };
}

/**
 * Determine the appropriate HTTP status code for the given application error.
 * @param error The generated or thrown application error.
 * @returns HTTP status code to return
 */
export function getHTTPStatusCode(error: AppError): number {
  const { code, name } = error;

  // If error name exists in the dictionary, return the mapped HTTP status code.
  const http_status_code = APP_ERROR_HTTP_STATUS_CODES[name as ICommonErrorName];

  if (http_status_code) {
    return http_status_code;
  }

  // If the error is about the input, return Bad Request error as the most likely issue.
  if (code === AppErrorCode.INPUT) {
    return 400;
  }

  // Any other error types are undetermined, return default server error.
  return 500;
}
