import { AppError } from '@lightbulbs/common';
import { IHTTPResponse } from './types';

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
