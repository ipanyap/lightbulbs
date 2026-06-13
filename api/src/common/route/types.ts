import { ICommonErrorName } from '@lightbulbs/common';
import { JSONSchemaType } from 'ajv';

/**
 * The available HTTP methods.
 */
export enum HTTPMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

/**
 * Dictionary of common application error names and their corresponding HTTP status codes.
 */
export const APP_ERROR_HTTP_STATUS_CODES: Record<ICommonErrorName, number> = {
  // Bad Request
  MissingInput: 400,
  InvalidInput: 400,
  // Unauthorized
  UnauthorizedAccess: 401,
  // Forbidden
  InsufficientPermission: 403,
  // Not Found
  MissingData: 404,
  // Conflict
  InvalidPrecondition: 409,
  // Bad Gateway
  NoExternalResponse: 502,
  // Gateway Timeout
  InternalServiceOutage: 504,
  // Internal Server Error
  InvalidData: 500,
  DatabaseOutage: 500,
  MissingConfig: 500,
  InvalidConfig: 500,
};

/**
 * The standard HTTP response.
 */
export type IHTTPResponse<DataType = null, MetaType = null> =
  | {
      success: true;
      data: DataType;
      error: null;
      meta: MetaType;
    }
  | {
      success: false;
      data: null;
      error: {
        code: string;
        name: string;
        message: string;
      };
      meta: null;
    };

/**
 * The generic type for all workflow functions.
 */
export type IWorkflowFunction<InputType> = (input: InputType) => Promise<unknown>;

/**
 * The basic structure of a workflow function's input.
 * @note Input is segmented into 3 properties:
 * - `key` is the target's identifier
 * - `data` is the payload
 * - `options` is the configuration related to how the workflow is to be executed
 */
export type IWorkflowInput = Partial<Record<'key' | 'data' | 'options', unknown>>;

/**
 * The schema which represents the workflow function's input.
 * @note Input is not mapped directly as a single JSON schema,
 * rather a separate JSON schema is defined for each input property.
 */
export interface IWorkflowJSONSchema<InputType extends IWorkflowInput = IWorkflowInput> {
  key?: JSONSchemaType<InputType['key']>;
  data?: JSONSchemaType<InputType['data']>;
  options?: JSONSchemaType<InputType['options']>;
}

/**
 * The controller configuration that wires together a route, input schema, and workflow function.
 */
export interface IRouteController<InputType extends IWorkflowInput = IWorkflowInput> {
  path: string;
  method: HTTPMethod;
  workflow: IWorkflowFunction<InputType>;
  schema?: IWorkflowJSONSchema<InputType>;
}
