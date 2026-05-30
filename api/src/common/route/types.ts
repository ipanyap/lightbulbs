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
